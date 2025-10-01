import { db } from "@/lib/db";

export const getProgress = async (userId: string,courseId: string ): Promise<number> => {
    try {

        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,   
            },
        });

        const publishedChapeterIds = publishedChapters.map(chapter => chapter.id);

        const validCompletedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapeterIds,
                },
                isCompleted: true,
            },
        })
        console.log("publishedChapeterIds", publishedChapeterIds);
        console.log("validCompletedChapters", validCompletedChapters);



        const progressPercentage = publishedChapeterIds.length > 0
            ? (validCompletedChapters / publishedChapeterIds.length) * 100
            : 0;
      
            return progressPercentage;

    } catch (error) {
        console.log("[GET PROGRESS]", error);
        throw new Error("Failed to fetch progress");
    }
}