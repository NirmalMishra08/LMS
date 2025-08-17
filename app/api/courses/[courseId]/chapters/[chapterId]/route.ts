import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from '@mux/mux-node';


 export const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
});




export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string } }){
    try {
        const { courseId, chapterId } = await params;
        const {userId} = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized ", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.findUnique({
            where:{
                id:chapterId,
                courseId:courseId
            }
        })
        if(!chapter){
            return new NextResponse("Not found", { status: 404 })
        }

        if(chapter.videoUrl){
           const existingMuxData = await db.muxData.findFirst({
            where:{
                chapterId:chapterId
            }
           })

           if(existingMuxData){
            await mux.video.assets.delete(existingMuxData.assetId)
            await db.muxData.delete({
                where:{
                    id:existingMuxData.id
                }
            })
           }
        }


        const deletedChapter = await db.chapter.delete({
            where:{
                id:chapterId
            }
        })

        const publishedChapterInCourse = await db.chapter.findMany({
            where:{
                courseId:courseId,
                isPublished:true
            }
        })

        if(!publishedChapterInCourse.length){
            await db.course.update({
                where:{
                    id:courseId
                },
                data:{
                    isPublished:false
                }
            })
        }

        return NextResponse.json(deletedChapter)
       
    } catch (error) {
      console.log('[CHAPTER_ID_DELETE]',error);
      return new NextResponse("Internal Error",{status:500})
    }
}





export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json()
        const { courseId, chapterId } = await params;
        if (!userId) {
            return new NextResponse("Unauthorized ", { status: 401 })
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values
            }

        })

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            })
            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);

                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
            const asset = await mux.video.assets.create({
                inputs: [{ url: values.videoUrl }],
                playback_policy: ['public'],
                test: false
            });

            //   const asset = await mux.video.assets.create({
            //     input: [{ url: 'https://muxed.s3.amazonaws.com/leds.mp4' }],
            //     playback_policy: ['public'],
            //     video_quality: 'basic',
            //   });

            console.log(asset)

            await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })

        }

        return NextResponse.json(chapter)




    } catch (error) {
        console.log("[chapters]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}