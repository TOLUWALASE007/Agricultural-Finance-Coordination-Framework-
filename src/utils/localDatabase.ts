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
