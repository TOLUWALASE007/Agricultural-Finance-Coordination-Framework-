import React, { useState, useMemo, useEffect, useRef } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport } from '../../../utils/quickActions';
import { schemeAPI } from '../../../utils/api';
import { useNotifications } from '../../../context/NotificationContext';

type DurationUnit = 'Days' | 'Weeks' | 'Months' | 'Years';
type LocationType = 'state' | 'lga' | 'ward';

type NigeriaLocationHierarchy = Record<string, {
  lgas: Record<string, string[]>;
}>;

const nigeriaLocationHierarchy: NigeriaLocationHierarchy = {
  'Lagos': {
    lgas: {
      'Ikeja': ['Alausa', 'Oregun', 'Agidingbi'],
      'Eti-Osa': ['Ikoyi', 'Victoria Island', 'Lekki Phase 1'],
      'Surulere': ['Iponri', 'Aguda', 'Bode Thomas']
    }
  },
  'Abuja (FCT)': {
    lgas: {
      'Municipal Area Council': ['Garki', 'Wuse', 'Maitama'],
      'Bwari': ['Kubwa', 'Bwari Central', 'Dutse'],
      'Kuje': ['Rubochi', 'Kuje Central', 'Chibiri']
    }
  },
  'Kano': {
    lgas: {
      'Kano Municipal': ['Shahuchi', 'Wambai', 'Kofar Mata'],
      'Nassarawa': ['Hotoro', 'Dakatar', 'Gama'],
      'Gwale': ['Dorayi', 'Gwagwarwa', 'Kofar Wambai']
    }
  },
  'Kaduna': {
    lgas: {
      'Kaduna North': ['Ungwan Rimi', 'Ungwan Dosa', 'Kawo'],
      'Chikun': ['Kujama', 'Sabon Tasha', 'Narayi'],
      'Zaria': ['Sabon Gari', 'Gyellesu', 'Samara']
    }
  },
  'Rivers': {
    lgas: {
      'Port Harcourt': ['Diobu', 'Township', 'Borokiri'],
      'Obio/Akpor': ['Rumuokoro', 'Rumuosi', 'Rumueme'],
      'Eleme': ['Ogale', 'Alesa', 'Aleto']
    }
  },
  'Oyo': {
    lgas: {
      'Ibadan North': ['Agbowo', 'Bodija', 'Sango'],
      'Ibadan South-West': ['Ring Road', 'Oke Ado', 'Challenge'],
      'Ogbomosho North': ['Isale Ora', 'Kinnira', 'Sabo']
    }
  }
};

const stripHtmlContent = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<li>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
};

type FormattingAction = 'bold' | 'italic' | 'underline' | 'bullet' | 'numbered';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, rows = 4 }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
      normalizeEditorContent();
    }
  }, [value]);

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    normalizeEditorContent();
    handleInput();
  };

  const normalizeEditorContent = () => {
    if (!editorRef.current) return;

    editorRef.current.querySelectorAll('ul').forEach((ul) => {
      const el = ul as HTMLElement;
      el.style.listStyleType = 'disc';
      el.style.marginLeft = '1.5rem';
      el.style.paddingLeft = '0.5rem';
      el.style.marginTop = '0.25rem';
      el.style.marginBottom = '0.25rem';
    });

    editorRef.current.querySelectorAll('ol').forEach((ol) => {
      const el = ol as HTMLElement;
      el.style.listStyleType = 'decimal';
      el.style.marginLeft = '1.5rem';
      el.style.paddingLeft = '0.5rem';
      el.style.marginTop = '0.25rem';
      el.style.marginBottom = '0.25rem';
    });
  };

  const applyCommand = (action: FormattingAction) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    switch (action) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'bullet':
        document.execCommand('insertUnorderedList');
        break;
      case 'numbered':
        document.execCommand('insertOrderedList');
        break;
      default:
        break;
    }

    normalizeEditorContent();
    handleInput();
  };

  const minHeight = Math.max(rows * 28, 120);
  const hasContent = stripHtmlContent(value || '') !== '';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary text-xs px-2 py-1 font-semibold"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyCommand('bold')}
        >
          B
        </button>
        <button
          type="button"
          className="btn-secondary text-xs px-2 py-1 italic"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyCommand('italic')}
        >
          I
        </button>
        <button
          type="button"
          className="btn-secondary text-xs px-2 py-1 underline"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyCommand('underline')}
        >
          U
        </button>
        <button
          type="button"
          className="btn-secondary text-xs px-2 py-1"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyCommand('bullet')}
        >
          •
        </button>
        <button
          type="button"
          className="btn-secondary text-xs px-2 py-1"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => applyCommand('numbered')}
        >
          1.
        </button>
      </div>
      <div className="relative">
        {!hasContent && (
          <span className="absolute inset-0 pointer-events-none text-sm text-gray-400 font-serif px-3 py-2">
            {placeholder}
          </span>
        )}
        <div
          ref={editorRef}
          className="w-full px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 whitespace-pre-wrap break-words"
          style={{ minHeight }}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
};

type FundSchemeMetadata = {
  schemeDetails: {
    schemeName: string;
    schemeId: string;
    enterprises: string[];
    customEnterprise?: string;
    startDate: string;
    applicationDeadline: string;
  };
  stateAllocation: {
    locationType: LocationType;
    selectAllStates: boolean;
    selectedStates: string[];
    selectedLGAs: Record<string, string[]>;
    selectedWards: Record<string, Record<string, string[]>>;
    selectAllLGAs: Record<string, boolean>;
    selectAllWards: Record<string, Record<string, boolean>>;
    allocationType: 'equal' | 'custom';
    amountPerLocation: string;
    beneficiariesPerLocation: string;
    customAllocations: Record<string, { amount: string; beneficiaries: string }>;
    notes?: string;
  };
  fundAllocation: {
    loanAmount: string;
    loanTenureValue: string;
    loanTenureUnit: DurationUnit;
    defermentValue: string;
    defermentUnit: DurationUnit;
    collateralRequired: 'Yes' | 'No';
    deRiskingPercentage: string;
    pfiInterestRate: string;
    insurancePercentage: string;
  };
  beneficiaries: {
    types: string[];
    customType?: string;
    eligibilityNotes?: string;
  };
  documents: {
    items: Array<{ id: string; fileName: string; description: string }>;
  };
};

interface FundScheme {
  id: string;
  name: string;
  fundProvider: string;
  amount: string;
  beneficiaries: number;
  status: 'Active' | 'Completed';
  state: string;
  startDate: string;
  recoveryRate: string;
  description?: string;
  applicationDeadline?: string;
  metadata?: FundSchemeMetadata;
}

const FundSchemes: React.FC = () => {
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
    { title: 'Total Schemes', value: '47', change: '+5', icon: '💵' },
    { title: 'Active Schemes', value: '34', change: '+3', icon: '✅' },
    { title: 'Total Funds', value: '₦125.8B', change: '+₦15.2B', icon: '💼' },
    { title: 'Recovery Rate', value: '89.2%', change: '+3.5%', icon: '📈' }
  ];

  // Load schemes from localStorage or use default
  const loadSchemesFromStorage = () => {
    try {
      const stored = localStorage.getItem('fundSchemes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading schemes from localStorage:', error);
    }
    return null;
  };

  // Fund Schemes state
  const [fundSchemes, setFundSchemes] = useState<FundScheme[]>(() => {
    const stored = loadSchemesFromStorage();
    if (stored) return stored as FundScheme[];
    return [
    { 
      id: 'FS001', 
      name: 'Rice Value Chain Financing', 
      fundProvider: 'CBN Agricultural Finance', 
      amount: '₦25.5B', 
      beneficiaries: 12450, 
      status: 'Active',
      state: 'Multi-State',
      startDate: 'Jan 2024',
      recoveryRate: '92%'
    },
    { 
      id: 'FS002', 
      name: 'Cassava Production Support', 
      fundProvider: 'BOA Agric Investment', 
      amount: '₦18.3B', 
      beneficiaries: 8920, 
      status: 'Active',
      state: 'Ogun, Oyo, Ondo',
      startDate: 'Mar 2024',
      recoveryRate: '88%'
    },
    { 
      id: 'FS003', 
      name: 'Maize Farmers Credit Scheme', 
      fundProvider: 'Sterling Bank Agric Fund', 
      amount: '₦12.7B', 
      beneficiaries: 6780, 
      status: 'Active',
      state: 'Kaduna, Kano, Katsina',
      startDate: 'Feb 2024',
      recoveryRate: '85%'
    },
    { 
      id: 'FS004', 
      name: 'Poultry Expansion Program', 
      fundProvider: 'Access Bank Agric', 
      amount: '₦9.8B', 
      beneficiaries: 3450, 
      status: 'Active',
      state: 'Lagos, Ogun',
      startDate: 'Apr 2024',
      recoveryRate: '91%'
    },
    { 
      id: 'FS005', 
      name: 'Tomato Processing Scheme', 
      fundProvider: 'Zenith Bank Agric Finance', 
      amount: '₦8.2B', 
      beneficiaries: 2340, 
      status: 'Active',
      state: 'Kano, Jigawa',
      startDate: 'May 2024',
      recoveryRate: '87%'
    },
    { 
      id: 'FS006', 
      name: 'Cocoa Farmers Support', 
      fundProvider: 'FMARD Special Fund', 
      amount: '₦15.6B', 
      beneficiaries: 5620, 
      status: 'Active',
      state: 'Cross River, Ondo, Ekiti',
      startDate: 'Jan 2024',
      recoveryRate: '94%'
    },
    { 
      id: 'FS007', 
      name: 'Fish Farming Initiative', 
      fundProvider: 'UBA Agric Development', 
      amount: '₦7.4B', 
      beneficiaries: 1890, 
      status: 'Active',
      state: 'Delta, Rivers, Bayelsa',
      startDate: 'Mar 2024',
      recoveryRate: '83%'
    },
    { 
      id: 'FS008', 
      name: 'Sorghum Production Boost', 
      fundProvider: 'First Bank Agric', 
      amount: '₦6.9B', 
      beneficiaries: 4560, 
      status: 'Completed',
      state: 'Borno, Yobe, Adamawa',
      startDate: 'Nov 2023',
      recoveryRate: '79%'
    },
    { 
      id: 'FS009', 
      name: 'Vegetable Farming Credit', 
      fundProvider: 'GTBank Agricultural Fund', 
      amount: '₦5.3B', 
      beneficiaries: 3210, 
      status: 'Active',
      state: 'Plateau, Benue',
      startDate: 'Jun 2024',
      recoveryRate: '90%'
    },
    { 
      id: 'FS010', 
      name: 'Dairy Development Scheme', 
      fundProvider: 'NIRSAL Agric Fund', 
      amount: '₦11.2B', 
      beneficiaries: 2780, 
      status: 'Active',
      state: 'Adamawa, Taraba',
      startDate: 'Feb 2024',
      recoveryRate: '86%'
    },
    { 
      id: 'FS011', 
      name: 'Oil Palm Expansion', 
      fundProvider: 'CBN Anchor Borrowers', 
      amount: '₦13.8B', 
      beneficiaries: 4920, 
      status: 'Active',
      state: 'Edo, Delta, Imo',
      startDate: 'Apr 2024',
      recoveryRate: '88%'
    },
    { 
      id: 'FS012', 
      name: 'Youth Agripreneur Fund', 
      fundProvider: 'BOI Youth Fund', 
      amount: '₦9.1B', 
      beneficiaries: 6340, 
      status: 'Active',
      state: 'Multi-State',
      startDate: 'May 2024',
      recoveryRate: '82%'
    }
    ];
  });
  
  // Save schemes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('fundSchemes', JSON.stringify(fundSchemes));
    } catch (error) {
      console.error('Error saving schemes to localStorage:', error);
    }
  }, [fundSchemes]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // State management for Available Schemes
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemePage, setSchemeePage] = useState(1);
  const [stateFilter, setStateFilter] = useState('All');
  const schemePageSize = 3;

  // State management for Completed Schemes
  const [completedSearch, setCompletedSearch] = useState('');
  const [completedStateFilter, setCompletedStateFilter] = useState('All');
  const [completedPage, setCompletedPage] = useState(1);
  const completedPageSize = 3;

// Create Scheme modal state
const [showCreateModal, setShowCreateModal] = useState(false);
const [showConfirmCreate, setShowConfirmCreate] = useState(false);
const totalCreateSteps = 5;
const enterpriseOptions = ['Livestock', 'Arable', 'SMEs', 'Agribusiness'];
const beneficiaryTypeOptions = [
  'Producers/Farmers',
  'Anchors',
  'Lead Firms',
  'Agricultural Cooperative Groups'
];
const durationUnits: DurationUnit[] = ['Days', 'Weeks', 'Months', 'Years'];
const stepDefinitions = [
  { step: 1, label: 'Step 1', title: 'Scheme Details' },
  { step: 2, label: 'Step 2', title: 'Location Designation' },
  { step: 3, label: 'Step 3', title: 'Fund Allocation' },
  { step: 4, label: 'Step 4', title: 'Beneficiaries' },
  { step: 5, label: 'Step 5', title: 'Documentations' }
];

const createEmptyForm = (): FundSchemeMetadata => ({
  schemeDetails: {
    schemeName: '',
    schemeId: '',
    enterprises: [],
    customEnterprise: '',
    startDate: '',
    applicationDeadline: ''
  },
  stateAllocation: {
    locationType: 'state',
    selectAllStates: false,
    selectedStates: [],
    selectedLGAs: {},
    selectedWards: {},
    selectAllLGAs: {},
    selectAllWards: {},
    allocationType: 'equal',
    amountPerLocation: '',
    beneficiariesPerLocation: '',
    customAllocations: {},
    notes: ''
  },
  fundAllocation: {
    loanAmount: '',
    loanTenureValue: '',
    loanTenureUnit: 'Months',
    defermentValue: '',
    defermentUnit: 'Months',
    collateralRequired: 'No',
    deRiskingPercentage: '',
    pfiInterestRate: '',
    insurancePercentage: ''
  },
  beneficiaries: {
    types: [],
    customType: '',
    eligibilityNotes: ''
  },
  documents: {
    items: [{ id: `doc-${Date.now()}`, fileName: '', description: '' }]
  }
});

const [createStep, setCreateStep] = useState(1);
const [createForm, setCreateForm] = useState<FundSchemeMetadata>(() => createEmptyForm());
const [createError, setCreateError] = useState<string | null>(null);

const { schemeDetails, stateAllocation, fundAllocation, beneficiaries: beneficiarySection, documents } = createForm;
const selectedStates = stateAllocation.selectedStates;

const resetCreateFlow = () => {
  setCreateForm(createEmptyForm());
  setCreateStep(1);
  setCreateError(null);
  setError(null);
};

const toggleEnterpriseOption = (value: string) => {
  setCreateForm(prev => {
    const enterprises = prev.schemeDetails.enterprises.includes(value)
      ? prev.schemeDetails.enterprises.filter(item => item !== value)
      : [...prev.schemeDetails.enterprises, value];
    return {
      ...prev,
      schemeDetails: {
        ...prev.schemeDetails,
        enterprises
      }
    };
  });
};

const removeEnterprise = (value: string) => {
  setCreateForm(prev => ({
    ...prev,
    schemeDetails: {
      ...prev.schemeDetails,
      enterprises: prev.schemeDetails.enterprises.filter(item => item !== value)
    }
  }));
};

const formatCurrencyValue = (value: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return '₦0';
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(parsed);
};

const formatDisplayDate = (dateString: string) => {
  if (!dateString) {
    return 'N/A';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const buildLocationKey = (type: LocationType, state: string, lga?: string, ward?: string) => {
  if (type === 'state') return `state|${state}`;
  if (type === 'lga') return `lga|${state}|${lga}`;
  return `ward|${state}|${lga}|${ward}`;
};

const removeCustomAllocationsWithPrefix = (allocations: Record<string, { amount: string; beneficiaries: string }>, prefix: string) => {
  const updated = { ...allocations };
  Object.keys(updated).forEach(key => {
    if (key.startsWith(prefix)) {
      delete updated[key];
    }
  });
  return updated;
};

const getSelectedLocationKeys = (
  allocationState: FundSchemeMetadata['stateAllocation'] = stateAllocation
): string[] => {
  if (allocationState.locationType === 'state') {
    return allocationState.selectedStates.map(state => buildLocationKey('state', state));
  }
  if (allocationState.locationType === 'lga') {
    return allocationState.selectedStates.flatMap(state =>
      (allocationState.selectedLGAs[state] || []).map(lga => buildLocationKey('lga', state, lga))
    );
  }
  return allocationState.selectedStates.flatMap(state =>
    Object.entries(allocationState.selectedWards[state] || {}).flatMap(([lga, wards]) =>
      (wards || []).map(ward => buildLocationKey('ward', state, lga, ward))
    )
  );
};

const getLocationLabels = (
  allocationState: FundSchemeMetadata['stateAllocation'] = stateAllocation
): string[] => {
  if (allocationState.locationType === 'state') {
    return allocationState.selectedStates;
  }
  if (allocationState.locationType === 'lga') {
    return allocationState.selectedStates.flatMap(state =>
      (allocationState.selectedLGAs[state] || []).map(lga => `${lga}, ${state}`)
    );
  }
  return allocationState.selectedStates.flatMap(state =>
    Object.entries(allocationState.selectedWards[state] || {}).flatMap(([lga, wards]) =>
      (wards || []).map(ward => `${ward}, ${lga}, ${state}`)
    )
  );
};

const computeTotalBeneficiaries = (
  allocationState: FundSchemeMetadata['stateAllocation'] = stateAllocation
) => {
  const locationKeys = getSelectedLocationKeys(allocationState);
  if (locationKeys.length === 0) return 0;

  if (allocationState.allocationType === 'custom') {
    return locationKeys.reduce((total, key) => {
      const perLocation = allocationState.customAllocations[key]?.beneficiaries ||
        allocationState.beneficiariesPerLocation ||
        '0';
      return total + Number(perLocation || 0);
    }, 0);
  }
  const perLocation = Number(allocationState.beneficiariesPerLocation || 0);
  return perLocation * locationKeys.length;
};

const locationLabels = getLocationLabels();
const selectedLocationSummary =
  locationLabels.length > 0
    ? `${locationLabels.slice(0, 3).join(', ')}${locationLabels.length > 3 ? ` +${locationLabels.length - 3} more` : ''}`
    : 'None selected';

const totalBeneficiaries = computeTotalBeneficiaries();
const formattedLoanAmountDisplay = fundAllocation.loanAmount ? formatCurrencyValue(fundAllocation.loanAmount) : 'Not specified';
const allocationTypeLabel = stateAllocation.allocationType === 'custom' ? 'Custom Allocation' : 'Equal Distribution';
const enterpriseSummary = schemeDetails.enterprises.length > 0 ? schemeDetails.enterprises.join(', ') : 'None specified';
const supportingNotesPreview =
  stripHtmlContent(stateAllocation.notes || '') ||
  stripHtmlContent(beneficiarySection.eligibilityNotes || '') ||
  'No additional notes provided.';
const requiredDocuments = documents.items.filter(item => item.fileName || stripHtmlContent(item.description).length > 0);
const requiredDocumentsCount = requiredDocuments.length;
const locationTypeLabel =
  stateAllocation.locationType === 'state'
    ? 'State-Based'
    : stateAllocation.locationType === 'lga'
    ? 'LGA-Based'
    : 'Ward-Based';
const selectedLocationCount = getSelectedLocationKeys().length;
const locationPreviewList = locationLabels.slice(0, 6);
const remainingLocationsCount = Math.max(locationLabels.length - locationPreviewList.length, 0);

const handleAddCustomEnterprise = () => {
  if (!schemeDetails.customEnterprise?.trim()) {
    return;
  }

  setCreateForm(prev => {
    const trimmed = (prev.schemeDetails.customEnterprise ?? '').trim();
    if (prev.schemeDetails.enterprises.includes(trimmed)) {
      return {
        ...prev,
        schemeDetails: {
          ...prev.schemeDetails,
          customEnterprise: ''
        }
      };
    }

    return {
      ...prev,
      schemeDetails: {
        ...prev.schemeDetails,
        enterprises: [...prev.schemeDetails.enterprises, trimmed],
        customEnterprise: ''
      }
    };
  });
};

const handleLocationTypeChange = (value: LocationType) => {
  setCreateForm(prev => ({
    ...prev,
    stateAllocation: {
      ...prev.stateAllocation,
      locationType: value,
      selectAllStates: false,
      selectedStates: [],
      selectedLGAs: {},
      selectedWards: {},
      selectAllLGAs: {},
      selectAllWards: {},
      customAllocations: {},
      amountPerLocation: '',
      beneficiariesPerLocation: '',
      notes: prev.stateAllocation.notes
    }
  }));
};

const handleStateToggle = (state: string) => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const isSelected = allocation.selectedStates.includes(state);
    const updatedStates = isSelected
      ? allocation.selectedStates.filter(s => s !== state)
      : [...allocation.selectedStates, state];

    let updatedLGAs = { ...allocation.selectedLGAs };
    let updatedWards = { ...allocation.selectedWards };
    let selectAllLGAs = { ...allocation.selectAllLGAs };
    let selectAllWards = { ...allocation.selectAllWards };
    let updatedAllocations = { ...allocation.customAllocations };

    if (isSelected) {
      delete updatedLGAs[state];
      delete selectAllLGAs[state];

      if (updatedWards[state]) {
        Object.keys(updatedWards[state]).forEach(lga => {
          updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `ward|${state}|${lga}`);
          if (selectAllWards[state]) {
            delete selectAllWards[state][lga];
          }
        });
        delete updatedWards[state];
      }

      updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `lga|${state}`);
      updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `state|${state}`);
      if (selectAllWards[state] && Object.keys(selectAllWards[state]).length === 0) {
        delete selectAllWards[state];
      }
    } else {
      if (!updatedLGAs[state]) {
        updatedLGAs[state] = [];
      }
      if (!updatedWards[state]) {
        updatedWards[state] = {};
      }
      if (!selectAllLGAs[state]) {
        selectAllLGAs[state] = false;
      }
      if (!selectAllWards[state]) {
        selectAllWards[state] = {};
      }
      if (allocation.locationType === 'state' && allocation.allocationType === 'custom') {
        const key = buildLocationKey('state', state);
        if (!updatedAllocations[key]) {
          updatedAllocations[key] = { amount: '', beneficiaries: '' };
        }
      }
    }

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        selectedStates: updatedStates,
        selectedLGAs: updatedLGAs,
        selectedWards: updatedWards,
        selectAllStates: updatedStates.length === nigerianStates.length,
        selectAllLGAs,
        selectAllWards,
        customAllocations: updatedAllocations
      }
    };
  });
};

const handleToggleSelectAllStates = () => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const shouldSelectAll = allocation.selectedStates.length !== nigerianStates.length;
    const updatedStates = shouldSelectAll ? [...nigerianStates] : [];

    let updatedLGAs: Record<string, string[]> = {};
    let updatedWards: Record<string, Record<string, string[]>> = {};
    let selectAllLGAs: Record<string, boolean> = {};
    let selectAllWards: Record<string, Record<string, boolean>> = {};
    let updatedAllocations: Record<string, { amount: string; beneficiaries: string }> = {};

    if (shouldSelectAll) {
      updatedLGAs = nigerianStates.reduce<Record<string, string[]>>((acc, state) => {
        acc[state] = allocation.selectedLGAs[state] || [];
        return acc;
      }, {});

      updatedWards = nigerianStates.reduce<Record<string, Record<string, string[]>>>((acc, state) => {
        acc[state] = allocation.selectedWards[state] || {};
        return acc;
      }, {});

      selectAllLGAs = nigerianStates.reduce<Record<string, boolean>>((acc, state) => {
        acc[state] = allocation.selectAllLGAs[state] || false;
        return acc;
      }, {});

      selectAllWards = nigerianStates.reduce<Record<string, Record<string, boolean>>>((acc, state) => {
        acc[state] = allocation.selectAllWards[state] || {};
        return acc;
      }, {});

      if (allocation.allocationType === 'custom') {
        const prospectiveAllocation: FundSchemeMetadata['stateAllocation'] = {
          ...allocation,
          selectedStates: updatedStates,
          selectedLGAs: updatedLGAs,
          selectedWards: updatedWards,
          selectAllStates: true,
          selectAllLGAs,
          selectAllWards
        };
        const keysForAll = getSelectedLocationKeys(prospectiveAllocation);
        updatedAllocations = ensureCustomAllocationsForLocations(allocation.customAllocations, keysForAll);
      }
    }

    const nextCustomAllocations =
      allocation.allocationType === 'custom'
        ? (shouldSelectAll ? updatedAllocations : {})
        : {};

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        selectedStates: updatedStates,
        selectedLGAs: shouldSelectAll ? updatedLGAs : {},
        selectedWards: shouldSelectAll ? updatedWards : {},
        selectAllStates: shouldSelectAll,
        selectAllLGAs: shouldSelectAll ? selectAllLGAs : {},
        selectAllWards: shouldSelectAll ? selectAllWards : {},
        customAllocations: nextCustomAllocations
      }
    };
  });
};

const handleLGAToggle = (state: string, lga: string) => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const existingLGAs = allocation.selectedLGAs[state] || [];
    const isSelected = existingLGAs.includes(lga);
    const updatedLGAs = {
      ...allocation.selectedLGAs,
      [state]: isSelected ? existingLGAs.filter(item => item !== lga) : [...existingLGAs, lga]
    };

    let updatedWards = { ...allocation.selectedWards };
    let selectAllLGAs = { ...allocation.selectAllLGAs, [state]: false };
    let selectAllWards = { ...allocation.selectAllWards };
    let updatedAllocations = { ...allocation.customAllocations };

    if (isSelected) {
      if (updatedWards[state]?.[lga]) {
        updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `ward|${state}|${lga}`);
        delete updatedWards[state][lga];
        if (selectAllWards[state]) {
          delete selectAllWards[state][lga];
        }
      }
      updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `lga|${state}|${lga}`);
    } else {
      if (allocation.locationType === 'ward') {
        if (!updatedWards[state]) {
          updatedWards[state] = {};
        }
        if (!updatedWards[state][lga]) {
          updatedWards[state][lga] = [];
        }
        if (!selectAllWards[state]) {
          selectAllWards[state] = {};
        }
        if (!selectAllWards[state][lga]) {
          selectAllWards[state][lga] = false;
        }
      }

      if (allocation.allocationType === 'custom' && allocation.locationType === 'lga') {
        const key = buildLocationKey('lga', state, lga);
        if (!updatedAllocations[key]) {
          updatedAllocations[key] = { amount: '', beneficiaries: '' };
        }
      }
    }

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        selectedLGAs: updatedLGAs,
        selectedWards: updatedWards,
        selectAllLGAs,
        selectAllWards,
        customAllocations: updatedAllocations
      }
    };
  });
};

const handleToggleSelectAllLGAs = (state: string) => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const availableLGAs = Object.keys(nigeriaLocationHierarchy[state]?.lgas || {});
    const shouldSelectAll = !(allocation.selectAllLGAs[state]);

    const updatedLGAs = {
      ...allocation.selectedLGAs,
      [state]: shouldSelectAll ? availableLGAs : []
    };

    let updatedWards = { ...allocation.selectedWards };
    let selectAllWards = { ...allocation.selectAllWards };
    let updatedAllocations = { ...allocation.customAllocations };

    if (allocation.locationType === 'ward') {
      if (!updatedWards[state]) {
        updatedWards[state] = {};
      }
      if (!selectAllWards[state]) {
        selectAllWards[state] = {};
      }

      availableLGAs.forEach(lga => {
        if (shouldSelectAll) {
          updatedWards[state][lga] = allocation.selectedWards[state]?.[lga] || [];
          selectAllWards[state][lga] = allocation.selectAllWards[state]?.[lga] || false;
        } else {
          if (updatedWards[state][lga]) {
            updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `ward|${state}|${lga}`);
          }
          delete updatedWards[state][lga];
          delete selectAllWards[state][lga];
        }
      });
    }

    if (allocation.allocationType === 'custom' && allocation.locationType === 'lga') {
      if (shouldSelectAll) {
        availableLGAs.forEach(lga => {
          const key = buildLocationKey('lga', state, lga);
          if (!updatedAllocations[key]) {
            updatedAllocations[key] = { amount: '', beneficiaries: '' };
          }
        });
      } else {
        updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `lga|${state}`);
      }
    }

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        selectedLGAs: updatedLGAs,
        selectedWards: updatedWards,
        selectAllLGAs: {
          ...allocation.selectAllLGAs,
          [state]: shouldSelectAll
        },
        selectAllWards,
        customAllocations: updatedAllocations
      }
    };
  });
};

const handleWardToggle = (state: string, lga: string, ward: string) => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const existingWards = allocation.selectedWards[state]?.[lga] || [];
    const isSelected = existingWards.includes(ward);
    const updatedWards = {
      ...allocation.selectedWards,
      [state]: {
        ...(allocation.selectedWards[state] || {}),
        [lga]: isSelected ? existingWards.filter(item => item !== ward) : [...existingWards, ward]
      }
    };

    const selectAllWards = {
      ...allocation.selectAllWards,
      [state]: {
        ...(allocation.selectAllWards[state] || {}),
        [lga]: false
      }
    };

    let updatedAllocations = { ...allocation.customAllocations };
    if (isSelected) {
      const key = buildLocationKey('ward', state, lga, ward);
      delete updatedAllocations[key];
    } else if (allocation.allocationType === 'custom') {
      const key = buildLocationKey('ward', state, lga, ward);
      if (!updatedAllocations[key]) {
        updatedAllocations[key] = { amount: '', beneficiaries: '' };
      }
    }

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        selectedWards: updatedWards,
        selectAllWards,
        customAllocations: updatedAllocations
      }
    };
  });
};

const handleToggleSelectAllWards = (state: string, lga: string) => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const wards = nigeriaLocationHierarchy[state]?.lgas?.[lga] || [];
    const shouldSelectAll = !(allocation.selectAllWards[state]?.[lga]);

    const updatedWards = {
      ...allocation.selectedWards,
      [state]: {
        ...(allocation.selectedWards[state] || {}),
        [lga]: shouldSelectAll ? wards : []
      }
    };

    const selectAllWards = {
      ...allocation.selectAllWards,
      [state]: {
        ...(allocation.selectAllWards[state] || {}),
        [lga]: shouldSelectAll
      }
    };

    let updatedAllocations = { ...allocation.customAllocations };
    if (allocation.allocationType === 'custom') {
      if (shouldSelectAll) {
        wards.forEach(ward => {
          const key = buildLocationKey('ward', state, lga, ward);
          if (!updatedAllocations[key]) {
            updatedAllocations[key] = { amount: '', beneficiaries: '' };
          }
        });
      } else {
        updatedAllocations = removeCustomAllocationsWithPrefix(updatedAllocations, `ward|${state}|${lga}`);
      }
    }

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        selectedWards: updatedWards,
        selectAllWards,
        customAllocations: updatedAllocations
      }
    };
  });
};

const ensureCustomAllocationsForLocations = (allocations: Record<string, { amount: string; beneficiaries: string }>, locationKeys: string[]) => {
  const updated = { ...allocations };
  locationKeys.forEach(key => {
    if (!updated[key]) {
      updated[key] = { amount: '', beneficiaries: '' };
    }
  });
  return updated;
};

const handleAllocationTypeChange = (value: 'equal' | 'custom') => {
  setCreateForm(prev => {
    const allocation = prev.stateAllocation;
    const locationKeys = getSelectedLocationKeys(allocation);
    const updatedAllocations =
      value === 'custom'
        ? ensureCustomAllocationsForLocations(allocation.customAllocations, locationKeys)
        : {};

    return {
      ...prev,
      stateAllocation: {
        ...allocation,
        allocationType: value,
        customAllocations: updatedAllocations
      }
    };
  });
};

const handleCustomAllocationChange = (locationKey: string, field: 'amount' | 'beneficiaries', value: string) => {
  setCreateForm(prev => ({
    ...prev,
    stateAllocation: {
      ...prev.stateAllocation,
      customAllocations: {
        ...prev.stateAllocation.customAllocations,
        [locationKey]: {
          ...prev.stateAllocation.customAllocations[locationKey],
          [field]: value
        }
      }
    }
  }));
};

const toggleBeneficiaryType = (type: string) => {
  setCreateForm(prev => {
    const exists = prev.beneficiaries.types.includes(type);
    return {
      ...prev,
      beneficiaries: {
        ...prev.beneficiaries,
        types: exists
          ? prev.beneficiaries.types.filter(item => item !== type)
          : [...prev.beneficiaries.types, type]
      }
    };
  });
};

const handleAddCustomBeneficiaryType = () => {
  if (!beneficiarySection.customType?.trim()) {
    return;
  }

  setCreateForm(prev => {
    const trimmed = (prev.beneficiaries.customType ?? '').trim();
    if (prev.beneficiaries.types.includes(trimmed)) {
      return {
        ...prev,
        beneficiaries: {
          ...prev.beneficiaries,
          customType: ''
        }
      };
    }

    return {
      ...prev,
      beneficiaries: {
        ...prev.beneficiaries,
        types: [...prev.beneficiaries.types, trimmed],
        customType: ''
      }
    };
  });
};

const handleDocumentFileChange = (index: number, file: File | null) => {
  setCreateForm(prev => {
    const updated = [...prev.documents.items];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        fileName: file ? file.name : ''
      };
    }
    return {
      ...prev,
      documents: { items: updated }
    };
  });
};

const handleDocumentDescriptionChange = (index: number, value: string) => {
  setCreateForm(prev => {
    const updated = [...prev.documents.items];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        description: value
      };
    }
    return {
      ...prev,
      documents: { items: updated }
    };
  });
};

const handleAddDocumentField = () => {
  setCreateForm(prev => ({
    ...prev,
    documents: {
      items: [
        ...prev.documents.items,
        { id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, fileName: '', description: '' }
      ]
    }
  }));
};

const handleRemoveDocumentField = (index: number) => {
  setCreateForm(prev => {
    if (prev.documents.items.length === 1) {
      return prev;
    }
    const updated = prev.documents.items.filter((_, i) => i !== index);
    return {
      ...prev,
      documents: { items: updated }
    };
  });
};

const isValidPositiveNumber = (value: string) => {
  if (!value) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0;
};

const isValidPercentage = (value: string) => {
  if (!value) return false;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100;
};

const validateStep = (step: number) => {
  switch (step) {
    case 1: {
      if (!schemeDetails.schemeName.trim() || !schemeDetails.schemeId.trim()) {
        setCreateError('Please provide both the scheme name and scheme ID.');
        return false;
      }
      if (!schemeDetails.startDate || !schemeDetails.applicationDeadline) {
        setCreateError('Please provide both a start date and an application deadline.');
        return false;
      }
      if (new Date(schemeDetails.applicationDeadline) <= new Date(schemeDetails.startDate)) {
        setCreateError('The application deadline must be later than the start date.');
        return false;
      }
      return true;
    }
    case 2: {
      const locationKeys = getSelectedLocationKeys();
      if (locationKeys.length === 0) {
        const message =
          stateAllocation.locationType === 'state'
            ? 'Select at least one state for this scheme.'
            : stateAllocation.locationType === 'lga'
            ? 'Select at least one LGA for this scheme.'
            : 'Select at least one ward for this scheme.';
        setCreateError(message);
        return false;
      }
      return true;
    }
    case 3: {
      if (!isValidPositiveNumber(fundAllocation.loanAmount)) {
        setCreateError('Enter a valid loan amount (₦).');
        return false;
      }
      if (!isValidPositiveNumber(fundAllocation.loanTenureValue)) {
        setCreateError('Enter a valid loan tenure.');
        return false;
      }
      if (fundAllocation.defermentValue && !isValidPositiveNumber(fundAllocation.defermentValue)) {
        setCreateError('Enter a valid deferment/grace period.');
        return false;
      }
      if (fundAllocation.deRiskingPercentage && !isValidPercentage(fundAllocation.deRiskingPercentage)) {
        setCreateError('Enter a valid de-risking percentage (0-100%).');
        return false;
      }
      if (fundAllocation.pfiInterestRate && !isValidPercentage(fundAllocation.pfiInterestRate)) {
        setCreateError('Enter a valid PFI interest rate (0-100%).');
        return false;
      }
      if (fundAllocation.insurancePercentage && !isValidPercentage(fundAllocation.insurancePercentage)) {
        setCreateError('Enter a valid insurance percentage (0-100%).');
        return false;
      }
      return true;
    }
    case 4: {
      if (beneficiarySection.types.length === 0) {
        setCreateError('Select at least one beneficiary type.');
        return false;
      }
      return true;
    }
    case 5: {
      const hasDocument = documents.items.some(item => item.fileName || item.description.trim().length > 0);
      if (!hasDocument) {
        setCreateError('Add at least one document with a file or description.');
        return false;
      }
      return true;
    }
    default:
      return true;
  }
};

const handleNextStep = () => {
  if (!validateStep(createStep)) {
    return;
  }
  setCreateError(null);
  setCreateStep(prev => Math.min(prev + 1, totalCreateSteps));
};

const handlePreviousStep = () => {
  setCreateError(null);
  setCreateStep(prev => Math.max(prev - 1, 1));
};

const handleStepNavigation = (targetStep: number) => {
  if (targetStep === createStep) return;

  if (targetStep > createStep && !validateStep(createStep)) {
    return;
  }

  setCreateError(null);
  setCreateStep(targetStep);
};

const openCreateModal = () => {
  resetCreateFlow();
  setShowCreateModal(true);
};

const closeCreateModal = () => {
  setShowCreateModal(false);
  resetCreateFlow();
};

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState<{ id: string; name: string } | null>(null);

  const { addNotification } = useNotifications();

  // Handle scheme completion
  const handleCompleteScheme = (schemeId: string) => {
    setFundSchemes(prev => prev.map(scheme => 
      scheme.id === schemeId 
        ? { ...scheme, status: 'Completed' }
        : scheme
    ));
    alert(`Scheme has been marked as completed and moved to completed schemes.`);
  };

  // Handle scheme deletion
  const handleDeleteScheme = (schemeId: string, schemeName: string) => {
    setSchemeToDelete({ id: schemeId, name: schemeName });
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (schemeToDelete) {
      setFundSchemes(prev => prev.filter(scheme => scheme.id !== schemeToDelete.id));
      setShowDeleteModal(false);
      setSchemeToDelete(null);
      alert(`Scheme "${schemeToDelete.name}" has been permanently deleted.`);
    }
  };

  // Fetch schemes from API
  // Only fetch from API on initial load if localStorage is empty
  useEffect(() => {
    const hasStoredSchemes = localStorage.getItem('fundSchemes');
    
    // If we have stored schemes, don't fetch from API (preserve local changes)
    if (hasStoredSchemes) {
      setLoading(false);
      return;
    }
    
    // Only fetch from API if localStorage is empty (initial load)
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await schemeAPI.getAll({
          page: 1,
          limit: 100,
          status: stateFilter === 'All' ? undefined : stateFilter
        });
        
        if (response.success && response.data) {
          // Transform API data to match the component's expected format
          const transformedSchemes: FundScheme[] = response.data.map((scheme: any) => ({
            id: scheme.schemeId,
            name: scheme.schemeName,
            fundProvider: scheme.fundProvider || 'Not Assigned',
            amount: scheme.amount,
            beneficiaries: scheme.beneficiaries || 0,
            status: scheme.status as 'Active' | 'Completed',
            state: scheme.state || scheme.states?.join(', ') || 'Multi-State',
            startDate: new Date(scheme.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            recoveryRate: scheme.recoveryRate || '0%'
          }));
          setFundSchemes(transformedSchemes);
        } else {
          // If response is not successful, keep existing schemes from localStorage
          // Do not clear schemes if we have localStorage data
        }
      } catch (err: any) {
        // Log error to console for debugging, but don't display to user
        console.error('Error fetching schemes:', err);
        // Don't overwrite localStorage data on error - keep existing schemes
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []); // Only run on initial mount, not when stateFilter changes

  const nigerianStates = [
    'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT Abuja'
  ];

  // Filtered schemes - only show Active schemes in Available Schemes
  const filteredSchemes = useMemo(() => {
    return fundSchemes.filter(scheme => {
      // Only show Active schemes
      if (scheme.status !== 'Active') {
        return false;
      }
      
      const matchesSearch = 
        scheme.name.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        scheme.fundProvider.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        scheme.state.toLowerCase().includes(schemeSearch.toLowerCase()) ||
        scheme.id.toLowerCase().includes(schemeSearch.toLowerCase());
      const matchesState = stateFilter === 'All' || scheme.state.toLowerCase().includes(stateFilter.toLowerCase());
      return matchesSearch && matchesState;
    });
  }, [schemeSearch, stateFilter, fundSchemes]);

  const filteredCompletedSchemes = useMemo(() => {
    return fundSchemes.filter(scheme => {
      // Only show Completed schemes
      if (scheme.status !== 'Completed') {
        return false;
      }
      
      const matchesSearch = 
        scheme.name.toLowerCase().includes(completedSearch.toLowerCase()) ||
        scheme.fundProvider.toLowerCase().includes(completedSearch.toLowerCase()) ||
        scheme.state.toLowerCase().includes(completedSearch.toLowerCase()) ||
        scheme.id.toLowerCase().includes(completedSearch.toLowerCase());
      const matchesState = completedStateFilter === 'All' || scheme.state.toLowerCase().includes(completedStateFilter.toLowerCase());
      return matchesSearch && matchesState;
    });
  }, [completedSearch, completedStateFilter, fundSchemes]);

  const paginatedCompletedSchemes = useMemo(() => {
    const start = (completedPage - 1) * completedPageSize;
    return filteredCompletedSchemes.slice(start, start + completedPageSize);
  }, [filteredCompletedSchemes, completedPage]);

  const paginatedSchemes = useMemo(() => {
    const start = (schemePage - 1) * schemePageSize;
    return filteredSchemes.slice(start, start + schemePageSize);
  }, [filteredSchemes, schemePage]);

  const handleCreateSubmit = () => {
  if (!validateStep(createStep)) {
    return;
  }
  setCreateError(null);
  setShowCreateModal(false);
  setShowConfirmCreate(true);
  };

const handleConfirmCreate = async () => {
  // Final validation safeguard
  if (!validateStep(5)) {
    setShowConfirmCreate(false);
    setShowCreateModal(true);
    setCreateStep(totalCreateSteps);
    return;
  }

  const combinedEnterprises = Array.from(
    new Set([
      ...schemeDetails.enterprises,
      ...(schemeDetails.customEnterprise?.trim() ? [schemeDetails.customEnterprise.trim()] : [])
    ])
  );

  const formattedAmount = formatCurrencyValue(fundAllocation.loanAmount);
  const formattedStartDate = schemeDetails.startDate
    ? new Date(schemeDetails.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';
  const schemeLocationSummary = selectedLocationSummary;
  const totalBeneficiaries = computeTotalBeneficiaries();
  const primaryNotes = stripHtmlContent(stateAllocation.notes || '');
  const secondaryNotes = stripHtmlContent(beneficiarySection.eligibilityNotes || '');
  const descriptionForScheme =
    primaryNotes ||
    secondaryNotes ||
    `Fund scheme focused on ${combinedEnterprises.join(', ') || 'agricultural development'}.`;
  const documentItems = documents.items.filter(item => item.fileName || stripHtmlContent(item.description).length > 0);

  // Check if user is authenticated
  const token = localStorage.getItem('authToken');
  if (!token) {
    setError('You must be logged in to create schemes. Please log in first.');
    return;
  }

  try {
    setIsCreating(true);
    setError(null);

    // Check if scheme ID already exists
    const existingScheme = fundSchemes.find(s => s.id === schemeDetails.schemeId);
    if (existingScheme) {
      setError(`Scheme with ID "${schemeDetails.schemeId}" already exists. Please use a different ID.`);
      setIsCreating(false);
      return;
    }

    const schemeMetadata: FundSchemeMetadata = {
      ...createForm,
      schemeDetails: {
        ...createForm.schemeDetails,
        enterprises: combinedEnterprises
      },
      documents: {
        items: documentItems
      }
    };

    // Create the scheme locally first (will be saved to localStorage)
    const newScheme: FundScheme = {
      id: schemeDetails.schemeId,
      name: schemeDetails.schemeName,
      fundProvider: 'Not Assigned',
      amount: formattedAmount,
      beneficiaries: totalBeneficiaries,
      status: 'Active',
      state: schemeLocationSummary,
      startDate: formattedStartDate,
      recoveryRate: '0%',
      description: descriptionForScheme,
      applicationDeadline: schemeDetails.applicationDeadline,
      metadata: schemeMetadata
    };

    // Add to local state immediately (will be saved to localStorage via useEffect)
    setFundSchemes(prev => [newScheme, ...prev]);

    // Try to create via API (but don't fail if it doesn't work)
    try {
      const response = await schemeAPI.create({
        schemeName: schemeDetails.schemeName,
        schemeId: schemeDetails.schemeId,
        description: descriptionForScheme,
        amount: formattedAmount,
        states: stateAllocation.selectedStates,
        startDate: schemeDetails.startDate,
        applicationDeadline: schemeDetails.applicationDeadline
      });

      // If API call succeeds, update the scheme with any additional data from the response
      if (response.success && response.data) {
        setFundSchemes(prev =>
          prev.map(scheme =>
            scheme.id === schemeDetails.schemeId
              ? {
                  ...scheme,
                  fundProvider: response.data.fundProvider || scheme.fundProvider,
                  beneficiaries: response.data.beneficiaries || scheme.beneficiaries,
                  recoveryRate: response.data.recoveryRate || scheme.recoveryRate
                }
              : scheme
          )
        );
      }
    } catch (apiError: any) {
      const errorMessage = apiError.message || '';
      if (
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate') ||
        errorMessage.includes('Scheme ID already exists')
      ) {
        setFundSchemes(prev => prev.filter(scheme => scheme.id !== schemeDetails.schemeId));
        setError(`Scheme with ID "${schemeDetails.schemeId}" already exists in the system. Please use a different ID.`);
      setCreateStep(totalCreateSteps);
      return;
      }
      console.warn('Scheme created locally, but API call failed:', apiError.message);
    }

    // Create notifications for all relevant roles (only if scheme was successfully created)
    const schemeMessage = `New fund scheme "${schemeDetails.schemeName}" (${formattedAmount}) is now available for applications. Application deadline: ${new Date(schemeDetails.applicationDeadline).toLocaleDateString()}.`;

    const commonNotificationData = {
      role: '🏛️ Coordinating Agency',
      applicantName: 'Coordinating Agency',
      applicantType: 'Company' as const,
      companyName: 'Agricultural Finance Coordination Framework',
      companyId: 'CA-001',
      organization: 'Coordinating Agency',
      organizationProfile: 'Central coordination body for agricultural finance',
      fullAddress: 'Federal Capital Territory, Abuja, Nigeria',
      contactPersonName: 'Dr. Aisha Mohammed',
      contactPersonEmail: 'a.mohammed@afcf.gov.ng',
      contactPersonPhone: '+234-807-123-4567',
      companyEmail: 'info@afcf.gov.ng',
      documentUrl: '#',
      schemeId: schemeDetails.schemeId,
      schemeName: schemeDetails.schemeName
    };

    addNotification({
      ...commonNotificationData,
      targetRole: 'fund-provider',
      message: schemeMessage
    });
    addNotification({
      ...commonNotificationData,
      targetRole: 'anchor',
      message: schemeMessage
    });
    addNotification({
      ...commonNotificationData,
      targetRole: 'producer',
      message: schemeMessage
    });
    addNotification({
      ...commonNotificationData,
      targetRole: 'pfi',
      message: schemeMessage
    });
    addNotification({
      ...commonNotificationData,
      targetRole: 'lead-firm',
      message: schemeMessage
    });

    setShowConfirmCreate(false);
    resetCreateFlow();
  } catch (err: any) {
    console.error('Error in post-creation steps:', err);
  } finally {
    setIsCreating(false);
  }
};

  return (
    <PortalLayout role="Coordinating Agency (Super Admin)" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-4 sm:p-6 text-white">
          <h1 className="text-base sm:text-xl font-bold font-sans mb-2">Fund Schemes Management</h1>
          <p className="text-xs sm:text-sm text-gray-200 font-serif">
            Monitor and manage all agricultural finance schemes across the nation. Track fund deployment, beneficiary reach, and recovery performance.
          </p>
        </div>

        {/* Create Scheme Button */}
        <div className="flex justify-end">
          <button 
            onClick={openCreateModal}
            className="px-4 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-sans flex items-center gap-2"
          >
            ➕ Create Scheme
          </button>
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

          {/* Available Schemes */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-sans text-gray-100 mb-2">Available Schemes</h1>
              <p className="text-sm text-gray-400 font-serif">Browse and manage all available fund schemes. Use filters and search to find specific schemes.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={stateFilter} 
                onChange={(e) => { setStateFilter(e.target.value); setSchemeePage(1); }}
                className="w-full sm:w-auto px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <input
                  type="text"
                  value={schemeSearch}
                  onChange={(e) => { setSchemeePage(1); setSchemeSearch(e.target.value); }}
                  placeholder="Search schemes..."
                  className="w-full sm:w-64 px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 font-serif">Loading schemes...</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-primary-700 rounded-lg border border-primary-600 p-4 hover:border-accent-500 transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">{scheme.name}</h3>
                    <p className="text-sm text-gray-300 font-serif mb-3">{scheme.fundProvider}</p>
                  </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      scheme.status === 'Active' ? 'bg-green-500 text-white' :
                      scheme.status === 'Completed' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {scheme.status}
                    </span>
                </div>
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-serif">Amount:</span>
                    <span className="text-sm font-medium text-accent-400 font-sans">{scheme.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-serif">Beneficiaries:</span>
                    <span className="text-sm text-gray-300 font-serif">{scheme.beneficiaries.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-serif">State:</span>
                    <span className="text-sm text-gray-300 font-serif">{scheme.state}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-serif">Recovery Rate:</span>
                    <span className="text-sm text-gray-300 font-serif">{scheme.recoveryRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-serif">Start Date:</span>
                    <span className="text-sm text-gray-300 font-serif">{scheme.startDate}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleCompleteScheme(scheme.id)}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors text-sm"
                    title="Mark scheme as completed (moves to completed schemes)"
                  >
                    Completed
                  </button>
                  <button 
                    onClick={() => handleDeleteScheme(scheme.id, scheme.name)}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors text-sm"
                    title="Delete scheme (permanent)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}

          {!loading && paginatedSchemes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 font-serif">No schemes found matching your search.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredSchemes.length > schemePageSize && (
            <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-primary-600">
              <button
                onClick={() => setSchemeePage(Math.max(schemePage - 1, 1))}
                disabled={schemePage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{schemePage} of {Math.ceil(filteredSchemes.length / schemePageSize)}</span>
              <button
                onClick={() => setSchemeePage(Math.min(schemePage + 1, Math.ceil(filteredSchemes.length / schemePageSize)))}
                disabled={schemePage >= Math.ceil(filteredSchemes.length / schemePageSize)}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Completed Schemes */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-sans text-gray-100 mb-2">Completed Schemes</h1>
              <p className="text-sm text-gray-400 font-serif">Schemes that have met their required targets (passed deadline, reached target funding).</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={completedStateFilter} 
                onChange={(e) => { setCompletedStateFilter(e.target.value); setCompletedPage(1); }}
                className="w-full sm:w-auto px-3 py-2 rounded-md bg-primary-700 text-gray-100 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              >
                <option value="All">All States</option>
                {nigerianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <input
                  type="text"
                  value={completedSearch}
                  onChange={(e) => { setCompletedPage(1); setCompletedSearch(e.target.value); }}
                  placeholder="Search completed schemes..."
                  className="w-full sm:w-64 px-4 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
          </div>
          
          {filteredCompletedSchemes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 font-serif">No completed schemes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCompletedSchemes.map((scheme) => (
                <div key={scheme.id} className="bg-primary-700 rounded-lg border border-primary-600 p-4 hover:border-accent-500 transition-colors flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold font-sans text-gray-100 mb-2">{scheme.name}</h3>
                      <p className="text-sm text-gray-300 font-serif mb-3">{scheme.fundProvider}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      scheme.status === 'Completed' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {scheme.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-serif">Amount:</span>
                      <span className="text-sm font-medium text-accent-400 font-sans">{scheme.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-serif">Beneficiaries:</span>
                      <span className="text-sm text-gray-300 font-serif">{scheme.beneficiaries.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-serif">State:</span>
                      <span className="text-sm text-gray-300 font-serif">{scheme.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-serif">Recovery Rate:</span>
                      <span className="text-sm text-gray-300 font-serif">{scheme.recoveryRate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-serif">Start Date:</span>
                      <span className="text-sm text-gray-300 font-serif">{scheme.startDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => handleDeleteScheme(scheme.id, scheme.name)}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors text-sm"
                      title="Delete scheme (permanent)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls for Completed Schemes */}
          {filteredCompletedSchemes.length > completedPageSize && (
            <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-primary-600">
              <button
                onClick={() => setCompletedPage(Math.max(completedPage - 1, 1))}
                disabled={completedPage === 1}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <span className="text-xs text-gray-400">{completedPage} of {Math.ceil(filteredCompletedSchemes.length / completedPageSize)}</span>
              <button
                onClick={() => setCompletedPage(Math.min(completedPage + 1, Math.ceil(filteredCompletedSchemes.length / completedPageSize)))}
                disabled={completedPage >= Math.ceil(filteredCompletedSchemes.length / completedPageSize)}
                className="btn-secondary text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card flex flex-col">
            <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100 mb-4">Top Performing Schemes</h3>
            <div className="space-y-3 flex-1">
              {fundSchemes
                .filter(scheme => scheme.status === 'Active')
                .sort((a, b) => parseFloat(b.recoveryRate) - parseFloat(a.recoveryRate))
                .slice(0, 5)
                .map((scheme, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 font-sans">{scheme.name}</p>
                      <p className="text-xs text-gray-400 font-serif">{scheme.fundProvider}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-bold text-green-400">{scheme.recoveryRate}</p>
                      <p className="text-xs text-gray-400 font-serif">Recovery</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100 mb-4">Largest Schemes by Amount</h3>
            <div className="space-y-3 flex-1">
              {fundSchemes
                .filter(scheme => scheme.status === 'Active')
                .sort((a, b) => {
                  const amountA = parseFloat(a.amount.replace(/[₦B,]/g, ''));
                  const amountB = parseFloat(b.amount.replace(/[₦B,]/g, ''));
                  return amountB - amountA;
                })
                .slice(0, 5)
                .map((scheme, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 font-sans">{scheme.name}</p>
                      <p className="text-xs text-gray-400 font-serif">{scheme.beneficiaries.toLocaleString()} beneficiaries</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-sm font-bold text-accent-400">{scheme.amount}</p>
                      <p className="text-xs text-gray-400 font-serif">Deployed</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className="btn-primary text-xs sm:text-sm px-3 py-2"
              onClick={() => generateReport('Fund Schemes Report', 'PDF')}
            >
              📄 Export Schemes Report
            </button>
            <button className="btn-secondary text-xs sm:text-sm px-3 py-2">
              ➕ Register New Scheme
            </button>
            <button className="btn-secondary text-xs sm:text-sm px-3 py-2">
              📊 View Analytics Dashboard
            </button>
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>

      {/* Create Fund Scheme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl bg-primary-800 border border-primary-700 rounded-lg shadow-xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-primary-700 flex items-start justify-between sticky top-0 bg-primary-800 z-10">
              <div>
                <h3 className="text-lg font-semibold text-white font-sans">Create Fund Scheme</h3>
                <p className="text-xs text-gray-400 font-serif mt-1">Step {createStep} of {totalCreateSteps}</p>
                <div className="mt-2 h-1 w-full bg-primary-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 transition-all duration-300"
                    style={{ width: `${(createStep / totalCreateSteps) * 100}%` }}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {stepDefinitions.map((def) => {
                    const isActive = def.step === createStep;
                    const isCompleted = def.step < createStep;
                    return (
                      <button
                        key={def.step}
                        type="button"
                        onClick={() => handleStepNavigation(def.step)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          isActive
                            ? 'bg-accent-600 text-white'
                            : isCompleted
                            ? 'bg-primary-600 text-accent-300 hover:bg-primary-500'
                            : 'bg-primary-700 text-gray-300 hover:text-white hover:bg-primary-600'
                        }`}
                      >
                        {def.label} – {def.title}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-200 text-xl leading-none">✖</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {createError && (
                <div className="rounded-md border border-red-500 bg-red-500/10 text-sm text-red-300 px-3 py-2">
                  {createError}
                </div>
              )}

              {createStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Step 1 of 5 – Scheme Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Scheme Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={schemeDetails.schemeName}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            schemeDetails: {
                              ...prev.schemeDetails,
                              schemeName: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., National Rice Value Chain"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Scheme ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={schemeDetails.schemeId}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            schemeDetails: {
                              ...prev.schemeDetails,
                              schemeId: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., FS-AGRIC-2024-001"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 font-sans">
                          Enterprise Focus
                        </label>
                        <p className="text-xs text-gray-400 font-serif">
                          Select all enterprise categories that this fund scheme covers.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {enterpriseOptions.map(option => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-700 border border-primary-600 hover:border-accent-500 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={schemeDetails.enterprises.includes(option)}
                            onChange={() => toggleEnterpriseOption(option)}
                            className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                          />
                          <span className="text-sm text-gray-200 font-sans">{option}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                          Custom Enterprise (optional)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={schemeDetails.customEnterprise}
                            onChange={(e) =>
                              setCreateForm(prev => ({
                                ...prev,
                                schemeDetails: {
                                  ...prev.schemeDetails,
                                  customEnterprise: e.target.value
                                }
                              }))
                            }
                            placeholder="Enter enterprise type not listed above"
                            className="input-field flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomEnterprise}
                            className="btn-secondary sm:w-auto"
                          >
                            ➕ Add
                          </button>
                        </div>
                      </div>
                      {schemeDetails.enterprises.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {schemeDetails.enterprises.map(item => (
                            <span
                              key={item}
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-700 text-xs text-accent-400 border border-primary-600"
                            >
                              {item}
                              <button
                                type="button"
                                onClick={() => removeEnterprise(item)}
                                className="text-gray-400 hover:text-red-300"
                              >
                                ✖
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={schemeDetails.startDate}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            schemeDetails: {
                              ...prev.schemeDetails,
                              startDate: e.target.value
                            }
                          }))
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Application Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={schemeDetails.applicationDeadline}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            schemeDetails: {
                              ...prev.schemeDetails,
                              applicationDeadline: e.target.value
                            }
                          }))
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {createStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Step 2 of 5 – Location Designation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Location Type
                      </label>
                      <select
                        value={stateAllocation.locationType}
                        onChange={(e) => handleLocationTypeChange(e.target.value as LocationType)}
                        className="input-field"
                      >
                        <option value="state">State-Based</option>
                        <option value="lga">LGA-Based</option>
                        <option value="ward">Ward-Based</option>
                      </select>
                    </div>
                    <div className="p-3 rounded-md border border-primary-600 bg-primary-700/60 text-xs text-gray-300 font-serif leading-relaxed">
                      {stateAllocation.locationType === 'state' && (
                        <p>Select one or more states where this scheme will operate.</p>
                      )}
                      {stateAllocation.locationType === 'lga' && (
                        <p>Select states, then choose the Local Government Areas (LGAs) the scheme will cover.</p>
                      )}
                      {stateAllocation.locationType === 'ward' && (
                        <p>Select states, then LGAs, and finally the wards where the scheme will be implemented.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-200 font-sans">Select States</h4>
                        <p className="text-xs text-gray-400 font-serif">
                          {stateAllocation.locationType === 'state'
                            ? 'Choose the states eligible for this scheme. Use “Select All” for nationwide coverage.'
                            : 'Select the states to start configuring locations at the next level.'}
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-2 text-sm text-accent-400 font-sans cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stateAllocation.selectAllStates}
                          onChange={handleToggleSelectAllStates}
                          className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                        />
                        Select All States
                      </label>
                    </div>
                    <div className="max-h-48 overflow-y-auto border border-primary-600 rounded-md p-3 bg-primary-700">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {nigerianStates.map(state => (
                          <label key={state} className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={stateAllocation.selectedStates.includes(state)}
                              onChange={() => handleStateToggle(state)}
                              className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                            />
                            <span>{state}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-serif mt-2">
                      Selected States: {stateAllocation.selectedStates.length}
                    </p>
                  </div>

                  {stateAllocation.locationType !== 'state' && stateAllocation.selectedStates.length > 0 && (
                    <div className="space-y-5">
                      {stateAllocation.selectedStates.map(state => {
                        const lgas = Object.keys(nigeriaLocationHierarchy[state]?.lgas || {});
                        const hasLGAs = lgas.length > 0;
                        return (
                          <div key={state} className="border border-primary-600 rounded-lg bg-primary-700/50 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-accent-400 font-sans">{state}</h5>
                              <label className="inline-flex items-center gap-2 text-xs text-accent-300 font-sans cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={stateAllocation.selectAllLGAs[state] || false}
                                  onChange={() => handleToggleSelectAllLGAs(state)}
                                  className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                                  disabled={!hasLGAs}
                                />
                                Select All LGAs
                              </label>
                            </div>
                            {!hasLGAs ? (
                              <p className="text-xs text-gray-400 font-serif">
                                Detailed location data is unavailable for {state}. You may continue with other states.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {lgas.map(lga => (
                                    <label key={lga} className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={(stateAllocation.selectedLGAs[state] || []).includes(lga)}
                                        onChange={() => handleLGAToggle(state, lga)}
                                        className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                                      />
                                      <span>{lga}</span>
                                    </label>
                                  ))}
                                </div>

                                {stateAllocation.locationType === 'ward' &&
                                  (stateAllocation.selectedLGAs[state] || []).map(lga => {
                                    const wards = nigeriaLocationHierarchy[state]?.lgas?.[lga] || [];
                                    return (
                                      <div key={`${state}-${lga}`} className="ml-3 sm:ml-6 border border-primary-600 rounded-lg bg-primary-800/40 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-semibold text-accent-300 font-sans uppercase tracking-wide">{lga}</span>
                                          <label className="inline-flex items-center gap-2 text-xs text-accent-300 font-sans cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={stateAllocation.selectAllWards[state]?.[lga] || false}
                                              onChange={() => handleToggleSelectAllWards(state, lga)}
                                              className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                                              disabled={wards.length === 0}
                                            />
                                            Select All Wards
                                          </label>
                                        </div>
                                        {wards.length === 0 ? (
                                          <p className="text-xs text-gray-400 font-serif">
                                            No ward data available for {lga}.
                                          </p>
                                        ) : (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {wards.map(ward => (
                                              <label key={ward} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={(stateAllocation.selectedWards[state]?.[lga] || []).includes(ward)}
                                                  onChange={() => handleWardToggle(state, lga, ward)}
                                                  className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                                                />
                                                <span>{ward}</span>
                                              </label>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Allocation Type
                      </label>
                      <select
                        value={stateAllocation.allocationType}
                        onChange={(e) => handleAllocationTypeChange(e.target.value as 'equal' | 'custom')}
                        className="input-field"
                      >
                        <option value="equal">Equal Distribution</option>
                        <option value="custom">Custom Allocation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Target Beneficiaries
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={stateAllocation.beneficiariesPerLocation}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            stateAllocation: {
                              ...prev.stateAllocation,
                              beneficiariesPerLocation: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., 150"
                        className="input-field"
                      />
                    </div>
                  </div>

                  {stateAllocation.allocationType === 'custom' && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                          Amount per Location (optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={stateAllocation.amountPerLocation}
                          onChange={(e) =>
                            setCreateForm(prev => ({
                              ...prev,
                              stateAllocation: {
                                ...prev.stateAllocation,
                                amountPerLocation: e.target.value
                              }
                            }))
                          }
                          placeholder="Enter default amount allocation per location"
                          className="input-field"
                        />
                        <p className="text-xs text-gray-500 font-serif mt-1">
                          This value will pre-fill each selected location. You can override it individually below.
                        </p>
                      </div>
                      <div className="space-y-3">
                        {getSelectedLocationKeys().length === 0 ? (
                          <p className="text-sm text-gray-400 font-serif">
                            Select at least one location to configure custom allocations.
                          </p>
                        ) : (
                          getSelectedLocationKeys().map((key, index) => {
                            const label = getLocationLabels()[index] || key;
                            const allocation = stateAllocation.customAllocations[key] || { amount: '', beneficiaries: '' };
                            return (
                              <div key={key} className="rounded-lg border border-primary-600 bg-primary-700 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-semibold text-accent-400 font-sans">{label}</h5>
                                  <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">
                                    {key.split('|')[0]}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 font-sans">
                                      Amount (₦)
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={allocation.amount}
                                      onChange={(e) => handleCustomAllocationChange(key, 'amount', e.target.value)}
                                      placeholder={stateAllocation.amountPerLocation || 'e.g., 5000000'}
                                      className="input-field"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1 font-sans">
                                      Beneficiaries
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={allocation.beneficiaries}
                                      onChange={(e) => handleCustomAllocationChange(key, 'beneficiaries', e.target.value)}
                                      placeholder={stateAllocation.beneficiariesPerLocation || 'e.g., 120'}
                                      className="input-field"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                      Supporting Notes
                    </label>
                    <RichTextEditor
                      value={stateAllocation.notes || ''}
                      onChange={(value) =>
                        setCreateForm(prev => ({
                          ...prev,
                          stateAllocation: {
                            ...prev.stateAllocation,
                            notes: value
                          }
                        }))
                      }
                      rows={4}
                      placeholder="Provide any context for how the allocation should be administered."
                    />
                  </div>
                </div>
              )}

              {createStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Step 3 of 5 – Fund Allocation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Loan Amount (₦) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={fundAllocation.loanAmount}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            fundAllocation: {
                              ...prev.fundAllocation,
                              loanAmount: e.target.value
                            }
                          }))
                        }
                        placeholder="Enter total loan amount to disburse"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Loan Tenure <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          min="0"
                          value={fundAllocation.loanTenureValue}
                          onChange={(e) =>
                            setCreateForm(prev => ({
                              ...prev,
                              fundAllocation: {
                                ...prev.fundAllocation,
                                loanTenureValue: e.target.value
                              }
                            }))
                          }
                          placeholder="Duration"
                          className="input-field"
                        />
                        <select
                          value={fundAllocation.loanTenureUnit}
                          onChange={(e) =>
                            setCreateForm(prev => ({
                              ...prev,
                              fundAllocation: {
                                ...prev.fundAllocation,
                                loanTenureUnit: e.target.value as DurationUnit
                              }
                            }))
                          }
                          className="input-field"
                        >
                          {durationUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Deferment / Grace Period
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          min="0"
                          value={fundAllocation.defermentValue}
                          onChange={(e) =>
                            setCreateForm(prev => ({
                              ...prev,
                              fundAllocation: {
                                ...prev.fundAllocation,
                                defermentValue: e.target.value
                              }
                            }))
                          }
                          placeholder="Duration"
                          className="input-field"
                        />
                        <select
                          value={fundAllocation.defermentUnit}
                          onChange={(e) =>
                            setCreateForm(prev => ({
                              ...prev,
                              fundAllocation: {
                                ...prev.fundAllocation,
                                defermentUnit: e.target.value as DurationUnit
                              }
                            }))
                          }
                          className="input-field"
                        >
                          {durationUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Collateral Required?
                      </label>
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="inline-flex items-center gap-2 text-sm text-gray-200 font-sans cursor-pointer">
                            <input
                              type="radio"
                              value={option}
                              checked={fundAllocation.collateralRequired === option}
                              onChange={(e) =>
                                setCreateForm(prev => ({
                                  ...prev,
                                  fundAllocation: {
                                    ...prev.fundAllocation,
                                    collateralRequired: e.target.value as 'Yes' | 'No'
                                  }
                                }))
                              }
                              className="h-4 w-4 text-accent-500 border-primary-500 bg-primary-800"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        De-Risking Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={fundAllocation.deRiskingPercentage}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            fundAllocation: {
                              ...prev.fundAllocation,
                              deRiskingPercentage: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., 60"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        PFI’s Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={fundAllocation.pfiInterestRate}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            fundAllocation: {
                              ...prev.fundAllocation,
                              pfiInterestRate: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., 9"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                        Insurance Company’s Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={fundAllocation.insurancePercentage}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            fundAllocation: {
                              ...prev.fundAllocation,
                              insurancePercentage: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., 4"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              )}

              {createStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Step 4 of 5 – Beneficiaries</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                      Beneficiary Types <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-400 font-serif mb-3">
                      Choose the categories of stakeholders eligible to apply for this fund scheme.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {beneficiaryTypeOptions.map(option => (
                        <label
                          key={option}
                          className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary-700 border border-primary-600 hover:border-accent-500 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={beneficiarySection.types.includes(option)}
                            onChange={() => toggleBeneficiaryType(option)}
                            className="h-4 w-4 text-accent-500 rounded border-primary-500 bg-primary-800"
                          />
                          <span className="text-sm text-gray-200 font-sans">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300 font-sans">
                      Add Custom Beneficiary Type (optional)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={beneficiarySection.customType}
                        onChange={(e) =>
                          setCreateForm(prev => ({
                            ...prev,
                            beneficiaries: {
                              ...prev.beneficiaries,
                              customType: e.target.value
                            }
                          }))
                        }
                        placeholder="e.g., Agro-Input Suppliers"
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomBeneficiaryType}
                        className="btn-secondary sm:w-auto"
                      >
                        ➕ Add
                      </button>
                    </div>
                    {beneficiarySection.types.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {beneficiarySection.types.map(type => (
                          <span
                            key={type}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-700 text-xs text-accent-400 border border-primary-600"
                          >
                            {type}
                            <button
                              type="button"
                              onClick={() => toggleBeneficiaryType(type)}
                              className="text-gray-400 hover:text-red-300"
                            >
                              ✖
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                      Eligibility Criteria Notes
                    </label>
                    <RichTextEditor
                      value={beneficiarySection.eligibilityNotes || ''}
                      onChange={(value) =>
                        setCreateForm(prev => ({
                          ...prev,
                          beneficiaries: {
                            ...prev.beneficiaries,
                            eligibilityNotes: value
                          }
                        }))
                      }
                      rows={5}
                      placeholder="Outline any special conditions, prerequisites or documentation required from beneficiaries."
                    />
                  </div>
                </div>
              )}

              {createStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-100 font-sans">Step 5 of 5 – Documentations</h3>
                  <p className="text-sm text-gray-400 font-serif">
                    Upload and describe the supporting documents that will accompany this fund scheme.
                  </p>
                  <div className="space-y-4">
                    {documents.items.map((doc, index) => (
                      <div key={doc.id} className="border border-primary-600 rounded-lg bg-primary-700/60 p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/2">
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                              Upload Document
                            </label>
                            <input
                              type="file"
                              onChange={(e) => handleDocumentFileChange(index, e.target.files?.[0] || null)}
                              className="w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-accent-600 file:text-white hover:file:bg-accent-500 bg-primary-800 border border-primary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                            />
                            {doc.fileName && (
                              <p className="text-xs text-gray-400 font-serif mt-2">
                                Selected: {doc.fileName}
                              </p>
                            )}
                          </div>
                          <div className="md:w-1/2">
                            <label className="block text-sm font-medium text-gray-300 mb-2 font-sans">
                              Short Description
                            </label>
                            <RichTextEditor
                              value={doc.description || ''}
                              onChange={(value) => handleDocumentDescriptionChange(index, value)}
                              rows={4}
                              placeholder="Provide a short description or usage note for this document."
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          {documents.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDocumentField(index)}
                              className="btn-secondary w-full sm:w-auto"
                            >
                              ➖ Remove Document
                            </button>
                          )}
                          {index === documents.items.length - 1 && (
                            <button
                              type="button"
                              onClick={handleAddDocumentField}
                              className="btn-secondary w-full sm:w-auto"
                            >
                              ➕ Add Document
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-primary-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky bottom-0 bg-primary-800">
              <button onClick={closeCreateModal} className="btn-secondary w-full sm:w-auto">Cancel</button>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {createStep > 1 && (
                  <button onClick={handlePreviousStep} className="btn-secondary w-full sm:w-auto">
                    Previous
                  </button>
                )}
                {createStep < totalCreateSteps && (
                  <button onClick={handleNextStep} className="btn-primary w-full sm:w-auto">
                    Next
                  </button>
                )}
                {createStep === totalCreateSteps && (
                  <button onClick={handleCreateSubmit} className="btn-primary w-full sm:w-auto">
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl bg-primary-800 border border-primary-700 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
            <div>
              <h4 className="text-white font-semibold font-sans text-xl">Confirm Scheme Creation</h4>
              <p className="text-gray-400 text-sm mt-1">
                Review the information below before creating{' '}
                <strong className="text-gray-100 font-semibold">"{schemeDetails.schemeName || 'Untitled Scheme'}"</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-3 bg-primary-700/60 border border-primary-600 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-accent-300 uppercase tracking-wide">Scheme Overview</h5>
                <dl className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Scheme ID</dt>
                    <dd className="font-medium">{schemeDetails.schemeId || 'N/A'}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Loan Amount</dt>
                    <dd className="font-medium">{formattedLoanAmountDisplay}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Start Date</dt>
                    <dd className="font-medium">{formatDisplayDate(schemeDetails.startDate)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Application Deadline</dt>
                    <dd className="font-medium">{formatDisplayDate(schemeDetails.applicationDeadline)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Location Type</dt>
                    <dd className="font-medium">{locationTypeLabel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Locations Selected</dt>
                    <dd className="font-medium">
                      {selectedLocationCount} {selectedLocationCount === 1 ? 'location' : 'locations'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Allocation Type</dt>
                    <dd className="font-medium">{allocationTypeLabel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Target Beneficiaries</dt>
                    <dd className="font-medium">
                      {totalBeneficiaries > 0 ? totalBeneficiaries.toLocaleString() : 'Not specified'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-400">Beneficiaries / Location</dt>
                    <dd className="font-medium">
                      {stateAllocation.beneficiariesPerLocation
                        ? Number(stateAllocation.beneficiariesPerLocation).toLocaleString()
                        : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-3 bg-primary-700/40 border border-primary-600 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-accent-300 uppercase tracking-wide">Location Summary</h5>
                <div className="text-xs text-gray-300 space-y-2">
                  <div>
                    <span className="text-gray-400 block mb-1">Highlighted Locations</span>
                    <p className="leading-relaxed">
                      {locationPreviewList.length === 0 ? 'No locations selected yet.' : locationPreviewList.join(', ')}
                      {remainingLocationsCount > 0 && ` +${remainingLocationsCount} more`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Enterprises</span>
                    <p>{enterpriseSummary}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Supporting Notes</span>
                    <p className="whitespace-pre-wrap">{supportingNotesPreview}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-700/40 border border-primary-600 rounded-lg p-4 space-y-3">
              <h5 className="text-sm font-semibold text-accent-300 uppercase tracking-wide">
                Documentations ({requiredDocumentsCount})
              </h5>
              {requiredDocumentsCount === 0 ? (
                <p className="text-xs text-gray-400 font-serif">
                  No documents attached yet. You can add uploads or descriptions before submitting.
                </p>
              ) : (
                <div className="space-y-2">
                  {requiredDocuments.map((doc, index) => {
                    const plainDescription = doc.description
                      ? doc.description
                          .replace(/<u>(.*?)<\/u>/gi, '$1')
                          .replace(/\*\*(.*?)\*\*/g, '$1')
                          .replace(/\*(.*?)\*/g, '$1')
                          .replace(/<\/?[^>]+(>|$)/g, '')
                          .replace(/\s+/g, ' ')
                          .trim()
                      : '';
                    return (
                      <div
                        key={doc.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-300 bg-primary-800/60 border border-primary-600 rounded-md px-3 py-2"
                      >
                        <div className="font-medium text-gray-100">
                          {doc.fileName || `Document ${index + 1}`}
                        </div>
                        {plainDescription && (
                          <div className="md:text-right text-gray-400 whitespace-pre-wrap">
                            {plainDescription.length > 160 ? `${plainDescription.slice(0, 157)}…` : plainDescription}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => { setShowConfirmCreate(false); setShowCreateModal(true); setError(null); }}
                className="btn-secondary w-full sm:w-auto"
              >
                Edit
              </button>
              <button 
                onClick={handleConfirmCreate} 
                disabled={isCreating}
                className="px-6 py-2 rounded-md bg-accent-600 hover:bg-accent-500 text-white font-semibold font-sans disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Confirm & Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && schemeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-primary-800 border border-primary-700 rounded-lg shadow-xl p-6">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold font-sans text-red-400 mb-2">Warning: Permanent Deletion</h3>
              <p className="text-gray-300 text-sm mb-4">
                You are about to <strong className="text-red-400">permanently delete</strong> the scheme:
              </p>
              <p className="text-lg font-semibold text-white mb-4">"{schemeToDelete.name}"</p>
              <p className="text-red-400 text-sm font-medium mb-2">
                ⚠️ This action cannot be undone!
              </p>
              <p className="text-gray-400 text-xs">
                All data associated with this scheme will be permanently removed from the system.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSchemeToDelete(null);
                }}
                className="flex-1 px-4 py-2 rounded-md bg-primary-700 hover:bg-primary-600 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default FundSchemes;

