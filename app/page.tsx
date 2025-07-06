"use client";

import { useEffect, useRef } from "react";
import Head from "next/head";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  FiArrowRight,
} from "react-icons/fi";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

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
  
  // Major shipping hubs with coordinates (x%, y%)
  const shippingHubs = [
    { name: "Rotterdam", x: 52, y: 32, size: 8 },
    { name: "Shanghai", x: 78, y: 45, size: 10 },
    { name: "Singapore", x: 75, y: 60, size: 8 },
    { name: "Los Angeles", x: 12, y: 45, size: 8 },
    { name: "Dubai", x: 60, y: 50, size: 7 },
    { name: "Hamburg", x: 50, y: 32, size: 6 },
    { name: "New York", x: 22, y: 40, size: 8 },
    { name: "Hong Kong", x: 76, y: 50, size: 7 },
    { name: "Antwerp", x: 50, y: 33, size: 5 },
    { name: "Busan", x: 82, y: 42, size: 6 },
  ];

  // Major shipping routes between hubs
  const shippingRoutes = [
    { from: "Rotterdam", to: "Shanghai" },
    { from: "Singapore", to: "Los Angeles" },
    { from: "Dubai", to: "New York" },
    { from: "Hong Kong", to: "Hamburg" },
    { from: "Busan", to: "Antwerp" },
    { from: "Shanghai", to: "Los Angeles" },
    { from: "Rotterdam", to: "New York" },
    { from: "Singapore", to: "Dubai" },
  ];

  const getHubCoordinates = (hubName: string) => {
    return shippingHubs.find((hub) => hub.name === hubName);
  };

  return (
    <>
      <Header />
      <Head>
        <title>XOLOG SAL - AI-Driven Shipping Solutions</title>
        <meta
          name="description"
          content="Revolutionizing freight forwarding with AI and cloud technology"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden relative">
        {/* World Map Background */}
        <div className="fixed inset-0 w-full h-full opacity-10 z-0 pointer-events-none">
          <Image
            src="/worldmap.png"
            alt="World Map"
            style={{objectFit: "cover"}}
            fill={true}
            quality={100}
            priority
          />
        </div>

        {/* Animated Shipping Network */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
          {/* Shipping Routes */}
          {shippingRoutes.map((route, i) => {
            const fromHub = getHubCoordinates(route.from);
            const toHub = getHubCoordinates(route.to);
            if (!fromHub || !toHub) return null;

            return (
              <motion.svg
                key={`route-${i}`}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <motion.path
                  d={`M${fromHub.x},${fromHub.y} Q${(fromHub.x + toHub.x) / 2},${(fromHub.y + toHub.y) / 2 + 5} ${toHub.x},${toHub.y}`}
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="0.5"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  animate={{
                    strokeDashoffset: [100, 0],
                    opacity: [0, 0.4, 0],
                  }}
                  transition={{
                    duration: Math.random() * 15 + 10,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                    delay: Math.random() * 5,
                  }}
                />
              </motion.svg>
            );
          })}

          {/* Shipping Hubs */}
          {shippingHubs.map((hub, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-600 border-2 border-white shadow-sm"
              style={{
                width: `${hub.size}px`,
                height: `${hub.size}px`,
                left: `${hub.x}%`,
                top: `${hub.y}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400 opacity-70"
                animate={{
                  scale: [1, 2],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeOut",
                }}
              />
            </motion.div>
          ))}

          {/* Sparkles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute rounded-full bg-blue-200"
              // style={{
              //   width: `${Math.random() * 3 + 1}px`,
              //   height: `${Math.random() * 3 + 1}px`,
              //   left: `${Math.random() * 100}%`,
              //   top: `${Math.random() * 100}%`,
              // }}
              animate={{
                x: [0, (Math.random() - 0.5) * 10],
                y: [0, (Math.random() - 0.5) * 10],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <main className="relative z-12 px-6 py-28 md:py-36 lg:py-44 max-w-7xl mx-auto">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">
                XOLOG SAL - AI-Powered Shipping
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900">
                  Your Cargo, Our Cloud
                </span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
                Where{" "}
                <span className="font-semibold text-blue-700">
                  AI Innovation
                </span>{" "}
                Meets
                <span className="font-semibold text-blue-700">
                  {" "}
                  Global Delivery
                </span>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Instant Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 flex items-center justify-center gap-2"
              >
                Track Shipment <FiArrowRight />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* AI-Powered Features Section */}
          <section className="py-20 bg-transparent">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }} // Added margin to trigger earlier
                className="text-center mb-16"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  AI-Powered Shipping Solutions
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Our cutting-edge AI technology optimizes every step of your
                  shipping process.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }} // Added margin to trigger earlier
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2,
                    },
                  },
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[
                  {
                    title: "Smart Logistics",
                    description:
                      "AI-powered routing for optimal delivery paths.",
                    icon: "📦",
                  },
                  {
                    title: "Predictive Delivery Times",
                    description:
                      "Get accurate delivery estimates that update in real-time based on current conditions.",
                    icon: "🧭",
                  },
                  {
                    title: "Automated Logistics",
                    description:
                      "AI manages warehouse operations and loading for maximum efficiency.",
                    icon: "📡",
                  },
                  {
                    title: "Real-time Analytics",
                    description:
                      "Data-driven insights for your supply chain.",
                    icon: "⏱️",
                  },
                  {
                    title: "24/7 Tracking",
                    description:
                      "Always know where your cargo is.",
                    icon: "🕵️‍♂️",
                  },
                  {
                    title: "Secure Shipping",
                    description:
                      "Blockchain-backed documentation.",
                    icon: "🛡",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Global Network Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
            className="mt-32 relative"
          >
            <div className="relative z-13 text-center pt-20 pb-20">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Our Global Shipping Network
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connected to major ports and logistics hubs worldwide for
                seamless cargo movement
              </p>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </>
  );
}
