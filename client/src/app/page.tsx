import Image from "next/image";

export default function Home() {
  return (
   <div className="bg-white text-black">
    <div>
      <h1 className="text-3xl font-medium text-slate-800 text-center mb-2 font-poppins">New Arrivals</h1>
      <p className="text-slate-600 mb-10 font-poppins text-center">Explore the latest additions to our collection.</p>
    </div>
    {/* <div>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <h1 className="text-3xl font-semibold text-center mx-auto">Our Latest Creations</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">A visual collection of our most recent works - each piece crafted with intention, emotion, and style.</p>
            <div className="flex items-center gap-2 h-[400px] w-full max-w-4xl mt-10 mx-auto">
                <div className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop"
                        alt="image" />
                </div>
                <div className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop"
                        alt="image" />
                </div>
                <div className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop"
                        alt="image" />
                </div>
                <div className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop"
                        alt="image" />
                </div>
                <div className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop"
                        alt="image" />
                </div>
                <div className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full">
                    <img className="h-full w-full object-cover object-center"
                        src="https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop"
                        alt="image" />
                </div>
            </div>
    </div> */}
    <div>
      <br className="m-8 b-8"/>
    </div>
    <div>
      <section className="flex flex-wrap items-center justify-center gap-6">
        <a href="#" className='group w-56'>
            <img className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-top'
            src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=500&auto=format&fit=crop"
            alt="image"
            width={224}
            height={288}
            />
            <p className='text-sm mt-2'>White crew-Neck T-Shirt</p>
            <p className='text-xl'>$ 29.00</p>
        </a>
        <a href="#" className='group w-56'>
            <img 
              className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
              src="https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600&auto=format&fit=crop" 
              alt="image"
              width={224}
              height={288}
              />
            <p className='text-sm mt-2'>White crew-Neck T-Shirt</p>
            <p className='text-xl'>$ 39.00</p>
        </a>
        <a href="#" className='group w-56'>
            <img 
              className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
              src="https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=735&auto=format&fit=crop"
              alt="image"
              width={224}
              height={288}
              />
            <p className='text-sm mt-2'>White crew-Neck T-Shirt</p>
            <p className='text-xl'>$ 29.00</p>
        </a>
        <a href="#" className='group w-56'>
            <img
              className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
              src="https://images.unsplash.com/photo-1667243038099-b257ab263bfd?q=80&w=687&auto=format&fit=crop"
              alt="image"
              width={224}
              height={288}
              />
            <p className='text-sm mt-2'>White crew-Neck T-Shirt</p>
            <p className='text-xl'>$ 49.00</p>
        </a>       
      </section>
      <section className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className='group w-56'>
              <img className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-top'
              src="https://images.unsplash.com/photo-1657560566744-06d0b69f6647?q=80&w=600&auto=format&fit=crop"
              alt="image"
              width={224}
              height={288}
              />
              <p className='text-sm mt-2'>Chris Jordan</p>
              <p className='text-xl'>$ 29.00</p>
          </a>
          <a href="#" className='group w-56'>
              <img 
                className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImage3.png" 
                alt="image"
                width={224}
                height={288}
                />
              <p className='text-sm mt-2'>Nike Pegasus 41 shoes</p>
              <p className='text-xl'>$ 159</p>
          </a>
          <a href="#" className='group w-56'>
              <img 
                className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
                src="https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=600&auto=format&fit=crop"
                alt="image"
                width={224}
                height={288}
                />
              <p className='text-sm mt-2'>Head set Sony</p>
              <p className='text-xl'>$ 129.00</p>
          </a>
          <a href="#" className='group w-56'>
              <img
                className='rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right'
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=700&auto=format&fit=crop"
                alt="image"
                width={224}
                height={288}
                />
              <p className='text-sm mt-2'>Daily mix</p>
              <p className='text-xl'>$ 30.00</p>
          </a>
          
      </section>
    </div>
    {/* <footer className="flex flex-wrap items-center justify-center bg-primary text-primary-content p-10 flex flex-co">
      <div className="flex flex-nowrap">
  <aside>
    <svg
      width="50"
      height="50"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      className="inline-block fill-current">
      <path
        d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
    </svg>
  </aside>
  <div>
    <p className="font-bold">
      ACME Industries Ltd.
      <br />
      Providing reliable tech since 1992
    </p>
    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
  </div>

    </div>
    <div className="flex flex-co">
  <nav>
    <div className="grid grid-flow-col gap-4">
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
        </svg>
      </a>
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
        </svg>
      </a>
      <a>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="fill-current">
          <path
            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
        </svg>
      </a>
    </div>
  </nav>

    </div>
</footer> */}
  </div>
  );
}
