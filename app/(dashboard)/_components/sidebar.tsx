import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './Sidebar-Routes'

const Sidebar = () => {
  return (
    <div className='h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm'>
      <div className='p-6 '>
        <Logo/>
      </div>
      <div>
        <SidebarRoutes/>
      </div>
    </div>
  )
}

export default Sidebar
