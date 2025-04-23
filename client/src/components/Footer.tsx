import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='bg-slate-100 px-4 2xl:px-20 mx-auto py-6 mt-20 flex items-center max-sm:flex-col justify-center gap-4'>
      <img src={assets.company_logo} className='w-[120px] sm:w-[160px]' alt="" />
      <p className='sm:border-l border-gray-400 pl-4 text-sm text-gray-800'>
        Copyright @PG.dev | All rights reserved.
      </p>
    </div>
  )
}

export default Footer
