import React from 'react'

const Container = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='mx-auto space-y-8 md:p-6 bg-[#F6F6F6] animate-in fade-in slide-in-from-left-4 duration-700'>{children}</div>
  )
}

export default Container