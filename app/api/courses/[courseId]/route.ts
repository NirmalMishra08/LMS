import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        console.log(userId)

        const values = await req.json();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 })
        }
        const courseId = params.courseId;

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