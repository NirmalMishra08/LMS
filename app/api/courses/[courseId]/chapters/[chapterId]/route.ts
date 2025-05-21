import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json()
        const { courseId, chapterId } = await params;
        if (!userId) {
            return new NextResponse("Unauthorized ", { status: 401 })
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values
            }

        })

        // Handle video update

        return NextResponse.json(chapter)




    } catch (error) {
        console.log("[chapters]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}