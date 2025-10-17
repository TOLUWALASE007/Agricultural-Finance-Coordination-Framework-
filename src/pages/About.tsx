import React from 'react';
import LazySection from '../components/LazySection';

const About: React.FC = () => {
  const portalDetails = [
    {
      name: 'Portal A - Board Portal',
      description: 'Access for Fund Providers, Coordinating Agency, Participating Banks, and supporting financial actors',
      features: ['Fund remittance and confirmations', 'Reports and feedback', 'Loan performance tracking', 'Document exchange'],
      stakeholders: ['Fund Providers', 'Coordinating Agency', 'PFIs', 'Insurance Companies']
    },
    {
      name: 'Portal B - Development Portal',
      description: 'Closed forum for project reports and reviews without external stakeholder influence',
      features: ['Project performance reviews', 'Document uploads', 'Internal reporting', 'Strategic planning'],
      stakeholders: ['PMT', 'Coordinating Agency', 'Fund Providers']
    },
    {
      name: 'Portal C - Band Portal',
      description: 'Comprehensive platform for lead firms, anchors, and financial actors',
      features: ['Loan applications', 'Fund disbursement', 'Registration systems', 'Financial statements'],
      stakeholders: ['Lead Firms', 'Anchors', 'PFIs', 'Coordinating Agency', 'PMT']
    },
    {
      name: 'Portal D - Index Portal',
      description: 'Public-facing portal for farmers and general public access',
      features: ['Farmer registration', 'Anchor matching', 'Loan applications', 'Information access'],
      stakeholders: ['Farmers/Producers', 'General Public', 'Anchors']
    }
  ];

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

      {/* System Architecture */}
      <LazySection animation="fade-up" delay={200}>
        <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-sans text-gray-100 mb-12 text-center">
            System Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {systemArchitecture.map((layer, index) => (
              <LazySection key={index} animation="slide-left" delay={index * 150 + 300}>
                <div className="card text-center">
                  <h3 className="text-xl font-semibold font-sans text-gray-100 mb-4">
                    {layer.tier}
                  </h3>
                  <p className="text-gray-300 mb-4 font-serif">
                    {layer.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {layer.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium font-sans"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </LazySection>
            ))}
          </div>
        </div>
        </section>
      </LazySection>

      {/* Portal Details */}
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-sans text-gray-100 mb-12 text-center">
            Four-Portal System
          </h2>
          <div className="space-y-8">
            {portalDetails.map((portal, index) => (
              <div key={index} className="card">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-semibold font-sans text-gray-100 mb-4">
                      {portal.name}
                    </h3>
                    <p className="text-gray-300 mb-6 font-serif">
                      {portal.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="text-lg font-medium font-sans text-gray-100 mb-3">
                        Key Features:
                      </h4>
                      <ul className="space-y-2">
                        {portal.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300 font-serif">
                            <span className="text-accent-400 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium font-sans text-gray-100 mb-3">
                      Target Stakeholders:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {portal.stakeholders.map((stakeholder, stakeholderIndex) => (
                        <span 
                          key={stakeholderIndex}
                          className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium font-sans"
                        >
                          {stakeholder}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                Integrated insurance and de-risking mechanisms protect all stakeholders
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
              <div className="text-4xl mb-4">💰</div>
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
