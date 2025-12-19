# USER REGISTRATION AND FINAL APPROVAL FLOW

## Overview
This document outlines the complete registration and approval process for all user types in the Agricultural Finance Coordination Framework (AFCF) system. The system uses a two-status model: **unverified** and **verified**, with the Coordinating Agency (CA) responsible for final approval. An optional M&E (Monitoring & Evaluation) verification step may be included.

---

## Complete Registration Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION & APPROVAL FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: USER REGISTRATION                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  USER (Fund Provider, Insurance Company, Anchor, etc.)                       │
│   │                                                                           │
│   ├─► Visit Registration Page                                               │
│   ├─► Select Role                                                           │
│   ├─► Fill Multi-Step Form (3-6 steps depending on role)                   │
│   ├─► Upload Required Documents                                             │
│   └─► Submit Application                                                    │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Create User Record                                                    │
│   │    • Status: 'unverified'                                                │
│   │    • ID: Generated with role prefix                                      │
│   │    • Timestamp: Recorded                                                 │
│   └─► Save to Database                                                      │
│                                                                               │
│  USER CAN NOW LOGIN (Limited Access)                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: CA INITIAL REVIEW                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Navigate to Applicants Section                                        │
│   ├─► View Registration Application                                         │
│   ├─► Review Submitted Documents                                            │
│   └─► Decide: M&E Verification Needed?                                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                     │                                │
                     │                                │
         ┌───────────┴──────────┐        ┌───────────┴──────────┐
         │                      │        │                      │
         ▼                      │        ▼                      │
    YES (M&E Required)          │   NO (Direct Approval)        │
         │                      │        │                      │
         │                      │        │                      │
┌────────┴──────────────────────┴────────┴──────────────────────┴─────────────┐
│  OPTION A: WITH M&E VERIFICATION       │  OPTION B: DIRECT CA DECISION       │
├────────────────────────────────────────┼─────────────────────────────────────┤
│                                        │                                     │
│  STEP 3A: CA CREATES M&E PROJECT       │  STEP 3B: CA MAKES DECISION         │
│                                        │                                     │
│  CA:                                   │  CA:                                │
│   ├─► Click "Create M&E Project"      │   ├─► Click "Approve" or "Reject"  │
│   ├─► Assign M&E Member                │   ├─► Enter remarks/reason         │
│   ├─► Set Priority                     │   └─► Confirm decision              │
│   └─► Submit                           │                                     │
│                                        │  SYSTEM:                            │
│  SYSTEM:                               │   ├─► Update status to 'verified'  │
│   ├─► Create M&E Project               │   │    or keep 'unverified'         │
│   ├─► Notify M&E Member                │   ├─► Send notification to user    │
│   └─► Status: unverified (M&E pending)│   └─► Grant/Deny full access        │
│                                        │                                     │
│  ─────────────────────────────────     │  PROCESS COMPLETE                   │
│                                        │  Duration: 1-2 days                 │
│  STEP 4A: M&E VERIFICATION             │                                     │
│                                        │                                     │
│  M&E MEMBER:                           │                                     │
│   ├─► Login to M&E Portal              │                                     │
│   ├─► View Assigned Project            │                                     │
│   ├─► Review Documents                 │                                     │
│   ├─► Conduct Verification:            │                                     │
│   │    • Document review                │                                     │
│   │    • Data validation                │                                     │
│   │    • Physical verification          │                                     │
│   │    • Background checks              │                                     │
│   │    • Compliance assessment          │                                     │
│   ├─► Document Findings                │                                     │
│   ├─► Upload Evidence                  │                                     │
│   └─► Submit Evaluation Report         │                                     │
│        • Recommendation: Approve/Reject│                                     │
│                                        │                                     │
│  SYSTEM:                               │                                     │
│   └─► Notify CA (M&E Report Ready)    │                                     │
│                                        │                                     │
│  M&E Duration: 3-7 days                │                                     │
│                                        │                                     │
│  ─────────────────────────────────     │                                     │
│                                        │                                     │
│  STEP 5A: CA REVIEWS M&E REPORT        │                                     │
│                                        │                                     │
│  CA:                                   │                                     │
│   ├─► View M&E Evaluation Report       │                                     │
│   ├─► Review Findings & Evidence       │                                     │
│   ├─► Consider M&E Recommendation      │                                     │
│   └─► Make Final Decision              │                                     │
│                                        │                                     │
│  ─────────────────────────────────     │                                     │
│                                        │                                     │
│  STEP 6A: CA FINAL DECISION            │                                     │
│                                        │                                     │
│  CA:                                   │                                     │
│   ├─► Click "Approve" or "Reject"      │                                     │
│   ├─► Enter remarks                    │                                     │
│   └─► Confirm decision                 │                                     │
│                                        │                                     │
│  SYSTEM:                               │                                     │
│   ├─► Update status to 'verified'      │                                     │
│   │    or keep 'unverified'             │                                     │
│   ├─► Send notification to user        │                                     │
│   └─► Grant/Deny full access           │                                     │
│                                        │                                     │
│  PROCESS COMPLETE                      │                                     │
│  Total Duration: 5-7 days              │                                     │
│                                        │                                     │
└────────────────────────────────────────┴─────────────────────────────────────┘
                     │                                │
                     │                                │
                     └────────────┬───────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FINAL RESULT                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  APPROVED (Status: verified)           │  REJECTED (Status: unverified)     │
│   • User has full portal access        │   • User has limited access         │
│   • Can submit scheme applications     │   • Can view rejection reason       │
│   • Can perform role-specific actions  │   • Can update profile & resubmit   │
│   • Receives approval notification     │   • Receives rejection notification │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## User Types and Registration Paths

### 1. **Fund Provider (PFI - Participating Financial Institution)**
- **Registration Type**: Individual or Company
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Official Email + Password

### 2. **Insurance Company**
- **Registration Type**: Individual or Company
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Official Email + Password

### 3. **Anchor**
- **Registration Type**: Individual or Company
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Official Email + Password

### 4. **Lead Firm**
- **Registration Type**: Company only
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Official Email + Password

### 5. **Producer/Farmer**
- **Registration Type**: Individual only
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Email or Phone + Password

### 6. **Cooperative Group**
- **Registration Type**: Company only
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Official Email + Password

### 7. **Extension Organization**
- **Registration Type**: Company only
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Official Email + Password

### 8. **Researcher/Student**
- **Registration Type**: Individual only
- **Initial Status**: `unverified`
- **Final Approver**: Coordinating Agency
- **Login Credentials**: Email + Password

---

## Registration Flow (All User Types)

### Step 1: User Registration
```
User visits Registration Page → Selects Role → Fills Multi-Step Form → Submits Application
```

#### Registration Form Steps (varies by role):

**For Individual Registration (3 Steps):**
1. **Personal Details**: Name, Position, Gender, Date of Birth
2. **Contact Information**: Email, Phone, Address, City, State, Country
3. **Verification & Emergency**: ID Type, ID Number, ID Document, Emergency Contact

**For Company Registration (4-6 Steps):**
1. **Personal Details** (Contact Person)
2. **Contact Information** (Contact Person)
3. **Verification & Emergency** (Contact Person)
4. **Basic Information**: Organization Name, Registration Number, Type, Year Established, Industry, Mission
5. **Address & Contact Info**: HQ Address, Office Phone, Official Email, Website, Social Media
6. **Operations & Documentation**: Employees, Areas of Operation, Logo, Certificate, Partnerships
7. **Security & Terms**: Password, Confirmation, Agreement Checkbox

### Step 2: Record Creation
```javascript
// Example for Fund Provider
const newRecord = {
  id: `fp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  email: payload.email,
  password: payload.password,
  status: 'unverified', // Initial status
  registrationType: 'individual' | 'company',
  lastSubmittedAt: new Date().toISOString(),
  formData: { /* all form fields */ }
}
```

**Key Points:**
- Unique ID generated with role prefix (e.g., `fp_`, `ic_`, `producer_`, `anchor_`)
- Status automatically set to `unverified`
- Timestamp recorded for submission tracking
- All form data preserved in `formData` object

### Step 3: Post-Registration
```
Record Saved to the Database → User Can Login → Limited Access Until Verified
```

**User Experience While Unverified:**
- [YES] Can log into their portal
- [YES] Can view their registration status
- [YES] Can see rejection reasons (if rejected)
- [NO] Cannot access full portal features
- [NO] Cannot submit scheme applications
- [NO] Cannot perform role-specific actions

---

## M&E (Monitoring & Evaluation) Verification Flow

**IMPORTANT:** Before the Coordinating Agency makes a final approval decision, user registrations may undergo M&E verification to ensure authenticity and compliance.

### When M&E Verification is Required

M&E verification is typically required for:
- **High-value registrations**: Organizations with significant operational scope
- **Complex applications**: Applications with extensive documentation
- **Risk assessment**: Applications flagged for additional verification
- **Policy compliance**: As determined by CA policy

### Step 1: CA Creates M&E Project

After a user submits their registration:

```
User Registers → Record Created (status: unverified) → CA Reviews → CA Creates M&E Project
```

**CA Actions:**
1. Navigate to appropriate Applicants section (Fund Provider, Insurance Company, Anchor, etc.)
2. Review the registration application
3. Click "Create M&E Project" button
4. M&E Project Modal opens with pre-filled data:
   - **Project Title**: Auto-generated (e.g., "Registration Verification - [Organization Name]")
   - **Project Type**: "registration"
   - **Source Type**: User role (e.g., "fund-provider", "insurance-company", "anchor")
   - **Source ID**: User's unique ID
   - **Description**: Auto-filled with registration summary
5. CA completes the form:
   - Assign M&E Member (select from dropdown)
   - Set Priority (Low/Medium/High/Urgent)
   - Add additional notes or instructions
6. Click "Create Project"

**M&E Project Structure:**
```javascript
{
  id: 'me_project_123456',
  name: 'Registration Verification - Green Valley Agro Industries',
  projectType: 'registration',
  status: 'pending', // Changes to 'in-progress' → 'evaluation-complete'
  priority: 'medium',
  
  // Source reference
  sourceType: 'fund-provider',
  sourceId: 'fp_1702704751234_abc123',
  sourceName: 'Green Valley Agro Industries Limited',
  sourceEmail: 'info@greenvalleyagro.com',
  
  // Submission data for verification
  submissionData: { /* Full registration form data */ },
  attachments: [ /* Uploaded documents */ ],
  
  // Assignment
  assignedMemberIds: ['me_member_789'],
  assignedMemberNames: ['Sarah Johnson'],
  
  // Timestamps
  createdAt: '2024-12-16T04:32:31Z',
  createdBy: 'ca_user_456',
  dueDate: '2024-12-23T23:59:59Z',
  
  // Evaluation reports (submitted by M&E members)
  evaluationReports: [],
  
  // Final CA decision (after reviewing M&E reports)
  caDecision: 'pending-review' // or 'approved' or 'rejected'
}
```

### Step 2: M&E Member Conducts Verification

**M&E Member Portal Access:**
```
M&E Member Logs In → My Projects → View Assigned Project
```

**Verification Process:**

1. **Document Review**
   - Review all submitted registration documents
   - Verify ID documents (National ID, Driver's License, etc.)
   - Check Certificate of Incorporation/Registration
   - Validate organization logo and branding
   - Review partnership documentation

2. **Data Validation**
   - Verify organization name and registration number
   - Confirm contact information (phone, email, address)
   - Validate areas of operation
   - Check year established and industry sector
   - Verify employee count and organizational structure

3. **Physical Verification** (if required)
   - Visit organization headquarters
   - Interview contact person
   - Verify physical address
   - Take photos of premises
   - Collect additional evidence

4. **Background Checks**
   - Verify registration with CAC (Corporate Affairs Commission)
   - Check for any legal issues or violations
   - Verify partnerships and affiliations
   - Confirm industry credentials
   - Check references

5. **Compliance Assessment**
   - Ensure all required fields are completed
   - Verify document authenticity
   - Check for policy compliance
   - Assess risk factors
   - Identify any red flags

**Typical M&E Verification Checklist:**
```
[DONE] Identity/Organization verified
[DONE] Registration documents validated
[DONE] Contact information confirmed
[DONE] Physical address verified (if applicable)
[DONE] Background checks completed
[DONE] No compliance issues found
[DONE] All documents authentic
[DONE] Risk assessment completed
[DONE] Evidence collected and documented
```

### Step 3: M&E Member Submits Evaluation Report

After completing verification, the M&E member submits a detailed evaluation report:

**Evaluation Report Structure:**
```javascript
{
  id: 'eval_report_456',
  projectId: 'me_project_123456',
  evaluatorId: 'me_member_789',
  evaluatorName: 'Sarah Johnson',
  
  // Verification findings
  findings: 'All documents verified. Organization is legitimate. Physical address confirmed. No compliance issues found.',
  
  // Recommendation
  recommendation: 'approve', // or 'reject' or 'pending'
  recommendationReason: 'All verification checks passed successfully.',
  
  // Additional notes
  additionalNotes: 'Organization has strong partnerships with Federal Ministry of Agriculture.',
  
  // Evidence
  evidenceAttachments: [
    {
      id: 'att_001',
      fileName: 'premises_photo.jpg',
      fileType: 'image/jpeg',
      description: 'Photo of organization headquarters',
      uploadedAt: '2024-12-18T10:30:00Z'
    },
    {
      id: 'att_002',
      fileName: 'cac_verification.pdf',
      fileType: 'application/pdf',
      description: 'CAC registration verification',
      uploadedAt: '2024-12-18T11:00:00Z'
    }
  ],
  
  submittedAt: '2024-12-18T14:00:00Z',
  reviewedByCA: false
}
```

**M&E Recommendations:**
- **Approve**: All verification checks passed, recommend approval
- **Reject**: Verification failed, recommend rejection with reasons
- **Pending**: Additional information needed before making recommendation

**Typical M&E Duration:** 3-7 business days

### Step 4: CA Reviews M&E Report

After M&E submits the evaluation report:

```
M&E Submits Report → CA Receives Notification → CA Reviews M&E Report → CA Makes Final Decision
```

**CA Review Process:**
1. Navigate to M&E Projects or Applicants section
2. View M&E evaluation report:
   - M&E recommendation (Approve/Reject)
   - Detailed findings
   - Evidence and attachments
   - Risk assessment
   - Any issues or concerns
3. Review all evidence collected by M&E
4. Consider M&E recommendation
5. Make final approval decision

**CA Decision Options:**
- **Accept M&E Recommendation**: Approve or reject based on M&E findings
- **Override M&E Recommendation**: Make different decision with justification
- **Request Additional Verification**: Send back to M&E for more investigation

---

## Coordinating Agency Final Approval Flow

### Step 1: CA Portal Access
The Coordinating Agency accesses the **Applicants** section in their portal, which includes:

1. **Fund Provider Applicants**
2. **Insurance Company Applicants**
3. **Anchor Applicants**
4. **Lead Firm Applicants**
5. **Producer/Farmer Applicants**
6. **Cooperative Group Applicants**
7. **Extension Organization Applicants**
8. **Researcher/Student Applicants**

### Step 2: Review Interface
Each applicant section contains three main cards:

#### Card 1: **Approve Access**
- **Purpose**: Review and approve/reject new registrations
- **Displays**: All applicants (with badge showing pending count)
- **Features**:
  - Search functionality
  - State filter
  - Bulk selection
  - Individual review
  - Status badges (Pending/Approved)

#### Card 2: **Restrict Access**
- **Purpose**: Revoke access for previously approved users
- **Displays**: Only verified/approved users
- **Features**:
  - Search functionality
  - State filter
  - Bulk selection
  - Individual restriction
  - Reason requirement

#### Card 3: **Approval Rights Card**
- **Purpose**: Manage scheme application approvals (separate from registration)
- **Displays**: Users who submitted scheme applications
- **Note**: This is for scheme approvals, not registration approvals

### Step 3: Application Review Process

```
CA Clicks "Review & Approve" → Modal Opens → CA Reviews Full Application
```

**Review Modal Contains:**
1. **Applicant Summary**: Name, Email, Phone, Organization, State
2. **Full Application View**: All submitted data organized by sections
3. **Document Access**: View uploaded documents (ID, Certificates, Logo)
4. **Decision Options**: Approve or Reject
5. **Remarks Field**: Required for rejection, optional for approval

**Application Data Sections:**
- **Contact Info**
  - Personal Details
  - Contact Information
  - Verification & Emergency
- **Organization Info** (for company registrations)
  - Basic Information
  - Address & Contact Info
  - Operations & Documentation

### Step 4: Decision Making

#### Option A: Approval
```javascript
// CA selects "Approve"
updateFundProviderStatus(userId, 'verified', {
  rejectionReason: undefined,
  pendingNotificationId: null,
  lastReviewedAt: new Date().toISOString()
})

// Notification sent to user
addNotification({
  role: 'Coordinating Agency',
  targetRole: 'fund-provider',
  message: 'Your registration has been approved. You now have full access.',
  metadata: {
    type: 'fundProviderRegistrationResponse',
    fundProviderId: userId
  }
})
```

**Approval Workflow:**
1. CA clicks "Approve"
2. Confirmation dialog appears
3. CA confirms approval
4. Status updated to `verified`
5. `lastReviewedAt` timestamp recorded
6. Notification sent to user
7. User gains full portal access

#### Option B: Rejection
```javascript
// CA selects "Reject" and provides reason
updateFundProviderStatus(userId, 'unverified', {
  rejectionReason: 'Incomplete documentation. Please upload valid CAC certificate.',
  pendingNotificationId: null,
  lastReviewedAt: new Date().toISOString()
})

// Notification sent to user
addNotification({
  role: 'Coordinating Agency',
  targetRole: 'fund-provider',
  message: 'Your registration has been rejected due to Incomplete documentation. Please upload valid CAC certificate. Please update your details and resubmit for approval.',
  metadata: {
    type: 'fundProviderRegistrationResponse',
    fundProviderId: userId
  }
})
```

**Rejection Workflow:**
1. CA clicks "Reject"
2. CA enters rejection reason (required)
3. Confirmation dialog appears
4. CA confirms rejection
5. Status remains `unverified`
6. `rejectionReason` stored in record
7. `lastReviewedAt` timestamp recorded
8. Notification sent to user with reason
9. User can update profile and resubmit

### Step 5: Bulk Actions
CA can select multiple applicants and:
- **Mass Approve**: Approve all selected applications at once
- **Mass Restrict**: Restrict access for multiple verified users

---

## Access Restriction Flow (Post-Approval)

### When to Restrict Access
- Policy violations
- Suspicious activity
- Compliance issues
- User request
- Administrative reasons

### Restriction Process
```
CA navigates to "Restrict Access" Card → Selects Verified User → Clicks "Restrict Access"
```

**Restriction Workflow:**
```javascript
// CA restricts a verified user
updateFundProviderStatus(userId, 'unverified', {
  rejectionReason: 'Violation of platform policies',
  pendingNotificationId: null,
  lastReviewedAt: new Date().toISOString()
})

// Notification sent
addNotification({
  role: 'Coordinating Agency',
  targetRole: 'fund-provider',
  message: 'Your access has been restricted. Reason: Violation of platform policies',
  metadata: {
    type: 'fundProviderRegistrationResponse',
    fundProviderId: userId
  }
})
```

**Effects of Restriction:**
- Status changed from `verified` to `unverified`
- User loses full portal access
- Restriction reason stored
- User notified with reason
- User can appeal or reapply

---

## User Status States

### Status: `unverified`
**Meaning**: Registration submitted but not yet approved, or access has been restricted

**User Capabilities:**
- [YES] Login to portal
- [YES] View registration status
- [YES] View rejection/restriction reason
- [YES] Update profile information
- [YES] Resubmit for approval
- [NO] Submit scheme applications
- [NO] Access full portal features
- [NO] Perform role-specific actions

**Display:**
- Badge: Yellow "Pending" or Red "Restricted"
- Message: "Your registration is pending approval" or "Your access has been restricted"

### Status: `verified`
**Meaning**: Registration approved by Coordinating Agency

**User Capabilities:**
- [YES] Full portal access
- [YES] Submit scheme applications
- [YES] Perform all role-specific actions
- [YES] Receive notifications
- [YES] Participate in framework activities

**Display:**
- Badge: Green "Approved" or "Verified"
- Message: "Your registration has been approved"

---

## Notification System

### Notification Types
1. **Registration Response**: Approval or rejection notification
2. **Access Restriction**: Notification when access is restricted
3. **Scheme Application**: Separate from registration (handled differently)

### Notification Flow
```
CA Makes Decision → Notification Created → Stored in NotificationContext → 
User Sees Notification in Portal → User Can Click to View Details
```

### Notification Structure
```javascript
{
  id: 'unique_id',
  role: 'Coordinating Agency',
  targetRole: 'fund-provider', // or 'insurance-company', 'anchor', etc.
  message: 'Your registration has been approved...',
  timestamp: '2024-12-16T04:32:31Z',
  read: false,
  metadata: {
    type: 'fundProviderRegistrationResponse',
    fundProviderId: 'fp_123456_abc123'
  }
}
```

---

## Data Storage Structure

### LocalStorage Keys
```javascript
// User Records
'afcf_fund_providers'          // Fund Provider records
'afcf_insurance_companies'     // Insurance Company records
'afcf_anchors'                 // Anchor records (if implemented)
'afcf_lead_firms'              // Lead Firm records
'afcf_producers'               // Producer/Farmer records
'afcf_cooperative_groups'      // Cooperative Group records
'afcf_extension_organizations' // Extension Organization records
'afcf_researchers'             // Researcher/Student records

// Session
'user'                         // Current user session
```

### Record Structure (Example: Fund Provider)
```javascript
{
  id: 'fp_1702704751234_abc123',
  email: 'info@greenvalleyagro.com',
  password: 'SecurePass@2024!',
  status: 'unverified' | 'verified',
  rejectionReason?: 'Reason for rejection',
  registrationType: 'individual' | 'company',
  lastSubmittedAt: '2024-12-16T04:32:31.234Z',
  lastReviewedAt?: '2024-12-16T05:15:22.567Z',
  pendingNotificationId?: 'notification_id',
  formData: {
    // All form fields
    fullName: 'John Adebayo Okonkwo',
    position: 'Chief Executive Officer',
    email: 'john.okonkwo@greenvalleyagro.com',
    organizationName: 'Green Valley Agro Industries Limited',
    // ... all other fields
  }
}
```

---

## Timeline Example: Complete Registration Flow (With M&E Verification)

### Day 1 - 10:00 AM: User Registration
```
User: "Green Valley Agro Industries" registers as Fund Provider
Status: unverified
Action: Record created in database
```

### Day 1 - 10:05 AM: User Login
```
User: Logs in with credentials
Portal: Shows "Registration Pending Approval" message
Access: Limited features only
```

### Day 2 - 2:00 PM: CA Initial Review
```
CA: Opens Fund Provider Applicants section
CA: Sees "Green Valley Agro Industries" in Approve Access card
CA: Reviews application
CA: Decides M&E verification is needed
```

### Day 2 - 2:30 PM: CA Creates M&E Project
```
CA: Clicks "Create M&E Project"
CA: Assigns M&E member "Sarah Johnson"
CA: Sets priority to "Medium"
System: Creates M&E project (ID: me_project_123456)
System: Notifies M&E member
Status: unverified (M&E verification in progress)
```

### Day 3 - 9:00 AM: M&E Begins Verification
```
M&E Member: Logs into M&E Portal
M&E Member: Views assigned project
M&E Member: Reviews registration documents
M&E Member: Begins verification checklist
```

### Day 3-5: M&E Conducts Verification
```
Day 3: Document review and data validation
Day 4: Physical verification (visits organization headquarters)
Day 4: Interviews contact person
Day 5: Background checks and CAC verification
Day 5: Compliance assessment
```

### Day 5 - 4:00 PM: M&E Submits Report
```
M&E Member: Completes verification checklist
M&E Member: Documents findings
M&E Member: Uploads evidence (photos, CAC verification)
M&E Member: Recommendation: "Approve"
M&E Member: Submits evaluation report
System: Notifies CA that M&E report is ready
```

### Day 6 - 10:00 AM: CA Reviews M&E Report
```
CA: Receives notification
CA: Opens M&E evaluation report
CA: Reviews findings and evidence
CA: Sees M&E recommendation: "Approve"
CA: Agrees with M&E recommendation
```

### Day 6 - 10:30 AM: CA Final Approval
```
CA: Clicks "Approve" in Applicants section
CA: Adds remarks: "All documents verified by M&E. Welcome to AFCF!"
CA: Confirms approval
System: Updates status to 'verified'
System: Sends notification to user
```

### Day 6 - 11:00 AM: User Notification
```
User: Logs in and sees notification
Notification: "Your registration has been approved. You now have full access."
Portal: Full features now accessible
User: Can now submit scheme applications
```

### Day 30 - 9:00 AM: Access Restriction (if needed)
```
CA: Identifies policy violation
CA: Navigates to Restrict Access card
CA: Selects "Green Valley Agro Industries"
CA: Clicks "Restrict Access"
CA: Enters reason: "Violation of platform policies"
CA: Confirms restriction
System: Updates status to 'unverified'
System: Sends notification to user
```

### Day 30 - 10:00 AM: User Sees Restriction
```
User: Logs in
Portal: Shows "Access Restricted" message
Notification: "Your access has been restricted. Reason: Violation of platform policies"
Access: Limited features only
User: Can appeal or contact CA
```

**Total Duration (With M&E):** 5-7 business days (typical)  
**Total Duration (Without M&E):** 1-2 business days (for straightforward cases)

---

## Key Functions Reference

### Registration Functions
```javascript
// Create new registration
registerFundProvider(payload)
registerInsuranceCompany(payload)
registerAnchor(payload)
registerLeadFirm(payload)
registerProducer(payload)
registerCooperativeGroup(payload)
registerExtensionOrganization(payload)
registerResearcher(payload)
```

### Status Update Functions
```javascript
// Update user status
updateFundProviderStatus(id, status, options)
updateInsuranceCompanyStatus(id, status, options)
updateAnchorStatus(id, status, options)
updateLeadFirmStatus(id, status, options)
updateProducerStatus(id, status, options)
updateCooperativeGroupStatus(id, status, options)
updateExtensionOrganizationStatus(id, status, options)
updateResearcherStatus(id, status, options)

// Options parameter:
{
  rejectionReason?: string,
  pendingNotificationId?: string | null
}
```

### Retrieval Functions
```javascript
// Get all records
getFundProviders()
getInsuranceCompanies()
getAnchors()
getLeadFirms()
getProducers()
getCooperativeGroups()
getExtensionOrganizations()
getResearchers()

// Find specific record
findFundProviderById(id)
findFundProviderByEmail(email)
// ... similar for other roles
```

### Authentication Functions
```javascript
// Verify login credentials
authenticateFundProvider(email, password)
authenticateInsuranceCompany(email, password)
authenticateAnchor(email, password)
authenticateLeadFirm(email, password)
authenticateProducer(emailOrPhone, password)
authenticateCooperativeGroup(email, password)
authenticateExtensionOrganization(email, password)
authenticateResearcher(email, password)
```

### M&E (Monitoring & Evaluation) Functions
```javascript
// M&E Member Management
getMEMembers()
findMEMemberById(id)
findMEMemberByEmail(email)
registerMEMember(payload)
updateMEMemberRecord(id, updates)

// M&E Project Management
getMEProjects()
findMEProjectById(id)
createMEProject(payload)
updateMEProject(id, updates)
assignMEMemberToProject(projectId, memberId)

// M&E Evaluation Reports
submitMEEvaluationReport(projectId, report)
getMEEvaluationReports(projectId)
updateMEProjectStatus(projectId, status)

// M&E Project Structure
MEProject {
  id: string,
  name: string,
  projectType: 'registration' | 'scheme-application' | 'incident-report',
  status: 'pending' | 'in-progress' | 'evaluation-complete' | 'archived',
  sourceType: 'producer' | 'anchor' | 'lead-firm' | 'pfi' | 'insurance' | etc.,
  sourceId: string,
  submissionData: object,
  assignedMemberIds: string[],
  evaluationReports: MEEvaluationReport[],
  caDecision: 'approved' | 'rejected' | 'pending-review'
}
```

---

## Important Notes

### 1. **Two-Status System**
The system uses only two statuses: `unverified` and `verified`. There is no intermediate "pending" status in the database, though the UI may display "Pending" for unverified users.

### 2. **M&E Verification (Optional but Recommended)**
- M&E verification is **optional** and determined by CA policy
- Typically required for high-value or complex registrations
- Adds 3-7 business days to approval timeline
- Provides additional layer of verification and risk assessment
- CA can approve/reject without M&E for straightforward cases
- M&E recommendation is advisory; CA makes final decision

### 3. **Rejection Handling**
- Rejected users remain with `unverified` status
- Rejection reason is stored in `rejectionReason` field
- Users can update their information and resubmit
- Previous rejection reason is overwritten on resubmission

### 4. **Session Management**
- User session stored in localStorage under `user` key
- Session includes: id, email, role, status, registrationType, organizationName, fullName
- Session synced when status changes

### 5. **Notification Targeting**
- Notifications use `targetRole` to route to specific user types
- Target roles: 'fund-provider', 'insurance-company', 'anchor', 'lead-firm', 'producer', 'cooperative-group', 'extension-organization', 'researcher'

### 6. **Document Handling**
- Documents stored as filenames in formData
- Actual files would be handled by backend in production
- Current system stores document names for reference

### 7. **Timestamp Tracking**
- `lastSubmittedAt`: When user registered or resubmitted
- `lastReviewedAt`: When CA made approval/rejection decision
- Both use ISO 8601 format

### 8. **Email vs Phone Login**
- Most roles: Email + Password
- Producer/Farmer: Email OR Phone + Password
- System checks both email and phone fields for Producer authentication

### 9. **Bulk Operations**
- CA can select multiple users for mass approval/restriction
- Each user processed individually with same decision
- Notifications sent to each user separately

---

## Security Considerations

1. **Password Storage**: Currently stored in plain text (LocalStorage). In production, should be hashed.
2. **Email Validation**: System checks for duplicate emails during registration.
3. **Session Validation**: Session checked on each portal access.
4. **Role-Based Access**: Each portal checks user role and status before granting access.
5. **Notification Privacy**: Notifications only visible to target role.

---

## Future Enhancements

1. **Multi-Level Approval**: Add intermediate approval stages
2. **Appeal Process**: Allow users to appeal rejections
3. **Audit Trail**: Track all status changes with full history
4. **Email Notifications**: Send email notifications in addition to in-app
5. **Document Verification**: Automated document verification
6. **Expiration Dates**: Add registration expiration and renewal
7. **Conditional Approval**: Approve with conditions that must be met
8. **Approval Delegation**: Allow CA to delegate approval authority

---

## Troubleshooting

### User Can't Login After Registration
- **Check**: User status is `unverified` - this is normal
- **Solution**: User can login but has limited access until approved

### CA Can't See Applicant
- **Check**: Record exists in localStorage
- **Check**: Correct role selected in CA portal
- **Solution**: Refresh page or check localStorage data

### Status Not Updating
- **Check**: `updateStatus` function called correctly
- **Check**: LocalStorage not full or corrupted
- **Solution**: Clear localStorage and re-register

### Notification Not Received
- **Check**: `targetRole` matches user's role
- **Check**: Notification context properly initialized
- **Solution**: Check notification context and role mapping

---

## Summary

The AFCF registration and approval system provides a comprehensive multi-step process with optional M&E verification:

### **Two Approval Paths:**

#### **Path 1: Direct CA Approval (1-2 days)**
1. **User Registration**: Users self-register with comprehensive information
2. **CA Review**: Coordinating Agency reviews application
3. **CA Decision**: CA approves or rejects directly

**Best for:**
- Straightforward applications
- Low-risk registrations
- Individual registrations
- Urgent approvals

#### **Path 2: With M&E Verification (5-7 days)**
1. **User Registration**: Users self-register with comprehensive information
2. **CA Initial Review**: CA reviews and decides M&E verification is needed
3. **M&E Project Creation**: CA creates M&E project and assigns M&E member
4. **M&E Verification**: M&E member conducts thorough verification (3-7 days)
5. **M&E Report Submission**: M&E submits evaluation report with recommendation
6. **CA Final Decision**: CA reviews M&E report and makes final decision

**Best for:**
- High-value organizations
- Complex applications
- Risk assessment required
- Policy compliance verification

### **Key Features:**

- **Quality Control**: Ensures only legitimate organizations are approved  
- **User Autonomy**: Users can self-register and track their status  
- **Flexible Verification**: Optional M&E verification for additional assurance  
- **Centralized Oversight**: All approvals managed through CA portal  
- **Complete Audit Trail**: All actions and decisions recorded  
- **Multiple User Roles**: Supports 8 different user types with tailored workflows  
- **Transparent Process**: Users always know their status and next steps  
- **Resubmission Allowed**: Rejected users can update and resubmit  

### **System Roles:**

1. **Users** (8 types): Self-register and await approval
2. **M&E Members**: Conduct field verification when assigned
3. **Coordinating Agency**: Makes all final approval decisions

This ensures quality control while maintaining user autonomy and providing flexibility in the approval process based on the complexity and risk level of each registration.
