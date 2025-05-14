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
        course.price
    ];
    const totalFields = requireField.length;
    const completedFields = requireField.filter(Boolean).length;

    const completionTexts = `(${completedFields}/${totalFields})`


    return (
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
                                <div>
                                    Todo:chapters
                                </div>

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
    )
}

export default Page
