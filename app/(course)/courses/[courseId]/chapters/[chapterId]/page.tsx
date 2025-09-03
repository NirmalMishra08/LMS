import { getChapter } from '@/actions/get-chapter';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: { params: { courseId: string, chapterId: string } }) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        attachment,
        muxData,
        nextChapter,
        purchase,
        userProgress
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId
    })

    if (!chapter || !course) {
        return redirect(`/`);
    }


    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted

    return (
        <div>
            {
                userProgress?.isCompleted &&
                (
                    <Banner variant={"success"} label='You already completed this chapter.' />
                )

            }
             {
               isLocked &&
                (
                    <Banner variant={"warning"} label='You need to purchase this course to watch this chapter.' />
                )

            }
        </div>
    )
}

export default page