"use client"
import React from 'react'
import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { useConfettiStore } from '@/hooks/useConfettiStore'
import { cn } from '@/lib/utils'

interface VideoPlayersProps {
    muxData: string;
    title: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    playbackId?: string;
}

const VideoPlayer = ({ muxData, title, isLocked, completeOnEnd, courseId, chapterId, nextChapterId }: VideoPlayersProps) => {
    const [isReady, setIsReady] = useState(false)
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnded = async () => {
        try {
           if(completeOnEnd){
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: true
            });
           } 

           if(!nextChapterId){
            confetti.onOpen();
           }
           toast.success("Chapter completed")
           router.refresh();

           if(nextChapterId){
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
           }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }
    return (
        <div className='relative aspect-video w-full'>
            {
                !isReady && !isLocked &&
                (
                    <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
                        <Loader2 className='h-8 w-8 animate-spin text-secondary' />
                    </div>
                )
            }
            {
                isLocked && (
                    <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
                        <Lock className='h-8 w-8' />
                        <p className='text-sm'>This Chapter is Locked</p>
                    </div>
                )
            }
            {
                !isLocked && (
                    <MuxPlayer
                        title={title}
                        className={cn(!isReady && 'hidden')}
                        onCanPlay={() => setIsReady(true)}
                        onEnded={onEnded}
                        autoPlay
                        playbackId={muxData}
                    />
                )
            }

        </div>
    )
}

export default VideoPlayer