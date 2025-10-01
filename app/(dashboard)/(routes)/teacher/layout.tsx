import { isTeacher } from "@/lib/Teacher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();

    if(!isTeacher(userId)){
    return redirect("/")
    }
    return (
        <>
            {children}
        </>
    )
}

export default TeacherLayout