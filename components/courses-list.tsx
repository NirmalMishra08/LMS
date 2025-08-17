import React from 'react'
import { Category, Course } from '@prisma/client'
import { CourseCard } from './course-card';

type CourseListPropsWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

type CourseListProps = {
    items: CourseListPropsWithCategory[];
}

const CoursesList = ({ items }: CourseListProps) => {
    return (
        <div>
            <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
                {items.map((item) => {
                    return (
                        <CourseCard
                        key={item.id}
                        id={item.id}
                        price={item.price!}
                        title={item.title}
                        imageUrl = {item.imageUrl!}
                        progress={item.progress}
                        chapterLength ={item.chapters.length}
                        category={item?.category?.name!}
                         />
                    )
                })}
            </div>
            {items.length === 0 && (
                <div className="text-center text-gray-500">
                    No courses found.
                </div>
            )}
        </div>

    )
}

export default CoursesList