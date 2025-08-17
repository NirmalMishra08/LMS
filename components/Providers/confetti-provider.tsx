"use client"
import ReactConfetti from 'react-confetti';
import { useConfettiStore } from "@/hooks/useConfettiStore"


export const ConfettiProvider = () => {
    const confetti = useConfettiStore();
    if (!confetti.isOpen) {
        return null;
    }

    return (
        <ReactConfetti
            className='pointer-events-none z-[100'
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={600}
            onConfettiComplete={() => { confetti.onClose() }}
        />
    );
};