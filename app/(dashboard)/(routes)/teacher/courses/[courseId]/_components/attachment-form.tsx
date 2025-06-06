"use client"
import React, { useState } from 'react'
import * as z from "zod"
import { Course } from '@/prisma/lib/generated/prisma'

import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { FileUpload } from '@/components/file-upload'
import { Attachment } from '@prisma/client'


interface AttachmentFormProps {
    initialData: Course & { attachment: Attachment[] }
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1)
})

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing((prev) => !prev)
    }
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            console.log(values)
            await axios.post(`/api/courses/${courseId}/attachments`, values);

            toast.success("Course Updated");
            toggleEdit();
            router.refresh();

        } catch {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted");
            router.refresh();

        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null)
        }

    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between gap-1    '>
                Course Attachment
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {
                        isEditing && (
                            <>
                                Cancel
                            </>
                        )
                    }
                    {
                        !isEditing && (
                            <>
                                <PlusCircle className='h-4 w-4 mr-2' />
                                Add an file
                            </>
                        )
                    }


                </Button>

            </div>
            {
                !isEditing && (
                    <>
                        {initialData.attachment.length === 0 && (
                            <p className='text-sm mt-2 text-slate-500 italic'>
                                No attachment found
                            </p>
                        )}
                        {
                            initialData.attachment.length > 0 &&
                            (<div className='space-y-2'>
                                {initialData.attachment.map((attachment) => (
                                    <div key={attachment.id} className='flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md'>
                                        <File className='h-4 w-4 mr-2 flex-shrink' />
                                        <p className='text-xs line-clamp-2'>
                                            {attachment.name}
                                        </p>
                                        {
                                            deletingId === attachment.id && (
                                                <div>
                                                    <Loader2 className='h-4 w-4 animate-spin' />
                                                </div>
                                            )
                                        }
                                        {
                                            deletingId !== attachment.id && (
                                                <button onClick={() => onDelete(attachment.id)} className='ml-auto'>
                                                    <X className='h-4 w-4' />
                                                </button>
                                            )
                                        }

                                    </div>
                                )

                                )}
                            </div>)

                        }
                    </>
                )
            }
            {isEditing &&
                <div>
                    <FileUpload
                        endpoint='courseAttachment'
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            } else {
                                // This will trigger when upload fails
                                toast.error("Please try uploading again");
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        Anything your student might need to complete this course .
                    </div>

                </div>
            }

        </div>
    )
}

export default AttachmentForm
