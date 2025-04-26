"use client";

import React, { useEffect, useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getDocumentById, updateDocument } from "@/utils/indexDb";
import AllProjects from "./AllProjects";

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();
  const params = useParams();

  const [projectName, setProjectName] = useState<string | null>(null);
  const [isProjectModalVisible, setIsProjectModal] = useState(false);

  useEffect(() => {
    try {
      if (projectName === null) return;
      updateDocument("projects", params?.projectId as any, { projectName })
        .then(() => console.log("Updated name"))
        .catch((e) => {
          throw new Error(e);
        });
    } catch (error) {
      console.error(error);
      toast.error("Error updating project name");
    }
  }, [projectName]);

  useEffect(() => {
    if (!pathName.includes("projects/")) return;
    console.log(params.projectId);

    getDocumentById("projects", params.projectId as string).then((data) => {
      setProjectName(data.projectName);
      console.log(data);
    });
  }, [pathName, params]);

  return (
    <div className="w-full h-[60px] flex items-center px-[30px] justify-between text-white gap-5">
      <div className="flex items-center gap-3 shrink-0">
        <Image src={logo} alt="/logo" className="w-[30px] h-[30px]" />
        <p className="text-[17px] font-extrabold">Texten</p>
      </div>
      <div className="w-full flex justify-center items-center">
        {pathName.includes("projects/") && (
          <input
            type="text"
            className="flex items-center h-[40px] px-[30px] rounded-[5px] opacity-75 hover:opacity-100 shrink-0 w-full max-w-[600px] text-center font-bold"
            placeholder="Enter title here"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            value={projectName || ""}
            onChange={(e) => setProjectName(e.target.value)}
          />
        )}
      </div>
      <div>
        <div
          className="flex items-center h-[40px]  rounded-[20px]  opacity-75 hover:opacity-100 hover:cursor-pointer login__hover shrink-0 gap-2"
          onClick={() => setIsProjectModal(true)}
        >
          <p className="text-[13px]">Projects</p>
          <i className="fa-light fa-square-list"></i>
        </div>
      </div>
      <AllProjects
        isVisible={isProjectModalVisible}
        onHide={() => setIsProjectModal(false)}
      />
    </div>
  );
}
