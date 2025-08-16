import { Iconbadge } from '@/components/icon-badge';
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';

import React from 'react'
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentForm from './_components/attachment-form';
import ChapterForm from './_components/chapter-form';
import Banner from '@/components/banner';
import Actions from './_components/Actions';


const Page = async ({ params }: { params: { courseId: string } }) => {

    const { userId } = await auth();
    if (!userId) {
        return redirect("/")
    }
    const paramsId = await params;

    const course = await db.course.findUnique({
        where:
        {
            id: paramsId.courseId
        },
        include: {
           chapters:{
            orderBy: {
                position: 'asc'
            }
           },
            attachment: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })




    if (!course) {
        return redirect("/")
    }

    const requireField = [
        course.title,
        course.description,
        course.imageUrl,
        course.categoryId,
        course.price,
        course.chapters.some(chapter=>chapter.isPublished)
    ];
    const totalFields = requireField.length;
    const completedFields = requireField.filter(Boolean).length;

    const completionTexts = `(${completedFields}/${totalFields})`

    const isComplete = requireField.every(Boolean); 


    return (
        <>
        {!course.isPublished&& <Banner label='This Course is Unpublished This will not be visible to the students'  />}
        <div className='flex  gap-y-6'>


            <div className='p-5'>
                <div className='flex flex-col  '>
                    <div className='flex flex-col gap-y-2'>
                        <h1 className='text-2xl font-medium'>
                            Course Setup
                        </h1>
                        <span className='text-sm text-slate-700'>
                            Complete all fields {completionTexts}
                        </span>

                    </div>
                    {/* Add actions */}

                    <Actions
                    disabled={!isComplete}
                    courseId={paramsId.courseId}
                    isPublished={course.isPublished}
                    />




                    <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-16'>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <Iconbadge icon={LayoutDashboard} />
                                <h2 className='text-xl'>
                                    Customize yours course
                                </h2>
                            </div>
                            <TitleForm initialData={course} courseId={course.id} />
                            <DescriptionForm initialData={course} courseId={course.id} />
                            <ImageForm initialData={course} courseId={course.id} />
                            <CategoryForm initialData={course} courseId={course.id}
                                options={categories.map((category) => ({
                                    label: category.name,
                                    value: category.id

                                }))} />
                        </div>
                        <div className='space-y-6 '>
                            <div>
                                <div className='flex items-center gap-x-2'>
                                    <Iconbadge icon={ListChecks} />
                                    <h2 className='text-xl'>
                                        Course Chapters
                                    </h2>

                                </div>
                                <ChapterForm initialData={course} courseId={course.id} />

                            </div>
                            <div>

                                <div className='flex items-center gap-x-2'>
                                    <Iconbadge icon={CircleDollarSign} />
                                    <h2 className='text-xl'>
                                        Sell your course
                                    </h2>
                                </div>
                                <PriceForm initialData={course} courseId={course.id} />

                            </div>

                            <div>
                                <div className='flex items-center gap-x-2'>
                                    <Iconbadge icon={File} />
                                    <h2 className='text-xl'>
                                        Resources & Attachments
                                    </h2>
                                </div>
                                <AttachmentForm initialData={course} courseId={course.id} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Page
