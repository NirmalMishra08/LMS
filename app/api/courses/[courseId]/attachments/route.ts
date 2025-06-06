import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"


export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const {url} = await req.json();
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId

            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId:params.courseId,


            }
        });
        return  NextResponse.json(attachment);



    } catch (error) {
        console.log("Course Id attachemebt", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}