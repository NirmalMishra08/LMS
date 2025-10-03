import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Authentication Error", { status: 401 });
        }

        // Await the params
        const { courseId, attachmentId } = await params;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });

        if (!course) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                id: attachmentId
            }
        });

        return NextResponse.json({ message: "Deleted Successfully", attachment });

    } catch (error) {
        console.error("[ATTACHMENT_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}