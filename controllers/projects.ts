import {
  base64ToFile,
  blobToBase64,
  exportToZip,
  extractTextFromFile,
  uint8ArrayToBase64,
} from "@/utils/files";
import { fetchFileById, storeDocument, storeFile } from "@/utils/indexDb";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { toast } from "react-toastify";

export const exportProjects = async (selectedProjects: any[]) => {
  try {
    toast.success("File will be exported soon");
    console.log(selectedProjects);

    const filesPromise = selectedProjects.map((project) =>
      fetchFileById(project.fileId)
    );

    const files = await Promise.all(filesPromise);
    console.log(files);

    const filesAsBase64Promise = files.map((file: any) => blobToBase64(file));

    const filesAsBase64 = await Promise.all(filesAsBase64Promise);

    console.log(filesAsBase64);

    let projectExportData = selectedProjects.map((project: any, index) => ({
      project: { ...project, fileId: "_" },
      file: filesAsBase64[index],
      fileMetaData: {
        name: (files[index] as any).name,
        mimeType: (files[index] as any).type,
      },
    }));

    console.log(projectExportData);
    const exportPackage = projectExportData.map((exportProject) =>
      deduceBlobForExportProject(exportProject)
    );
    console.log(exportPackage);
    exportToZip(exportPackage as any);
  } catch (error) {
    console.error(error);
    toast.error("Export error");
  }
};

const deduceBlobForExportProject = (exportProject: any) => {
  const exportProjectAsString = JSON.stringify(exportProject);
  console.log(exportProjectAsString);

  return {
    name: exportProject.project.projectName,
    file: new Blob([exportProjectAsString], { type: "text/plain" }),
  };
};
export const importProject = async (file: File) => {
  try {
    console.log(file);
    toast.success("File will be imported soon");
    const text = await extractTextFromFile(file);
    const fileContentAsJSON = JSON.parse(text);

    console.log(fileContentAsJSON);

    const blob = base64ToFile(
      fileContentAsJSON.file,
      fileContentAsJSON.fileMetaData.name,
      fileContentAsJSON.fileMetaData.mimeType
    );
    console.log(blob);

    // Save blob to index db
    const fileId = await storeFile(blob as File);
    console.log(fileId);

    // create and store metadata
    const metaData = {
      ...fileContentAsJSON.project,
      projectName:
        fileContentAsJSON.project.projectName + "__UPDATE__" + Date.now(),
      created: Date.now(),
      fileId,
    };

    const projectId = await storeDocument("projects", metaData);

    console.log(projectId);
    return;
  } catch (error) {
    console.error(error);
  }
};

export const importProjects = async (files: File[]) => {
  try {
    files.map((file) => importProject(file));
  } catch (error) {
    console.error(error);
  }
};
