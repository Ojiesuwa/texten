"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingGIf from "../public/loading.gif";
import Image from "next/image";
import {
  checkIndexedDBUsage,
  deleteDocument,
  deleteFile,
  getCollection,
} from "@/utils/indexDb";
import { useRouter } from "next/navigation";
import { dbEvents } from "@/utils/dbEvent";
import { bytesToGB } from "@/utils/files";
import { exportProjects, importProjects } from "@/controllers/projects";

export default function AllProjects({
  isVisible,
  onHide,
}: {
  isVisible: boolean;
  onHide: any;
}) {
  const [projects, setProjects] = useState<any>(null);
  const [selectedProjects, setSelectedProjects] = useState<any>([]);
  const [usage, setUsage] = useState(0);
  const router = useRouter();

  const handleFetchProjects = async () => {
    try {
      const projects = await getCollection("projects");

      console.log(projects);

      projects.sort((a: any, b: any) => b.created - a.created);

      const { usage, quota }: any = await checkIndexedDBUsage();
      setUsage(bytesToGB(usage));

      setProjects(projects);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching projects");
    }
  };

  const handleAddProject = (data: any) => {
    setSelectedProjects((p: any) => [...p, { ...data }]);
  };
  const handleRemoveProject = (data: any) => {
    setSelectedProjects((p: any) =>
      p.filter((project: any) => project.id !== data.id)
    );
  };

  const handleExport = () => {
    try {
      if (selectedProjects.length === 0) return;
      exportProjects(selectedProjects);
    } catch (error) {
      console.error(error);
      toast.error("Error exporting");
    }
  };

  const handleImport = async () => {
    try {
      const getTxtnFiles = async () => {
        return new Promise<File[]>((resolve, reject) => {
          const link = document.createElement("input");
          link.type = "file";
          link.accept = ".txtn";
          link.multiple = true;
          link.click();

          link.addEventListener("change", () => {
            resolve(Array.from(link.files as any));
          });
        });
      };

      const files = await getTxtnFiles();
      importProjects(files);
    } catch (error) {
      console.error(error);
      toast.error("Error importing");
    }
  };

  // Fetch on mount
  useEffect(() => {
    handleFetchProjects();
  }, []);

  // Listen to db-change events
  useEffect(() => {
    const handleDBChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { collectionName } = customEvent.detail || {};

      handleFetchProjects();
    };

    dbEvents.addEventListener("db-change", handleDBChange);
    dbEvents.addEventListener("dataChanged", handleDBChange);
    return () => {
      dbEvents.removeEventListener("db-change", handleDBChange);
      dbEvents.removeEventListener("dataChanged", handleDBChange);
    };
  }, []);

  return (
    <div
      className={
        " z-[400] fixed top-0 left-0 flex justify-center items-center hover:cursor-pointer " +
        (isVisible
          ? "modal__background__active "
          : "modal__background__inactive ")
      }
      onClick={onHide}
    >
      <div
        className={
          "text-white w-[500px] h-[calc(100svh-80px)] bg-black backdrop-blur-2xl rounded-md border border-white/30 flex flex-col gap-3 " +
          (isVisible ? "" : "scale-y-0")
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-[60px] flex justify-between items-center px-[20px] border-b-white/30 shrink-0">
          <div className="flex gap-3 items-center">
            <i
              className="fa-solid fa-home hover:opacity-50"
              onClick={() => {
                router.push("/");
                onHide();
              }}
            ></i>
            <p className="font-bold">Projects</p>
          </div>
          <i
            className="fa-light fa-xmark hover:cursor-pointer hover:text-red-400"
            onClick={onHide}
          ></i>
        </div>
        <div className="w-full shrink-0 h-fit flex px-[20px] items-center gap-2 mb-3">
          <progress
            value={usage}
            max={2}
            className="w-full h-[3px] rounded-full appearance-none"
          />
          <p className="shrink-0 text-[12px] font-light">{usage}GB / 2GB </p>
        </div>
        {!projects ? (
          <div className="w-full h-full flex justify-center items-center">
            <Image
              src={LoadingGIf}
              alt="loader"
              className="w-[30px] h-[30px]"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-2 overflow-y-auto px-[20px]">
            {projects?.map((data: any, index: number) => (
              <div className="flex gap-4 h-[50px]" key={index}>
                {selectedProjects?.some(
                  (project: any) => project.id === data.id
                ) ? (
                  <i
                    className="fa-solid fa-circle-check shrink-0 text-[17px] hover:cursor-pointer hover:text-purple-500"
                    onClick={() => handleRemoveProject(data)}
                  ></i>
                ) : (
                  <i
                    className="fa-light fa-circle shrink-0 text-[17px] hover:cursor-pointer hover:text-purple-500"
                    onClick={() => handleAddProject(data)}
                  ></i>
                )}

                <div className="w-full h-full mt-[-4px]">
                  <p
                    className="font-semibold text-[14px] hover:cursor-pointer hover:underline hover:decoration-white/100 hover:underline-offset-3"
                    onClick={() => {
                      router.push("/projects/" + data.id);
                      onHide();
                    }}
                  >
                    {data.projectName}
                  </p>
                  <p className="text-[12px] font-light opacity-50 mt-[-3px]">
                    24th Feburary 2024
                  </p>
                </div>
                <i
                  className="fa-light fa-trash shrink-0 hover:cursor-pointer hover:opacity-60"
                  onClick={() => {
                    deleteFile(data.fileId)
                      .then(() => {
                        deleteDocument("projects", data.id)
                          .then(() => {})
                          .catch((e) => console.log(e));
                      })
                      .catch((e) => console.log(e));
                  }}
                ></i>
              </div>
            ))}
          </div>
        )}
        <div className="w-full h-[60px] flex shrink-0 justify-between px-[20px] items-center gap-2 ">
          <div
            className="w-full border border-white/30 rounded-full h-[45px] px-[30px] flex items-center gap-3 justify-center hover:cursor-pointer hover:opacity-65"
            onClick={handleImport}
          >
            <p className="text-[12px]">Import</p>
            <i className="fa-light fa-file-import text-[15px]"></i>
          </div>
          <div
            className="w-full border border-white/30 rounded-full h-[45px] px-[30px] flex items-center gap-3 justify-center hover:cursor-pointer hover:opacity-65"
            onClick={handleExport}
          >
            <p className="text-[12px]">Export</p>
            <i className="fa-light fa-file-export text-[15px]"></i>
          </div>
          <div className="w-full border border-white/30 rounded-full h-[45px] px-[30px] flex items-center gap-3 justify-center hover:cursor-pointer hover:opacity-65">
            <p className="text-[12px]">Delete</p>
            <i className="fa-light fa-file-export text-[15px]"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
