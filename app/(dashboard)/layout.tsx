
import React from 'react'
import Sidebar from './_components/sidebar'
import Navbar from './_components/Navbar'
import { ToasterProvider } from '@/components/Providers/toaster-provider'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen flex '>
            <div className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
              <Navbar/>
            </div>
            <div className='hidden h-screen md:flex  w-56 flex-col inset-y-0 z-50'>
                <Sidebar />
            </div>
            <main className='flex-1 pt-[80px] h-full '>
                <ToasterProvider/>
                {children}
            </main>

        </div>
    )
}

export default DashboardLayout
