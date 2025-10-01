import Image from "next/image";
import Link from "next/link";
import { Iconbadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./course-progress";
import { getProgress } from "@/actions/get-progress";
import { useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";


interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    price?: number;
    progress: number | null;
    chapterLength: number;
    category: string | null;
}
export const CourseCard = async ({ id, title, imageUrl, price, progress, chapterLength, category }: CourseCardProps) => {
    const { userId } = await auth();
    const progressCount = userId ? await getProgress(userId, id) : 0;
    return (
        <Link href={`/courses/${id}`} className="group hover:shadow-sm trainsition overflow-hidden border rounded-lg p-3 h-full ">
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Image
                    fill
                    className="object-cover"
                    alt={title}
                    src={imageUrl}
                />
            </div>
            <div className="flex flex-col pt-2">
                <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                    {title}
                </div>
                <p className="text-xs text-muted-foreground">
                    {category}
                </p>
                <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                    <div className="flex items-center gap-x-1 text-slate-500">
                        <Iconbadge size={"sm"} icon={BookOpen} />
                        <span>{chapterLength} {chapterLength === 1 ? "Chapter" : "Chapters"}</span>
                    </div>
                </div>
                {progress !== null ? (
                    <div className="text-xs text-muted-foreground">
                        <CourseProgress variant="success" value={progressCount} />
                    </div>
                ) : (
                    <p className="text-md md:text-sm font-medium text-slate-700 ">
                        {formatPrice(price ?? 0)}
                    </p>
                )}
            </div>
        </Link>
    )
}