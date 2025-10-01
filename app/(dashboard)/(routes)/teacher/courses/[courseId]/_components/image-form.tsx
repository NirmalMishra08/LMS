"use client"
import React, { useState } from 'react'
import * as z from "zod"
import { Course } from '@/prisma/lib/generated/prisma'
import { useForm } from "react-hook-form"

import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Loader2, Pencil, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'


interface ImageFormProps {
    initialData: Course
    courseId: string;
};

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    })
})

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing((prev) => !prev)
    }
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData.imageUrl || ""
        }
    })

    const { isSubmitting } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            console.log(values)
            await axios.patch(`/api/courses/${courseId}`, values);

            toast.success("Course description updated successfully");
            toggleEdit();
            router.refresh();

        } catch {
            toast.error("Something went wrong");
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between gap-1    '>
                Image Description
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {
                        isEditing && (
                            <>
                                Cancel
                            </>
                        )
                    }
                    {
                        !isEditing && !initialData.imageUrl && (
                            <>
                                <PlusCircle className='h-4 w-4 mr-2' />
                                Add an image
                            </>
                        )
                    }
                    {!isEditing && initialData.imageUrl &&
                        (
                            <>
                                <Pencil className='h-4 w-4 mr-2' />
                                Edit Image
                            </>
                        )
                    }

                </Button>

            </div>
            {
                !isEditing && (
                    !initialData.imageUrl ? (
                        <div className='flex items-center justify-center h-60  border-slate-200 rounded-md '>
                            <ImageIcon className='h-10 w-10 text-slate-500' />

                        </div>
                    ) : (
                        <div className='relative aspect-video mt-2 '>
                            <Image alt="upload" fill className="object-cover rounded-md" src={initialData.imageUrl} />

                        </div>
                    )
                )
            }
            {isEditing &&
                <div>
                    <FileUpload
                        endpoint='courseImage'
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            } else {
                                // This will trigger when upload fails
                                toast.error("Please try uploading again");
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                        16:9 aspect ratio recommended
                    </div>
                    {isSubmitting && (
                        <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    )}
                </div>
            }

        </div>
    )
}

export default ImageForm
