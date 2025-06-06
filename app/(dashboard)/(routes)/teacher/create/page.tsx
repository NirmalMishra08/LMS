"use client"
import React from 'react'
import * as z from "zod"
import axios from "axios"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'



const page = () => {

    const router = useRouter();

    const formSchema = z.object({
        title: z.string().min(1, {
            message: "Title is required"
        })

    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${res.data.id}`);
            toast.success("Course created successfully");
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
            
        }
    }
    return (
        <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6 '>
            <div>
                <h1 className='text-2xl '>
                    Name your Course
                </h1>
                <p className='text-sm text-slate-600'>
                    What would you like to name your course? You can always change it later.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-8'>
                        <FormField control={form.control} name='title' render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="e.g. 'Advanced web development' " {...field} />

                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course ?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )
                        }} />
                        <div className='flex items-center gap-x-2'>
                            <Link href="/">
                                <Button type='button' variant={"ghost"}>
                                    Cancel
                                </Button>
                                </Link>
                                <Button type='submit' disabled={!isValid || isSubmitting}>
                                    Continue
                                </Button>
                         

                        </div>



                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page
