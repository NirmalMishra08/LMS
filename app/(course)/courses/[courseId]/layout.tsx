import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseMobileSidebar } from "./_components/course-mobile-sidebar";
const CourseLayout = async ({ children, params }: { children: React.ReactNode, params: { courseId: string } }) => {

    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }

    const { courseId } = await params

    const course = await db.course.findUnique({
        where: {
            id: courseId,

        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },

        }
    })

    if (!course) {
        return redirect("/");
    }

    const progressCount = await getProgress(userId, course.id);





    return (
        <div className="h-full ">
            <div className="h-[80px] w-full md:pl-80 fixed inset-y-0 z-50">
                <CourseMobileSidebar
                    course={course}
                    progressCount={progressCount}
                />
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>

        </div>
    )

}

export default CourseLayout;