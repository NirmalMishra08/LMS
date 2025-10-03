import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";


export const PUT = async (req: Request, { params }: { params: Promise<{ courseId: string }> }) => {
    try {
        const { userId } = await auth();

        const { courseId } = await params
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { list } = await req.json();

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        for (const items of list) {
            await db.chapter.update({
                where: {
                    id: items.id
                },
                data: {
                    position: items.position
                }
            })
        }

        return new NextResponse("Success", { status: 200 });



    } catch (error) {
        console.log("[REORDER]", error)
        return new NextResponse("Server Error", { status: 500 })

    }
}