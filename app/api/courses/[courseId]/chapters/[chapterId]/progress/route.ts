import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        const { isCompleted } = await req.json();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            },
            update: {
                isCompleted
            }
        });

        return new Response(JSON.stringify(userProgress
        ), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}