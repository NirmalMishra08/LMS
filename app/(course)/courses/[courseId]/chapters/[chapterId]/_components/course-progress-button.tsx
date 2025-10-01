'use client'
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useConfettiStore } from '@/hooks/useConfettiStore';
import toast from 'react-hot-toast';

interface CourseProgressButtonProps {
    chapterId: string;
    courseId?: string;
    nextChapterId?: string;
    isCompleted?: boolean;
}

const CourseProgressButton = ({ chapterId, courseId, nextChapterId, isCompleted }: CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle;
    const router = useRouter();
    const confetti = useConfettiStore();
    const [, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await fetch(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isCompleted: !isCompleted
                })
            });
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }
            if (nextChapterId && !isCompleted) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
            toast.success("Progress updated");
            router.refresh();

        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Button onClick={onClick} type='button' variant={isCompleted ? "outline" : "success"} className='w-full md:w-auto ' >
            {isCompleted ? "Not Completed" : "Mark as Complete"}
            <Icon className='h-4 w-4 ml-2 ' />

        </Button>
    )
}

export default CourseProgressButton