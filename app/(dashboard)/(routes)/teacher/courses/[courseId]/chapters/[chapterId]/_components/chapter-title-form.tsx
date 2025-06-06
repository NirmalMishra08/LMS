"use client"
import React, { useState } from 'react'
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    chapterId: string
};

const formSchema = z.object({
    title: z.string().min(1),
})

const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => {
        setIsEditing((prev) => !prev)
    }
    const router = useRouter();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            console.log(values)
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

            toast.success("Chapter title updated successfully");
            toggleEdit();
            router.refresh();

        } catch {
            toast.error("Something went wrong");
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between    '>
                Chapter Title
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {
                        isEditing ? (
                            <>
                                Cancel
                            </>
                        ) : (
                            <>
                                <Pencil className='h-4 w-4 mr-2' />
                                Edit Title
                            </>
                        )
                    }

                </Button>

            </div>
            {
                !isEditing && (
                    <p className='text-sm mt-2'>
                        {initialData.title}
                    </p>
                )
            }
            {isEditing &&

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4' >
                        <FormField control={form.control} name='title' render={({
                            field
                        }) => (
                            <FormItem>
                                <FormControl>
                                    <Input className='bg-white' disabled={isSubmitting} placeholder="e.g. 'Introduction to the Course' " {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>
                                Save
                            </Button>

                        </div>

                    </form>

                </Form>
            }

        </div>
    )
}

export default ChapterTitleForm
