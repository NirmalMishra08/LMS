import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import { mux } from "./chapters/[chapterId]/route";

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include:{
                chapters:{
                    include:{
                        muxData: true
                    }
                }
            }
        })

        if (!course) {
            return new NextResponse("Not found", { status: 404 });

        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await mux.video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
                userId
            }
        }); 

        return NextResponse.json(deletedCourse);

    } catch (error) {
        console.log("[Chapter Delete]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        console.log(userId)

        const values = await req.json();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 })
        }
        const courseId = await params.courseId;

        const course = await db.course.update({
            where: {
                id: courseId
            },
            data: {
                ...values
            }
        })


    }
    catch (error) {
        console.log(error)
        return new Response("Internal Server Error", { status: 500 })
    }
    return new Response("ok")
}