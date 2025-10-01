"use client"
import React, { useState } from 'react'
import * as z from "zod"
import { Chapter, MuxData } from '@/prisma/lib/generated/prisma'
import { useForm } from "react-hook-form"

import { zodResolver } from '@hookform/resolvers/zod'
import {  Pencil, PlusCircle, VideoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MuxPlayer from "@mux/mux-player-react"

import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


import { FileUpload } from '@/components/file-upload'


interface VideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null },
    courseId: string,
    chapterId: string
};

const formSchema = z.object({
    videoUrl: z.string().min(1)
})

const VideoForm = ({ initialData, courseId, chapterId }: VideoFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing((prev) => !prev)
    }
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            formSchema.parse(values);
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

            toast.success("Chapter Updated");
            toggleEdit();
            router.refresh();

        } catch {
            toast.error("Something went wrong");
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between gap-1    '>
               Chapter Video
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {
                        isEditing && (
                            <>
                                Cancel
                            </>
                        )
                    }
                    {
                        !isEditing && !initialData.videoUrl && (
                            <>
                                <PlusCircle className='h-4 w-4 mr-2' />
                                Add an video
                            </>
                        )
                    }
                    {!isEditing && initialData.videoUrl &&
                        (
                            <>
                                <Pencil className='h-4 w-4 mr-2' />
                                Edit video
                            </>
                        )
                    }

                </Button>

            </div>
            {
                !isEditing && (
                    !initialData.videoUrl ? (
                        <div className='flex items-center justify-center h-60  border-slate-200 rounded-md '>
                            <VideoIcon className='h-10 w-10 text-slate-500' />

                        </div>
                    ) : (
                        <div className='relative aspect-video mt-2 '>
                          <MuxPlayer
                          playbackId={initialData?.muxData?.playbackId||""}
                          
                          />
                        </div>
                    )
                )
            }
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            } else {
                                // This will trigger when upload fails
                                toast.error("Please try uploading again");
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Upload this chapter&apos;s video
                    </div>

                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-sm text-muted-foreground mt-2">
                    Videos can take a few minutes to process . Refresh the page if video does not appear
                </div>
            )}

        </div>
    )
}

export default VideoForm
