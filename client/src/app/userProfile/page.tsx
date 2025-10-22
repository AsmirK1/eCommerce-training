'use client'
import React ,{useState}from 'react'
type Product = {
    id: string,
    name: string,
    imge:string,
    pries:number
}

type Order = {
    datum: string,
    products : Product[]
}
type WhisList = Product[];



export default function UserProfile() {
    const [order, setOrder] =useState<Order>();
    const [whisList, setWhisList] = useState<WhisList>()
    // fetich user from Mongodb 
  return (
    <div className='bg-white flex-col justify-center text-black text center m-2 p-2'>
        <div className='grid place-content-center p-1'>
            <h1 className='p-2'>Name : <strong className='text-red-800'>username </strong></h1>
        </div>
        <div className='border-3 border-sky-500 rounded-xl p-2 m-2 '>
            <p className='grid place-content-center'>Order list <span>Datum : orderDatum</span></p>
            <div className='flex flex-row m-3 border-3 border-blue-500 rounded-xl p-2 m-2'>
                <div className="basis-1/3">
                    <img 
                    className='rounded-lg object-cover object-right'
                    src="https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=600&auto=format&fit=crop"
                    alt="productsImage"
                    width={300}
                    height={300}/>
                </div>
                <div className="basis-2/3 m-5 p-5">
                    <p className='p-4'>Product Name </p>
                    <p className='p-4'>Product Pries</p>
                </div>
            </div>
        </div>
        <div className='border-3 border-sky-500 rounded-xl p-2 m-2'>
            <p className='grid place-content-center'>Wish list </p>
            <div className='flex flex-row m-3 border-3 border-blue-500 rounded-xl p-2 m-2'>
                <div className="basis-1/3">
                    <img 
                    className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
                    src="https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=600&auto=format&fit=crop"
                    alt="productsImage"
                    width={70}
                    height={70}/>
                </div>
                <div className="basis-2/3 ml-5 p-5">
                    <p className='p-4'>Product Name </p>
                    <p className='p-4'>Product Pries</p>
                </div>
            </div>
        </div>
    </div>
  )
}
