import React from 'react';
import { Link } from 'react-router-dom';
import LazySection from '../components/LazySection';

const Home: React.FC = () => {
  const stakeholders = [
    {
      title: 'Fund Providers',
      description: 'CBN, Ministry of Agriculture, Ministry of Finance, and Donor funds',
      icon: '💵'
    },
    {
      title: 'Coordinating Agency',
      description: 'Central coordination body managing the entire framework',
      icon: '🏛️'
    },
    {
      title: 'Participating Banks',
      description: 'Banks and microfinance institutions providing agricultural loans',
      icon: '🏦'
    },
    {
      title: 'Insurance Companies',
      description: 'NAIC and private insurance providers offering coverage',
      icon: '🛡️'
    },
    {
      title: 'Anchors',
      description: 'Large-scale agribusiness firms coordinating with farmers',
      icon: '⚓'
    },
    {
      title: 'Lead Firms',
      description: 'Input manufacturers and machinery dealers',
      icon: '🏭'
    },
    {
      title: 'Producers/Farmers',
      description: 'End beneficiaries receiving agricultural financing',
      icon: '🌾'
    }
  ];

  const features = [
    {
      title: 'Multi-Portal System',
      description: 'Four specialized portals catering to different stakeholder needs',
      icon: '🖥️'
    },
    {
      title: 'Real-time Tracking',
      description: 'Live monitoring of fund disbursements and loan performance',
      icon: '📊'
    },
    {
      title: 'Document Management',
      description: 'Secure document exchange and verification system',
      icon: '📁'
    },
    {
      title: 'Risk Management',
      description: 'Integrated insurance mechanisms',
      icon: '🛡️'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-sans mb-6 animate-fade-in">
              Agricultural Finance Coordination Framework
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up font-serif">
              Facilitating efficient flow of funds and resources within Nigeria's agricultural ecosystem
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
              <button className="bg-accent-500 text-white hover:bg-accent-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Access Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <LazySection animation="fade-up" delay={100}>
        <section className="section-padding bg-primary-900">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-sans text-gray-100 mb-4">
                Our Stakeholders
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-serif">
                The AFCF brings together key stakeholders across the agricultural value chain to create a coordinated financing ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stakeholders.map((stakeholder, index) => (
                <LazySection key={index} animation="fade-up" delay={index * 100 + 200}>
                  <div className="card hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl mb-4">{stakeholder.icon}</div>
                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">
                      {stakeholder.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-serif">
                      {stakeholder.description}
                    </p>
                  </div>
                </LazySection>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Features Section */}
      <LazySection animation="fade-up" delay={200}>
        <section className="section-padding bg-primary-800">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-sans text-gray-100 mb-4">
                Key Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-serif">
                Our comprehensive platform provides all the tools needed for effective agricultural finance coordination
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <LazySection key={index} animation="slide-left" delay={index * 150 + 300}>
                  <div className="card hover:shadow-lg transition-shadow duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold font-sans text-gray-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 font-serif">
                      {feature.description}
                    </p>
                  </div>
                </LazySection>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* Stats Section */}
      <LazySection animation="fade-up" delay={300}>
        <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <LazySection animation="fade-in" delay={400}>
                <div>
                  <div className="text-4xl font-bold mb-2">12+</div>
                  <div className="text-gray-300">Stakeholder Types</div>
                </div>
              </LazySection>
              <LazySection animation="fade-in" delay={500}>
                <div>
                  <div className="text-4xl font-bold mb-2">4</div>
                  <div className="text-gray-300">Specialized Portals</div>
                </div>
              </LazySection>
              <LazySection animation="fade-in" delay={600}>
                <div>
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <div className="text-gray-300">Modules & Features</div>
                </div>
              </LazySection>
              <LazySection animation="fade-in" delay={700}>
                <div>
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-gray-300">System Availability</div>
                </div>
              </LazySection>
            </div>
          </div>
        </section>
      </LazySection>

      {/* Media Showcase */}
      <LazySection animation="fade-up" delay={300}>
        <section className="section-padding bg-primary-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-sans text-gray-100 mb-4">Farm Media Showcase</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-serif">
                Explore real farming activities across our value chains through images and videos
              </p>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                'https://imgs.search.brave.com/Cb2JjQopir9XwHO5mvQeQYJFimhbiRXVMBx4he6wZLY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjI4/MzQ1MDEyL3Bob3Rv/L3RlYS1mYXJtZXJz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1GT1dpcG5YdS14/VUZpMWxUWDF5UDEy/bjA3UnhJLTZfeDly/MGFDVWhId21rPQ',
                'https://media.istockphoto.com/id/543185364/photo/young-african-male-and-adult-african-woman-working-in-garden.jpg?s=612x612&w=0&k=20&c=guwG7IudOUwIDYypM3-ivbcg8jfGVHwhNQByhA22raY=',
                'https://media.istockphoto.com/id/1210772424/photo/count-your-wealth-by-the-richnesses-of-your-soil.jpg?s=612x612&w=0&k=20&c=qjR4z9qMIUyXGhnZ6EV5RFLJ4vuSgic3hYBesTTBUUA=',
                'https://media.istockphoto.com/id/140398173/photo/hands-holding-seeds-2.jpg?s=612x612&w=0&k=20&c=Lh48kEptvqoAvnOiEtmkibhdXR6OODzMqy-GIzNwgVs='
              ].map((src, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-primary-700 bg-primary-800">
                  <img src={src} alt="Farm activity" className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>

            {/* Video Section */}
            <div className="card">
              <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Featured Field Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-96 rounded-lg"
                  src="https://www.youtube.com/embed/Twggtl-DLvA?rel=0"
                  title="Farming Showcase"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </LazySection>

      {/* CTA Section */}
      <LazySection animation="fade-up" delay={400}>
        <section className="section-padding bg-primary-900">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-sans text-gray-100 mb-4">
                Ready to Transform Agricultural Financing?
              </h2>
              <p className="text-xl text-gray-300 mb-8 font-serif">
                Join thousands of stakeholders already using the AFCF platform to streamline agricultural finance coordination
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LazySection animation="slide-left" delay={500}>
                  <Link to="/contact" className="btn-primary">
                    Get Started
                  </Link>
                </LazySection>
                <LazySection animation="slide-right" delay={600}>
                  <Link to="/elearning" className="btn-secondary">
                    Learn More
                  </Link>
                </LazySection>
              </div>
            </div>
          </div>
        </section>
      </LazySection>
    </div>
  );
};

export default Home;
