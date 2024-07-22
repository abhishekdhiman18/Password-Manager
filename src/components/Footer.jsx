import React from 'react'

const Footer = () => {
  return (
    <div className='bg-slate-800 text-white flex flex-col items-center  bottom-0 w-full'>
            <div className="logo text-2xl">
        <span className='text-green-500'>

        &lt;
        </span>
        Pass 
        <span className='text-green-500'>OP/&gt;
        </span>
        </div>
      <div className='flex items-center '>
      Created with <img className='w-7' src="icons/heart.png" alt="" /> by Abhishek
      </div>
    </div>
  )
}

export default Footer
