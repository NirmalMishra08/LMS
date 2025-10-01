import React from 'react'
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface CourseProgressProps {
    variant?: "success" | "default";
    value: number;
    size?: "sm" | "default" | "lg"
}

const colorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700"
}

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
    lg: "text-base"
}

const CourseProgress = ({ value, variant, size }: CourseProgressProps) => {
    return (
        <div>
            <Progress
                className='h-2 '
                value={value}
                variant={variant}
            />
            <p className={cn("font-medium mt-1 text-sky-700", colorByVariant[variant || "default"], sizeByVariant[size || "default"])}>
                {Math.round(value)}% completed
            </p>

        </div>
    )
}

export default CourseProgress