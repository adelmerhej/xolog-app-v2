'use client';

import React from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    title: "Sea Import",
    description:
      "Efficient and reliable sea import solutions for your global cargo. We handle customs, documentation, and ensure timely delivery from port to door.",
    icon: "🚢",
  },
  {
    title: "Sea Export",
    description:
      "Export your goods worldwide with our expert sea freight team. We offer competitive rates, secure handling, and full tracking.",
    icon: "🌊",
  },
  {
    title: "Sea Clearance",
    description:
      "Smooth customs clearance for all sea shipments. Our experienced team ensures compliance and fast processing at every port.",
    icon: "🛃",
  },
  {
    title: "Air Import",
    description:
      "Fast and secure air import services for urgent and high-value shipments. We manage logistics from airport to your warehouse.",
    icon: "✈️",
  },
  {
    title: "Air Export",
    description:
      "Export by air with confidence. Our network and expertise guarantee quick transit and safe delivery to any destination.",
    icon: "🛫",
  },
  {
    title: "Air Clearance",
    description:
      "Expert air cargo clearance for hassle-free import/export. We handle all paperwork and regulatory requirements.",
    icon: "🛂",
  },
  {
    title: "Land Freight",
    description:
      "Comprehensive land freight solutions across the region. We offer FTL, LTL, and last-mile delivery with real-time tracking.",
    icon: "🚚",
  },
  {
    title: "Warehouse",
    description:
      "Secure and modern warehousing for your inventory. Flexible storage, inventory management, and value-added services.",
    icon: "🏢",
  },
  {
    title: "Local delivery",
    description:
      "Specializing in local moves, door-to-door transportation and logistics solutions for businesses and individuals relocating within the same city or region.",
    icon: "🚚🚪",
  },
];

export default function ServicesPage() {
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
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">
                XOLOG SAL - Our Services
              </h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
                  Shipping Solutions for Every Need
                </span>
              </h1>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
                Discover our full range of logistics services, powered by AI and delivered with care.
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 8px 32px rgba(59,130,246,0.12)" }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col items-center"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
// ... existing code ...