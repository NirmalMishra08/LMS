import { Iconbadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentForm from './_components/attachment-form';
import ChapterForm from './_components/chapter-form';
import Banner from '@/components/banner';
import Actions from './_components/Actions';

const Page = async ({ params }: { params: Promise<{ courseId: string }> }) => {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: { orderBy: { position: 'asc' } },
      attachment: { orderBy: { createdAt: 'desc' } }
    }
  });

  const categories = await db.category.findMany({ orderBy: { name: 'asc' } });

  if (!course) return redirect("/");

  const requireField = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.price,
    course.chapters.some(chapter => chapter.isPublished)
  ];

  const totalFields = requireField.length;
  const completedFields = requireField.filter(Boolean).length;
  const completionTexts = `(${completedFields}/${totalFields})`;
  const isComplete = requireField.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label='This Course is Unpublished. It will not be visible to the students.'
          variant='warning'
        />
      )}

      <div className='max-w-7xl mx-auto px-6 py-8 space-y-10'>
        {/* Header */}
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6'>
          <div>
            <h1 className='text-3xl font-semibold'>Course Setup</h1>
            <p className='text-sm text-slate-600 mt-1'>
              Complete all fields {completionTexts}
            </p>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          {/* Left Column - Customize Course */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Iconbadge icon={LayoutDashboard} />
                <h2 className='text-xl font-medium'>Customize Your Course</h2>
              </div>
              <TitleForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map(category => ({
                  label: category.name,
                  value: category.id
                }))}
              />
            </div>
          </div>

          {/* Right Column - Chapters, Price & Attachments */}
          <div className='space-y-10'>
            {/* Course Chapters */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Iconbadge icon={ListChecks} />
                <h2 className='text-xl font-medium'>Course Chapters</h2>
              </div>
              <ChapterForm initialData={course} courseId={course.id} />
            </div>

            {/* Price */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Iconbadge icon={CircleDollarSign} />
                <h2 className='text-xl font-medium'>Sell Your Course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>

            {/* Attachments */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Iconbadge icon={File} />
                <h2 className='text-xl font-medium'>Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
