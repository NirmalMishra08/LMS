import { getChapter } from '@/actions/get-chapter';
import Banner from '@/components/banner';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import VideoPlayer from './_components/VideoPlayers';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';
import { File } from 'lucide-react';
import CourseProgressButton from './_components/course-progress-button';

const page = async ({ params }: { params: { courseId: string, chapterId: string } }) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const { chapterId, courseId } = await params

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
        chapterId: chapterId,
        courseId: courseId
    })

    if (!chapter || !course) {
        return redirect(`/`);
    }


    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted

    console.log(muxData)

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
            <div className='flex flex-col max-w-4xl mx-auto pb-20 '>
                <div className='p-4'>
                    <VideoPlayer
                        chapterId={chapterId}
                        courseId={courseId}
                        title={chapter.title}
                        nextChapterId={nextChapter?.id}
                        muxData={muxData?.playbackId ?? ""}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}

                    />

                </div>
                <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
                    <h2 className='text-2xl font-semibold mb-2 '>
                        {chapter.title}
                    </h2>
                    {
                        purchase ? (

                            <CourseProgressButton
                                chapterId={chapterId}
                                courseId={courseId}
                                nextChapterId={nextChapter?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ) : (
                           <CourseEnrollButton price={course.price!} courseId={courseId} />

                        )
                    }
                </div>
                <Separator />
                <div>
                   <Preview value={chapter.description ?? ""} />

                </div>
                {
                    !!attachment.length && (
                        <>
                            <Separator />
                            <div className='p-4'>
                                {attachment.map((att) => (
                                    <div key={att.id} className='p-4 border rounded-md my-2'>
                                        <a href={att.url} target='_blank' rel='noreferrer' className="flex items-center p-3 w-full bg-sky-200 border-sky-700 rounded-md hover:underline " >
                                            <File />
                                            <p className='line-clamp-1 '>
                                                {att.name}
                                            </p>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    )
}

export default page