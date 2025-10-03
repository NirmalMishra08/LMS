import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { db } from '@/lib/db';
import { ArrowLeft, Eye, LayoutDashboard, VideoIcon } from 'lucide-react';
import { Iconbadge } from '@/components/icon-badge';
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import VideoForm from './_components/chapter-video-form';
import Banner from '@/components/banner';
import ChapterActions from './_components/chapter-actions';

const chapterIdPage = async ({ params }: { params: Promise<{ courseId: string, chapterId: string }> }) => {
    const { userId } = await auth();

    const { courseId, chapterId } = await params

    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            courseId: courseId
        },
        include: {
            muxData: true
        }
    })

    if (!chapter) {
        return redirect("/");
    }

    const requireField = [ 

        chapter.title,
        chapter.description,
        chapter.videoUrl,

    ]
    const totalFields = requireField.length;
    const completedFields = requireField.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requireField.every(Boolean)
    console.log(isComplete)




    return (
        <>
        {!chapter.isPublished && (
            <div>
                <Banner variant="warning" label='This chapter is not published . It will not be visible in the course'/>
            </div>
        )}
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='w-full'>
                    <Link href={`/teacher/courses/${courseId}/`} className='flex items-center text-sm hover:opacity-75 transition mb-6 '>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to Course setup 
                    </Link>
                    <div className='flex items-center justify-between w-full '>
                        <div className='flex flex-col gap-y-2'>
                            <h1 className='text-2xl font-medium'>
                                Chapter Creation
                            </h1>
                            <span className='text-sm text-slate-700'>
                                Completed all fields {completionText}
                            </span>
                        </div>
                        <ChapterActions
                        disabled={!isComplete}
                        courseId={courseId}
                        chapterId={chapterId}
                        isPublished={chapter.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-16'>
                <div className='space-y-4 '>
                    <div>

                        <div className='flex items-center gap-x-2 '>
                            <Iconbadge icon={LayoutDashboard} />

                            <h2 className='text-xl'>
                                Customize your Chapter
                            </h2>
                        </div>
                        {/* ChapterTitleForm */}
                        <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId} />


                    </div>
                    <div>
                        <div className='flex items-center gap-x-2 '>
                            <Iconbadge icon={Eye} />
                            <h2 className='text-xl'>
                                Access Settings
                            </h2>

                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={courseId}
                            chapterId={chapterId}
                        />
                    </div>



                </div>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <Iconbadge icon={VideoIcon} />
                        <h2 className='text-xl'>Add a video</h2>
                    </div>
                    <VideoForm
                    initialData={chapter}
                    courseId={courseId}
                    chapterId={chapterId}
                    />
                </div>


            </div>
        </div>
        </>

    )
}

export default chapterIdPage
