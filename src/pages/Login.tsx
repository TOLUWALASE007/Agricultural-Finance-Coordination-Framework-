import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const roles = [
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
    'Researcher/Student'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    // Navigate to role-specific portal
    const roleMap: { [key: string]: string } = {
      'Fund Provider': '/portal/fund-provider',
      'Coordinating Agency': '/portal/coordinating-agency',
      'Participating Bank (PFI)': '/portal/pfi',
      'Insurance Company': '/portal/insurance',
      'Project Management Team (PMT)': '/portal/pmt',
      'Anchor': '/portal/anchor',
      'Lead Firm': '/portal/lead-firm',
      'Producer/Farmer': '/portal/producer',
      'Cooperative Group': '/portal/cooperative',
      'De-risking Institution': '/portal/de-risking',
      'Extension Organization': '/portal/extension',
      'Researcher/Student': '/portal/researcher'
    };
    
    const portalPath = roleMap[formData.role] || '/portal/fund-provider';
    navigate(portalPath);
  };

  return (
    <div className="min-h-screen bg-primary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Login Card */}
        <div className="card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={`${process.env.PUBLIC_URL}/images/logo/LOGO.svg`} 
                alt="AFCF Logo" 
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold font-sans text-gray-100 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300 font-serif">
              Sign in to your AFCF account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                Email Address
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium font-sans text-gray-300 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select your role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-600 bg-primary-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300 font-serif">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-accent-400 hover:text-accent-300 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 font-serif">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-accent-400 hover:text-accent-300 transition-colors duration-200"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
