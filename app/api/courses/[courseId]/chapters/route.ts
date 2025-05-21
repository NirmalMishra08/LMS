import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";


export const POST = async (req: Request, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        const courseId = await params.courseId;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                userId: userId,
                id: courseId
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const lastChaper = await db.chapter.findFirst({
            where: {
                courseId: courseId
            },
            orderBy: {
                position: "desc"
            }
        })

        const newPosition = lastChaper ? lastChaper.position + 1 : 1;

        const chapter = await db.chapter.create({
            data:{
                title,
                courseId,
                position:newPosition
            }
        })

        return NextResponse.json(chapter);



   } catch (error) {
        console.log("Chapter",error)
        return new NextResponse("Server Error", { status: 500 })

    }
}