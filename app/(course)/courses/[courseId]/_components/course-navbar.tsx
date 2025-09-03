import NavbarRoutes from '@/components/Navbar-routes'
import { Chapter, UserProgress } from '@/prisma/lib/generated/prisma'
import { Course } from '@prisma/client'
import React from 'react'

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter &
        {
            userProgress: UserProgress[] | null
        }
        )[]
    }
    progressCount: number
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
    return (
        <div className='p-4 border-b h-full w-full flex items-center bg-white shadow-sm '>
           <NavbarRoutes/>
        </div>
    )
}
