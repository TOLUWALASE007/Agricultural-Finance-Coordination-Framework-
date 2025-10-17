import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    stakeholderType: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I register for the AFCF platform?",
      answer: "Registration varies by stakeholder type. Visit our portal access page or contact us for specific registration instructions."
    },
    {
      question: "What documents are required for loan applications?",
      answer: "Required documents depend on your stakeholder type. Farmers typically need identification, farm registration, and anchor agreements."
    },
    {
      question: "How long does loan approval take?",
      answer: "Standard loan approvals are processed within 5-7 business days after all required documentation is submitted and verified."
    },
    {
      question: "Is technical support available?",
      answer: "Yes, we provide 24/7 technical support for critical issues and business hours support for general inquiries."
    }
  ];

  const stakeholderTypes = [
    'Fund Provider',
    'Coordinating Agency',
    'Participating Bank (PFI)',
    'Insurance Company',
    'Project Management Team (PMT)',
    'Anchor',
    'Lead Firm',
    'Producer/Farmer',
    'Cooperative Group',
    'De-risking Institution',
    'Extension Organization',
    'Researcher/Student',
    'General Inquiry'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        organization: '',
        stakeholderType: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      title: 'Main Office',
      details: [
        'Agricultural and Rural Management Training Institute',
        'Ilorin, Kwara State, Nigeria',
        'PMB 2243, Ilorin'
      ],
      icon: '🏢'
    },
    {
      title: 'Contact Information',
      details: [
        'Email: info@afcf.gov.ng',
        'Phone: +234 XXX XXX XXXX',
        'Fax: +234 XXX XXX XXXX'
      ],
      icon: '📞'
    },
    {
      title: 'Business Hours',
      details: [
        'Monday - Friday: 8:00 AM - 5:00 PM',
        'Saturday: 9:00 AM - 2:00 PM',
        'Sunday: Closed'
      ],
      icon: '🕒'
    },
    {
      title: 'Technical Support',
      details: [
        'Email: support@afcf.gov.ng',
        'Phone: +234 XXX XXX XXXX',
        'Available 24/7 for critical issues'
      ],
      icon: '🛠️'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-200 font-serif">
              Get in touch with the AFCF team for support, inquiries, or feedback
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold font-sans text-gray-100 mb-6">
                Send us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="card bg-green-50 border-green-200">
                  <div className="flex items-center">
                    <div className="text-green-500 text-2xl mr-3">✓</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-green-600">
                        Thank you for contacting us. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your organization"
                      />
                    </div>
                    <div>
                      <label htmlFor="stakeholderType" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                        Stakeholder Type
                      </label>
                      <select
                        id="stakeholderType"
                        name="stakeholderType"
                        value={formData.stakeholderType}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select stakeholder type</option>
                        {stakeholderTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold font-sans text-gray-100 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="card">
                    <div className="flex items-start">
                      <div className="text-2xl mr-4">{info.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300 text-sm mb-1 font-serif">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="card mt-6">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <a href="#" className="block text-accent-400 hover:text-accent-300 transition-colors duration-200">
                    → Portal Access
                  </a>
                  <a href="#" className="block text-accent-400 hover:text-accent-300 transition-colors duration-200">
                    → User Documentation
                  </a>
                  <a href="#" className="block text-accent-400 hover:text-accent-300 transition-colors duration-200">
                    → FAQ
                  </a>
                  <a href="#" className="block text-accent-400 hover:text-accent-300 transition-colors duration-200">
                    → System Status
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <h2 className="text-2xl font-bold font-sans text-gray-100 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="card">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
                >
                  <h3 className="text-lg font-semibold font-sans text-gray-100 pr-4">
                    {faq.question}
                  </h3>
                  <div className={`transform transition-transform duration-200 flex-shrink-0 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}>
                    <svg 
                      className="w-5 h-5 text-accent-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}>
                  <p className="text-gray-300 font-serif">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
