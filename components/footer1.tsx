import React from 'react'
import Link from "next/link";

export default function Footer1() {
  return (
    <div>
        <footer className="bg-gray-900 text-white py-12 fixed w-full z-50 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 lg:w-1/3 mb-8">
              <h3 className="text-2xl font-bold mb-4">
                <Link href="/"> About Us</Link>
               
                </h3> 
              <p className="text-gray-400">
                We are a team of passionate developers and designers who are
                dedicated to creating high-quality software solutions.
              </p>
            </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 mb-8"> 
            </div>
            </div>
        </footer>
    </div>
  )
}
