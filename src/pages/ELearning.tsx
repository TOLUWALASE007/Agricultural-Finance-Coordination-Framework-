import React, { useState } from 'react';

const ELearning: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'fund-providers', name: 'Fund Providers', icon: '💰' },
    { id: 'pfis', name: 'PFIs', icon: '🏦' },
    { id: 'anchors', name: 'Anchors', icon: '⚓' },
    { id: 'farmers', name: 'Farmers', icon: '🌾' },
    { id: 'pmt', name: 'PMT', icon: '👥' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️' }
  ];

  const courses = [
    {
      id: 1,
      title: 'AFCF Platform Overview',
      description: 'Comprehensive introduction to the AFCF system and its capabilities',
      duration: '2 hours',
      level: 'Beginner',
      category: 'all',
      thumbnail: '📖',
      modules: 5
    },
    {
      id: 2,
      title: 'Fund Provider Dashboard',
      description: 'Learn how to navigate and utilize the fund provider portal effectively',
      duration: '1.5 hours',
      level: 'Intermediate',
      category: 'fund-providers',
      thumbnail: '💰',
      modules: 3
    },
    {
      id: 3,
      title: 'PFI Loan Management',
      description: 'Complete guide to managing agricultural loans through the PFI portal',
      duration: '3 hours',
      level: 'Advanced',
      category: 'pfis',
      thumbnail: '🏦',
      modules: 7
    },
    {
      id: 4,
      title: 'Anchor-Farmer Coordination',
      description: 'Best practices for coordinating with farmers and managing produce',
      duration: '2.5 hours',
      level: 'Intermediate',
      category: 'anchors',
      thumbnail: '⚓',
      modules: 4
    },
    {
      id: 5,
      title: 'Agricultural Finance for Farmers',
      description: 'Understanding loan processes, requirements, and best practices',
      duration: '2 hours',
      level: 'Beginner',
      category: 'farmers',
      thumbnail: '🌾',
      modules: 6
    },
    {
      id: 6,
      title: 'PMT Monitoring & Evaluation',
      description: 'Tools and techniques for effective project monitoring and evaluation',
      duration: '2.5 hours',
      level: 'Advanced',
      category: 'pmt',
      thumbnail: '👥',
      modules: 5
    },
    {
      id: 7,
      title: 'Agricultural Insurance Basics',
      description: 'Understanding insurance products and claims processing',
      duration: '1.5 hours',
      level: 'Beginner',
      category: 'insurance',
      thumbnail: '🛡️',
      modules: 4
    },
    {
      id: 8,
      title: 'Risk Management Strategies',
      description: 'Advanced risk assessment and mitigation strategies',
      duration: '3 hours',
      level: 'Advanced',
      category: 'insurance',
      thumbnail: '🎯',
      modules: 8
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-sans mb-6">
              E-Learning Portal
            </h1>
            <p className="text-xl text-gray-200 font-serif">
              Comprehensive training resources for all AFCF stakeholders
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-sans text-gray-100 mb-8 text-center">
            Course Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium font-sans transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-800 text-gray-300 hover:bg-primary-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4 text-center">{course.thumbnail}</div>
                <h3 className="text-xl font-semibold font-sans text-gray-100 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm font-serif">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <span className="text-sm text-gray-400">
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{course.modules} modules</span>
                </div>
                <button className="btn-primary w-full">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="section-padding bg-primary-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-sans text-gray-100 mb-12 text-center">
            Recommended Learning Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-4">
                🚀 Getting Started Path
              </h3>
              <p className="text-gray-300 mb-4 font-serif">
                Perfect for new users who want to understand the basics of AFCF
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">1.</span>
                  AFCF Platform Overview
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">2.</span>
                  Agricultural Finance Basics
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">3.</span>
                  Portal Navigation
                </li>
              </ul>
              <button className="btn-primary mt-4 w-full">
                Start Learning Path
              </button>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold font-sans text-gray-100 mb-4">
                🎯 Advanced User Path
              </h3>
              <p className="text-gray-300 mb-4 font-serif">
                For experienced users looking to master advanced features
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">1.</span>
                  Advanced Risk Management
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">2.</span>
                  Complex Loan Structures
                </li>
                <li className="flex items-center">
                  <span className="text-primary-500 mr-2">3.</span>
                  Performance Analytics
                </li>
              </ul>
              <button className="btn-primary mt-4 w-full">
                Start Learning Path
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="section-padding bg-primary-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-sans text-gray-100 mb-6">
            Get Certified
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-serif">
            Complete our courses and earn industry-recognized certifications
          </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="text-4xl mb-4">🥉</div>
                <h3 className="text-lg font-semibold font-sans mb-2">Basic Certification</h3>
                <p className="text-gray-300 text-sm font-serif">Complete 3 beginner courses</p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">🥈</div>
                <h3 className="text-lg font-semibold font-sans mb-2">Intermediate Certification</h3>
                <p className="text-gray-300 text-sm font-serif">Complete 5 intermediate courses</p>
              </div>
              <div className="card">
                <div className="text-4xl mb-4">🥇</div>
                <h3 className="text-lg font-semibold font-sans mb-2">Advanced Certification</h3>
                <p className="text-gray-300 text-sm font-serif">Complete all advanced courses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-800 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-sans mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-gray-200 mb-8 font-serif">
              Join thousands of stakeholders already advancing their skills through our e-learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Browse All Courses
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                View Progress
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ELearning;
