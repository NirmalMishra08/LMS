import { Iconbadge } from '@/components/icon-badge';
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { LayoutDashboard } from 'lucide-react';
import { redirect } from 'next/navigation';

import React from 'react'
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';


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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <Iconbadge  icon={LayoutDashboard}/>
                            <h2 className='text-xl'>
                                Customize yours course
                            </h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id}/>
                        <DescriptionForm initialData={course} courseId={course.id}/>

                    </div>
                </div>

            </div>
        </div>
        </div>
    )
}

export default Page
