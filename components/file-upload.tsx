"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {  UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string) => void;  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const [, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
        
          console.log("Upload complete:", res);
          const url = res?.[0]?.url;
          if (url) {
            onChange(url);
            toast.success("Upload successful!");
          } else {
            toast.error("No URL returned from upload.");
          }
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          console.error("Upload error:", error);
          toast.error(error.message || "Upload failed.");
          onChange(undefined);
        }}
       
      />
      
    </div>
  );
};
