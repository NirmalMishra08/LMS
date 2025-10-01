import { db } from '@/lib/db';
import { Chapter, Course, UserProgress } from '@/prisma/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { CourseSidebarItem } from './course-sideabar-item';
import CourseProgress from '@/components/course-progress';

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[],
    };
    progressCount: number

}

type ChapterWithProgress = Chapter & {
    userProgress: UserProgress[] | null;
};

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
         userId_courseId:{
            courseId: course.id,
            userId: userId
         }
            
        }
    })


    return (
        <div className='h-full border-r flex flex-col overflow-auto shadow-sm'>
            <div className='p-8 flex flex-col border-b '>
                <h1 className='font-semibold'>{course.title}</h1>
            </div>
            {
                purchase && (
                    <div className='mt-10 px-5'>
                        <CourseProgress variant="success" value={progressCount} />

                    </div>
                )
            }
            <div className='flex flex-col w-full'>
                {course.chapters.map((chapter: ChapterWithProgress) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                )
                )}


            </div>
        </div>
    )
}
