import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticateFundProvider, buildFundProviderSession, authenticateInsuranceCompany, buildInsuranceCompanySession, authenticateCooperativeGroup, buildCooperativeGroupSession, authenticateExtensionOrganization, buildExtensionOrganizationSession, authenticatePFI, buildPFISession, authenticateAnchor, buildAnchorSession, authenticateLeadFirm, buildLeadFirmSession, authenticateProducer, buildProducerSession, authenticateResearcher, buildResearcherSession } from '../utils/localDatabase';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isStaticHosted = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname !== 'localhost' && hostname !== '127.0.0.1';
  }, []);

  const demoUsers = useMemo(() => ([
    {
      email: 'ca@email.com',
      password: '123456',
      role: 'Coordinating Agency',
      portal: '/portal/coordinating-agency',
      user: {
        id: 'demo-ca',
        firstName: 'Coordinating',
        lastName: 'Agency',
        userType: 'coordinating_agency',
        organizationName: 'AFCF Coordinating Agency'
      }
    },
    {
      email: 'fp@email.com',
      password: '123456',
      role: 'Fund Provider',
      portal: '/portal/fund-provider',
      user: {
        id: 'demo-fp',
        firstName: 'Fund',
        lastName: 'Provider',
        userType: 'fund_provider',
        organizationName: 'AFCF Fund Provider'
      }
    },
    {
      email: 'pfi@email.com',
      password: '123456',
      role: 'Participating Bank (PFI)',
      portal: '/portal/pfi',
      user: {
        id: 'demo-pfi',
        firstName: 'PFI',
        lastName: 'Bank',
        userType: 'pfi',
        organizationName: 'AFCF Participating Bank'
      }
    },
    {
      email: 'anchor@email.com',
      password: '123456',
      role: 'Anchor',
      portal: '/portal/anchor',
      user: {
        id: 'demo-anchor',
        firstName: 'Anchor',
        lastName: 'Company',
        userType: 'anchor',
        organizationName: 'AFCF Anchor Company'
      }
    },
    {
      email: 'leadfirm@email.com',
      password: '123456',
      role: 'Lead Firm',
      portal: '/portal/lead-firm',
      user: {
        id: 'demo-leadfirm',
        firstName: 'Lead',
        lastName: 'Firm',
        userType: 'lead_firm',
        organizationName: 'AFCF Lead Firm'
      }
    },
    {
      email: 'farmer@email.com',
      password: '123456',
      role: 'Producer/Farmer',
      portal: '/portal/producer',
      user: {
        id: 'demo-farmer',
        firstName: 'Producer',
        lastName: 'Farmer',
        userType: 'farmer',
        organizationName: 'AFCF Producer Network'
      }
    },
    {
      email: 'insurance@email.com',
      password: '123456',
      role: 'Insurance Company',
      portal: '/portal/insurance',
      user: {
        id: 'demo-insurance',
        firstName: 'Insurance',
        lastName: 'Company',
        userType: 'insurance',
        organizationName: 'AFCF Insurance Company'
      }
    },
    {
      email: 'cooperative@email.com',
      password: '123456',
      role: 'Cooperative Group',
      portal: '/portal/cooperative',
      user: {
        id: 'demo-cooperative',
        firstName: 'Cooperative',
        lastName: 'Group',
        userType: 'cooperative_group',
        organizationName: 'AFCF Cooperative Group'
      }
    },
    {
      email: 'extension@email.com',
      password: '123456',
      role: 'Extension Organization',
      portal: '/portal/extension',
      user: {
        id: 'demo-extension',
        firstName: 'Extension',
        lastName: 'Organization',
        userType: 'extension_organization',
        organizationName: 'AFCF Extension Organization'
      }
    },
    {
      email: 'researcher@email.com',
      password: '123456',
      role: 'Researcher/Student',
      portal: '/portal/researcher',
      user: {
        id: 'demo-researcher',
        firstName: 'Researcher',
        lastName: 'Student',
        userType: 'researcher_student',
        organizationName: 'AFCF Research Network'
      }
    }
  ]), []);

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

  const handleSuccessfulLogin = (user: any, role: string, token?: string) => {
    const portalPath = roleMap[role] || '/portal/fund-provider';
    localStorage.setItem('authToken', token || `demo-token-${Date.now()}`);
    localStorage.setItem('user', JSON.stringify(user));
    navigate(portalPath);
  };

  const tryDemoLogin = () => {
    const matched = demoUsers.find(
      (demo) =>
        demo.email.toLowerCase() === formData.email.toLowerCase() &&
        demo.password === formData.password &&
        demo.role === formData.role
    );

    if (matched) {
      handleSuccessfulLogin(
        {
          ...matched.user,
          email: matched.email,
          role: matched.role,
          lastLogin: new Date().toISOString(),
        },
        matched.role,
        'demo-token'
      );
      return true;
    }

    return false;
  };

  const attemptFundProviderLocalLogin = (): boolean => {
    if (formData.role !== 'Fund Provider') return false;
    const email = formData.email.trim();
    const record = authenticateFundProvider(email, formData.password);
    if (!record) return false;
    const session = buildFundProviderSession(record);
    handleSuccessfulLogin(session, 'Fund Provider', `fp-token-${Date.now()}`);
    return true;
  };

  const attemptInsuranceCompanyLocalLogin = (): boolean => {
    if (formData.role !== 'Insurance Company') return false;
    const email = formData.email.trim();
    const record = authenticateInsuranceCompany(email, formData.password);
    if (!record) return false;
    const session = buildInsuranceCompanySession(record);
    handleSuccessfulLogin(session, 'Insurance Company', `ic-token-${Date.now()}`);
    return true;
  };

  const attemptCooperativeGroupLocalLogin = (): boolean => {
    if (formData.role !== 'Cooperative Group') return false;
    const email = formData.email.trim();
    const record = authenticateCooperativeGroup(email, formData.password);
    if (!record) return false;
    const session = buildCooperativeGroupSession(record);
    handleSuccessfulLogin(session, 'Cooperative Group', `cg-token-${Date.now()}`);
    return true;
  };

  const attemptExtensionOrganizationLocalLogin = (): boolean => {
    if (formData.role !== 'Extension Organization') return false;
    const email = formData.email.trim();
    const record = authenticateExtensionOrganization(email, formData.password);
    if (!record) return false;
    const session = buildExtensionOrganizationSession(record);
    handleSuccessfulLogin(session, 'Extension Organization', `eo-token-${Date.now()}`);
    return true;
  };

  const attemptPFILocalLogin = (): boolean => {
    if (formData.role !== 'Participating Bank (PFI)') return false;
    const email = formData.email.trim();
    const record = authenticatePFI(email, formData.password);
    if (!record) return false;
    const session = buildPFISession(record);
    handleSuccessfulLogin(session, 'Participating Bank (PFI)', `pfi-token-${Date.now()}`);
    return true;
  };

  const attemptAnchorLocalLogin = (): boolean => {
    if (formData.role !== 'Anchor') return false;
    const email = formData.email.trim();
    const record = authenticateAnchor(email, formData.password);
    if (!record) return false;
    const session = buildAnchorSession(record);
    handleSuccessfulLogin(session, 'Anchor', `anchor-token-${Date.now()}`);
    return true;
  };

  const attemptLeadFirmLocalLogin = (): boolean => {
    if (formData.role !== 'Lead Firm') return false;
    const email = formData.email.trim();
    const record = authenticateLeadFirm(email, formData.password);
    if (!record) return false;
    const session = buildLeadFirmSession(record);
    handleSuccessfulLogin(session, 'Lead Firm', `lf-token-${Date.now()}`);
    return true;
  };

  const attemptProducerLocalLogin = (): boolean => {
    // Producer/Farmer uses individual email or phone (since email is optional) + password
    // This is separate from organizational login mechanisms used by other roles
    if (formData.role !== 'Producer/Farmer') return false;
    const emailOrPhone = formData.email.trim();
    if (!emailOrPhone) return false;
    const record = authenticateProducer(emailOrPhone, formData.password);
    if (!record) return false;
    const session = buildProducerSession(record);
    handleSuccessfulLogin(session, 'Producer/Farmer', `producer-token-${Date.now()}`);
    return true;
  };

  const attemptResearcherLocalLogin = (): boolean => {
    // Researcher/Student uses individual email (required) + password
    // This is separate from organizational login mechanisms used by other roles
    if (formData.role !== 'Researcher/Student') return false;
    const email = formData.email.trim();
    if (!email) return false;
    const record = authenticateResearcher(email, formData.password);
    if (!record) return false;
    const session = buildResearcherSession(record);
    handleSuccessfulLogin(session, 'Researcher/Student', `researcher-token-${Date.now()}`);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const localLoginHandled = attemptFundProviderLocalLogin() || attemptInsuranceCompanyLocalLogin() || attemptCooperativeGroupLocalLogin() || attemptExtensionOrganizationLocalLogin() || attemptPFILocalLogin() || attemptAnchorLocalLogin() || attemptLeadFirmLocalLogin() || attemptProducerLocalLogin() || attemptResearcherLocalLogin();
    if (localLoginHandled) {
      setIsSubmitting(false);
      return;
    }
    
    const shouldUseDemo = isStaticHosted && (!process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL.includes('localhost'));

    if (shouldUseDemo) {
      const loggedIn = tryDemoLogin();
      if (!loggedIn) {
        alert('Login failed. Please verify your email, password, and selected role.');
      }
      setIsSubmitting(false);
      return;
    }

    // On localhost, skip backend login attempt to avoid ERR_CONNECTION_REFUSED errors
    // Local and demo login should handle authentication when backend is not running
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocalhost) {
      // On localhost, only use local/demo login to avoid connection errors
      // Try demo login as final fallback
      const loggedIn = tryDemoLogin();
      if (!loggedIn) {
        alert('Login failed. Please verify your email, password, and selected role. If you just registered, your account may need to be verified.');
      }
      setIsSubmitting(false);
      return;
    }

    // Attempt backend login with proper error handling (only for non-localhost environments)
    let backendLoginSuccess = false;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 2000); // 2 second timeout
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        signal: abortController.signal
      });

      clearTimeout(timeoutId);

      // Check for network/connection errors in response
      if (response.status === 0 || response.type === 'error') {
        // Network error - backend not running, try local login
        const localLoginHandled = attemptFundProviderLocalLogin() || attemptInsuranceCompanyLocalLogin() || attemptCooperativeGroupLocalLogin() || attemptExtensionOrganizationLocalLogin() || attemptPFILocalLogin() || attemptAnchorLocalLogin() || attemptLeadFirmLocalLogin() || attemptProducerLocalLogin() || attemptResearcherLocalLogin();
        if (localLoginHandled) {
          setIsSubmitting(false);
          return;
        }
        throw new Error('Backend server is not running');
      }

      const data = await response.json();
      
      if (response.ok && data.success && data.token) {
        // Backend login successful
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        const portalPath = roleMap[formData.role] || '/portal/fund-provider';
        navigate(portalPath);
        setIsSubmitting(false);
        backendLoginSuccess = true;
        return;
      } else {
        // Backend returned error - will fall through to local login attempt
        throw new Error(data.error || 'Invalid credentials');
      }
    } catch (backendError: any) {
      clearTimeout(timeoutId);
      
      // Check if this is an abort (timeout) or connection error
      const isAborted = backendError?.name === 'AbortError';
      const errorMessage = backendError?.message || String(backendError) || '';
      const isConnectionError = 
        isAborted ||
        errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('ERR_CONNECTION_REFUSED') ||
        errorMessage.includes('NetworkError') ||
        backendError?.name === 'TypeError' ||
        backendError?.name === 'NetworkError' ||
        !backendError?.message; // If no message, likely connection error
      
      if (isConnectionError) {
        // Connection error - try local login silently (don't log to console)
        const localLoginHandled = attemptFundProviderLocalLogin() || attemptInsuranceCompanyLocalLogin() || attemptCooperativeGroupLocalLogin() || attemptExtensionOrganizationLocalLogin() || attemptPFILocalLogin() || attemptAnchorLocalLogin() || attemptLeadFirmLocalLogin() || attemptProducerLocalLogin() || attemptResearcherLocalLogin();
        if (localLoginHandled) {
          setIsSubmitting(false);
          return;
        }
        // If local login also fails, continue to demo login fallback
      }
      
      // If backend login failed for other reasons, continue to local/demo login
      // Don't throw here - let the flow continue to try local and demo login
    }

    // If we reach here, backend login failed and we need to try local/demo login
    // This code should not execute if backend login succeeded or local login succeeded above
    if (!backendLoginSuccess) {
      // Try local login one more time (in case it wasn't tried above)
      const localLoginHandled = attemptFundProviderLocalLogin() || attemptInsuranceCompanyLocalLogin() || attemptCooperativeGroupLocalLogin() || attemptExtensionOrganizationLocalLogin() || attemptPFILocalLogin() || attemptAnchorLocalLogin() || attemptLeadFirmLocalLogin() || attemptProducerLocalLogin() || attemptResearcherLocalLogin();
      if (localLoginHandled) {
        setIsSubmitting(false);
        return;
      }
      
      // Try demo login
      const demoHandled = tryDemoLogin();
      if (!demoHandled) {
        alert('Login failed. Please verify your credentials. If the backend server is not running, ensure you have registered locally or use demo accounts.');
      }
      setIsSubmitting(false);
      return;
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
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-300 font-serif">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-accent-400 hover:text-accent-300 transition-colors duration-200">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;