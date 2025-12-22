import React from 'react';
import LazySection from '../components/LazySection';

const About: React.FC = () => {


  const systemArchitecture = [
    {
      tier: 'Presentation Tier',
      description: 'User interface and user interaction layer',
      technologies: ['React', 'TypeScript', 'Tailwind CSS']
    },
    {
      tier: 'Application Tier',
      description: 'Business logic and processing layer',
      technologies: ['Node.js', 'Express.js', 'Odoo Framework']
    },
    {
      tier: 'Database Tier',
      description: 'Data storage and retrieval layer',
      technologies: ['PostgreSQL', 'SQL Server']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">
              About AFCF
            </h1>
            <p className="text-xl text-gray-200 font-serif">
              Understanding the Agricultural Finance Coordination Framework
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <LazySection animation="fade-up" delay={100}>
        <section className="section-padding bg-primary-900">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold font-sans text-gray-100 mb-6 text-center">
                System Overview
              </h2>
              <div className="prose prose-lg mx-auto text-gray-300">
                <p className="text-lg leading-relaxed mb-6 font-serif">
                  The Agricultural Finance Coordination Framework (AFCF) is an innovative digital solution
                  designed to facilitate the efficient flow of funds and resources within Nigeria's agricultural
                  ecosystem. Built on the robust Odoo platform, AFCF creates a coordinated environment where
                  all agricultural finance stakeholders can interact seamlessly.
                </p>
                <p className="text-lg leading-relaxed mb-6 font-serif">
                  Our system addresses the critical need for better coordination among agricultural finance
                  stakeholders, reducing bottlenecks and improving access to agricultural financing for farmers
                  and agribusinesses across Nigeria.
                </p>
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Field Gallery */}
      <LazySection animation="fade-up" delay={150}>
        <section className="section-padding bg-primary-800">
          <div className="container-custom">
            <h2 className="text-3xl font-bold font-sans text-gray-100 mb-8 text-center">Field Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                'https://media.istockphoto.com/id/532203295/photo/tea-harvest.jpg?s=612x612&w=0&k=20&c=4NXcvPzzFY5zkhK-A-mlNjXSnO3wfwPwhTtWfJsLqNs=',
                'https://media.istockphoto.com/id/1460297386/video/african-women-plucking-tea-leaves-on-plantation-east-africa.avif?s=640x640&k=20&c=uxwhzkojijfm2c43K4SMCyYrE1beWxxCyWksi5eQecs=',
                'https://media.istockphoto.com/id/627210216/photo/young-african-woman-collecting-coffee-cherries-east-africa.jpg?s=612x612&w=0&k=20&c=5jBbLQ-P0fZSTGvLijf9Gc-ncg-1QzOIRUWMNKtCcTY=',
                'https://media.istockphoto.com/id/1419252068/photo/african-american-workers-sorting-out-coffee-beans.jpg?s=612x612&w=0&k=20&c=zs-KTruZk5ml_lj4YL71gBcqugLnkuSvdqMqPVloGus='
              ].map((src, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-primary-700 bg-primary-900">
                  <img src={src} alt="Field" className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* About Video */}
      <LazySection animation="fade-up" delay={200}>
        <section className="section-padding bg-primary-900">
          <div className="container-custom">
            <div className="card">
              <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">AFCF in Action</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-96 rounded-lg"
                  src="https://www.youtube.com/embed/Twggtl-DLvA?rel=0"
                  title="AFCF Overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </LazySection>





      {/* Key Benefits */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-sans text-gray-100 mb-12 text-center">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                Improved Efficiency
              </h3>
              <p className="text-gray-300 font-serif">
                Streamlined processes reduce time-to-funding and operational overhead
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                Risk Management
              </h3>
              <p className="text-gray-300 font-serif">
                Integrated insurance mechanisms protect all stakeholders
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                Transparency
              </h3>
              <p className="text-gray-300 font-serif">
                Real-time tracking and reporting ensure complete visibility
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                Better Coordination
              </h3>
              <p className="text-gray-300 font-serif">
                Enhanced collaboration between all agricultural finance stakeholders
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                Increased Access
              </h3>
              <p className="text-gray-300 font-serif">
                More farmers and agribusinesses gain access to formal financing
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                Modern Technology
              </h3>
              <p className="text-gray-300 font-serif">
                Built on cutting-edge technology for reliability and scalability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-sans mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed font-serif">
              To create a comprehensive and efficient Agriculture Financing Coordinating Framework
              that optimizes the allocation of funds, resources, and support to all participants
              within the agricultural value chain, promoting sustainable agricultural growth in Nigeria.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
