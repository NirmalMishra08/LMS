import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  console.log("User ID:", userId); // Log the user ID for debugging
  if (!userId) {
    throw new Error("Unauthorized");
  }
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      await handleAuth();
     
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => {
      await handleAuth();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for courseAttachment:", file.url);
    }),

  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(async () => {
      await handleAuth();
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for chapterVideo:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
