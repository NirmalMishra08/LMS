"use client"
import { LucideIcon } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'



interface SidebarItemsProps {
    icon: LucideIcon,
    label: string,
    href: string
}

const SidebarItems = ({ icon: Icon, label, href }: SidebarItemsProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (
        pathname === "/" && href === '/'
    ) || pathname === href || pathname?.startsWith(`${href}/`)


    const onClick = () => {
        if (href) {
            router.push(href)
        }
    }

    return (
        <button onClick={onClick} className={cn("flex  items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:bg-slate-300/20  ", isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20","h-full")}>
            <div className='flex items-center gap-x-2 py-4'>
                <Icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
                {label}
            </div>
            <div className = {cn('ml-auto opacity-0 border-2 border-sky-700 h-[52px] transition-all', isActive && "opacity-100")} />

        </button>
    )
}

export default SidebarItems
