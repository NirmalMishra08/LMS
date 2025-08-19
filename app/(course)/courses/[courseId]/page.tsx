import React from 'react'

const Page = async ({ params }: { params: { courseId: string } }) => {
    const { courseId } = await params
    return (
        <div>{courseId}</div>
    )
}

export default Page