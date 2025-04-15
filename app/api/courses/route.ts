import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, sessionId } = await auth();
        
        console.log(userId , sessionId)
        const { title } = await req.json()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                title,
                userId,
            },
        })

        return NextResponse.json(course);


    } catch (error) {
        console.log("error occurred while" + error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}