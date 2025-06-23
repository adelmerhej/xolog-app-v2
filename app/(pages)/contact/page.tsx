'use client';

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ContactPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden relative">
        {/* World Map Background */}
        <div className="fixed inset-0 w-full h-full opacity-10 z-0 pointer-events-none">
          <Image
            src="/worldmap.png"
            alt="World Map"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
        </div>

        <div className="relative z-10 px-6 py-28 md:py-36 lg:py-44 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4 text-center">
                Get in Touch
              </h2>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-center">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
                  Contact Us
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 text-center">
                Have questions? We`re here to <span className="font-semibold text-blue-700">help</span> and 
                <span className="font-semibold text-blue-700"> guide you</span> through your shipping needs.
              </p>
            </motion.div>

            {/* Headquarters */}
            <motion.div variants={itemVariants}>
              <Card className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-2xl font-bold text-gray-900">Our Headquarters</CardHeader>
                <CardContent className="space-y-2 text-lg text-gray-600">
                  <p className="font-semibold text-blue-700">XOLOG sal (HEADQUARTERS)</p>
                  <p><b>Beirut – Lebanon</b></p>
                  <p>Gemayze area – Pasteur street – West End 33 building – 8th floor</p>
                  <p>Email: info@xolog.com</p>
                  <p>Tel: (+961) 1 574333</p>
                  <p>Fax: (+961) 1 574666</p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card className="backdrop-blur-sm bg-white/80 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-2xl font-bold text-gray-900">Send a Message</CardHeader>
                <CardContent className="space-y-6">
                  <Input 
                    type="text" 
                    placeholder="Your Name" 
                    className="bg-white text-lg py-6" 
                  />
                  <Input 
                    type="email" 
                    placeholder="Your Email" 
                    className="bg-white text-lg py-6" 
                  />
                  <Textarea 
                    placeholder="Your Message" 
                    rows={6} 
                    className="bg-white text-lg resize-none" 
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6">
                      Send Message
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}