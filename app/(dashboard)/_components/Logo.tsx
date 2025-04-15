import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
        <Image height={50} width={50} src="/logo.svg" alt='logo' />
      
    </div>
  )
}

export default Logo
