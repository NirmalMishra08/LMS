import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
export async function DELETE(req: Request, { params }: { params: { attachmentId: string, courseId: string } }) {
    try {

        const {attachmentId,courseId} =  await params;
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Authentication Error", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId

            }
        })
        if (!courseOwner) {
            return new NextResponse("Authentication Error", { status: 401 })
        }
       
        const attachment = await db.attachment.delete({
            where:{
                courseId:courseId,
                id:attachmentId
            }
        })

        return new NextResponse("Deleted Successfully",attachment)

    } catch (error) {
        console.log("Error in Deleting" + error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}