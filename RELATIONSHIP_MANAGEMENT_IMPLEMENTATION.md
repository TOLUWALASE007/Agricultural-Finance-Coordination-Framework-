# Producer/Farmer and Anchor Relationship Management System - Implementation Plan

## Overview
This document outlines the implementation of a comprehensive relationship management system between Coordinating Agency (CA), Anchors, and Producers/Farmers.

## Core Relationship Rules
- Anchors can have 0 or more producers/farmers under them
- Producers/Farmers can join 0 or more anchors (many-to-many relationship)
- All relationship actions generate system notifications
- CA oversees and approves all relationship changes
- M&E team verifies creation and leave requests

## Database Schema Updates

### 1. Anchor-Producer Relationship Table
```typescript
interface AnchorProducerRelationship {
  id: string;
  anchorId: string;
  producerId: string;
  status: 'pending' | 'active' | 'terminated' | 'rejected' | 'invitation-sent' | 'invitation-declined';
  createdBy: 'anchor' | 'producer' | 'ca';
  createdAt: string;
  approvedAt?: string;
  terminatedAt?: string;
  rejectionReason?: string;
  terminationReason?: string;
  meProjectId?: string; // For verification
  pendingNotificationId?: string;
}
```

### 2. Producer Creation Request
```typescript
interface ProducerCreationRequest {
  id: string;
  anchorId: string;
  requestedProducerData: Partial<ProducerFormData>;
  status: 'pending-ca' | 'pending-me' | 'approved' | 'rejected';
  meProjectId?: string;
  meReportId?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}
```

### 3. Producer Leave Request
```typescript
interface ProducerLeaveRequest {
  id: string;
  producerId: string;
  anchorId: string;
  relationshipId: string;
  reason: string;
  status: 'pending-ca' | 'pending-me' | 'approved' | 'rejected';
  meProjectId?: string;
  meReportId?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}
```

## Implementation Phases

### Phase 1: Database Layer (localDatabase.ts)
- Add relationship management functions
- Add creation request functions
- Add leave request functions
- Add helper functions for querying relationships

### Phase 2: Anchor Portal Updates
- Add "Producer/Farmer Management" sidebar section
- Create "Create New Producer/Farmer" page
- Create "Invite Existing Producers/Farmers" page
- Create "Manage Current Producers/Farmers" page
- Create "View Join Requests" page
- Create "Producer/Farmer Activity Logs" page

### Phase 3: Producer Portal Updates
- Add "Anchor Relationships" sidebar section
- Create "View Current Anchors" page
- Create "Accept/Decline Invitations" page
- Create "Request to Leave Anchor" page
- Create "Anchor Communication" page
- Create "Relationship History" page

### Phase 4: CA Portal Updates
- Add review pages for:
  - Producer creation requests
  - Anchor invitation requests
  - Producer leave requests
- Integrate M&E project creation for verifications
- Add approval/rejection workflows

### Phase 5: Notification System Updates
- Extend NotificationContext for relationship-specific metadata
- Add notification types for all workflows
- Implement notification routing

### Phase 6: M&E Integration
- Create M&E project templates for:
  - Producer creation verification
  - Producer leave verification
- Add M&E report submission handling
- Link M&E reports to CA decisions

## User Workflows

### Workflow 1: Anchor Creates New Producer/Farmer
1. Anchor fills creation form → Notification to CA
2. CA reviews → Creates M&E project
3. M&E team verifies → Submits report to CA
4. CA approves/rejects based on M&E report
5. If approved: Producer created + relationship established
6. If rejected: Anchor notified with reason

### Workflow 2: Anchor Invites Existing Producer/Farmer
1. Anchor selects producers → Notification to CA
2. CA approves/rejects invitation request
3. If approved: Invitations sent to producers
4. Producer accepts/declines → Notification to CA
5. CA final approval (if producer accepted)
6. Relationship established or declined

### Workflow 3: Producer Leaves Anchor
1. Producer submits leave request → Notification to CA
2. CA initiates M&E verification
3. M&E team verifies → Submits report
4. CA approves/rejects based on M&E report
5. If approved: Relationship terminated, both parties notified
6. If rejected: Producer notified with reason

## File Structure
```
src/
├── utils/
│   └── localDatabase.ts (updated with relationship functions)
├── context/
│   └── NotificationContext.tsx (extended with relationship metadata)
├── pages/portals/
│   ├── Anchor/
│   │   ├── ProducerManagement/
│   │   │   ├── CreateProducer.tsx
│   │   │   ├── InviteProducers.tsx
│   │   │   ├── ManageProducers.tsx
│   │   │   ├── JoinRequests.tsx
│   │   │   └── ActivityLogs.tsx
│   │   └── AnchorPortal.tsx (updated sidebar)
│   ├── Producer/
│   │   ├── AnchorRelationships/
│   │   │   ├── CurrentAnchors.tsx
│   │   │   ├── Invitations.tsx
│   │   │   ├── LeaveRequest.tsx
│   │   │   ├── Communication.tsx
│   │   │   └── History.tsx
│   │   └── ProducerPortal.tsx (updated sidebar)
│   └── CoordinatingAgency/
│       ├── Relationships/
│       │   ├── ProducerCreationRequests.tsx
│       │   ├── InvitationRequests.tsx
│       │   └── LeaveRequests.tsx
│       └── CoordinatingAgencyPortal.tsx (updated)
```

## Next Steps
1. Implement database layer functions
2. Create UI components for Anchor portal
3. Create UI components for Producer portal
4. Create CA review pages
5. Integrate notification system
6. Test end-to-end workflows
