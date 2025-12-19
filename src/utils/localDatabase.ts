export type FundProviderStatus = 'unverified' | 'verified';

export interface FundProviderFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface FundProviderRecord {
  id: string;
  email: string;
  password: string;
  status: FundProviderStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: FundProviderFormData;
}

const FUND_PROVIDERS_KEY = 'afcf_fund_providers';
const USER_SESSION_KEY = 'user';

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse localStorage item', error);
    return fallback;
  }
};

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export const getFundProviders = (): FundProviderRecord[] => {
  if (!isBrowser) return [];
  return safeParse<FundProviderRecord[]>(localStorage.getItem(FUND_PROVIDERS_KEY), []);
};

const saveFundProviders = (records: FundProviderRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(FUND_PROVIDERS_KEY, JSON.stringify(records));
};

export const findFundProviderByEmail = (email: string): FundProviderRecord | undefined => {
  return getFundProviders().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findFundProviderById = (id: string): FundProviderRecord | undefined => {
  return getFundProviders().find((record) => record.id === id);
};

export const registerFundProvider = (
  payload: Omit<FundProviderRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): FundProviderRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findFundProviderByEmail(payload.email);
  if (existing) {
    throw new Error('A Fund Provider with this email already exists.');
  }

  const newRecord: FundProviderRecord = {
    ...payload,
    id: `fp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getFundProviders()];
  saveFundProviders(updated);
  return newRecord;
};

export const updateFundProviderRecord = (
  id: string,
  updates: Partial<Omit<FundProviderRecord, 'id'>>
): FundProviderRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getFundProviders();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('A Fund Provider with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: FundProviderRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveFundProviders(records);
  syncSessionWithFundProvider(updatedRecord);
  return updatedRecord;
};

export const updateFundProviderStatus = (
  id: string,
  status: FundProviderStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): FundProviderRecord | undefined => {
  const updates: Partial<FundProviderRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateFundProviderRecord(id, updates);
};

export const authenticateFundProvider = (email: string, password: string): FundProviderRecord | null => {
  const record = findFundProviderByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export interface StoredUserSession {
  id: string;
  email: string;
  role: 'Fund Provider' | 'Coordinating Agency' | 'Participating Bank (PFI)' | 'Insurance Company' | 'Anchor' | 'Lead Firm' | 'Producer/Farmer' | 'Cooperative Group' | 'Extension Organization' | 'Researcher/Student';
  status?: FundProviderStatus;
  registrationType?: 'individual' | 'company';
  organizationName?: string;
  fullName?: string;
  lastLogin?: string;
}

export const syncSessionWithFundProvider = (record: FundProviderRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Fund Provider') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status,
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildFundProviderSession = (record: FundProviderRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Fund Provider',
  status: record.status,
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildFundProviderApplicationData = (form: FundProviderFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocument: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step5: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation.length
      ? form.areasOfOperation.join(', ')
      : 'Not specified',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails || 'Not provided',
    organizationLogo: form.organizationLogoName || 'Not provided',
    certificateOfIncorporation: form.certificateOfIncorporationName || 'Not provided',
  },
});

export const clearFundProviders = () => {
  if (!isBrowser) return;
  localStorage.removeItem(FUND_PROVIDERS_KEY);
};

export const getActiveFundProviderRecord = (): FundProviderRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Fund Provider' || !session.id) return null;

  return findFundProviderById(session.id) || null;
};

export const getFundProviderStatusSnapshot = () => {
  const record = getActiveFundProviderRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

// Insurance Company Types and Interfaces
export type InsuranceCompanyStatus = 'unverified' | 'verified';

export interface InsuranceCompanyFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface InsuranceCompanyRecord {
  id: string;
  email: string;
  password: string;
  status: InsuranceCompanyStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: InsuranceCompanyFormData;
}

const INSURANCE_COMPANIES_KEY = 'afcf_insurance_companies';

export const getInsuranceCompanies = (): InsuranceCompanyRecord[] => {
  if (!isBrowser) return [];
  return safeParse<InsuranceCompanyRecord[]>(localStorage.getItem(INSURANCE_COMPANIES_KEY), []);
};

const saveInsuranceCompanies = (records: InsuranceCompanyRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(INSURANCE_COMPANIES_KEY, JSON.stringify(records));
};

export const findInsuranceCompanyByEmail = (email: string): InsuranceCompanyRecord | undefined => {
  return getInsuranceCompanies().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findInsuranceCompanyById = (id: string): InsuranceCompanyRecord | undefined => {
  return getInsuranceCompanies().find((record) => record.id === id);
};

export const registerInsuranceCompany = (
  payload: Omit<InsuranceCompanyRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): InsuranceCompanyRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findInsuranceCompanyByEmail(payload.email);
  if (existing) {
    throw new Error('An Insurance Company with this email already exists.');
  }

  const newRecord: InsuranceCompanyRecord = {
    ...payload,
    id: `ic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getInsuranceCompanies()];
  saveInsuranceCompanies(updated);
  return newRecord;
};

export const updateInsuranceCompanyRecord = (
  id: string,
  updates: Partial<Omit<InsuranceCompanyRecord, 'id'>>
): InsuranceCompanyRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getInsuranceCompanies();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('An Insurance Company with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: InsuranceCompanyRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveInsuranceCompanies(records);
  syncSessionWithInsuranceCompany(updatedRecord);
  return updatedRecord;
};

export const updateInsuranceCompanyStatus = (
  id: string,
  status: InsuranceCompanyStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): InsuranceCompanyRecord | undefined => {
  const updates: Partial<InsuranceCompanyRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateInsuranceCompanyRecord(id, updates);
};

export const authenticateInsuranceCompany = (email: string, password: string): InsuranceCompanyRecord | null => {
  const record = findInsuranceCompanyByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithInsuranceCompany = (record: InsuranceCompanyRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Insurance Company') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus, // Reusing the same status type
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildInsuranceCompanySession = (record: InsuranceCompanyRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Insurance Company',
  status: record.status as FundProviderStatus, // Reusing the same status type
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildInsuranceCompanyApplicationData = (form: InsuranceCompanyFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocument: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step5: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation.length
      ? form.areasOfOperation.join(', ')
      : 'Not specified',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails || 'Not provided',
    organizationLogo: form.organizationLogoName || 'Not provided',
    certificateOfIncorporation: form.certificateOfIncorporationName || 'Not provided',
  },
});

export const clearInsuranceCompanies = () => {
  if (!isBrowser) return;
  localStorage.removeItem(INSURANCE_COMPANIES_KEY);
};

export const getActiveInsuranceCompanyRecord = (): InsuranceCompanyRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Insurance Company' || !session.id) return null;

  return findInsuranceCompanyById(session.id) || null;
};

export const getInsuranceCompanyStatusSnapshot = () => {
  const record = getActiveInsuranceCompanyRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

// Cooperative Group Types and Interfaces
export type CooperativeGroupStatus = 'unverified' | 'verified';

export interface CooperativeGroupFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface CooperativeGroupRecord {
  id: string;
  email: string;
  password: string;
  status: CooperativeGroupStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: CooperativeGroupFormData;
}

const COOPERATIVE_GROUPS_KEY = 'afcf_cooperative_groups';

export const getCooperativeGroups = (): CooperativeGroupRecord[] => {
  if (!isBrowser) return [];
  return safeParse<CooperativeGroupRecord[]>(localStorage.getItem(COOPERATIVE_GROUPS_KEY), []);
};

const saveCooperativeGroups = (records: CooperativeGroupRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(COOPERATIVE_GROUPS_KEY, JSON.stringify(records));
};

export const findCooperativeGroupByEmail = (email: string): CooperativeGroupRecord | undefined => {
  return getCooperativeGroups().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findCooperativeGroupById = (id: string): CooperativeGroupRecord | undefined => {
  return getCooperativeGroups().find((record) => record.id === id);
};

export const registerCooperativeGroup = (
  payload: Omit<CooperativeGroupRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): CooperativeGroupRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findCooperativeGroupByEmail(payload.email);
  if (existing) {
    throw new Error('A Cooperative Group with this email already exists.');
  }

  const newRecord: CooperativeGroupRecord = {
    ...payload,
    id: `cg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getCooperativeGroups()];
  saveCooperativeGroups(updated);
  return newRecord;
};

export const updateCooperativeGroupRecord = (
  id: string,
  updates: Partial<Omit<CooperativeGroupRecord, 'id'>>
): CooperativeGroupRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getCooperativeGroups();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('A Cooperative Group with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: CooperativeGroupRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveCooperativeGroups(records);
  syncSessionWithCooperativeGroup(updatedRecord);
  return updatedRecord;
};

export const updateCooperativeGroupStatus = (
  id: string,
  status: CooperativeGroupStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): CooperativeGroupRecord | undefined => {
  const updates: Partial<CooperativeGroupRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateCooperativeGroupRecord(id, updates);
};

export const authenticateCooperativeGroup = (email: string, password: string): CooperativeGroupRecord | null => {
  const record = findCooperativeGroupByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithCooperativeGroup = (record: CooperativeGroupRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Cooperative Group') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildCooperativeGroupSession = (record: CooperativeGroupRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Cooperative Group',
  status: record.status, // CooperativeGroupStatus is the same as FundProviderStatus ('unverified' | 'verified')
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildCooperativeGroupApplicationData = (form: CooperativeGroupFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocument: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step5: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation.length
      ? form.areasOfOperation.join(', ')
      : 'Not specified',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails || 'Not provided',
    organizationLogo: form.organizationLogoName || 'Not provided',
    certificateOfIncorporation: form.certificateOfIncorporationName || 'Not provided',
  },
});

export const clearCooperativeGroups = () => {
  if (!isBrowser) return;
  localStorage.removeItem(COOPERATIVE_GROUPS_KEY);
};

export const getActiveCooperativeGroupRecord = (): CooperativeGroupRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Cooperative Group' || !session.id) return null;

  return findCooperativeGroupById(session.id) || null;
};

export const getCooperativeGroupStatusSnapshot = () => {
  const record = getActiveCooperativeGroupRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

// Extension Organization Types and Interfaces
export type ExtensionOrganizationStatus = 'unverified' | 'verified';

export interface ExtensionOrganizationFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface ExtensionOrganizationRecord {
  id: string;
  email: string;
  password: string;
  status: ExtensionOrganizationStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: ExtensionOrganizationFormData;
}

const EXTENSION_ORGANIZATIONS_KEY = 'afcf_extension_organizations';

export const getExtensionOrganizations = (): ExtensionOrganizationRecord[] => {
  if (!isBrowser) return [];
  return safeParse<ExtensionOrganizationRecord[]>(localStorage.getItem(EXTENSION_ORGANIZATIONS_KEY), []);
};

const saveExtensionOrganizations = (records: ExtensionOrganizationRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(EXTENSION_ORGANIZATIONS_KEY, JSON.stringify(records));
};

export const findExtensionOrganizationByEmail = (email: string): ExtensionOrganizationRecord | undefined => {
  return getExtensionOrganizations().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findExtensionOrganizationById = (id: string): ExtensionOrganizationRecord | undefined => {
  return getExtensionOrganizations().find((record) => record.id === id);
};

export const registerExtensionOrganization = (
  payload: Omit<ExtensionOrganizationRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): ExtensionOrganizationRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findExtensionOrganizationByEmail(payload.email);
  if (existing) {
    throw new Error('An Extension Organization with this email already exists.');
  }

  const newRecord: ExtensionOrganizationRecord = {
    ...payload,
    id: `eo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getExtensionOrganizations()];
  saveExtensionOrganizations(updated);
  return newRecord;
};

export const updateExtensionOrganizationRecord = (
  id: string,
  updates: Partial<Omit<ExtensionOrganizationRecord, 'id'>>
): ExtensionOrganizationRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getExtensionOrganizations();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('An Extension Organization with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: ExtensionOrganizationRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveExtensionOrganizations(records);
  syncSessionWithExtensionOrganization(updatedRecord);
  return updatedRecord;
};

export const updateExtensionOrganizationStatus = (
  id: string,
  status: ExtensionOrganizationStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): ExtensionOrganizationRecord | undefined => {
  const updates: Partial<ExtensionOrganizationRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateExtensionOrganizationRecord(id, updates);
};

export const authenticateExtensionOrganization = (email: string, password: string): ExtensionOrganizationRecord | null => {
  const record = findExtensionOrganizationByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithExtensionOrganization = (record: ExtensionOrganizationRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Extension Organization') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildExtensionOrganizationSession = (record: ExtensionOrganizationRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Extension Organization',
  status: record.status,
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildExtensionOrganizationApplicationData = (form: ExtensionOrganizationFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocumentName: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
  },
  step5: {
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step6: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation,
    organizationLogoName: form.organizationLogoName || 'Not provided',
    certificateOfIncorporationName: form.certificateOfIncorporationName || 'Not provided',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails,
  },
});

export const getActiveExtensionOrganizationRecord = (): ExtensionOrganizationRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Extension Organization' || !session.id) return null;

  return findExtensionOrganizationById(session.id) || null;
};

export const getExtensionOrganizationStatusSnapshot = () => {
  const record = getActiveExtensionOrganizationRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

export const clearExtensionOrganizations = () => {
  if (!isBrowser) return;
  localStorage.removeItem(EXTENSION_ORGANIZATIONS_KEY);
};

// PFI Types and Interfaces
export type PFIStatus = 'unverified' | 'verified';

export interface PFIFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface PFIRecord {
  id: string;
  email: string;
  password: string;
  status: PFIStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: PFIFormData;
}

const PFIS_KEY = 'afcf_pfis';

export const getPFIs = (): PFIRecord[] => {
  if (!isBrowser) return [];
  return safeParse<PFIRecord[]>(localStorage.getItem(PFIS_KEY), []);
};

const savePFIs = (records: PFIRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(PFIS_KEY, JSON.stringify(records));
};

export const findPFIByEmail = (email: string): PFIRecord | undefined => {
  return getPFIs().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findPFIById = (id: string): PFIRecord | undefined => {
  return getPFIs().find((record) => record.id === id);
};

export const registerPFI = (
  payload: Omit<PFIRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): PFIRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findPFIByEmail(payload.email);
  if (existing) {
    throw new Error('A PFI with this email already exists.');
  }

  const newRecord: PFIRecord = {
    ...payload,
    id: `pfi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getPFIs()];
  savePFIs(updated);
  return newRecord;
};

export const updatePFIRecord = (
  id: string,
  updates: Partial<Omit<PFIRecord, 'id'>>
): PFIRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getPFIs();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('A PFI with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: PFIRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  savePFIs(records);
  syncSessionWithPFI(updatedRecord);
  return updatedRecord;
};

export const updatePFIStatus = (
  id: string,
  status: PFIStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): PFIRecord | undefined => {
  const updates: Partial<PFIRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updatePFIRecord(id, updates);
};

export const authenticatePFI = (email: string, password: string): PFIRecord | null => {
  const record = findPFIByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithPFI = (record: PFIRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Participating Bank (PFI)') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildPFISession = (record: PFIRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Participating Bank (PFI)',
  status: record.status,
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildPFIApplicationData = (form: PFIFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocumentName: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
  },
  step5: {
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step6: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation,
    organizationLogoName: form.organizationLogoName || 'Not provided',
    certificateOfIncorporationName: form.certificateOfIncorporationName || 'Not provided',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails,
  },
});

export const getActivePFIRecord = (): PFIRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Participating Bank (PFI)' || !session.id) return null;

  return findPFIById(session.id) || null;
};

export const getPFIStatusSnapshot = () => {
  const record = getActivePFIRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

export const clearPFIs = () => {
  if (!isBrowser) return;
  localStorage.removeItem(PFIS_KEY);
};

// Anchor Types and Interfaces
export type AnchorStatus = 'unverified' | 'verified';

export interface AnchorFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface AnchorRecord {
  id: string;
  email: string;
  password: string;
  status: AnchorStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: AnchorFormData;
}

const ANCHORS_KEY = 'afcf_anchors';

export const getAnchors = (): AnchorRecord[] => {
  if (!isBrowser) return [];
  return safeParse<AnchorRecord[]>(localStorage.getItem(ANCHORS_KEY), []);
};

const saveAnchors = (records: AnchorRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(ANCHORS_KEY, JSON.stringify(records));
};

export const findAnchorByEmail = (email: string): AnchorRecord | undefined => {
  return getAnchors().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findAnchorById = (id: string): AnchorRecord | undefined => {
  return getAnchors().find((record) => record.id === id);
};

export const registerAnchor = (
  payload: Omit<AnchorRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): AnchorRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findAnchorByEmail(payload.email);
  if (existing) {
    throw new Error('An Anchor with this email already exists.');
  }

  const newRecord: AnchorRecord = {
    ...payload,
    id: `anchor_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getAnchors()];
  saveAnchors(updated);
  return newRecord;
};

export const updateAnchorRecord = (
  id: string,
  updates: Partial<Omit<AnchorRecord, 'id'>>
): AnchorRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getAnchors();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('An Anchor with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: AnchorRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveAnchors(records);
  syncSessionWithAnchor(updatedRecord);
  return updatedRecord;
};

export const updateAnchorStatus = (
  id: string,
  status: AnchorStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): AnchorRecord | undefined => {
  const updates: Partial<AnchorRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateAnchorRecord(id, updates);
};

export const authenticateAnchor = (email: string, password: string): AnchorRecord | null => {
  const record = findAnchorByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithAnchor = (record: AnchorRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Anchor') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildAnchorSession = (record: AnchorRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Anchor',
  status: record.status,
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildAnchorApplicationData = (form: AnchorFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocumentName: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
  },
  step5: {
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step6: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation,
    organizationLogoName: form.organizationLogoName || 'Not provided',
    certificateOfIncorporationName: form.certificateOfIncorporationName || 'Not provided',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails,
  },
});

export const getActiveAnchorRecord = (): AnchorRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Anchor' || !session.id) return null;

  return findAnchorById(session.id) || null;
};

export const getAnchorStatusSnapshot = () => {
  const record = getActiveAnchorRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

export const clearAnchors = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ANCHORS_KEY);
};

// Lead Firm Types and Interfaces
export type LeadFirmStatus = 'unverified' | 'verified';

export interface LeadFirmFormData {
  fullName: string;
  position: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  organizationName: string;
  registrationNumber: string;
  organizationType: string;
  yearEstablished: string;
  industry: string;
  missionStatement: string;
  headquartersAddress: string;
  hqCity: string;
  hqState: string;
  hqCountry: string;
  officePhone: string;
  officialEmail: string;
  website: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  numEmployees: string;
  areasOfOperation: string[];
  organizationLogoName?: string;
  certificateOfIncorporationName?: string;
  hasPartnership: string;
  partnershipDetails: string;
  password: string;
}

export interface LeadFirmRecord {
  id: string;
  email: string;
  password: string;
  status: LeadFirmStatus;
  rejectionReason?: string;
  registrationType: 'individual' | 'company';
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: LeadFirmFormData;
}

const LEAD_FIRMS_KEY = 'afcf_lead_firms';

export const getLeadFirms = (): LeadFirmRecord[] => {
  if (!isBrowser) return [];
  return safeParse<LeadFirmRecord[]>(localStorage.getItem(LEAD_FIRMS_KEY), []);
};

const saveLeadFirms = (records: LeadFirmRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(LEAD_FIRMS_KEY, JSON.stringify(records));
};

export const findLeadFirmByEmail = (email: string): LeadFirmRecord | undefined => {
  return getLeadFirms().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findLeadFirmById = (id: string): LeadFirmRecord | undefined => {
  return getLeadFirms().find((record) => record.id === id);
};

export const registerLeadFirm = (
  payload: Omit<LeadFirmRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): LeadFirmRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findLeadFirmByEmail(payload.email);
  if (existing) {
    throw new Error('A Lead Firm with this email already exists.');
  }

  const newRecord: LeadFirmRecord = {
    ...payload,
    id: `lf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getLeadFirms()];
  saveLeadFirms(updated);
  return newRecord;
};

export const updateLeadFirmRecord = (
  id: string,
  updates: Partial<Omit<LeadFirmRecord, 'id'>>
): LeadFirmRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getLeadFirms();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('A Lead Firm with this official email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: LeadFirmRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveLeadFirms(records);
  syncSessionWithLeadFirm(updatedRecord);
  return updatedRecord;
};

export const updateLeadFirmStatus = (
  id: string,
  status: LeadFirmStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): LeadFirmRecord | undefined => {
  const updates: Partial<LeadFirmRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateLeadFirmRecord(id, updates);
};

export const authenticateLeadFirm = (email: string, password: string): LeadFirmRecord | null => {
  const record = findLeadFirmByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithLeadFirm = (record: LeadFirmRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Lead Firm') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    registrationType: record.registrationType,
    organizationName: record.formData.organizationName,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildLeadFirmSession = (record: LeadFirmRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Lead Firm',
  status: record.status,
  registrationType: record.registrationType,
  organizationName: record.formData.organizationName,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildLeadFirmApplicationData = (form: LeadFirmFormData) => ({
  step1: {
    fullName: form.fullName,
    position: form.position,
    gender: form.gender,
    birthDate: form.birthDate,
  },
  step2: {
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step3: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocumentName: form.idDocumentName || 'Not provided',
    emergencyContactName: form.emergencyContactName,
    emergencyContactPhone: form.emergencyContactPhone,
    emergencyRelationship: form.emergencyRelationship,
  },
  step4: {
    organizationName: form.organizationName,
    registrationNumber: form.registrationNumber,
    organizationType: form.organizationType,
    yearEstablished: form.yearEstablished,
    industry: form.industry,
    missionStatement: form.missionStatement,
  },
  step5: {
    headquartersAddress: form.headquartersAddress,
    hqCity: form.hqCity,
    hqState: form.hqState,
    hqCountry: form.hqCountry,
    officePhone: form.officePhone,
    officialEmail: form.officialEmail,
    website: form.website,
    facebook: form.facebook || 'Not provided',
    linkedin: form.linkedin || 'Not provided',
    twitter: form.twitter || 'Not provided',
    instagram: form.instagram || 'Not provided',
  },
  step6: {
    numEmployees: form.numEmployees,
    areasOfOperation: form.areasOfOperation,
    organizationLogoName: form.organizationLogoName || 'Not provided',
    certificateOfIncorporationName: form.certificateOfIncorporationName || 'Not provided',
    hasPartnership: form.hasPartnership,
    partnershipDetails: form.partnershipDetails,
  },
});

export const getActiveLeadFirmRecord = (): LeadFirmRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Lead Firm' || !session.id) return null;

  return findLeadFirmById(session.id) || null;
};

export const getLeadFirmStatusSnapshot = () => {
  const record = getActiveLeadFirmRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

export const clearLeadFirms = () => {
  if (!isBrowser) return;
  localStorage.removeItem(LEAD_FIRMS_KEY);
};

// Researcher/Student Types and Interfaces
export type ResearcherStatus = 'unverified' | 'verified';

export interface ResearcherFormData {
  fullName: string;
  gender: string;
  birthDate: string;
  nationality: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  institutionName: string;
  faculty: string;
  currentLevel: string;
  studentResearcherId: string;
  yearOfEntry: string;
  expectedCompletionYear: string;
  areaOfStudy: string;
  researchTopic?: string;
  supervisorName?: string;
  supervisorEmail?: string;
  supportingDocumentName?: string;
  googleScholar?: string;
  researchGate?: string;
  linkedinProfile?: string;
  password: string;
}

export interface ResearcherRecord {
  id: string;
  email: string;
  password: string;
  status: ResearcherStatus;
  rejectionReason?: string;
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: ResearcherFormData;
}

const RESEARCHERS_KEY = 'afcf_researchers';

export const getResearchers = (): ResearcherRecord[] => {
  if (!isBrowser) return [];
  return safeParse<ResearcherRecord[]>(localStorage.getItem(RESEARCHERS_KEY), []);
};

const saveResearchers = (records: ResearcherRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(RESEARCHERS_KEY, JSON.stringify(records));
};

export const findResearcherByEmail = (email: string): ResearcherRecord | undefined => {
  return getResearchers().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findResearcherById = (id: string): ResearcherRecord | undefined => {
  return getResearchers().find((record) => record.id === id);
};

export const registerResearcher = (
  payload: Omit<ResearcherRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): ResearcherRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findResearcherByEmail(payload.email);
  if (existing) {
    throw new Error('A Researcher with this email already exists.');
  }

  const newRecord: ResearcherRecord = {
    ...payload,
    id: `researcher_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getResearchers()];
  saveResearchers(updated);
  return newRecord;
};

export const updateResearcherRecord = (
  id: string,
  updates: Partial<Omit<ResearcherRecord, 'id'>>
): ResearcherRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getResearchers();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('A Researcher with this email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: ResearcherRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveResearchers(records);
  syncSessionWithResearcher(updatedRecord);
  return updatedRecord;
};

export const updateResearcherStatus = (
  id: string,
  status: ResearcherStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): ResearcherRecord | undefined => {
  const updates: Partial<ResearcherRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateResearcherRecord(id, updates);
};

export const authenticateResearcher = (email: string, password: string): ResearcherRecord | null => {
  // Researcher/Student uses individual email (required) + password
  const record = findResearcherByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithResearcher = (record: ResearcherRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Researcher/Student') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildResearcherSession = (record: ResearcherRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Researcher/Student',
  status: record.status,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildResearcherApplicationData = (form: ResearcherFormData) => ({
  step1: {
    fullName: form.fullName,
    gender: form.gender,
    birthDate: form.birthDate,
    nationality: form.nationality,
    email: form.email,
    phone: form.phone,
    whatsapp: form.whatsapp || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
    idType: form.idType,
    idNumber: form.idNumber,
    idDocumentName: form.idDocumentName || 'Not provided',
  },
  step2: {
    institutionName: form.institutionName,
    faculty: form.faculty,
    currentLevel: form.currentLevel,
    studentResearcherId: form.studentResearcherId,
    yearOfEntry: form.yearOfEntry,
    expectedCompletionYear: form.expectedCompletionYear,
    areaOfStudy: form.areaOfStudy,
    researchTopic: form.researchTopic || 'Not provided',
    supervisorName: form.supervisorName || 'Not provided',
    supervisorEmail: form.supervisorEmail || 'Not provided',
    supportingDocumentName: form.supportingDocumentName || 'Not provided',
    googleScholar: form.googleScholar || 'Not provided',
    researchGate: form.researchGate || 'Not provided',
    linkedinProfile: form.linkedinProfile || 'Not provided',
  },
  step3: {
    password: '***',
  },
});

export const getActiveResearcherRecord = (): ResearcherRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Researcher/Student' || !session.id) return null;

  return findResearcherById(session.id) || null;
};

export const getResearcherStatusSnapshot = () => {
  const record = getActiveResearcherRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

export const clearResearchers = () => {
  if (!isBrowser) return;
  localStorage.removeItem(RESEARCHERS_KEY);
};

// Producer/Farmer Types and Interfaces
export type ProducerStatus = 'unverified' | 'verified';

export interface ProducerFormData {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  farmBusinessName: string;
  typeOfFarmer: string[];
  farmAddress: string;
  farmSize: string;
  yearsOfExperience: string;
  primarySourceOfIncome: string;
  farmerAssociation?: string;
  crops: string[];
  livestock: string[];
  hasProcessingValueAddition: string;
  processingValueAdditionDetails?: string;
  totalAnnualProduction: string;
  primaryMarket: string;
  majorBuyers?: string;
  challengesFaced?: string;
  idType: string;
  idNumber: string;
  idDocumentName?: string;
  farmImagesName?: string;
  certificationName?: string;
  preferredPaymentMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  password: string;
}

export interface ProducerRecord {
  id: string;
  email: string;
  password: string;
  status: ProducerStatus;
  rejectionReason?: string;
  lastSubmittedAt: string;
  lastReviewedAt?: string;
  pendingNotificationId?: string;
  formData: ProducerFormData;
}

const PRODUCERS_KEY = 'afcf_producers';

export const getProducers = (): ProducerRecord[] => {
  if (!isBrowser) return [];
  return safeParse<ProducerRecord[]>(localStorage.getItem(PRODUCERS_KEY), []);
};

const saveProducers = (records: ProducerRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(PRODUCERS_KEY, JSON.stringify(records));
};

export const findProducerByEmail = (email: string): ProducerRecord | undefined => {
  return getProducers().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findProducerByEmailOrPhone = (identifier: string): ProducerRecord | undefined => {
  // Producer/Farmer can login with either email or phone number
  // The record.email field contains either email or phone (whichever was provided during registration)
  // We check both record.email and record.formData.phone to handle all cases
  const normalized = identifier.toLowerCase().trim();
  return getProducers().find((record) => {
    const recordEmail = record.email.toLowerCase().trim();
    const recordPhone = record.formData.phone.toLowerCase().trim();
    return recordEmail === normalized || recordPhone === normalized;
  });
};

export const findProducerById = (id: string): ProducerRecord | undefined => {
  return getProducers().find((record) => record.id === id);
};

export const registerProducer = (
  payload: Omit<ProducerRecord, 'id' | 'status' | 'lastSubmittedAt' | 'lastReviewedAt' | 'pendingNotificationId' | 'rejectionReason'>
): ProducerRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findProducerByEmail(payload.email);
  if (existing) {
    throw new Error('A Producer with this email already exists.');
  }

  const newRecord: ProducerRecord = {
    ...payload,
    id: `producer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'unverified',
    lastSubmittedAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...getProducers()];
  saveProducers(updated);
  return newRecord;
};

export const updateProducerRecord = (
  id: string,
  updates: Partial<Omit<ProducerRecord, 'id'>>
): ProducerRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getProducers();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('A Producer with this email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: ProducerRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveProducers(records);
  syncSessionWithProducer(updatedRecord);
  return updatedRecord;
};

export const updateProducerStatus = (
  id: string,
  status: ProducerStatus,
  options?: { rejectionReason?: string; pendingNotificationId?: string | null }
): ProducerRecord | undefined => {
  const updates: Partial<ProducerRecord> = {
    status,
    lastReviewedAt: new Date().toISOString(),
  };

  if (options) {
    if (typeof options.rejectionReason !== 'undefined') {
      updates.rejectionReason = options.rejectionReason || undefined;
    }
    if (typeof options.pendingNotificationId !== 'undefined') {
      updates.pendingNotificationId = options.pendingNotificationId || undefined;
    }
  }

  return updateProducerRecord(id, updates);
};

export const authenticateProducer = (emailOrPhone: string, password: string): ProducerRecord | null => {
  // Producer/Farmer uses individual email or phone (since email is optional) + password
  const record = findProducerByEmailOrPhone(emailOrPhone);
  if (!record) return null;
  if (record.password !== password) return null;
  return record;
};

export const syncSessionWithProducer = (record: ProducerRecord) => {
  if (!isBrowser) return;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.id !== record.id || session.role !== 'Producer/Farmer') return;

  const updatedSession: StoredUserSession = {
    ...session,
    status: record.status as FundProviderStatus,
    fullName: record.formData.fullName,
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedSession));
};

export const buildProducerSession = (record: ProducerRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Producer/Farmer',
  status: record.status,
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

export const buildProducerApplicationData = (form: ProducerFormData) => ({
  step1: {
    fullName: form.fullName,
    gender: form.gender,
    birthDate: form.birthDate,
    phone: form.phone,
    email: form.email || 'Not provided',
    address: form.address,
    city: form.city,
    state: form.state,
    country: form.country,
  },
  step2: {
    farmBusinessName: form.farmBusinessName,
    typeOfFarmer: form.typeOfFarmer,
    farmAddress: form.farmAddress,
    farmSize: form.farmSize,
    yearsOfExperience: form.yearsOfExperience,
    primarySourceOfIncome: form.primarySourceOfIncome,
    farmerAssociation: form.farmerAssociation || 'Not provided',
  },
  step3: {
    crops: form.crops,
    livestock: form.livestock,
    hasProcessingValueAddition: form.hasProcessingValueAddition,
    processingValueAdditionDetails: form.processingValueAdditionDetails || 'Not provided',
  },
  step4: {
    totalAnnualProduction: form.totalAnnualProduction,
    primaryMarket: form.primaryMarket,
    majorBuyers: form.majorBuyers || 'Not provided',
    challengesFaced: form.challengesFaced || 'Not provided',
  },
  step5: {
    idType: form.idType,
    idNumber: form.idNumber,
    idDocumentName: form.idDocumentName || 'Not provided',
    farmImagesName: form.farmImagesName || 'Not provided',
    certificationName: form.certificationName || 'Not provided',
  },
  step6: {
    preferredPaymentMethod: form.preferredPaymentMethod,
    bankName: form.bankName,
    accountName: form.accountName,
    accountNumber: form.accountNumber,
  },
  step7: {
    password: '***',
  },
});

export const getActiveProducerRecord = (): ProducerRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem(USER_SESSION_KEY);
  if (!rawSession) return null;

  const session = safeParse<StoredUserSession | null>(rawSession, null);
  if (!session || session.role !== 'Producer/Farmer' || !session.id) return null;

  return findProducerById(session.id) || null;
};

export const getProducerStatusSnapshot = () => {
  const record = getActiveProducerRecord();
  if (!record) return null;

  return {
    record,
    status: record.status,
    rejectionReason: record.rejectionReason || null,
  };
};

export const clearProducers = () => {
  if (!isBrowser) return;
  localStorage.removeItem(PRODUCERS_KEY);
};

// ==================== M&E Team Types and Interfaces ====================

export type MEMemberStatus = 'active' | 'inactive' | 'suspended';

export interface MEMemberFormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  state: string;
  lga: string;
  address: string;
  qualification: string;
  yearsOfExperience: string;
  specialization: string;
  profileImage?: string;
}

export interface MEMemberRecord {
  id: string;
  email: string;
  password: string;
  status: MEMemberStatus;
  createdAt: string;
  lastActiveAt?: string;
  createdBy: string; // CA user ID
  assignedProjectsCount: number;
  completedProjectsCount: number;
  formData: MEMemberFormData;
}

export type MEProjectStatus = 'pending' | 'in-progress' | 'evaluation-complete' | 'archived';
export type MEProjectType = 'registration' | 'scheme-application' | 'incident-report';
export type MERecommendation = 'approve' | 'reject' | 'pending';

export interface MEProjectAttachment {
  id: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface MEEvaluationReport {
  id: string;
  projectId: string;
  evaluatorId: string;
  evaluatorName: string;
  findings: string;
  recommendation: MERecommendation;
  recommendationReason: string;
  additionalNotes?: string;
  evidenceAttachments?: MEProjectAttachment[];
  submittedAt: string;
  reviewedByCA?: boolean;
  caReviewedAt?: string;
  caReviewNotes?: string;
  isLeadMEReport?: boolean;          // True if submitted by Lead M&E
}

export interface MEProject {
  id: string;
  name: string;
  description?: string;
  projectType: MEProjectType;
  status: MEProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Source reference
  sourceType: 'producer' | 'anchor' | 'lead-firm' | 'cooperative' | 'pfi' | 'insurance' | 'extension' | 'researcher';
  sourceId: string; // ID of the user/entity being evaluated
  sourceName: string;
  sourceEmail?: string;
  sourcePhone?: string;

  // Related data
  schemeId?: string;
  schemeName?: string;
  notificationId?: string;

  // Attached user submission data
  submissionData: Record<string, any>;
  attachments: MEProjectAttachment[];

  // Assignment
  assignedMemberIds: string[];
  assignedMemberNames: string[];

  // Lead M&E designation
  leadMEMemberId?: string;           // ID of the designated Lead M&E
  leadMEMemberName?: string;         // Name of the designated Lead M&E
  leadMEAssignedAt?: string;         // Timestamp when Lead M&E was assigned
  leadMEAssignedBy?: string;         // CA user who assigned the Lead M&E

  // Timestamps
  createdAt: string;
  createdBy: string;
  dueDate?: string;
  startedAt?: string;
  completedAt?: string;

  // Evaluation reports from assigned members
  evaluationReports: MEEvaluationReport[];

  // Final CA decision after reviewing M&E reports
  caDecision?: 'approved' | 'rejected' | 'pending-review';
  caDecisionAt?: string;
  caDecisionNotes?: string;
}

const ME_MEMBERS_KEY = 'afcf_me_members';
const ME_PROJECTS_KEY = 'afcf_me_projects';

// ==================== M&E Member Functions ====================

export const getMEMembers = (): MEMemberRecord[] => {
  if (!isBrowser) return [];
  return safeParse<MEMemberRecord[]>(localStorage.getItem(ME_MEMBERS_KEY), []);
};

const saveMEMembers = (records: MEMemberRecord[]) => {
  if (!isBrowser) return;
  localStorage.setItem(ME_MEMBERS_KEY, JSON.stringify(records));
};

export const findMEMemberByEmail = (email: string): MEMemberRecord | undefined => {
  return getMEMembers().find((record) => record.email.toLowerCase() === email.toLowerCase());
};

export const findMEMemberById = (id: string): MEMemberRecord | undefined => {
  return getMEMembers().find((record) => record.id === id);
};

export const registerMEMember = (
  payload: Omit<MEMemberRecord, 'id' | 'createdAt' | 'assignedProjectsCount' | 'completedProjectsCount'>
): MEMemberRecord => {
  if (!isBrowser) {
    throw new Error('Registration is only supported in a browser environment.');
  }

  const existing = findMEMemberByEmail(payload.email);
  if (existing) {
    throw new Error('An M&E Team Member with this email already exists.');
  }

  const newRecord: MEMemberRecord = {
    ...payload,
    id: `me_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    assignedProjectsCount: 0,
    completedProjectsCount: 0,
  };

  const updated = [newRecord, ...getMEMembers()];
  saveMEMembers(updated);
  return newRecord;
};

export const updateMEMemberRecord = (
  id: string,
  updates: Partial<Omit<MEMemberRecord, 'id'>>
): MEMemberRecord | undefined => {
  if (!isBrowser) return undefined;
  const records = getMEMembers();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;

  if (updates.email) {
    const normalizedEmail = updates.email.trim().toLowerCase();
    const duplicate = records.find(
      (record) => record.id !== id && record.email.toLowerCase() === normalizedEmail
    );
    if (duplicate) {
      throw new Error('An M&E Team Member with this email already exists.');
    }
    updates.email = updates.email.trim();
  }

  const updatedRecord: MEMemberRecord = {
    ...records[index],
    ...updates,
    formData: {
      ...records[index].formData,
      ...(updates.formData || {}),
    },
  };

  records[index] = updatedRecord;
  saveMEMembers(records);
  return updatedRecord;
};

export const updateMEMemberStatus = (
  id: string,
  status: MEMemberStatus
): MEMemberRecord | undefined => {
  return updateMEMemberRecord(id, { status, lastActiveAt: new Date().toISOString() });
};

export const authenticateMEMember = (email: string, password: string): MEMemberRecord | null => {
  const record = findMEMemberByEmail(email);
  if (!record) return null;
  if (record.password !== password) return null;
  if (record.status !== 'active') return null;
  return record;
};

export const deleteMEMember = (id: string): boolean => {
  if (!isBrowser) return false;
  const records = getMEMembers();
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return false;

  records.splice(index, 1);
  saveMEMembers(records);
  return true;
};

export const clearMEMembers = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ME_MEMBERS_KEY);
};

export const buildMEMemberSession = (record: MEMemberRecord): StoredUserSession => ({
  id: record.id,
  email: record.email,
  role: 'Coordinating Agency', // M&E members access through CA portal but with limited permissions
  status: record.status === 'active' ? 'verified' : 'unverified',
  fullName: record.formData.fullName,
  lastLogin: new Date().toISOString(),
});

// ==================== M&E Project Functions ====================

export const getMEProjects = (): MEProject[] => {
  if (!isBrowser) return [];
  return safeParse<MEProject[]>(localStorage.getItem(ME_PROJECTS_KEY), []);
};

const saveMEProjects = (projects: MEProject[]) => {
  if (!isBrowser) return;
  localStorage.setItem(ME_PROJECTS_KEY, JSON.stringify(projects));
};

export const findMEProjectById = (id: string): MEProject | undefined => {
  return getMEProjects().find((project) => project.id === id);
};

export const getMEProjectsByMemberId = (memberId: string): MEProject[] => {
  return getMEProjects().filter((project) => project.assignedMemberIds.includes(memberId));
};

export const getMEProjectsByStatus = (status: MEProjectStatus): MEProject[] => {
  return getMEProjects().filter((project) => project.status === status);
};

export const createMEProject = (
  payload: Omit<MEProject, 'id' | 'createdAt' | 'evaluationReports'>
): MEProject => {
  if (!isBrowser) {
    throw new Error('Project creation is only supported in a browser environment.');
  }

  const newProject: MEProject = {
    ...payload,
    id: `mep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    evaluationReports: [],
  };

  const updated = [newProject, ...getMEProjects()];
  saveMEProjects(updated);

  // Update assigned member counts
  payload.assignedMemberIds.forEach((memberId) => {
    const member = findMEMemberById(memberId);
    if (member) {
      updateMEMemberRecord(memberId, {
        assignedProjectsCount: member.assignedProjectsCount + 1,
      });
    }
  });

  return newProject;
};

export const updateMEProject = (
  id: string,
  updates: Partial<Omit<MEProject, 'id' | 'createdAt'>>
): MEProject | undefined => {
  if (!isBrowser) return undefined;
  const projects = getMEProjects();
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return undefined;

  const updatedProject: MEProject = {
    ...projects[index],
    ...updates,
  };

  projects[index] = updatedProject;
  saveMEProjects(projects);
  return updatedProject;
};

export const updateMEProjectStatus = (
  id: string,
  status: MEProjectStatus
): MEProject | undefined => {
  const updates: Partial<MEProject> = { status };

  if (status === 'in-progress' && !findMEProjectById(id)?.startedAt) {
    updates.startedAt = new Date().toISOString();
  }

  if (status === 'evaluation-complete' || status === 'archived') {
    updates.completedAt = new Date().toISOString();

    // Update completed count for all assigned members
    const project = findMEProjectById(id);
    if (project && status === 'evaluation-complete') {
      project.assignedMemberIds.forEach((memberId) => {
        const member = findMEMemberById(memberId);
        if (member) {
          updateMEMemberRecord(memberId, {
            completedProjectsCount: member.completedProjectsCount + 1,
          });
        }
      });
    }
  }

  return updateMEProject(id, updates);
};

export const addMEProjectAttachment = (
  projectId: string,
  attachment: Omit<MEProjectAttachment, 'id' | 'uploadedAt'>
): MEProject | undefined => {
  const project = findMEProjectById(projectId);
  if (!project) return undefined;

  const newAttachment: MEProjectAttachment = {
    ...attachment,
    id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    uploadedAt: new Date().toISOString(),
  };

  return updateMEProject(projectId, {
    attachments: [...project.attachments, newAttachment],
  });
};

export const submitMEEvaluationReport = (
  projectId: string,
  report: Omit<MEEvaluationReport, 'id' | 'projectId' | 'submittedAt' | 'isLeadMEReport'>
): MEProject | undefined => {
  const project = findMEProjectById(projectId);
  if (!project) return undefined;

  // Check if the evaluator is the Lead M&E for this project
  const isLeadME = project.leadMEMemberId === report.evaluatorId;

  const newReport: MEEvaluationReport = {
    ...report,
    id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    projectId,
    submittedAt: new Date().toISOString(),
    isLeadMEReport: isLeadME,  // Automatically flag if submitted by Lead M&E
  };

  // Check if this evaluator already submitted a report
  const existingReportIndex = project.evaluationReports.findIndex(
    (r) => r.evaluatorId === report.evaluatorId
  );

  let updatedReports: MEEvaluationReport[];
  if (existingReportIndex >= 0) {
    // Replace existing report
    updatedReports = [...project.evaluationReports];
    updatedReports[existingReportIndex] = newReport;
  } else {
    updatedReports = [...project.evaluationReports, newReport];
  }

  // Check if all assigned members have submitted their reports
  const allReportsSubmitted = project.assignedMemberIds.every((memberId) =>
    updatedReports.some((r) => r.evaluatorId === memberId)
  );

  return updateMEProject(projectId, {
    evaluationReports: updatedReports,
    status: allReportsSubmitted ? 'evaluation-complete' : 'in-progress',
    completedAt: allReportsSubmitted ? new Date().toISOString() : project.completedAt,
  });
};

export const setCADecisionOnMEProject = (
  projectId: string,
  decision: 'approved' | 'rejected' | 'pending-review',
  notes?: string
): MEProject | undefined => {
  return updateMEProject(projectId, {
    caDecision: decision,
    caDecisionAt: new Date().toISOString(),
    caDecisionNotes: notes,
    status: 'archived',
  });
};

export const deleteMEProject = (id: string): boolean => {
  if (!isBrowser) return false;
  const projects = getMEProjects();
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) return false;

  projects.splice(index, 1);
  saveMEProjects(projects);
  return true;
};

export const clearMEProjects = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ME_PROJECTS_KEY);
};

// ==================== Lead M&E Management Functions ====================

/**
 * Assign a Lead M&E to a project
 * The Lead M&E must be one of the already assigned members
 */
export const assignLeadMEToProject = (
  projectId: string,
  leadMEMemberId: string,
  assignedBy: string
): MEProject | undefined => {
  const project = findMEProjectById(projectId);
  if (!project) return undefined;

  // Validate that the Lead M&E is one of the assigned members
  if (!project.assignedMemberIds.includes(leadMEMemberId)) {
    throw new Error('Lead M&E must be one of the assigned members for this project.');
  }

  // Get the Lead M&E member name
  const memberIndex = project.assignedMemberIds.indexOf(leadMEMemberId);
  const leadMEMemberName = project.assignedMemberNames[memberIndex];

  return updateMEProject(projectId, {
    leadMEMemberId,
    leadMEMemberName,
    leadMEAssignedAt: new Date().toISOString(),
    leadMEAssignedBy: assignedBy,
  });
};

/**
 * Remove Lead M&E designation from a project
 */
export const removeLeadMEFromProject = (
  projectId: string
): MEProject | undefined => {
  return updateMEProject(projectId, {
    leadMEMemberId: undefined,
    leadMEMemberName: undefined,
    leadMEAssignedAt: undefined,
    leadMEAssignedBy: undefined,
  });
};

/**
 * Check if a specific M&E member is the Lead M&E for a project
 */
export const isLeadMEForProject = (
  projectId: string,
  memberId: string
): boolean => {
  const project = findMEProjectById(projectId);
  if (!project) return false;
  return project.leadMEMemberId === memberId;
};

// Get active M&E member from session
export const getActiveMEMemberRecord = (): MEMemberRecord | null => {
  if (!isBrowser) return null;
  const rawSession = localStorage.getItem('me_member_session');
  if (!rawSession) return null;

  const session = safeParse<{ id: string } | null>(rawSession, null);
  if (!session || !session.id) return null;

  return findMEMemberById(session.id) || null;
};

// Save M&E member session
export const saveMEMemberSession = (member: MEMemberRecord) => {
  if (!isBrowser) return;
  localStorage.setItem('me_member_session', JSON.stringify({
    id: member.id,
    email: member.email,
    fullName: member.formData.fullName,
    lastLogin: new Date().toISOString(),
  }));
};

// Clear M&E member session
export const clearMEMemberSession = () => {
  if (!isBrowser) return;
  localStorage.removeItem('me_member_session');
};