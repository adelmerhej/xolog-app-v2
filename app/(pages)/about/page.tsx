"use client";

import { motion } from "framer-motion";
import Head from "next/head";
import {
  TruckIcon,
  GlobeAltIcon,
  ClockIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

const AboutPage = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stats = [
    { value: "3,000+", label: "Daily Shipments" },
    { value: "150+", label: "Countries Served" },
    { value: "99.7%", label: "On-Time Delivery" },
    { value: "24/7", label: "Customer Support" },
  ];

  const features = [
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Fast Delivery",
      description:
        "Our optimized logistics network ensures your packages arrive faster than industry standards.",
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Reach",
      description:
        "We operate in over 150 countries with reliable local partners in each region.",
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description:
        "Track your shipment every step of the way with our advanced tracking system.",
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure Handling",
      description:
        "Your goods are protected with our state-of-the-art security measures.",
    },
  ];

  return (
    <>
    <Header />
    <main className="min-h-screen pt-24 px-6">
      <Head>
        <title>About Us | XOLOG sal</title>
        <meta
          name="description"
          content="Learn about XOLOG and our global shipping solutions"
        />
      </Head>

      <div className="bg-white">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-blue-600 to-cyan-400 py-20 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-100">
            <div className="absolute inset-0 bg-[url('/images/corporat_collage-1.jpg')]"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                Delivering Excellence Worldwide
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-blue-100 max-w-2xl mx-auto"
              >
                XOLOG sal is a global leader in freight forwarding and supply
                chain solutions, connecting businesses to markets around the
                world.
              </motion.p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <svg
              className="w-64 h-64 text-white opacity-10"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M40,-58.1C52.3,-50.3,63,-40.2,68.8,-27.7C74.6,-15.1,75.5,-0.1,72.4,13.6C69.3,27.3,62.2,39.7,51.4,49.1C40.6,58.5,26.1,64.9,10.3,70.8C-5.5,76.7,-22.6,82.1,-36.1,76.3C-49.6,70.5,-59.5,53.5,-65.5,36.1C-71.6,18.7,-73.9,0.9,-70.3,-15.3C-66.7,-31.5,-57.2,-46.1,-44.4,-53.7C-31.6,-61.3,-15.8,-61.8,-0.7,-60.9C14.4,-60,28.8,-57.6,40,-58.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 mb-4">
                  <b>XOLOG sal </b> is a young Lebanese freight forwarding company
                  aiming to dominate the Lebanese fragmented FF market and to
                  provide exceptional services in the domain of logistics. <br />
                  Our goal is to guarantee you the best customer assistance possible
                  as we deliver quick and reliable services with competitive
                  rates by using our extensive experience in the IT field. <br />
                  We also develop software programs and mobile applications that
                  will benefit our clients and allow them to run their freight
                  businesses in the most efficient ways possible. <br />
    
                </p>
                <p className="text-gray-600 mb-4">
                <b>XOLOG sal</b> is committed to rapidly become one of the top ten leading freight
                  forwarding companies in Lebanon. Our vision and business plan
                  are to serve Lebanon and the MENA region by providing the best
                  freight forwarding experience to our clients in export and
                  import from and to any place in the world whether by sea, air
                  or land.{" "}
                </p>
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:w-1/2 relative"
              >
                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/warehouse-team.jpg"
                    alt="XOLOG warehouse team"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
                </div>
                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-lg">
                  <p className="text-2xl font-bold text-blue-600">10+ Years</p>
                  <p className="text-gray-600">of trusted service</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose XOLOG?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We combine global reach with local expertise to deliver tailored
                logistics solutions.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Our Leadership
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The experienced team driving XOLOG`s global success.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  name: "Sarah Johnson",
                  role: "CEO & Founder",
                  image: "/images/team-sarah.jpg",
                },
                {
                  name: "Michael Chen",
                  role: "Chief Operations Officer",
                  image: "/images/team-michael.jpg",
                },
                {
                  name: "Elena Rodriguez",
                  role: "Global Logistics Director",
                  image: "/images/team-elena.jpg",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 mb-4">{member.role}</p>
                    <div className="flex space-x-4">
                      {["LinkedIn", "Twitter"].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {social}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section> */}

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20 bg-transparent"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
              Ready to Ship With Us?
            </h2>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto mb-8">
              Join thousands of businesses that trust XOLOG for their
              logistics needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Get a Free Quote
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-blue-300 text-blue-700 font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Contact Sales
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
