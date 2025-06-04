/* eslint-disable react/no-unescaped-entities */
import Header from "@/components/Header";
import { Footer } from "@/components/visions/footer";
import { MotionDiv } from "@/components/visions/motion-div";
import VisionCard from "@/components/visions/VisionCard";
import ServiceHighlight from "@/components/visions/ServiceHighlight";

export default function VisionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/freight-hero.jpg')] bg-cover bg-center opacity-30" />
          
          <MotionDiv 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-6xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Reimagining</span> Freight Forwarding
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Pioneering logistics solutions connecting Lebanon to the Middle East and beyond with 
              innovation, reliability, and unmatched expertise.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore Our Network
            </button>
          </MotionDiv>
        </section>

        {/* Vision Statement */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Our <span className="text-blue-600">Vision</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 text-center">
              To transform the logistics landscape in Lebanon and the Middle East by leveraging 
              cutting-edge technology, sustainable practices, and deep regional expertise to create 
              seamless supply chain solutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <VisionCard 
                title="Digital Innovation"
                description="Implementing AI-driven logistics platforms to optimize routes and reduce costs."
                icon="🚀"
                delay={0.1}
              />
              <VisionCard 
                title="Regional Expertise"
                description="Deep understanding of Middle Eastern markets and customs regulations."
                icon="🌍"
                delay={0.2}
              />
              <VisionCard 
                title="Sustainable Logistics"
                description="Reducing carbon footprint through eco-friendly transport solutions."
                icon="♻️"
                delay={0.3}
              />
            </div>
          </MotionDiv>
        </section>

        {/* Services Showcase */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              Our <span className="text-blue-200">Freight Solutions</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ServiceHighlight 
                title="Air Freight"
                description="Rapid transit solutions from Beirut International Airport to global destinations."
                delay={0.1}
              />
              <ServiceHighlight 
                title="Sea Freight"
                description="Full-container and LCL services through Beirut and Tripoli ports."
                delay={0.2}
              />
              <ServiceHighlight 
                title="Land Transport"
                description="Cross-border trucking services across Middle Eastern countries."
                delay={0.3}
              />
              <ServiceHighlight 
                title="Customs Clearance"
                description="Expert handling of complex Middle Eastern customs procedures."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* Regional Focus */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">Lebanon</span> as a Logistics Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategically positioned on the Mediterranean, Lebanon serves as the perfect gateway 
              between Europe, the Middle East, and Africa.
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Beirut Port Expansion</h3>
              <p className="text-gray-700 mb-6">
                With ongoing port modernization projects, we're enhancing capacity to handle 
                increased trade flows through Lebanon's primary maritime gateway.
              </p>
              <div className="h-48 bg-[url('/images/beirut-port.jpg')] bg-cover bg-center rounded-lg" />
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Middle East Network</h3>
              <p className="text-gray-700 mb-6">
                Our established partnerships across GCC countries, Jordan, Syria, and Iraq ensure 
                seamless regional distribution with local compliance expertise.
              </p>
              <div className="h-48 bg-[url('/images/middle-east-map.jpg')] bg-cover bg-center rounded-lg" />
            </MotionDiv>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to <span className="text-blue-400">Transform</span> Your Supply Chain?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Partner with Lebanon's most innovative freight forwarding specialist for 
                reliable, efficient, and technology-driven logistics solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                  Get a Quote
                </button>
                <button className="bg-transparent hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full border border-gray-600 transition-all duration-300 transform hover:scale-105">
                  Contact Our Team
                </button>
              </div>
            </MotionDiv>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}