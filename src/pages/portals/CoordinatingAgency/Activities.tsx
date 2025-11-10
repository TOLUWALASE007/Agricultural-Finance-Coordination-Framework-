import React, { useEffect, useMemo, useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord } from '../../../utils/quickActions';

const Activities: React.FC = () => {
  const sidebarItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '🏠', 
      href: '/portal/coordinating-agency',
      hasDropdown: true,
      dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
        { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
      ]
    },
    { 
      id: 'state-monitoring', 
      name: 'State Monitoring Team', 
      icon: '🗺️', 
      href: '/portal/coordinating-agency/monitoring/state'
    },
    { 
      id: 'representative-body', 
      name: 'Representative Body', 
      icon: '🏛️', 
      href: '/portal/coordinating-agency/representative',
      hasDropdown: true,
      dropdownItems: [
        { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
        { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
        { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
      ]
    },
    { 
      id: 'applicants', 
      name: 'Applicants', 
      icon: '📝', 
      href: '/portal/coordinating-agency/applicants',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
        { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
        { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
        { 
          id: 'fund-beneficiaries', 
          name: 'Fund Beneficiaries', 
          icon: '👥', 
          href: '/portal/coordinating-agency/fund-beneficiaries',
          hasDropdown: true,
          dropdownItems: [
            { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
            { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
            { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
            { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
          ]
        }
      ]
    },
    { 
      id: 'stakeholders', 
      name: 'Department', 
      icon: '🤝', 
      href: '/portal/coordinating-agency/stakeholders',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
        { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
        { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
        { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
        { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
        { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
        { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
      ]
    },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/coordinating-agency/publications' },
    { id: 'blog', name: 'Blog', icon: '📰', href: '/portal/coordinating-agency/blog' },
    { id: 'faqs', name: 'FAQs', icon: '❓', href: '/portal/coordinating-agency/faqs' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const stats = [
    { title: 'Active Programs', value: '12', change: '+2', icon: '🏛️' },
    { title: 'Stakeholders', value: '2,847', change: '+45', icon: '🤝' },
    { title: 'Funds Managed', value: '₦15.2B', change: '+₦2.1B', icon: '💼' },
    { title: 'Compliance Rate', value: '94.5%', change: '+2.1%', icon: '✅' }
  ];

  // Nigerian states
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
    "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
  ];

  // Super Admin: Rotating Notifications (demo JSON)
  type NotificationItem = {
    id: string;
    message: string;
    role: string;
    status: 'pending' | 'ignored' | 'approved';
    receivedAt: string;
    applicantName: string;
    applicantType: 'Individual' | 'Company';
    companyName?: string;
    accountProfile: string;
    workAddress: string;
    documentUrl?: string;
  };

  const initialNotifications: NotificationItem[] = useMemo(() => ([
    {
      id: 'n1',
      role: '👨‍🌾 Producer/Farmer',
      message: 'Adeola applied for a ₦500,000 loan to purchase improved cassava seedlings and fertilizers for her 2-hectare farm in Ogun State.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Adeola Adebayo',
      applicantType: 'Individual',
      accountProfile: 'Smallholder Farmer • 2 hectares • Cassava Production',
      workAddress: 'Plot 45, Abeokuta Road, Ogun State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n2',
      role: '🏦 Fund Provider',
      message: 'Mr. Okonkwo deployed ₦2.5 billion to the rice value chain scheme across 6 northern states through 12 participating banks.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Mr. Chukwudi Okonkwo',
      applicantType: 'Company',
      companyName: 'Okonkwo Agricultural Finance Limited',
      accountProfile: 'Fund Provider • ₦5.2B Assets Under Management • 12 Active Schemes',
      workAddress: '24 Marina Road, Lagos Island, Lagos State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n3',
      role: '🏛️ PFI (Bank)',
      message: 'Chioma processed and approved 47 loan applications worth ₦23.5 million for smallholder maize farmers in Kaduna.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Chioma Okeke',
      applicantType: 'Company',
      companyName: 'Access Bank PLC',
      accountProfile: 'Participating Financial Institution • 2,450 Active Loans • 89% Recovery Rate',
      workAddress: 'Access Tower, 999A Danmole Street, Victoria Island, Lagos, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n4',
      role: '🏢 Anchor Company',
      message: 'Dangote Rice created a supply contract with 500 farmers to purchase 10,000 tons of paddy rice at ₦180 per kg.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Dangote Rice Operations Team',
      applicantType: 'Company',
      companyName: 'Dangote Rice Limited',
      accountProfile: 'Anchor Company • 500 Contracted Farmers • 10,000 tons/year Capacity',
      workAddress: 'Dangote Industries Complex, Obajana, Kogi State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n5',
      role: '🛡️ Insurance Company',
      message: 'Fatima Insurance issued crop insurance policies covering 2,000 hectares of maize farms against drought and flood risks.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Fatima Musa',
      applicantType: 'Company',
      companyName: 'Fatima Insurance Company Limited',
      accountProfile: 'Agricultural Insurance Provider • 2,000 hectares Coverage • 95% Claim Settlement',
      workAddress: '12 Ahmadu Bello Way, Kano, Kano State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n6',
      role: '🏭 Lead Firm',
      message: 'Notore Fertilizer delivered ₦15 million worth of NPK fertilizer on credit to 200 farmers with payment due after harvest.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Notore Fertilizer Sales Team',
      applicantType: 'Company',
      companyName: 'Notore Fertilizer Limited',
      accountProfile: 'Lead Firm • ₦15M Credit Extended • 200 Farmers Served',
      workAddress: 'Onne Port, Rivers State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n7',
      role: '👥 Cooperative',
      message: 'Ibadan Cassava Growers Cooperative secured a ₦50 million group loan for 300 members to expand their farms.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Ibadan Cassava Growers Cooperative',
      applicantType: 'Company',
      companyName: 'Ibadan Cassava Growers Cooperative Society',
      accountProfile: 'Cooperative • 300 Members • Cassava Value Chain',
      workAddress: 'Cooperative House, Bodija, Ibadan, Oyo State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n8',
      role: '🎓 Extension Officer',
      message: 'Amina conducted a 3-day training on climate-smart agriculture for 150 farmers in Kano State.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Amina Yusuf',
      applicantType: 'Individual',
      accountProfile: 'Extension Officer • 150 Farmers Trained • Climate-Smart Agriculture Specialist',
      workAddress: 'Kano State Agricultural Development Project, Kano, Kano State, Nigeria',
      documentUrl: '#',
    },
    {
      id: 'n9',
      role: '🔬 Researcher',
      message: 'Dr. Bello published findings on a new drought-resistant sorghum variety that increases yield by 40%.',
      status: 'pending',
      receivedAt: new Date().toISOString(),
      applicantName: 'Dr. Ibrahim Bello',
      applicantType: 'Individual',
      accountProfile: 'Agricultural Researcher • PhD Agronomy • 40% Yield Improvement',
      workAddress: 'Institute for Agricultural Research, Ahmadu Bello University, Zaria, Kaduna State, Nigeria',
      documentUrl: '#',
    },
    
  ]), []);


  // Demo access data - Enhanced with more details
  type User = { 
    id: string; 
    name: string; 
    email: string; 
    roleRequested: string; 
    state: string; 
    created?: boolean;
    phone: string;
    organization: string;
    organizationProfile: string;
    organizationType: 'Individual' | 'Company';
    fullAddress: string;
    companyRegNumber?: string;
    contactPerson?: {
      name: string;
      title: string;
      email: string;
      phone: string;
    };
    registrationDate: string;
    documents: string[];
  };
  
  type AccessUser = { 
    id: string; 
    name: string; 
    email: string;
    role: string; 
    state: string;
    organization: string;
    accessScope: 'Basic' | 'Standard' | 'Full'; 
    restricted: boolean; 
    canApprove: boolean;
    phone: string;
    registrationDate: string;
    contactPersonName: string;
    contactPersonEmail: string;
    companyEmail: string;
    companyId: string;
    fullAddress: string;
    organizationProfile: string;
  };

  type ApprovalLog = {
    id: string;
    userId: string;
    userName: string;
    action: 'approved' | 'rejected';
    approvedBy: string;
    date: string;
    remarks: string;
  };

  const [newRegistrations, setNewRegistrations] = useState<User[]>([
    { 
      id: 'u1', 
      name: 'Adeola Adebayo', 
      email: 'adeola@example.com', 
      roleRequested: 'Producer', 
      state: 'Ogun', 
      phone: '+234 802 345 6789', 
      organization: 'Adebayo Farms Ltd', 
      organizationProfile: 'Smallholder farm specializing in cassava production with 2 hectares of cultivated land',
      organizationType: 'Individual',
      fullAddress: 'Plot 45, Abeokuta Road, Odeda, Ogun State, Nigeria',
      registrationDate: '2024-10-20', 
      documents: ['CAC Document', 'Tax ID', 'Bank Statement'] 
    },
    { 
      id: 'u2', 
      name: 'Chioma Okeke', 
      email: 'chioma@accessbank.com', 
      roleRequested: 'PFI', 
      state: 'Lagos', 
      phone: '+234 803 456 7890', 
      organization: 'Access Bank PLC', 
      organizationProfile: 'Leading commercial bank providing agricultural finance with over 2,450 active loans',
      organizationType: 'Company',
      fullAddress: 'Access Tower, 999A Danmole Street, Victoria Island, Lagos State, Nigeria',
      companyRegNumber: 'RC 123456',
      contactPerson: {
        name: 'Chioma Okeke',
        title: 'Head of Agricultural Finance',
        email: 'chioma.okeke@accessbank.com',
        phone: '+234 803 456 7890'
      },
      registrationDate: '2024-10-19', 
      documents: ['Banking License', 'CBN Approval', 'Compliance Certificate'] 
    },
    { 
      id: 'u3', 
      name: 'Fatima Musa', 
      email: 'fatima@insureco.ng', 
      roleRequested: 'Insurance', 
      state: 'Kano', 
      phone: '+234 804 567 8901', 
      organization: 'Fatima Insurance Ltd', 
      organizationProfile: 'Agricultural insurance provider covering 2,000 hectares with 95% claim settlement rate',
      organizationType: 'Company',
      fullAddress: '12 Ahmadu Bello Way, Fagge, Kano, Kano State, Nigeria',
      companyRegNumber: 'RC 234567',
      contactPerson: {
        name: 'Fatima Musa',
        title: 'Managing Director',
        email: 'fatima.musa@insureco.ng',
        phone: '+234 804 567 8901'
      },
      registrationDate: '2024-10-18', 
      documents: ['NAICOM License', 'Tax Clearance', 'Financial Statement'] 
    },
    { 
      id: 'u4', 
      name: 'Dangote Rice Ops', 
      email: 'ops@dangoterice.com', 
      roleRequested: 'Anchor', 
      state: 'Kano', 
      phone: '+234 805 678 9012', 
      organization: 'Dangote Rice Limited', 
      organizationProfile: 'Major rice processing company with 10,000 tons/year capacity and 500 contracted farmers',
      organizationType: 'Company',
      fullAddress: 'Dangote Industries Complex, Obajana, Kogi State, Nigeria',
      companyRegNumber: 'RC 345678',
      contactPerson: {
        name: 'Ibrahim Suleiman',
        title: 'Operations Manager',
        email: 'ibrahim.s@dangoterice.com',
        phone: '+234 805 678 9012'
      },
      registrationDate: '2024-10-17', 
      documents: ['CAC Document', 'NAFDAC Approval', 'Quality Certificate'] 
    },
    { 
      id: 'u5', 
      name: 'Notore Fertilizer Ltd', 
      email: 'sales@notore.com', 
      roleRequested: 'Lead Firm', 
      state: 'Rivers', 
      phone: '+234 806 789 0123', 
      organization: 'Notore Fertilizer Limited', 
      organizationProfile: 'Leading fertilizer supplier providing NPK and urea with credit facilities to 200+ farmers',
      organizationType: 'Company',
      fullAddress: 'Onne Port Industrial Complex, Onne, Rivers State, Nigeria',
      companyRegNumber: 'RC 456789',
      contactPerson: {
        name: 'Adewale Johnson',
        title: 'Sales Director',
        email: 'adewale.j@notore.com',
        phone: '+234 806 789 0123'
      },
      registrationDate: '2024-10-16', 
      documents: ['Operating License', 'Environmental Clearance', 'Tax ID'] 
    },
    { 
      id: 'u6', 
      name: 'IITA Research Team', 
      email: 'research@iita.org', 
      roleRequested: 'Researcher', 
      state: 'Oyo', 
      phone: '+234 807 890 1234', 
      organization: 'International Institute of Tropical Agriculture', 
      organizationProfile: 'International research organization focused on tropical agriculture and food security',
      organizationType: 'Company',
      fullAddress: 'PMB 5320, Oyo Road, Ibadan, Oyo State, Nigeria',
      companyRegNumber: 'RC 567890',
      contactPerson: {
        name: 'Dr. Yemi Akinlade',
        title: 'Lead Researcher',
        email: 'y.akinlade@iita.org',
        phone: '+234 807 890 1234'
      },
      registrationDate: '2024-10-15', 
      documents: ['Research License', 'MOU with FMARD', 'Project Proposal'] 
    },
    { 
      id: 'u7', 
      name: 'Oyo ADP Extension', 
      email: 'extension@oyoadp.ng', 
      roleRequested: 'Extension', 
      state: 'Oyo', 
      phone: '+234 808 901 2345', 
      organization: 'Oyo State ADP', 
      organizationProfile: 'State agricultural development program providing extension services to farmers',
      organizationType: 'Company',
      fullAddress: 'Secretariat Road, Agodi GRA, Ibadan, Oyo State, Nigeria',
      companyRegNumber: 'RC 678901',
      contactPerson: {
        name: 'Amina Bello',
        title: 'Extension Coordinator',
        email: 'amina.b@oyoadp.ng',
        phone: '+234 808 901 2345'
      },
      registrationDate: '2024-10-14', 
      documents: ['Government ID', 'Posting Letter', 'Professional License'] 
    },
    { 
      id: 'u8', 
      name: 'NIRSAL Risk Manager', 
      email: 'risk@nirsal.com', 
      roleRequested: 'PFI', 
      state: 'FCT', 
      phone: '+234 809 012 3456', 
      organization: 'NIRSAL Plc', 
      organizationProfile: 'Commercial bank risk unit supporting agricultural guarantees',
      organizationType: 'Company',
      fullAddress: 'NIRSAL House, Plot 1347, Cadastral Zone B06, Central Business District, Abuja, FCT, Nigeria',
      companyRegNumber: 'RC 789012',
      contactPerson: {
        name: 'Mohammed Abbas',
        title: 'Risk Manager',
        email: 'mohammed.a@nirsal.com',
        phone: '+234 809 012 3456'
      },
      registrationDate: '2024-10-13', 
      documents: ['Corporate License', 'CBN Approval', 'Risk Management Framework'] 
    },
    { 
      id: 'u9', 
      name: 'Ibadan Cooperative', 
      email: 'info@ibadancoop.ng', 
      roleRequested: 'Cooperative', 
      state: 'Oyo', 
      phone: '+234 810 123 4567', 
      organization: 'Ibadan Cassava Growers Cooperative', 
      organizationProfile: 'Farmers cooperative with 300 members focused on cassava value chain development',
      organizationType: 'Company',
      fullAddress: 'Cooperative House, Ring Road, Bodija, Ibadan, Oyo State, Nigeria',
      companyRegNumber: 'RC 890123',
      contactPerson: {
        name: 'Samuel Ogunleye',
        title: 'Cooperative Secretary',
        email: 'samuel.o@ibadancoop.ng',
        phone: '+234 810 123 4567'
      },
      registrationDate: '2024-10-12', 
      documents: ['Cooperative Registration', 'Member List', 'Financial Records'] 
    },
    { 
      id: 'u10', 
      name: 'Kwara Farmers Union', 
      email: 'union@kwara.ng', 
      roleRequested: 'Producer', 
      state: 'Kwara', 
      phone: '+234 811 234 5678', 
      organization: 'Kwara Farmers Union', 
      organizationProfile: 'Farmers union representing smallholder farmers in Kwara State across multiple crops',
      organizationType: 'Company',
      fullAddress: 'KM 18, Ilorin-Ajase-Ipo Road, Ilorin, Kwara State, Nigeria',
      companyRegNumber: 'RC 901234',
      contactPerson: {
        name: 'Abubakar Musa',
        title: 'Union Chairman',
        email: 'abubakar.m@kwara.ng',
        phone: '+234 811 234 5678'
      },
      registrationDate: '2024-10-11', 
      documents: ['Union Registration', 'Land Documentation', 'Farm Records'] 
    },
  ]);

  const [approvalLogs, setApprovalLogs] = useState<ApprovalLog[]>([
    { id: 'log1', userId: 'u100', userName: 'John Farmer', action: 'approved', approvedBy: 'Admin User', date: '2024-10-10', remarks: 'All documents verified' },
    { id: 'log2', userId: 'u101', userName: 'Mary Agric Ltd', action: 'approved', approvedBy: 'Admin User', date: '2024-10-09', remarks: 'Complete application' },
    { id: 'log3', userId: 'u102', userName: 'Peter Insurance', action: 'rejected', approvedBy: 'Admin User', date: '2024-10-08', remarks: 'Incomplete documentation' },
  ]);

  // Edit Access Logs
  const [editLogs, setEditLogs] = useState<ApprovalLog[]>([
    { id: 'edit1', userId: 'a1', userName: 'Dangote Rice Operations', action: 'approved', approvedBy: 'Admin User', date: '2024-10-09', remarks: 'Access scope updated to Standard' },
    { id: 'edit2', userId: 'a2', userName: 'Access Bank Agricultural Finance', action: 'approved', approvedBy: 'Admin User', date: '2024-10-08', remarks: 'Role changed to PFI Manager' },
  ]);

  // Restrict Access Logs
  const [restrictLogs, setRestrictLogs] = useState<ApprovalLog[]>([
    { id: 'restrict1', userId: 'a4', userName: 'Notore Fertilizer Ltd', action: 'approved', approvedBy: 'Admin User', date: '2024-10-07', remarks: 'Access restricted due to compliance issues' },
    { id: 'restrict2', userId: 'a3', userName: 'NIRSAL Risk Management', action: 'approved', approvedBy: 'Admin User', date: '2024-10-06', remarks: 'Temporary restriction lifted' },
  ]);

  // Approval Rights Logs
  const [approvalRightsLogs, setApprovalRightsLogs] = useState<ApprovalLog[]>([
    { id: 'approval1', userId: 'a2', userName: 'Access Bank Agricultural Finance', action: 'approved', approvedBy: 'Admin User', date: '2024-10-05', remarks: 'Approval rights granted' },
    { id: 'approval2', userId: 'a8', userName: 'FMARD Coordinating Unit', action: 'approved', approvedBy: 'Admin User', date: '2024-10-04', remarks: 'Approval rights updated' },
  ]);

  // Recent Activities data
  const recentActivities = [
    { type: 'Program Launch', description: 'New agricultural finance program launched', time: '2 hours ago', status: 'completed' },
    { type: 'Stakeholder Meeting', description: 'Quarterly coordination meeting with PFIs', time: '1 day ago', status: 'completed' },
    { type: 'Compliance Review', description: 'Monthly compliance review completed', time: '2 days ago', status: 'completed' },
    { type: 'Policy Update', description: 'Agricultural finance policy updated', time: '3 days ago', status: 'pending' },
    { type: 'Training Session', description: 'Staff training on new policies', time: '4 days ago', status: 'completed' },
    { type: 'Budget Review', description: 'Q1 budget allocation review', time: '5 days ago', status: 'in-progress' }
  ];

  // Organizations data
  const stakeholderData = [
    { type: 'Fund Providers', count: '15', status: 'Active', color: 'bg-green-500' },
    { type: 'PFI Banks', count: '24', status: 'Active', color: 'bg-blue-500' },
    { type: 'Insurance Companies', count: '8', status: 'Active', color: 'bg-purple-500' },
    { type: 'Anchor Companies', count: '156', status: 'Active', color: 'bg-yellow-500' },
    { type: 'Producers', count: '2,647', status: 'Active', color: 'bg-orange-500' },
    { type: 'Cooperatives', count: '45', status: 'Active', color: 'bg-indigo-500' },
    { type: 'Lead Firms', count: '12', status: 'Active', color: 'bg-pink-500' }
  ];

  // State for Recent Activities pagination and search
  const [activitySearch, setActivitySearch] = useState('');
  const [activityPage, setActivityPage] = useState(1);

  // State for Organizations pagination and search
  const [stakeholderSearch, setStakeholderSearch] = useState('');
  const [stakeholderPage, setStakeholderPage] = useState(1);

  // Filtered and paginated Recent Activities
  const filteredActivities = useMemo(() => {
    return recentActivities.filter(activity =>
      activity.type.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.description.toLowerCase().includes(activitySearch.toLowerCase())
    );
  }, [activitySearch]);

  const paginatedActivities = useMemo(() => {
    const start = (activityPage - 1) * 3;
    return filteredActivities.slice(start, start + 3);
  }, [filteredActivities, activityPage]);

  // Filtered and paginated Organizations
  const filteredStakeholders = useMemo(() => {
    return stakeholderData.filter(stakeholder =>
      stakeholder.type.toLowerCase().includes(stakeholderSearch.toLowerCase())
    );
  }, [stakeholderSearch]);

  const paginatedStakeholders = useMemo(() => {
    const start = (stakeholderPage - 1) * 4;
    return filteredStakeholders.slice(start, start + 4);
  }, [filteredStakeholders, stakeholderPage]);

  // Demo data for access management
  const [accessUsers, setAccessUsers] = useState<AccessUser[]>([
    { id: 'a1', name: 'Dangote Rice Operations', email: 'ops@dangoterice.com', role: 'Anchor', state: 'Kano', organization: 'Dangote Rice Limited', accessScope: 'Standard', restricted: false, canApprove: true, phone: '+234 805 678 9012', registrationDate: '2024-09-15', contactPersonName: 'Alhaji Musa Ibrahim', contactPersonEmail: 'musa.ibrahim@dangoterice.com', companyEmail: 'info@dangoterice.com', companyId: 'DRL-2024-001', fullAddress: 'Plot 45, Industrial Layout, Kano-Zaria Road, Kano State, Nigeria', organizationProfile: 'Leading rice producer and processor in Northern Nigeria with over 10,000 hectares under cultivation' },
    { id: 'a2', name: 'Access Bank Agricultural Finance', email: 'agric@accessbank.com', role: 'PFI', state: 'Lagos', organization: 'Access Bank PLC', accessScope: 'Full', restricted: false, canApprove: true, phone: '+234 803 456 7890', registrationDate: '2024-09-10', contactPersonName: 'Mrs. Chioma Nwosu', contactPersonEmail: 'chioma.nwosu@accessbankplc.com', companyEmail: 'info@accessbankplc.com', companyId: 'AB-PFI-2024-002', fullAddress: '999C Danmole Street, Victoria Island, Lagos State, Nigeria', organizationProfile: 'Tier-1 commercial bank providing agricultural financing solutions across Nigeria' },
    
    { id: 'a4', name: 'Notore Fertilizer Ltd', email: 'sales@notore.com', role: 'Lead Firm', state: 'Rivers', organization: 'Notore Fertilizer Limited', accessScope: 'Basic', restricted: true, canApprove: false, phone: '+234 806 789 0123', registrationDate: '2024-09-05', contactPersonName: 'Engr. Tunde Akinola', contactPersonEmail: 'tunde.akinola@notore.com', companyEmail: 'info@notore.com', companyId: 'NFL-2024-004', fullAddress: 'Onne Industrial Park, Port Harcourt, Rivers State, Nigeria', organizationProfile: 'Major fertilizer manufacturer and distributor supporting Nigerian agriculture' },
    { id: 'a5', name: 'AIICO Insurance', email: 'agric@aiico.com', role: 'Insurance', state: 'Lagos', organization: 'AIICO Insurance PLC', accessScope: 'Full', restricted: false, canApprove: true, phone: '+234 801 234 5678', registrationDate: '2024-09-01', contactPersonName: 'Mr. Emeka Okafor', contactPersonEmail: 'emeka.okafor@aiico.com', companyEmail: 'info@aiico.com', companyId: 'AIICO-2024-005', fullAddress: 'AIICO Plaza, Plot 479A, Constitution Avenue, Central Business District, Abuja, FCT, Nigeria', organizationProfile: 'Leading insurance company providing agricultural and crop insurance solutions' },
    { id: 'a6', name: 'IITA Research Institute', email: 'research@iita.org', role: 'Researcher', state: 'Oyo', organization: 'International Institute of Tropical Agriculture', accessScope: 'Standard', restricted: false, canApprove: false, phone: '+234 807 890 1234', registrationDate: '2024-08-28', contactPersonName: 'Prof. Ngozi Okonjo', contactPersonEmail: 'n.okonjo@iita.org', companyEmail: 'iita@cgiar.org', companyId: 'IITA-2024-006', fullAddress: 'PMB 5320, Oyo Road, Ibadan, Oyo State, Nigeria', organizationProfile: 'International agricultural research institute focused on tropical agriculture and food security' },
    { id: 'a7', name: 'Oyo State ADP Extension', email: 'extension@oyoadp.ng', role: 'Extension', state: 'Oyo', organization: 'Oyo State ADP', accessScope: 'Basic', restricted: false, canApprove: false, phone: '+234 808 901 2345', registrationDate: '2024-08-25', contactPersonName: 'Mr. Biodun Adeyemi', contactPersonEmail: 'biodun.adeyemi@oyoadp.ng', companyEmail: 'info@oyoadp.ng', companyId: 'OYADP-2024-007', fullAddress: 'Secretariat Road, Agodi GRA, Ibadan, Oyo State, Nigeria', organizationProfile: 'State agricultural development program providing extension services to farmers' },
    { id: 'a8', name: 'FMARD Coordinating Unit', email: 'coord@fmard.gov.ng', role: 'Coordinating', state: 'FCT Abuja', organization: 'Federal Ministry of Agriculture', accessScope: 'Full', restricted: false, canApprove: true, phone: '+234 809 876 5432', registrationDate: '2024-08-20', contactPersonName: 'Dr. Fatima Bello', contactPersonEmail: 'fatima.bello@fmard.gov.ng', companyEmail: 'info@fmard.gov.ng', companyId: 'FMARD-2024-008', fullAddress: 'Area 11, Garki, Abuja, FCT, Nigeria', organizationProfile: 'Federal coordinating agency for agricultural policies and programs in Nigeria' },
  ]);

  // States for pagination and search - Enhanced for Approve Access
  const [createSearch, setCreateSearch] = useState('');
  const [createStateFilter, setCreateStateFilter] = useState('All');
  const [createPage, setCreatePage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showMoreInfo, setShowMoreInfo] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<User | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{user: User, action: 'approve' | 'reject'} | null>(null);
  const [approvalConfirm, setApprovalConfirm] = useState<string | null>(null);

  const [editSearch, setEditSearch] = useState('');
  const [editPage, setEditPage] = useState(1);
  const [editStateFilter, setEditStateFilter] = useState('All');
  const [selectedEditUsers, setSelectedEditUsers] = useState<string[]>([]);
  const [showEditMoreInfo, setShowEditMoreInfo] = useState<string | null>(null);
  const [showEditLogsModal, setShowEditLogsModal] = useState(false);
  
  const [restrictSearch, setRestrictSearch] = useState('');
  const [restrictPage, setRestrictPage] = useState(1);
  const [restrictStateFilter, setRestrictStateFilter] = useState('All');
  const [selectedRestrictUsers, setSelectedRestrictUsers] = useState<string[]>([]);
  const [showRestrictMoreInfo, setShowRestrictMoreInfo] = useState<string | null>(null);
  const [showRestrictLogsModal, setShowRestrictLogsModal] = useState(false);
  
  const [approvalSearch, setApprovalSearch] = useState('');
  const [approvalPage, setApprovalPage] = useState(1);
  const [approvalStateFilter, setApprovalStateFilter] = useState('All');
  const [selectedApprovalUsers, setSelectedApprovalUsers] = useState<string[]>([]);
  const [showApprovalMoreInfo, setShowApprovalMoreInfo] = useState<string | null>(null);
  const [showApprovalLogsModal, setShowApprovalLogsModal] = useState(false);

  // Filtered and paginated for Approve Access
  const filteredCreateUsers = useMemo(() => {
    return newRegistrations.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(createSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(createSearch.toLowerCase()) ||
        user.roleRequested.toLowerCase().includes(createSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(createSearch.toLowerCase());
      const matchesState = createStateFilter === 'All' || user.state === createStateFilter;
      return matchesSearch && matchesState && !user.created;
    });
  }, [newRegistrations, createSearch, createStateFilter]);

  const paginatedCreateUsers = useMemo(() => {
    const pageSize = 3;
    const start = (createPage - 1) * pageSize;
    return filteredCreateUsers.slice(start, start + pageSize);
  }, [filteredCreateUsers, createPage]);

  // Filtered and paginated for Edit Access (accessUsers)
  const filteredEditUsers = useMemo(() => {
    return accessUsers.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(editSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(editSearch.toLowerCase()) ||
        user.role.toLowerCase().includes(editSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(editSearch.toLowerCase());
      const matchesState = editStateFilter === 'All' || user.state === editStateFilter;
      return matchesSearch && matchesState;
    });
  }, [accessUsers, editSearch, editStateFilter]);

  const paginatedEditUsers = useMemo(() => {
    const start = (editPage - 1) * 2;
    return filteredEditUsers.slice(start, start + 2);
  }, [filteredEditUsers, editPage]);

  // Filtered and paginated for Restrict Access (accessUsers)
  const filteredRestrictUsers = useMemo(() => {
    return accessUsers.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(restrictSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(restrictSearch.toLowerCase()) ||
        user.role.toLowerCase().includes(restrictSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(restrictSearch.toLowerCase());
      const matchesState = restrictStateFilter === 'All' || user.state === restrictStateFilter;
      return matchesSearch && matchesState;
    });
  }, [accessUsers, restrictSearch, restrictStateFilter]);

  const paginatedRestrictUsers = useMemo(() => {
    const start = (restrictPage - 1) * 3;
    return filteredRestrictUsers.slice(start, start + 3);
  }, [filteredRestrictUsers, restrictPage]);

  // Filtered and paginated for Approval Rights (accessUsers)
  const filteredApprovalUsers = useMemo(() => {
    return accessUsers.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(approvalSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(approvalSearch.toLowerCase()) ||
        user.role.toLowerCase().includes(approvalSearch.toLowerCase()) ||
        user.organization.toLowerCase().includes(approvalSearch.toLowerCase());
      const matchesState = approvalStateFilter === 'All' || user.state === approvalStateFilter;
      return matchesSearch && matchesState;
    });
  }, [accessUsers, approvalSearch, approvalStateFilter]);

  const paginatedApprovalUsers = useMemo(() => {
    const start = (approvalPage - 1) * 3;
    return filteredApprovalUsers.slice(start, start + 3);
  }, [filteredApprovalUsers, approvalPage]);

  // Enhanced approval functions
  const handleApproveAccess = (user: User, remarks: string = '') => {
    setNewRegistrations(prev => prev.map(u => u.id === user.id ? { ...u, created: true } : u));
    const newLog: ApprovalLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: remarks || 'Approved successfully'
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    setShowConfirmDialog(null);
    setShowApprovalModal(null);
    setApprovalConfirm(`Access approved for ${user.name}`);
    setTimeout(() => setApprovalConfirm(null), 3000);
  };

  const handleRejectAccess = (user: User, remarks: string = '') => {
    setNewRegistrations(prev => prev.filter(u => u.id !== user.id));
    const newLog: ApprovalLog = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'rejected',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: remarks || 'Application rejected'
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    setShowConfirmDialog(null);
    setShowApprovalModal(null);
    setApprovalConfirm(`Access rejected for ${user.name}`);
    setTimeout(() => setApprovalConfirm(null), 3000);
  };

  const handleMassApproval = () => {
    if (selectedUsers.length === 0) return;
    selectedUsers.forEach(userId => {
      const user = newRegistrations.find(u => u.id === userId);
      if (user) {
        handleApproveAccess(user, 'Mass approval');
      }
    });
    setSelectedUsers([]);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedCreateUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedCreateUsers.map(u => u.id));
    }
  };

  // Update functions to remove source parameter
  const updateRole = (id: string, role: string) => {
    setAccessUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const updateScope = (id: string, scope: AccessUser['accessScope']) => {
    setAccessUsers(prev => prev.map(u => u.id === id ? { ...u, accessScope: scope } : u));
  };

  const toggleRestrict = (id: string) => {
    setAccessUsers(prev => prev.map(u => u.id === id ? { ...u, restricted: !u.restricted } : u));
  };

  const toggleApprovalRight = (id: string) => {
    setAccessUsers(prev => prev.map(u => u.id === id ? { ...u, canApprove: !u.canApprove } : u));
  };

  // Handler functions for Edit Access
  const handleEditCheckboxChange = (userId: string) => {
    setSelectedEditUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleMassEditApply = () => {
    if (selectedEditUsers.length === 0) return;
    
    const newLog: ApprovalLog = {
      id: `edit${Date.now()}`,
      userId: 'multiple',
      userName: `${selectedEditUsers.length} users`,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: 'Mass access update applied'
    };
    
    setEditLogs(prev => [newLog, ...prev]);
    setSelectedEditUsers([]);
    alert(`✅ Access updated for ${selectedEditUsers.length} user(s)!`);
  };

  const handleEditUserAction = (user: AccessUser) => {
    const newLog: ApprovalLog = {
      id: `edit${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: `Access scope: ${user.accessScope}, Role: ${user.role}`
    };
    
    setEditLogs(prev => [newLog, ...prev]);
    alert(`✅ Access updated for ${user.name}!`);
  };

  // Handler functions for Restrict Access
  const handleRestrictCheckboxChange = (userId: string) => {
    setSelectedRestrictUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleMassRestrict = () => {
    if (selectedRestrictUsers.length === 0) return;
    
    const newLog: ApprovalLog = {
      id: `restrict${Date.now()}`,
      userId: 'multiple',
      userName: `${selectedRestrictUsers.length} users`,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: 'Mass restriction status update applied'
    };
    
    setRestrictLogs(prev => [newLog, ...prev]);
    setSelectedRestrictUsers([]);
    alert(`✅ Restriction updated for ${selectedRestrictUsers.length} user(s)!`);
  };

  const handleRestrictUserAction = (user: AccessUser) => {
    const newLog: ApprovalLog = {
      id: `restrict${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: user.restricted ? 'Access restricted' : 'Access restored'
    };
    
    setRestrictLogs(prev => [newLog, ...prev]);
    alert(`✅ Restriction status updated for ${user.name}!`);
  };

  // Handler functions for Approval Rights
  const handleApprovalCheckboxChange = (userId: string) => {
    setSelectedApprovalUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleMassApprovalRights = () => {
    if (selectedApprovalUsers.length === 0) return;
    
    const newLog: ApprovalLog = {
      id: `approval${Date.now()}`,
      userId: 'multiple',
      userName: `${selectedApprovalUsers.length} users`,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: 'Mass approval rights update applied'
    };
    
    setApprovalRightsLogs(prev => [newLog, ...prev]);
    setSelectedApprovalUsers([]);
    alert(`✅ Approval rights updated for ${selectedApprovalUsers.length} user(s)!`);
  };

  const handleApprovalRightsAction = (user: AccessUser) => {
    const newLog: ApprovalLog = {
      id: `approval${Date.now()}`,
      userId: user.id,
      userName: user.name,
      action: 'approved',
      approvedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      remarks: user.canApprove ? 'Approval rights granted' : 'Approval rights revoked'
    };
    
    setApprovalRightsLogs(prev => [newLog, ...prev]);
    alert(`✅ Approval rights updated for ${user.name}!`);
  };

  return (
    <PortalLayout role="Coordinating Agency (Super Admin)" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* More Info Modal */}
        {showMoreInfo && (() => {
          const user = newRegistrations.find(u => u.id === showMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">Application Details</h3>
                    <button onClick={() => setShowMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">
                          {user.organizationType === 'Company' ? 'Contact Person Name' : 'Full Name'}
                        </p>
                        <p className="text-sm text-gray-100 font-sans">
                          {user.organizationType === 'Company' && user.contactPerson 
                            ? user.contactPerson.name 
                            : user.name}
                        </p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">
                          {user.organizationType === 'Company' ? 'Company Email' : 'Email Address'}
                        </p>
                        <p className="text-sm text-gray-100 font-sans">{user.email}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">
                          {user.organizationType === 'Company' ? 'Contact Person Phone' : 'Phone Number'}
                        </p>
                        <p className="text-sm text-gray-100 font-sans">
                          {user.organizationType === 'Company' && user.contactPerson 
                            ? user.contactPerson.phone 
                            : user.phone}
                        </p>
                      </div>
                      {user.organizationType === 'Company' && user.contactPerson && (
                        <div className="bg-primary-800 rounded-md p-3">
                          <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Email</p>
                          <p className="text-sm text-gray-100 font-sans">{user.contactPerson.email}</p>
                        </div>
                      )}
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Role Requested</p>
                        <p className="text-sm text-gray-100 font-sans">{user.roleRequested}</p>
                      </div>
                      {user.organizationType === 'Company' && user.companyRegNumber && (
                        <div className="bg-primary-800 rounded-md p-3">
                          <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                          <p className="text-sm text-gray-100 font-sans">{user.companyRegNumber}</p>
                        </div>
                      )}
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Registration Date</p>
                        <p className="text-sm text-gray-100 font-sans">{user.registrationDate}</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organization}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Full Address</p>
                      <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-2">Submitted Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {user.documents.map((doc, idx) => (
                          <a
                            key={idx}
                            href={`#download-${doc}`}
                            download={`${doc}-${user.name}.pdf`}
                            className="px-2 py-1 bg-primary-700 text-xs text-gray-300 hover:bg-accent-600 hover:text-white rounded cursor-pointer transition-colors"
                            title={`Download ${doc}`}
                          >
                            📄 {doc}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowMoreInfo(null)} className="btn-secondary">Close</button>
                    <button 
                      onClick={() => {
                        setShowMoreInfo(null);
                        setShowApprovalModal(user);
                      }}
                      className="btn-primary"
                    >
                      Proceed to Approval
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalModal(null)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-lg bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Final Approval</h3>
                  <button onClick={() => setShowApprovalModal(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>

                <div className="bg-primary-800 rounded-md p-4 mb-4">
                  <p className="text-sm text-gray-400 font-serif mb-2">Applicant</p>
                  <p className="text-lg font-semibold text-gray-100 font-sans mb-1">{showApprovalModal.name}</p>
                  <p className="text-sm text-gray-300 font-serif">{showApprovalModal.email}</p>
                  <p className="text-sm text-gray-300 font-serif">{showApprovalModal.roleRequested} • {showApprovalModal.state}</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const action = formData.get('action') as 'approve' | 'reject';
                    const remarks = formData.get('remarks') as string;
                    setShowConfirmDialog({ user: showApprovalModal, action });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-gray-300 font-serif mb-2">Decision</label>
                    <select name="action" className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500" required>
                      <option value="approve">Approve Access</option>
                      <option value="reject">Reject Application</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 font-serif mb-2">Remarks (Optional)</label>
                    <textarea 
                      name="remarks"
                      rows={3}
                      className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Add any remarks or notes..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowApprovalModal(null)} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary">Submit Decision</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[60] bg-black/70 p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-primary-900 rounded-lg border border-primary-700 p-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{showConfirmDialog.action === 'approve' ? '✅' : '❌'}</div>
                <h3 className="text-xl font-semibold font-sans text-gray-100 mb-2">
                  {showConfirmDialog.action === 'approve' ? 'Approve Access?' : 'Reject Application?'}
                </h3>
                <p className="text-sm text-gray-400 font-serif">
                  Are you sure you want to {showConfirmDialog.action} access for:
                </p>
                <p className="text-lg font-semibold text-gray-100 font-sans mt-2">{showConfirmDialog.user.name}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmDialog(null)}
                  className="flex-1 btn-secondary"
                >
                  No, Cancel
                </button>
                <button 
                  onClick={() => {
                    if (showConfirmDialog.action === 'approve') {
                      handleApproveAccess(showConfirmDialog.user, 'Approved by admin');
                    } else {
                      handleRejectAccess(showConfirmDialog.user, 'Rejected by admin');
                    }
                  }}
                  className={`flex-1 ${showConfirmDialog.action === 'approve' ? 'btn-primary' : 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'}`}
                >
                  Yes, {showConfirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Logs Modal */}
        {showLogsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowLogsModal(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-4xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Approval History</h3>
                  <button onClick={() => setShowLogsModal(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {approvalLogs.map(log => (
                    <div key={log.id} className="bg-primary-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-100 font-sans">{log.userName}</p>
                          <p className="text-xs text-gray-400 font-serif">ID: {log.userId}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.action === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {log.action === 'approved' ? '✅ Approved' : '❌ Rejected'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-serif">
                        <p>Approved By: <span className="text-gray-300">{log.approvedBy}</span></p>
                        <p>Date: <span className="text-gray-300">{log.date}</span></p>
                      </div>
                      {log.remarks && (
                        <p className="text-xs text-gray-300 font-serif mt-2 italic">"{log.remarks}"</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowLogsModal(false)} className="btn-secondary">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Activities Dashboard</h1>
          <p className="text-gray-200 font-serif">
            Monitor platform activities, manage user access, review notifications, and oversee stakeholder interactions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                  <p className="text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="card flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Recent Activities</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={activitySearch}
                  onChange={(e) => { setActivityPage(1); setActivitySearch(e.target.value); }}
                  placeholder="Search activities..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {paginatedActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-primary-700 rounded-lg">
                    <div className="w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium font-sans text-gray-100">{activity.type}</p>
                      <p className="text-sm text-gray-300 font-serif">{activity.description}</p>
                      <p className="text-xs text-gray-400 font-serif">{activity.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' ? 'bg-green-500 text-white' :
                      activity.status === 'pending' ? 'bg-yellow-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
              {recentActivities.length > 3 && (
                <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                  <button 
                    onClick={() => setActivityPage(Math.max(activityPage - 1, 1))} 
                    className="btn-secondary text-sm p-1"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-400">{activityPage} of {Math.ceil(filteredActivities.length / 3)}</span>
                  <button 
                    onClick={() => setActivityPage(Math.min(activityPage + 1, Math.ceil(filteredActivities.length / 3)))} 
                    className="btn-secondary text-sm p-1"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Organizations */}
          <div className="card flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Organizations</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={stakeholderSearch}
                  onChange={(e) => { setStakeholderPage(1); setStakeholderSearch(e.target.value); }}
                  placeholder="Search organizations..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {paginatedStakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${stakeholder.color}`}></div>
                      <div>
                        <p className="font-medium font-sans text-gray-100">{stakeholder.type}</p>
                        <p className="text-sm text-gray-300 font-serif">{stakeholder.count} registered</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                      {stakeholder.status}
                    </span>
                  </div>
                ))}
              </div>
              {stakeholderData.length > 4 && (
                <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                  <button 
                    onClick={() => setStakeholderPage(Math.max(stakeholderPage - 1, 1))} 
                    className="btn-secondary text-sm p-1"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-400">{stakeholderPage} of {Math.ceil(filteredStakeholders.length / 4)}</span>
                  <button 
                    onClick={() => setStakeholderPage(Math.min(stakeholderPage + 1, Math.ceil(filteredStakeholders.length / 4)))} 
                    className="btn-secondary text-sm p-1"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Program Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Program Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-2xl font-bold font-sans text-gray-100">87%</p>
              <p className="text-sm text-gray-400 font-serif">Target Achievement</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">+15%</p>
              <p className="text-sm text-gray-400 font-serif">Growth Rate</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-2xl font-bold font-sans text-gray-100">4.2/5</p>
              <p className="text-sm text-gray-400 font-serif">Satisfaction Score</p>
            </div>
          </div>
        </div>

        {/* Access Management (Super Admin) - Enhanced Approve Access Card */}
        {false && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Approve Access Card (Enhanced) */}
          <div className="card flex flex-col">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Approve Access</h3>
                  <span className="px-2 py-1 bg-accent-600 text-white text-xs rounded-full font-medium">
                    {filteredCreateUsers.length} Pending
                  </span>
                </div>
                <button 
                  onClick={() => setShowLogsModal(true)}
                  className="btn-secondary text-xs px-3 py-1"
                >
                  📜 View History
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    value={createSearch}
                    onChange={(e) => { setCreatePage(1); setCreateSearch(e.target.value); }}
                    placeholder="Search applications..."
                    className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                    🔍
                  </button>
                </div>
                <select
                  value={createStateFilter}
                  onChange={(e) => { setCreateStateFilter(e.target.value); setCreatePage(1); }}
                  className="px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <option value="All">All States</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-accent-600/20 border border-accent-600 rounded-md">
                  <span className="text-sm text-gray-200 font-sans">{selectedUsers.length} selected</span>
                  <button 
                    onClick={handleMassApproval}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    ✅ Approve All Selected
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {paginatedCreateUsers.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 p-2 bg-primary-700 rounded-md">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === paginatedCreateUsers.length && paginatedCreateUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-accent-500"
                      />
                      <span className="text-xs text-gray-400 font-sans">Select All</span>
                    </div>
                    {paginatedCreateUsers.map((user, index) => (
                      <div key={index} className="p-3 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="mt-1 w-4 h-4 accent-accent-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-100 font-sans">{user.name}</p>
                                <p className="text-xs text-gray-400 font-serif">{user.email}</p>
                              </div>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                Pending
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-2">
                              <span className="flex items-center gap-1">
                                <span>👤</span> {user.roleRequested}
                              </span>
                              <span className="flex items-center gap-1">
                                <span>📍</span> {user.state}
                              </span>
                              <span className="flex items-center gap-1">
                                <span>🏢</span> {user.organization}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button 
                                onClick={() => setShowMoreInfo(user.id)}
                                className="text-xs text-accent-400 hover:text-accent-300 font-medium"
                              >
                                📋 More Info
                              </button>
                              <button 
                                onClick={() => setShowApprovalModal(user)}
                                className="text-xs bg-accent-600 hover:bg-accent-700 text-white px-3 py-1 rounded transition-colors font-medium"
                              >
                                ✅ Review & Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-gray-400 font-sans">No pending applications</p>
                  </div>
                )}
              </div>
              {/* Pagination */}
              {filteredCreateUsers.length > 3 && (
                <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                  <button 
                    onClick={() => setCreatePage(Math.max(createPage - 1, 1))} 
                    className="btn-secondary text-sm p-1"
                  >
                    ←
                  </button>
                  <span className="text-xs text-gray-400">{createPage} of {Math.ceil(filteredCreateUsers.length / 3)}</span>
                  <button 
                    onClick={() => setCreatePage(Math.min(createPage + 1, Math.ceil(filteredCreateUsers.length / 3)))} 
                    className="btn-secondary text-sm p-1"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit Access Card - FULLY ENHANCED VERSION */}
          <div className="card flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold font-sans text-gray-100">Edit Access</h3>
              <button 
                onClick={() => setShowEditLogsModal(true)}
                className="text-xs text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1"
              >
                📜 View History
              </button>
            </div>
            
            {/* Filters and Mass Action */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  value={editSearch}
                  onChange={(e) => { setEditPage(1); setEditSearch(e.target.value); }}
                  placeholder="Search users..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
              <select
                value={editStateFilter}
                onChange={(e) => { setEditStateFilter(e.target.value); setEditPage(1); }}
                className="input-field w-full sm:w-auto"
              >
                <option value="All">Filter by State</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <button 
                onClick={() => {
                  if (selectedEditUsers.length === paginatedEditUsers.length) {
                    setSelectedEditUsers([]);
                  } else {
                    setSelectedEditUsers(paginatedEditUsers.map(u => u.id));
                  }
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                {selectedEditUsers.length === paginatedEditUsers.length ? '☐ Deselect All' : '☑ Select All'}
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {paginatedEditUsers.length > 0 ? (
                <div className="space-y-4">
                  {paginatedEditUsers.map((user) => (
                    <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                      <input
                        type="checkbox"
                        checked={selectedEditUsers.includes(user.id)}
                        onChange={() => handleEditCheckboxChange(user.id)}
                        className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                      />
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                            <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                          <span className="flex items-center gap-1">
                            <span>👤</span> {user.role}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📍</span> {user.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🏢</span> {user.organization}
                          </span>
                        </div>
                        
                        {/* Edit Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <select 
                            value={user.role} 
                            onChange={(e) => updateRole(user.id, e.target.value)} 
                            className="input-field text-sm"
                          >
                            <option value="Producer">Producer</option>
                            <option value="PFI">PFI</option>
                            <option value="Anchor">Anchor</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Lead Firm">Lead Firm</option>
                            <option value="Cooperative">Cooperative</option>
                            
                            <option value="Extension">Extension</option>
                            <option value="Researcher">Researcher</option>
                            <option value="Coordinating">Coordinating</option>
                          </select>
                          <select 
                            value={user.accessScope} 
                            onChange={(e) => updateScope(user.id, e.target.value as any)} 
                            className="input-field text-sm"
                          >
                            <option value="Basic">Basic Access</option>
                            <option value="Standard">Standard Access</option>
                            <option value="Full">Full Access</option>
                          </select>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => setShowEditMoreInfo(user.id)} 
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            📋 More Info
                          </button>
                          <button 
                            onClick={() => handleEditUserAction(user)} 
                            className="btn-primary text-sm px-3 py-1"
                          >
                            ✅ Apply Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-400 font-sans">No users found</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredEditUsers.length > 2 && (
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                <button 
                  onClick={() => setEditPage(Math.max(editPage - 1, 1))} 
                  className="btn-secondary text-sm p-1"
                >
                  ←
                </button>
                <span className="text-xs text-gray-400">{editPage} of {Math.ceil(filteredEditUsers.length / 2)}</span>
                <button 
                  onClick={() => setEditPage(Math.min(editPage + 1, Math.ceil(filteredEditUsers.length / 2)))} 
                  className="btn-secondary text-sm p-1"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Restrict Access Card - FULLY ENHANCED VERSION */}
          <div className="card flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold font-sans text-gray-100">Restrict Access</h3>
              <button 
                onClick={() => setShowRestrictLogsModal(true)}
                className="text-xs text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1"
              >
                📜 View History
              </button>
            </div>
            
            {/* Filters and Mass Action */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  value={restrictSearch}
                  onChange={(e) => { setRestrictPage(1); setRestrictSearch(e.target.value); }}
                  placeholder="Search users..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
              <select
                value={restrictStateFilter}
                onChange={(e) => { setRestrictStateFilter(e.target.value); setRestrictPage(1); }}
                className="input-field w-full sm:w-auto"
              >
                <option value="All">Filter by State</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <button 
                onClick={() => {
                  if (selectedRestrictUsers.length === paginatedRestrictUsers.length) {
                    setSelectedRestrictUsers([]);
                  } else {
                    setSelectedRestrictUsers(paginatedRestrictUsers.map(u => u.id));
                  }
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                {selectedRestrictUsers.length === paginatedRestrictUsers.length ? '☐ Deselect All' : '☑ Select All'}
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {paginatedRestrictUsers.length > 0 ? (
                <div className="space-y-4">
                  {paginatedRestrictUsers.map((user) => (
                    <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                      <input
                        type="checkbox"
                        checked={selectedRestrictUsers.includes(user.id)}
                        onChange={() => handleRestrictCheckboxChange(user.id)}
                        className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                      />
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                            <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.restricted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                          }`}>
                            {user.restricted ? 'Restricted' : 'Active'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                          <span className="flex items-center gap-1">
                            <span>👤</span> {user.role}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📍</span> {user.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🏢</span> {user.organization}
                          </span>
                        </div>
                        
                        {/* Restriction Control */}
                        <div className="bg-primary-700 p-2 rounded-md mb-2">
                          <label className="flex items-center gap-2 text-sm text-gray-300 font-serif cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!user.restricted}
                              onChange={() => toggleRestrict(user.id)}
                              className="accent-accent-500 w-4 h-4"
                            />
                            <span>Grant Active Access (Unrestrict User)</span>
                          </label>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => setShowRestrictMoreInfo(user.id)} 
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            📋 More Info
                          </button>
                          <button 
                            onClick={() => handleRestrictUserAction(user)} 
                            className="btn-primary text-sm px-3 py-1"
                          >
                            ✅ Apply Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-400 font-sans">No users found</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredRestrictUsers.length > 3 && (
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                <button 
                  onClick={() => setRestrictPage(Math.max(restrictPage - 1, 1))} 
                  className="btn-secondary text-sm p-1"
                >
                  ←
                </button>
                <span className="text-xs text-gray-400">{restrictPage} of {Math.ceil(filteredRestrictUsers.length / 3)}</span>
                <button 
                  onClick={() => setRestrictPage(Math.min(restrictPage + 1, Math.ceil(filteredRestrictUsers.length / 3)))} 
                  className="btn-secondary text-sm p-1"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Approval Rights Card - FULLY ENHANCED VERSION */}
          <div className="card flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold font-sans text-gray-100">Approval Rights</h3>
              <button 
                onClick={() => setShowApprovalLogsModal(true)}
                className="text-xs text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1"
              >
                📜 View History
              </button>
            </div>
            
            {/* Filters and Mass Action */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  value={approvalSearch}
                  onChange={(e) => { setApprovalPage(1); setApprovalSearch(e.target.value); }}
                  placeholder="Search users..."
                  className="w-full px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
              <select
                value={approvalStateFilter}
                onChange={(e) => { setApprovalStateFilter(e.target.value); setApprovalPage(1); }}
                className="input-field w-full sm:w-auto"
              >
                <option value="All">Filter by State</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <button 
                onClick={() => {
                  if (selectedApprovalUsers.length === paginatedApprovalUsers.length) {
                    setSelectedApprovalUsers([]);
                  } else {
                    setSelectedApprovalUsers(paginatedApprovalUsers.map(u => u.id));
                  }
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                {selectedApprovalUsers.length === paginatedApprovalUsers.length ? '☐ Deselect All' : '☑ Select All'}
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {paginatedApprovalUsers.length > 0 ? (
                <div className="space-y-4">
                  {paginatedApprovalUsers.map((user) => (
                    <div key={user.id} className="flex items-start bg-primary-800 p-3 rounded-lg shadow-sm">
                      <input
                        type="checkbox"
                        checked={selectedApprovalUsers.includes(user.id)}
                        onChange={() => handleApprovalCheckboxChange(user.id)}
                        className="form-checkbox h-5 w-5 text-accent-500 rounded mr-3 mt-1"
                      />
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-gray-100 font-sans font-semibold">{user.name}</p>
                            <p className="text-gray-400 text-sm font-serif">{user.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.canApprove ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
                          }`}>
                            {user.canApprove ? '⭐ Can Approve' : 'No Rights'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-300 font-serif mb-3">
                          <span className="flex items-center gap-1">
                            <span>👤</span> {user.role}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📍</span> {user.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🏢</span> {user.organization}
                          </span>
                        </div>
                        
                        {/* Approval Rights Control */}
                        <div className="bg-primary-700 p-2 rounded-md mb-2">
                          <label className="flex items-center gap-2 text-sm text-gray-300 font-serif cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.canApprove}
                              onChange={() => toggleApprovalRight(user.id)}
                              className="accent-accent-500 w-4 h-4"
                            />
                            <span>Grant Approval Rights (Can approve platform activities)</span>
                          </label>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => setShowApprovalMoreInfo(user.id)} 
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            📋 More Info
                          </button>
                          <button 
                            onClick={() => handleApprovalRightsAction(user)} 
                            className="btn-primary text-sm px-3 py-1"
                          >
                            ✅ Apply Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-400 font-sans">No users found</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredApprovalUsers.length > 3 && (
              <div className="flex items-center justify-center space-x-2 mt-4 pt-4">
                <button 
                  onClick={() => setApprovalPage(Math.max(approvalPage - 1, 1))} 
                  className="btn-secondary text-sm p-1"
                >
                  ←
                </button>
                <span className="text-xs text-gray-400">{approvalPage} of {Math.ceil(filteredApprovalUsers.length / 3)}</span>
                <button 
                  onClick={() => setApprovalPage(Math.min(approvalPage + 1, Math.ceil(filteredApprovalUsers.length / 3)))} 
                  className="btn-secondary text-sm p-1"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Program Launch')}
            >
              🏛️ Launch Program
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Program Progress Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Stakeholder Meeting')}
            >
              🤝 Stakeholder Meeting
            </button>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>

        {/* Edit Access - More Info Modal */}
        {showEditMoreInfo && (() => {
          const user = accessUsers.find(u => u.id === showEditMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowEditMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">User Details</h3>
                    <button onClick={() => setShowEditMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Full Name</p>
                        <p className="text-sm text-gray-100 font-sans">{user.contactPersonName}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Email Address</p>
                        <p className="text-sm text-gray-100 font-sans">{user.contactPersonEmail}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Company Email Address</p>
                        <p className="text-sm text-gray-100 font-sans">{user.companyEmail}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Phone Number</p>
                        <p className="text-sm text-gray-100 font-sans">{user.phone}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                        <p className="text-sm text-gray-100 font-sans">{user.companyId}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Role</p>
                        <p className="text-sm text-gray-100 font-sans">{user.role}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Registration Date</p>
                        <p className="text-sm text-gray-100 font-sans">{user.registrationDate}</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organization}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Full Address</p>
                      <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Access Scope</p>
                      <p className="text-sm text-gray-100 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.accessScope === 'Full' ? 'bg-green-500 text-white' :
                          user.accessScope === 'Standard' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {user.accessScope} Access
                        </span>
                      </p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Status</p>
                      <p className="text-sm text-gray-100 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.restricted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {user.restricted ? 'Restricted' : 'Active'}
                        </span>
                        {user.canApprove && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                            Can Approve
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button 
                        onClick={() => setShowEditMoreInfo(null)} 
                        className="btn-secondary"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Edit Access - History Log Modal */}
        {showEditLogsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowEditLogsModal(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Edit Access History</h3>
                  <button onClick={() => setShowEditLogsModal(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {editLogs.length > 0 ? (
                    editLogs.map((log) => (
                      <div key={log.id} className="bg-primary-800 rounded-md p-4 border-l-4 border-accent-500">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-100 font-sans">{log.userName}</p>
                            <p className="text-xs text-gray-400 font-serif">Modified by {log.approvedBy}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {log.action === 'approved' ? '✅ Updated' : '❌ Rejected'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 font-serif mb-2">{log.remarks}</p>
                        <p className="text-xs text-gray-500 font-serif">{log.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-2">📜</div>
                      <p className="text-gray-400 font-sans">No history available</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowEditLogsModal(false)} className="btn-primary">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restrict Access - More Info Modal */}
        {showRestrictMoreInfo && (() => {
          const user = accessUsers.find(u => u.id === showRestrictMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">User Details</h3>
                    <button onClick={() => setShowRestrictMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Full Name</p>
                        <p className="text-sm text-gray-100 font-sans">{user.contactPersonName}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Email Address</p>
                        <p className="text-sm text-gray-100 font-sans">{user.contactPersonEmail}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Company Email Address</p>
                        <p className="text-sm text-gray-100 font-sans">{user.companyEmail}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Phone Number</p>
                        <p className="text-sm text-gray-100 font-sans">{user.phone}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                        <p className="text-sm text-gray-100 font-sans">{user.companyId}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Role</p>
                        <p className="text-sm text-gray-100 font-sans">{user.role}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Registration Date</p>
                        <p className="text-sm text-gray-100 font-sans">{user.registrationDate}</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organization}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Full Address</p>
                      <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Access Scope</p>
                      <p className="text-sm text-gray-100 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.accessScope === 'Full' ? 'bg-green-500 text-white' :
                          user.accessScope === 'Standard' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {user.accessScope} Access
                        </span>
                      </p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Restriction Status</p>
                      <p className="text-sm text-gray-100 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.restricted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {user.restricted ? '🚫 Restricted' : '✅ Active'}
                        </span>
                        {user.canApprove && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                            Can Approve
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button 
                        onClick={() => setShowRestrictMoreInfo(null)} 
                        className="btn-secondary"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Restrict Access - History Log Modal */}
        {showRestrictLogsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowRestrictLogsModal(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Restrict Access History</h3>
                  <button onClick={() => setShowRestrictLogsModal(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {restrictLogs.length > 0 ? (
                    restrictLogs.map((log) => (
                      <div key={log.id} className="bg-primary-800 rounded-md p-4 border-l-4 border-red-500">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-100 font-sans">{log.userName}</p>
                            <p className="text-xs text-gray-400 font-serif">Modified by {log.approvedBy}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {log.action === 'approved' ? '✅ Updated' : '❌ Rejected'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 font-serif mb-2">{log.remarks}</p>
                        <p className="text-xs text-gray-500 font-serif">{log.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-2">📜</div>
                      <p className="text-gray-400 font-sans">No history available</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowRestrictLogsModal(false)} className="btn-primary">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Rights - More Info Modal */}
        {showApprovalMoreInfo && (() => {
          const user = accessUsers.find(u => u.id === showApprovalMoreInfo);
          return user ? (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalMoreInfo(null)}>
              <div className="min-h-screen flex items-center justify-center py-8">
                <div className="w-full max-w-2xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold font-sans text-gray-100">User Details</h3>
                    <button onClick={() => setShowApprovalMoreInfo(null)} className="text-gray-400 hover:text-gray-200">✖</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Full Name</p>
                        <p className="text-sm text-gray-100 font-sans">{user.contactPersonName}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Contact Person Email Address</p>
                        <p className="text-sm text-gray-100 font-sans">{user.contactPersonEmail}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Company Email Address</p>
                        <p className="text-sm text-gray-100 font-sans">{user.companyEmail}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Phone Number</p>
                        <p className="text-sm text-gray-100 font-sans">{user.phone}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Company ID</p>
                        <p className="text-sm text-gray-100 font-sans">{user.companyId}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Role</p>
                        <p className="text-sm text-gray-100 font-sans">{user.role}</p>
                      </div>
                      <div className="bg-primary-800 rounded-md p-3">
                        <p className="text-xs text-gray-400 font-serif mb-1">Registration Date</p>
                        <p className="text-sm text-gray-100 font-sans">{user.registrationDate}</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organization}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Full Address</p>
                      <p className="text-sm text-gray-100 font-sans">{user.fullAddress}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Organization Profile</p>
                      <p className="text-sm text-gray-100 font-sans">{user.organizationProfile}</p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Access Scope</p>
                      <p className="text-sm text-gray-100 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.accessScope === 'Full' ? 'bg-green-500 text-white' :
                          user.accessScope === 'Standard' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {user.accessScope} Access
                        </span>
                      </p>
                    </div>
                    
                    <div className="bg-primary-800 rounded-md p-3">
                      <p className="text-xs text-gray-400 font-serif mb-1">Approval Rights</p>
                      <p className="text-sm text-gray-100 font-sans">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.canApprove ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {user.canApprove ? '⭐ Can Approve Activities' : '⛔ No Approval Rights'}
                        </span>
                        {user.restricted && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                            Restricted
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <button 
                        onClick={() => setShowApprovalMoreInfo(null)} 
                        className="btn-secondary"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Approval Rights - History Log Modal */}
        {showApprovalLogsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto" onClick={() => setShowApprovalLogsModal(false)}>
            <div className="min-h-screen flex items-center justify-center py-8">
              <div className="w-full max-w-3xl bg-primary-900 rounded-lg border border-primary-700 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold font-sans text-gray-100">Approval Rights History</h3>
                  <button onClick={() => setShowApprovalLogsModal(false)} className="text-gray-400 hover:text-gray-200">✖</button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {approvalRightsLogs.length > 0 ? (
                    approvalRightsLogs.map((log) => (
                      <div key={log.id} className="bg-primary-800 rounded-md p-4 border-l-4 border-purple-500">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-100 font-sans">{log.userName}</p>
                            <p className="text-xs text-gray-400 font-serif">Modified by {log.approvedBy}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {log.action === 'approved' ? '✅ Updated' : '❌ Rejected'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 font-serif mb-2">{log.remarks}</p>
                        <p className="text-xs text-gray-500 font-serif">{log.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-2">📜</div>
                      <p className="text-gray-400 font-sans">No history available</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowApprovalLogsModal(false)} className="btn-primary">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approval Confirmation Toast */}
        {approvalConfirm && (
          <div className="fixed right-4 bottom-4 sm:right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
            ✅ {approvalConfirm}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default Activities;
