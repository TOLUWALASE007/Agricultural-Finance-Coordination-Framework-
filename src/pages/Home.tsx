import React from 'react';
import { Link } from 'react-router-dom';
import LazySection from '../components/LazySection';

const Home: React.FC = () => {
  const stakeholders = [
    {
      title: 'Fund Providers',
      description: 'CBN, Ministry of Agriculture, Ministry of Finance, and Donor funds',
      icon: '💰'
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
      title: 'Project Management Team',
      description: 'State-level monitoring and supervision teams',
      icon: '👥'
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
      description: 'Integrated insurance and de-risking mechanisms',
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
