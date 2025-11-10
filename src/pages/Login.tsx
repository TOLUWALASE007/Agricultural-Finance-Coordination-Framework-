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
    'Anchor',
    'Lead Firm',
    'Producer/Farmer',
    'Cooperative Group',
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
    
    try {
      // Call the backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate to role-specific portal
        const roleMap: { [key: string]: string } = {
          'Fund Provider': '/portal/fund-provider',
          'Coordinating Agency': '/portal/coordinating-agency',
          'Participating Bank (PFI)': '/portal/pfi',
          'Insurance Company': '/portal/insurance',
          'Anchor': '/portal/anchor',
          'Lead Firm': '/portal/lead-firm',
          'Producer/Farmer': '/portal/producer',
          'Cooperative Group': '/portal/cooperative',
          'Extension Organization': '/portal/extension',
          'Researcher/Student': '/portal/researcher'
        };
        
        const portalPath = roleMap[formData.role] || '/portal/fund-provider';
        navigate(portalPath);
      } else {
        // Auto-register if user doesn't exist for specific roles
        if (data.error?.includes('Invalid credentials')) {
          let shouldAutoRegister = false;
          let registerData: any = null;

          // Coordinating Agency auto-register
          if (formData.email === 'ca@email.com' && 
              formData.password === '123456' &&
              formData.role === 'Coordinating Agency') {
            shouldAutoRegister = true;
            registerData = {
              email: 'ca@email.com',
              password: '123456',
              firstName: 'Coordinating',
              lastName: 'Agency',
              userType: 'coordinating_agency',
              organizationName: 'AFCF Coordinating Agency'
            };
          }
          // Fund Provider auto-register
          else if (formData.email === 'fp@email.com' && 
                   formData.password === '123456' &&
                   formData.role === 'Fund Provider') {
            shouldAutoRegister = true;
            registerData = {
              email: 'fp@email.com',
              password: '123456',
              firstName: 'Fund',
              lastName: 'Provider',
              userType: 'fund_provider',
              organizationName: 'AFCF Fund Provider'
            };
          }
          // PFI auto-register
          else if (formData.email === 'pfi@email.com' && 
                   formData.password === '123456' &&
                   formData.role === 'Participating Bank (PFI)') {
            shouldAutoRegister = true;
            registerData = {
              email: 'pfi@email.com',
              password: '123456',
              firstName: 'PFI',
              lastName: 'Bank',
              userType: 'pfi',
              organizationName: 'AFCF Participating Bank'
            };
          }
          // Anchor auto-register
          else if (formData.email === 'anchor@email.com' && 
                   formData.password === '123456' &&
                   formData.role === 'Anchor') {
            shouldAutoRegister = true;
            registerData = {
              email: 'anchor@email.com',
              password: '123456',
              firstName: 'Anchor',
              lastName: 'Company',
              userType: 'anchor',
              organizationName: 'AFCF Anchor Company'
            };
          }
          // Lead Firm auto-register
          else if (formData.email === 'leadfirm@email.com' && 
                   formData.password === '123456' &&
                   formData.role === 'Lead Firm') {
            shouldAutoRegister = true;
            registerData = {
              email: 'leadfirm@email.com',
              password: '123456',
              firstName: 'Lead',
              lastName: 'Firm',
              userType: 'lead_firm',
              organizationName: 'AFCF Lead Firm'
            };
          }
          // Producer/Farmer auto-register
          else if (formData.email === 'farmer@email.com' && 
                   formData.password === '123456' &&
                   formData.role === 'Producer/Farmer') {
            shouldAutoRegister = true;
            registerData = {
              email: 'farmer@email.com',
              password: '123456',
              firstName: 'Producer',
              lastName: 'Farmer',
              userType: 'farmer',
              organizationName: undefined
            };
          }
          // Insurance Company auto-register
          else if (formData.email === 'insurance@email.com' &&
                   formData.password === '123456' &&
                   formData.role === 'Insurance Company') {
            shouldAutoRegister = true;
            registerData = {
              email: 'insurance@email.com',
              password: '123456',
              firstName: 'Insurance',
              lastName: 'Company',
              userType: 'insurance',
              organizationName: 'AFCF Insurance Company'
            };
          }
          // Cooperative Group auto-register
          else if (formData.email === 'cooperative@email.com' &&
                   formData.password === '123456' &&
                   formData.role === 'Cooperative Group') {
            shouldAutoRegister = true;
            registerData = {
              email: 'cooperative@email.com',
              password: '123456',
              firstName: 'Cooperative',
              lastName: 'Group',
              userType: 'cooperative_group',
              organizationName: 'AFCF Cooperative Group'
            };
          }
          // Extension Organization auto-register
          else if (formData.email === 'extension@email.com' &&
                   formData.password === '123456' &&
                   formData.role === 'Extension Organization') {
            shouldAutoRegister = true;
            registerData = {
              email: 'extension@email.com',
              password: '123456',
              firstName: 'Extension',
              lastName: 'Org',
              userType: 'extension_organization',
              organizationName: 'AFCF Extension Organization'
            };
          }
          // Researcher/Student auto-register
          else if (formData.email === 'researcher@email.com' &&
                   formData.password === '123456' &&
                   formData.role === 'Researcher/Student') {
            shouldAutoRegister = true;
            registerData = {
              email: 'researcher@email.com',
              password: '123456',
              firstName: 'Researcher',
              lastName: 'Student',
              userType: 'researcher_student',
              organizationName: undefined
            };
          }

          if (shouldAutoRegister && registerData) {
            try {
              const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
              });

              const registerResult = await registerResponse.json();
              
              if (registerResponse.ok && registerResult.success && registerResult.token) {
                localStorage.setItem('authToken', registerResult.token);
                localStorage.setItem('user', JSON.stringify(registerResult.user));
                alert('User created successfully! Logging in...');
                
                const roleMap: { [key: string]: string } = {
                  'Fund Provider': '/portal/fund-provider',
                  'Coordinating Agency': '/portal/coordinating-agency',
                  'Participating Bank (PFI)': '/portal/pfi',
                  'Insurance Company': '/portal/insurance',
                  'Anchor': '/portal/anchor',
                  'Lead Firm': '/portal/lead-firm',
                  'Producer/Farmer': '/portal/producer',
                  'Cooperative Group': '/portal/cooperative',
                  'Extension Organization': '/portal/extension',
                  'Researcher/Student': '/portal/researcher'
                };
                
                const portalPath = roleMap[formData.role] || '/portal/fund-provider';
                navigate(portalPath);
                return;
              }
            } catch (regError) {
              console.error('Auto-register failed:', regError);
            }
          }
        }
        
        // Show error message
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and ensure the backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
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
