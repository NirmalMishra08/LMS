import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import React from 'react'
import { Categories } from './_components/categories'
import SearchInput from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import { auth } from '@clerk/nextjs/server'
import CoursesList from '@/components/courses-list'



interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string
  }
}

const page = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = await auth()

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  console.log("Search Params:", userId)

  if (!userId) {
    redirect("/")
  }

  const searchParms = await searchParams;

  const courses = await getCourses({ userId, ...searchParms })


  return (
    <>
      <div className='px-6 pt-6 md:hidden md:mb-0 block'>
        <SearchInput />
      </div>
      <div className='p-6 space-y-4 '>
        <Categories
          items={categories}
        />
        <CoursesList
        items={courses}
        />
      </div>
    </>

  )
}

export default page
