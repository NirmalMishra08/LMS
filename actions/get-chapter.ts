import { db } from "@/lib/db";
import { Chapter } from "@/prisma/lib/generated/prisma";
import { Attachment } from "@/prisma/lib/generated/prisma";

interface GetChapterProps {
    userId: string;
    chapterId: string;
    courseId: string;
}

export const getChapter = async ({ userId, chapterId, courseId }: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId
            },
            select: {
                price: true,
            }
        })
        const chapter = await db.chapter.findFirst({
            where: {
                id: chapterId,
                courseId,
                isPublished: true
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or Course not found");
        }

        let muxData = null;
        let attachment: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachment = await db.attachment.findMany({
                where: {
                    courseId: courseId
                }
            })
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            })
        }
        nextChapter = await db.chapter.findFirst({
            where: {
                courseId,
                isPublished: true,
                position: {
                    gt: chapter?.position
                }
            },
            orderBy: {
                position: 'asc'
            }
        })


        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId
                }
            }
        });


        return {
            chapter,
            course,
            muxData,
            attachment,
            nextChapter,
            userProgress,
            purchase
        }






    } catch (error) {
        console.error("Error fetching chapter:", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachment: [],
            nextChapter: null,
            userProgress: null,
            purschase: null
        }
    }
}       
