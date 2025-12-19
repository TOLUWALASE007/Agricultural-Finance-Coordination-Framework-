// Anchor-Producer Relationship Management System

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function safeParse<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export type RelationshipStatus =
    | 'pending-ca-approval'      // Waiting for CA to approve invitation
    | 'invitation-sent'          // CA approved, invitation sent to producer
    | 'invitation-declined'      // Producer declined the invitation
    | 'active'                   // Relationship is active
    | 'pending-termination'      // Producer requested to leave, pending CA/M&E
    | 'terminated'               // Relationship has ended
    | 'rejected';                // CA rejected the relationship request

export type CreationRequestStatus =
    | 'pending-ca'               // Waiting for CA initial review
    | 'pending-me'               // CA approved, M&E verification in progress
    | 'approved'                 // M&E verified, producer created
    | 'rejected';                // CA or M&E rejected

export type LeaveRequestStatus =
    | 'pending-ca'               // Waiting for CA initial review
    | 'pending-me'               // CA approved, M&E verification in progress
    | 'approved'                 // M&E verified, leave approved
    | 'rejected';                // CA or M&E rejected

export interface AnchorProducerRelationship {
    id: string;
    anchorId: string;
    producerId: string;
    status: RelationshipStatus;
    createdBy: 'anchor' | 'producer' | 'ca';
    createdAt: string;
    approvedAt?: string;
    terminatedAt?: string;
    rejectionReason?: string;
    terminationReason?: string;
    meProjectId?: string;
    pendingNotificationId?: string;
    invitationSentAt?: string;
    invitationDeclinedAt?: string;
}

export interface ProducerCreationRequest {
    id: string;
    anchorId: string;
    anchorName: string;
    requestedProducerData: {
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
        preferredPaymentMethod: string;
        bankName: string;
        accountName: string;
        accountNumber: string;
    };
    status: CreationRequestStatus;
    meProjectId?: string;
    meReportId?: string;
    rejectionReason?: string;
    createdAt: string;
    reviewedAt?: string;
    caNotificationId?: string;
    anchorNotificationId?: string;
    createdProducerId?: string; // Set when approved
}

export interface ProducerLeaveRequest {
    id: string;
    producerId: string;
    producerName: string;
    anchorId: string;
    anchorName: string;
    relationshipId: string;
    reason: string;
    status: LeaveRequestStatus;
    meProjectId?: string;
    meReportId?: string;
    rejectionReason?: string;
    createdAt: string;
    reviewedAt?: string;
    caNotificationId?: string;
    producerNotificationId?: string;
    anchorNotificationId?: string;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const RELATIONSHIPS_KEY = 'afcf_anchor_producer_relationships';
const CREATION_REQUESTS_KEY = 'afcf_producer_creation_requests';
const LEAVE_REQUESTS_KEY = 'afcf_producer_leave_requests';

// ============================================================================
// RELATIONSHIP MANAGEMENT FUNCTIONS
// ============================================================================

export const getRelationships = (): AnchorProducerRelationship[] => {
    if (!isBrowser) return [];
    return safeParse<AnchorProducerRelationship[]>(localStorage.getItem(RELATIONSHIPS_KEY), []);
};

const saveRelationships = (relationships: AnchorProducerRelationship[]) => {
    if (!isBrowser) return;
    localStorage.setItem(RELATIONSHIPS_KEY, JSON.stringify(relationships));
};

export const findRelationshipById = (id: string): AnchorProducerRelationship | undefined => {
    return getRelationships().find(r => r.id === id);
};

export const findRelationshipByAnchorAndProducer = (
    anchorId: string,
    producerId: string
): AnchorProducerRelationship | undefined => {
    return getRelationships().find(
        r => r.anchorId === anchorId && r.producerId === producerId
    );
};

export const getRelationshipsByAnchor = (anchorId: string): AnchorProducerRelationship[] => {
    return getRelationships().filter(r => r.anchorId === anchorId);
};

export const getRelationshipsByProducer = (producerId: string): AnchorProducerRelationship[] => {
    return getRelationships().filter(r => r.producerId === producerId);
};

export const getActiveRelationshipsByAnchor = (anchorId: string): AnchorProducerRelationship[] => {
    return getRelationships().filter(r => r.anchorId === anchorId && r.status === 'active');
};

export const getActiveRelationshipsByProducer = (producerId: string): AnchorProducerRelationship[] => {
    return getRelationships().filter(r => r.producerId === producerId && r.status === 'active');
};

export const createRelationship = (
    data: Omit<AnchorProducerRelationship, 'id' | 'createdAt'>
): AnchorProducerRelationship => {
    if (!isBrowser) {
        throw new Error('Relationship creation is only supported in a browser environment.');
    }

    const newRelationship: AnchorProducerRelationship = {
        ...data,
        id: `rel_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
    };

    const relationships = getRelationships();
    relationships.unshift(newRelationship);
    saveRelationships(relationships);

    return newRelationship;
};

export const updateRelationship = (
    id: string,
    updates: Partial<Omit<AnchorProducerRelationship, 'id' | 'createdAt'>>
): AnchorProducerRelationship | undefined => {
    if (!isBrowser) return undefined;

    const relationships = getRelationships();
    const index = relationships.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const updatedRelationship: AnchorProducerRelationship = {
        ...relationships[index],
        ...updates,
    };

    relationships[index] = updatedRelationship;
    saveRelationships(relationships);

    return updatedRelationship;
};

export const deleteRelationship = (id: string): boolean => {
    if (!isBrowser) return false;

    const relationships = getRelationships();
    const index = relationships.findIndex(r => r.id === id);
    if (index === -1) return false;

    relationships.splice(index, 1);
    saveRelationships(relationships);

    return true;
};

export const clearRelationships = () => {
    if (!isBrowser) return;
    localStorage.removeItem(RELATIONSHIPS_KEY);
};

// ============================================================================
// PRODUCER CREATION REQUEST FUNCTIONS
// ============================================================================

export const getCreationRequests = (): ProducerCreationRequest[] => {
    if (!isBrowser) return [];
    return safeParse<ProducerCreationRequest[]>(localStorage.getItem(CREATION_REQUESTS_KEY), []);
};

const saveCreationRequests = (requests: ProducerCreationRequest[]) => {
    if (!isBrowser) return;
    localStorage.setItem(CREATION_REQUESTS_KEY, JSON.stringify(requests));
};

export const findCreationRequestById = (id: string): ProducerCreationRequest | undefined => {
    return getCreationRequests().find(r => r.id === id);
};

export const getCreationRequestsByAnchor = (anchorId: string): ProducerCreationRequest[] => {
    return getCreationRequests().filter(r => r.anchorId === anchorId);
};

export const getPendingCreationRequests = (): ProducerCreationRequest[] => {
    return getCreationRequests().filter(r => r.status === 'pending-ca' || r.status === 'pending-me');
};

export const createCreationRequest = (
    data: Omit<ProducerCreationRequest, 'id' | 'createdAt' | 'status'>
): ProducerCreationRequest => {
    if (!isBrowser) {
        throw new Error('Creation request is only supported in a browser environment.');
    }

    const newRequest: ProducerCreationRequest = {
        ...data,
        id: `pcr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        status: 'pending-ca',
        createdAt: new Date().toISOString(),
    };

    const requests = getCreationRequests();
    requests.unshift(newRequest);
    saveCreationRequests(requests);

    return newRequest;
};

export const updateCreationRequest = (
    id: string,
    updates: Partial<Omit<ProducerCreationRequest, 'id' | 'createdAt'>>
): ProducerCreationRequest | undefined => {
    if (!isBrowser) return undefined;

    const requests = getCreationRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const updatedRequest: ProducerCreationRequest = {
        ...requests[index],
        ...updates,
    };

    requests[index] = updatedRequest;
    saveCreationRequests(requests);

    return updatedRequest;
};

export const deleteCreationRequest = (id: string): boolean => {
    if (!isBrowser) return false;

    const requests = getCreationRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return false;

    requests.splice(index, 1);
    saveCreationRequests(requests);

    return true;
};

export const clearCreationRequests = () => {
    if (!isBrowser) return;
    localStorage.removeItem(CREATION_REQUESTS_KEY);
};

// ============================================================================
// PRODUCER LEAVE REQUEST FUNCTIONS
// ============================================================================

export const getLeaveRequests = (): ProducerLeaveRequest[] => {
    if (!isBrowser) return [];
    return safeParse<ProducerLeaveRequest[]>(localStorage.getItem(LEAVE_REQUESTS_KEY), []);
};

const saveLeaveRequests = (requests: ProducerLeaveRequest[]) => {
    if (!isBrowser) return;
    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(requests));
};

export const findLeaveRequestById = (id: string): ProducerLeaveRequest | undefined => {
    return getLeaveRequests().find(r => r.id === id);
};

export const getLeaveRequestsByProducer = (producerId: string): ProducerLeaveRequest[] => {
    return getLeaveRequests().filter(r => r.producerId === producerId);
};

export const getLeaveRequestsByAnchor = (anchorId: string): ProducerLeaveRequest[] => {
    return getLeaveRequests().filter(r => r.anchorId === anchorId);
};

export const getPendingLeaveRequests = (): ProducerLeaveRequest[] => {
    return getLeaveRequests().filter(r => r.status === 'pending-ca' || r.status === 'pending-me');
};

export const createLeaveRequest = (
    data: Omit<ProducerLeaveRequest, 'id' | 'createdAt' | 'status'>
): ProducerLeaveRequest => {
    if (!isBrowser) {
        throw new Error('Leave request is only supported in a browser environment.');
    }

    const newRequest: ProducerLeaveRequest = {
        ...data,
        id: `plr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        status: 'pending-ca',
        createdAt: new Date().toISOString(),
    };

    const requests = getLeaveRequests();
    requests.unshift(newRequest);
    saveLeaveRequests(requests);

    return newRequest;
};

export const updateLeaveRequest = (
    id: string,
    updates: Partial<Omit<ProducerLeaveRequest, 'id' | 'createdAt'>>
): ProducerLeaveRequest | undefined => {
    if (!isBrowser) return undefined;

    const requests = getLeaveRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    const updatedRequest: ProducerLeaveRequest = {
        ...requests[index],
        ...updates,
    };

    requests[index] = updatedRequest;
    saveLeaveRequests(requests);

    return updatedRequest;
};

export const deleteLeaveRequest = (id: string): boolean => {
    if (!isBrowser) return false;

    const requests = getLeaveRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return false;

    requests.splice(index, 1);
    saveLeaveRequests(requests);

    return true;
};

export const clearLeaveRequests = () => {
    if (!isBrowser) return;
    localStorage.removeItem(LEAVE_REQUESTS_KEY);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const hasActiveRelationship = (anchorId: string, producerId: string): boolean => {
    const relationship = findRelationshipByAnchorAndProducer(anchorId, producerId);
    return relationship?.status === 'active';
};

export const hasPendingInvitation = (anchorId: string, producerId: string): boolean => {
    const relationship = findRelationshipByAnchorAndProducer(anchorId, producerId);
    return relationship?.status === 'invitation-sent' || relationship?.status === 'pending-ca-approval';
};

export const getProducerCountForAnchor = (anchorId: string): number => {
    return getActiveRelationshipsByAnchor(anchorId).length;
};

export const getAnchorCountForProducer = (producerId: string): number => {
    return getActiveRelationshipsByProducer(producerId).length;
};
