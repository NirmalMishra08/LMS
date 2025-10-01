"use client"
import React, { useState } from 'react'
import * as z from "zod"
import { Chapter, Course } from '@/prisma/lib/generated/prisma'
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import ChapterList from './ChapterList'





interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] }
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1)
})

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [, setIsupdating] = useState(false)

    const toggleCreating = () => {
        setIsCreating((current) => !current)
    }
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            console.log(values)
            await axios.post(`/api/courses/${courseId}/chapters`, values);

            toast.success("Chapter Created");
            toggleCreating();
            router.refresh();

        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }

    const onReorder = async (updateData: { id: string, position: number }[]) => {
        try {
            setIsupdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapter Reordered")
            router.refresh()

        } catch (error) {
            toast.error("Something went Wrong")
            console.log(error)
        } finally {
            setIsupdating(false)
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }




    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between gap-1'>
                Course Chapters
                <Button onClick={toggleCreating} variant={"ghost"}>
                    {
                        isCreating ? (
                            <>
                                Cancel
                            </>
                        ) : (
                            <>
                                <PlusCircle className='h-4 w-4 mr-2' />
                                Add a Chapter
                            </>
                        )
                    }

                </Button>

            </div>

            {isCreating &&

                (<Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4' >
                        <FormField control={form.control} name='title' render={({
                            field
                        }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className='bg-white' disabled={isSubmitting} placeholder="e.g. 'Introduction to the course'" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button disabled={!isValid || isSubmitting} type='submit'>
                            Create
                        </Button>
                    </form>
                </Form>
                )}
            {
                !isCreating && (
                    <div className={cn("text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic")}>
                        {!initialData.chapters.length && "No Chapters"}
                        <ChapterList
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.chapters || []}
                        />
                    </div>
                )
            }
            {
                !isCreating && (
                    <p className='text-xs text-muted-foreground mt-4'>
                        Drag and drop the reorder the chapters
                    </p>
                )
            }
        </div>
    )
}

export default ChapterForm
