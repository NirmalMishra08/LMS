import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
};

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async() => {
        await handleAuth();
        return {};
      })
      .onUploadComplete(() => {}),
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => {
        await handleAuth();
        return {};
      })
      .onUploadComplete(() => {}),
    chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(async () => {
        await handleAuth();
        return {};
      })
      .onUploadComplete(() => {}),
        

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
