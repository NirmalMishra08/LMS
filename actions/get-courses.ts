import { Category,Course } from "@/prisma/lib/generated/prisma";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;

}

type GetCourses = {
    userId: string;
    categoryId?: string;
    title?: string;
};

export const getCourses = async ({ userId, categoryId, title }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId: userId,
                    },
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });



        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    };
                }

                const progressPercentage = await getProgress(course.id, userId);

                return {
                    ...course,
                    progress:progressPercentage
                }
            })
        );
        

        return coursesWithProgress;
    } catch (error) {
        console.error("[GET COURSES]", error);
        throw new Error("Failed to fetch courses");
    }
};  
