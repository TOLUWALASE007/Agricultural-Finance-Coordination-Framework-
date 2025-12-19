# SCHEME CREATION AND APPLICATION FLOW

## Overview
This document outlines the complete process for creating fund schemes and managing applications from various stakeholders in the Agricultural Finance Coordination Framework (AFCF) system. The process involves multiple stages with different actors: The Coordinating Agency (CA) creates and manages schemes, Insurance Companies and PFIs submit proposals, and Beneficiaries apply for funding.

---

## Complete Scheme Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCHEME CREATION & APPLICATION WORKFLOW                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: SCHEME CREATION (Coordinating Agency Portal)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Login to CA Portal                                                    │
│   ├─► Navigate to "Fund Schemes" → "Create New Scheme"                     │
│   ├─► Fill Multi-Step Scheme Creation Form:                                 │
│   │    • Step 1: Scheme Details (Name, ID, Enterprises, Dates)              │
│   │    • Step 2: State Allocation (Location, Amount, Beneficiaries)         │
│   │    • Step 3: Fund Allocation (Loan Terms, Interest, Insurance)          │
│   │    • Step 4: Beneficiary Types & Eligibility                            │
│   │    • Step 5: Required Documents                                         │
│   │    • Step 6: Insurance Company Requirements                             │
│   │    • Step 7: PFI Selection                                               │
│   └─► Submit Scheme                                                         │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Create Scheme Record                                                  │
│   │    • Status: 'Active'                                                    │
│   │    • Workflow Stage: 'initial'                                           │
│   │    • ID: Auto-generated (e.g., FS001, FS002)                            │
│   │    • Timestamp: Recorded                                                 │
│   └─► Save to Database (localStorage: 'fundSchemes')                        │
│                                                                               │
│  SCHEME CREATED - Now visible in CA Portal                                  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: IC & PFI SELECTION (CA Portal)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Navigate to Fund Schemes                                              │
│   ├─► View Scheme in "Initial Stage" tab                                    │
│   ├─► Click "Manage Workflow"                                               │
│   ├─► Select Insurance Companies (if required)                              │
│   │    • Choose from verified Insurance Companies                            │
│   │    • Can select multiple ICs                                             │
│   │    • Set premium type: Fixed Amount or Rate                              │
│   │    • Add IC requirements/conditions                                      │
│   ├─► Select PFIs (Participating Financial Institutions)                    │
│   │    • Choose from verified PFIs                                           │
│   │    • Can select multiple PFIs                                            │
│   └─► Click "Notify Selected ICs & PFIs"                                    │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Update Scheme Record                                                  │
│   │    • selectedInsuranceCompanyIds: [ic_ids]                               │
│   │    • selectedPFIIds: [pfi_ids]                                           │
│   ├─► Send Notifications to Selected ICs                                    │
│   │    • Message: "You have been selected for scheme [Name]"                │
│   │    • Includes scheme details and requirements                            │
│   └─► Send Notifications to Selected PFIs                                   │
│        • Message: "You have been selected for scheme [Name]"                │
│        • Includes scheme details                                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: INSURANCE COMPANY SUBMISSIONS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INSURANCE COMPANY                                                           │
│   │                                                                           │
│   ├─► Receives notification about scheme                                    │
│   ├─► Navigate to "Scheme Applications"                                     │
│   ├─► View scheme details                                                   │
│   ├─► Click "Submit Proposal"                                               │
│   ├─► Fill Submission Form:                                                 │
│   │    • Premium Rate (if rate-based) OR                                     │
│   │    • Premium Fixed Amount (if fixed)                                     │
│   │    • Insurance Policies (detailed description)                           │
│   │    • Upload Documents (policies, terms, etc.)                            │
│   └─► Submit Proposal                                                       │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Create IC Submission Record                                           │
│   │    • insuranceCompanyId: [ic_id]                                         │
│   │    • insuranceCompanyName: [name]                                        │
│   │    • premiumRate or premiumFixedAmount                                   │
│   │    • insurancePolicies: [description]                                    │
│   │    • documents: [uploaded files]                                         │
│   │    • status: 'pending'                                                   │
│   │    • submittedAt: [timestamp]                                            │
│   ├─► Add to Scheme's insuranceCompanySubmissions array                     │
│   └─► Send Notification to CA                                               │
│        • Message: "[IC Name] submitted proposal for [Scheme]"               │
│                                                                               │
│  SUBMISSION PENDING CA REVIEW                                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 4: PFI APPLICATIONS                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  PFI (Participating Financial Institution)                                  │
│   │                                                                           │
│   ├─► Receives notification about scheme                                    │
│   ├─► Navigate to "Scheme Applications"                                     │
│   ├─► View scheme details                                                   │
│   ├─► Click "Apply to Scheme"                                               │
│   ├─► Fill Application Form:                                                │
│   │    • Proposed Interest Rate                                              │
│   │    • Upload Documents (financial terms, agreements)                      │
│   └─► Submit Application                                                    │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Create PFI Application Record                                         │
│   │    • pfiId: [pfi_id]                                                     │
│   │    • pfiName: [name]                                                     │
│   │    • proposedInterestRate: [rate]                                        │
│   │    • documents: [uploaded files]                                         │
│   │    • status: 'pending'                                                   │
│   │    • submittedAt: [timestamp]                                            │
│   ├─► Add to Scheme's pfiApplications array                                 │
│   └─► Send Notification to CA                                               │
│        • Message: "[PFI Name] applied to scheme [Scheme]"                   │
│                                                                               │
│  APPLICATION PENDING CA REVIEW                                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 5: CA REVIEWS IC SUBMISSIONS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Navigate to Fund Schemes                                              │
│   ├─► View scheme with pending IC submissions                               │
│   ├─► Click "Review IC Submissions"                                         │
│   ├─► Review each IC submission:                                            │
│   │    • Premium rate/amount                                                 │
│   │    • Insurance policies                                                  │
│   │    • Uploaded documents                                                  │
│   └─► Make Decision: APPROVE ONE IC or REJECT                               │
│                                                                               │
│  OPTION A: APPROVE ONE IC                                                   │
│   ├─► Select one IC submission                                              │
│   ├─► Click "Approve"                                                       │
│   ├─► Add review notes (optional)                                           │
│   └─► Confirm approval                                                      │
│                                                                               │
│  SYSTEM ACTION (APPROVAL):                                                  │
│   ├─► Update IC Submission                                                  │
│   │    • status: 'approved'                                                  │
│   │    • reviewedAt: [timestamp]                                             │
│   │    • reviewNotes: [notes]                                                │
│   ├─► Update Scheme                                                         │
│   │    • approvedInsuranceCompanyId: [ic_id]                                 │
│   ├─► Send Notification to Approved IC                                      │
│   │    • Message: "Your proposal for [Scheme] approved"                     │
│   └─► Send Notifications to Other ICs                                       │
│        • Message: "Another IC was selected for [Scheme]"                    │
│                                                                               │
│  OPTION B: REJECT IC                                                        │
│   ├─► Select IC submission                                                  │
│   ├─► Click "Reject"                                                        │
│   ├─► Enter rejection reason (required)                                     │
│   └─► Confirm rejection                                                     │
│                                                                               │
│  SYSTEM ACTION (REJECTION):                                                 │
│   ├─► Update IC Submission                                                  │
│   │    • status: 'rejected'                                                  │
│   │    • reviewedAt: [timestamp]                                             │
│   │    • reviewNotes: [rejection reason]                                     │
│   └─► Send Notification to IC                                               │
│        • Message: "Your proposal rejected. Reason: [reason]"                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 6: CA REVIEWS PFI APPLICATIONS                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► View scheme with pending PFI applications                             │
│   ├─► Click "Review PFI Applications"                                       │
│   ├─► Review each PFI application:                                          │
│   │    • Proposed interest rate                                              │
│   │    • Uploaded documents                                                  │
│   └─► Make Decision: APPROVE MULTIPLE PFIs or REJECT                        │
│                                                                               │
│  APPROVE PFIs (Can approve multiple):                                       │
│   ├─► Select PFI applications to approve                                    │
│   ├─► Click "Approve Selected"                                              │
│   ├─► Add review notes (optional)                                           │
│   └─► Confirm approval                                                      │
│                                                                               │
│  SYSTEM ACTION (APPROVAL):                                                  │
│   ├─► Update Each PFI Application                                           │
│   │    • status: 'approved'                                                  │
│   │    • reviewedAt: [timestamp]                                             │
│   │    • reviewNotes: [notes]                                                │
│   ├─► Update Scheme                                                         │
│   │    • Add PFI IDs to selectedPFIIds array                                 │
│   ├─► Send Notifications to Approved PFIs                                   │
│   │    • Message: "Your application for [Scheme] approved"                  │
│   └─► Send Notifications to Rejected PFIs                                   │
│        • Message: "Your application was not selected"                       │
│                                                                               │
│  REJECT PFI:                                                                │
│   ├─► Select PFI application                                                │
│   ├─► Click "Reject"                                                        │
│   ├─► Enter rejection reason (required)                                     │
│   └─► Confirm rejection                                                     │
│                                                                               │
│  SYSTEM ACTION (REJECTION):                                                 │
│   ├─► Update PFI Application                                                │
│   │    • status: 'rejected'                                                  │
│   │    • reviewedAt: [timestamp]                                             │
│   │    • reviewNotes: [rejection reason]                                     │
│   └─► Send Notification to PFI                                              │
│        • Message: "Application rejected. Reason: [reason]"                  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 7: CA OPENS SCHEME TO BENEFICIARIES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Verify: At least one IC approved (if IC required)                     │
│   ├─► Verify: At least one PFI approved                                     │
│   ├─► Click "Open for Beneficiaries"                                        │
│   └─► Confirm action                                                        │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Update Scheme                                                         │
│   │    • openToBeneficiaries: true                                           │
│   └─► Send Notifications to Eligible Beneficiaries                          │
│        • Lead Firms                                                          │
│        • Anchors                                                             │
│        • Producers/Farmers                                                   │
│        • Cooperative Groups                                                  │
│        • Message: "New scheme [Name] is now open for applications"          │
│                                                                               │
│  SCHEME NOW VISIBLE TO BENEFICIARIES                                         │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 8: BENEFICIARY APPLICATIONS                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  BENEFICIARY (Lead Firm, Anchor, Producer/Farmer, Cooperative)              │
│   │                                                                           │
│   ├─► Receives notification about new scheme                                │
│   ├─► Navigate to "Scheme Applications"                                     │
│   ├─► View available schemes (Active, Initial, Open)                        │
│   ├─► Click "View Details" on scheme                                        │
│   ├─► Review:                                                                │
│   │    • Scheme details (amount, deadline, requirements)                     │
│   │    • Approved Insurance Company details                                  │
│   │    • Selected PFIs list                                                  │
│   ├─► Click "Apply to Scheme"                                               │
│   ├─► Fill Application Form:                                                │
│   │    • Select PFI (from approved list)                                     │
│   │    • Select Insurance Company (approved IC)                              │
│   │    • Produce Type (for Producers/Farmers)                                │
│   │    • Farmer Information (for Anchors)                                    │
│   │    • Upload Required Documents                                           │
│   └─► Submit Application                                                    │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Create Beneficiary Application Record                                 │
│   │    • beneficiaryId: [id]                                                 │
│   │    • beneficiaryName: [name]                                             │
│   │    • beneficiaryType: [type]                                             │
│   │    • selectedPFI: [pfi_id]                                               │
│   │    • selectedInsuranceCompany: [ic_id]                                   │
│   │    • documents: [uploaded files]                                         │
│   │    • status: 'pending'                                                   │
│   │    • submittedAt: [timestamp]                                            │
│   ├─► Add to Scheme's beneficiaryApplications array                         │
│   ├─► Send Notification to CA                                               │
│   │    • Message: "[Beneficiary] applied to [Scheme]"                       │
│   └─► Remove scheme from beneficiary's available schemes list               │
│                                                                               │
│  APPLICATION PENDING CA REVIEW                                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 9: CA INITIAL REVIEW & M&E PROJECT CREATION (Optional)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Navigate to Fund Schemes                                              │
│   ├─► View scheme with pending beneficiary applications                     │
│   ├─► Click "Review Beneficiary Applications"                               │
│   ├─► Review application details                                            │
│   └─► Decide: M&E Verification Needed?                                      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                     │                                │
                     │                                │
         ┌───────────┴──────────┐        ┌───────────┴──────────┐
         │                      │        │                      │
         ▼                      │        ▼                      │
    YES (M&E Required)          │   NO (Direct Decision)        │
         │                      │        │                      │
         │                      │        │                      │
┌────────┴──────────────────────┴────────┴──────────────────────┴─────────────┐
│  OPTION A: WITH M&E VERIFICATION       │  OPTION B: DIRECT CA DECISION       │
├────────────────────────────────────────┼─────────────────────────────────────┤
│                                        │                                     │
│  CA CREATES M&E PROJECT                │  CA MAKES IMMEDIATE DECISION        │
│                                        │  (Skip to Stage 11)                 │
│  CA:                                   │                                     │
│   ├─► Click "Create M&E Project"      │                                     │
│   ├─► M&E Project Modal Opens:        │                                     │
│   │    • Project Title: Auto-generated│                                     │
│   │    • Project Type: "scheme-       │                                     │
│   │      application"                  │                                     │
│   │    • Source: Beneficiary type     │                                     │
│   │    • Submission Data: Application │                                     │
│   ├─► Assign M&E Member                │                                     │
│   ├─► Set Priority                     │                                     │
│   └─► Submit M&E Project               │                                     │
│                                        │                                     │
│  SYSTEM ACTION:                        │                                     │
│   ├─► Create M&E Project               │                                     │
│   │    • projectType: 'scheme-        │                                     │
│   │      application'                  │                                     │
│   │    • sourceType: beneficiary type │                                     │
│   │    • sourceId: beneficiary ID     │                                     │
│   │    • schemeId: scheme ID           │                                     │
│   │    • schemeName: scheme name       │                                     │
│   │    • submissionData: application  │                                     │
│   │    • status: 'pending'             │                                     │
│   ├─► Notify M&E Member                │                                     │
│   └─► Link M&E Project to Application │                                     │
│                                        │                                     │
└────────────────────────────────────────┴─────────────────────────────────────┘
         │
         │ (If M&E Project Created)
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 10: M&E VERIFICATION                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  M&E TEAM MEMBER                                                             │
│   │                                                                           │
│   ├─► Receives M&E project assignment                                       │
│   ├─► Navigate: M&E Portal → My Projects                                    │
│   ├─► View project details:                                                 │
│   │    • Beneficiary information                                             │
│   │    • Scheme details                                                      │
│   │    • Application data                                                    │
│   │    • Selected PFI and IC                                                 │
│   │    • Submitted documents                                                 │
│   │                                                                           │
│   ├─► Conduct Verification:                                                 │
│   │    • Verify beneficiary identity/legitimacy                              │
│   │    • Validate submitted documents                                        │
│   │    • Confirm eligibility criteria met                                    │
│   │    • Physical verification (if required)                                 │
│   │    • Interview beneficiary (if needed)                                   │
│   │    • Check financial capacity                                            │
│   │    • Assess risk factors                                                 │
│   │    • Verify PFI and IC selections are appropriate                        │
│   │                                                                           │
│   ├─► Document Findings                                                     │
│   │    • Create verification report                                          │
│   │    • Add photos/evidence                                                 │
│   │    • Note any issues or concerns                                         │
│   │                                                                           │
│   └─► Submit M&E Report                                                     │
│        • Recommendation: Approve or Reject                                   │
│        • Detailed findings                                                   │
│        • Supporting evidence                                                 │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Update M&E Project                                                    │
│   │    • status: 'evaluation-complete'                                       │
│   │    • evaluationReports: [report]                                         │
│   └─► Notify CA (M&E Report Ready)                                          │
│                                                                               │
│  M&E Duration: 3-7 business days                                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 11: CA FINAL REVIEW (With or Without M&E Report)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► Navigate to Fund Schemes                                              │
│   ├─► View scheme with beneficiary applications                             │
│   ├─► If M&E verification was done:                                         │
│   │    • View M&E evaluation report                                          │
│   │    • Review M&E recommendation                                           │
│   │    • Review findings and evidence                                        │
│   ├─► Review application details:                                           │
│   │    • Beneficiary details                                                 │
│   │    • Selected PFI and IC                                                 │
│   │    • Uploaded documents                                                  │
│   │    • Eligibility criteria                                                │
│   │    • M&E report (if applicable)                                          │
│   └─► Make Decision: APPROVE or REJECT                                      │
│                                                                               │
│  OPTION A: APPROVE APPLICATION                                              │
│   ├─► Click "Approve"                                                       │
│   ├─► Add review notes (optional)                                           │
│   │    • Can reference M&E recommendation                                    │
│   └─► Confirm approval                                                      │
│                                                                               │
│  SYSTEM ACTION (APPROVAL):                                                  │
│   ├─► Update Beneficiary Application                                        │
│   │    • status: 'approved'                                                  │
│   │    • reviewedAt: [timestamp]                                             │
│   │    • reviewNotes: [notes]                                                │
│   ├─► Update M&E Project (if exists)                                        │
│   │    • caDecision: 'approved'                                              │
│   │    • caDecisionAt: [timestamp]                                           │
│   ├─► Send Notification to Beneficiary                                      │
│   │    • Message: "Your application for [Scheme] approved!"                 │
│   │    • Include next steps                                                  │
│   ├─► Send Notification to Selected PFI                                     │
│   │    • Message: "[Beneficiary] approved for [Scheme]"                     │
│   └─► Send Notification to Selected IC                                      │
│        • Message: "[Beneficiary] approved for [Scheme]"                     │
│                                                                               │
│  OPTION B: REJECT APPLICATION                                               │
│   ├─► Click "Reject"                                                        │
│   ├─► Enter rejection reason (required)                                     │
│   │    • Can reference M&E findings                                          │
│   └─► Confirm rejection                                                     │
│                                                                               │
│  SYSTEM ACTION (REJECTION):                                                 │
│   ├─► Update Beneficiary Application                                        │
│   │    • status: 'rejected'                                                  │
│   │    • reviewedAt: [timestamp]                                             │
│   │    • reviewNotes: [rejection reason]                                     │
│   ├─► Update M&E Project (if exists)                                        │
│   │    • caDecision: 'rejected'                                              │
│   │    • caDecisionAt: [timestamp]                                           │
│   ├─► Send Notification to Beneficiary                                      │
│   │    • Message: "Application rejected. Reason: [reason]"                  │
│   └─► Make scheme visible again to beneficiary                              │
│        • Beneficiary can reapply after addressing issues                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STAGE 12: SCHEME COMPLETION (Optional)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  COORDINATING AGENCY                                                         │
│   │                                                                           │
│   ├─► When scheme reaches deadline or target                                │
│   ├─► Navigate to scheme details                                            │
│   ├─► Click "Mark as Completed"                                             │
│   └─► Confirm action                                                        │
│                                                                               │
│  SYSTEM ACTION:                                                              │
│   ├─► Update Scheme                                                         │
│   │    • status: 'Completed'                                                 │
│   │    • workflowStage: 'completed'                                          │
│   ├─► Remove from active schemes list                                       │
│   └─► Move to completed schemes archive                                     │
│                                                                               │
│  SCHEME COMPLETED                                                            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Scheme Creation Details

### Step 1: Scheme Details
**Fields:**
- **Scheme Name**: Descriptive name (e.g., "Rice Value Chain Financing")
- **Scheme ID**: Unique identifier (auto-generated or custom)
- **Enterprises**: Agricultural sectors covered (Rice, Cassava, Maize, Poultry, etc.)
- **Custom Enterprise**: Option to add unlisted enterprise
- **Start Date**: When scheme becomes active
- **Application Deadline**: Last date for beneficiary applications

### Step 2: State Allocation
**Location Configuration:**
- **Location Type**: State, LGA, or Ward level
- **State Selection**: 
  - Select All States option
  - Individual state selection
  - Multi-state support
- **LGA Selection** (if applicable):
  - Per-state LGA selection
  - Select All LGAs option
- **Ward Selection** (if applicable):
  - Per-LGA ward selection

**Allocation Configuration:**
- **Allocation Type**: Equal or Custom
- **Equal Allocation**:
  - Amount per location
  - Beneficiaries per location
- **Custom Allocation**:
  - Specific amount per location
  - Specific beneficiary count per location
- **Notes**: Additional allocation information

### Step 3: Fund Allocation
**Loan Terms:**
- **Loan Amount**: Total or per-beneficiary amount
- **Loan Tenure**: Duration with unit (Days/Weeks/Months/Years)
- **Deferment Period**: Grace period before repayment starts
- **Collateral Required**: Yes/No

**Risk & Interest:**
- **De-Risking Percentage**: Risk coverage percentage
- **PFI Interest Rate**: Expected interest rate range
- **Insurance Percentage**: Insurance coverage percentage

### Step 4: Beneficiary Types & Eligibility
**Beneficiary Types:**
- Lead Firms
- Anchors
- Producers/Farmers
- Cooperative Groups

**Eligibility:**
- Detailed eligibility criteria
- Requirements and conditions
- Notes on selection process

### Step 5: Required Documents
**Document Management:**
- Add multiple required documents
- Each document has:
  - File name
  - Description of what's required
- Documents beneficiaries must submit

### Step 6: Insurance Company Requirements
**IC Configuration:**
- **Premium Type**: Fixed Amount or Rate-based
- **Requirements**: Detailed conditions for ICs
- **Select ICs**: Choose from verified Participating Financial Institutions
- **Multiple Selection**: Can select multiple ICs for the scheme
- **IC List**: Shows all verified ICs available in the system
- **Selection Purpose**: Selected ICs will be notified and can apply to participate

### Step 7: PFI Selection
**PFI Configuration:**
- **Select PFIs**: Choose from verified Participating Financial Institutions
- **Multiple Selection**: Can select multiple PFIs for the scheme
- **PFI List**: Shows all verified PFIs available in the system
- **Selection Purpose**: Selected PFIs will be notified and can apply to participate

---

## Workflow Stages

### Initial Stage
**Characteristics:**
- Scheme created but not yet open to beneficiaries
- IC and PFI selection in progress
- CA manages workflow
- Submissions from ICs and PFIs accepted

**Activities:**
- CA selects ICs and PFIs
- ICs submit proposals
- PFIs submit applications
- CA reviews and approves IC/PFI submissions

### Completed Stage
**Characteristics:**
- Scheme fully configured
- Open to beneficiaries (if CA chooses)
- All IC/PFI selections finalized
- Beneficiary applications accepted

**Activities:**
- Beneficiaries view and apply
- CA reviews beneficiary applications
- Approvals and rejections processed
- Scheme progresses toward completion

---

## Application Status Flow

### Insurance Company Submission Statuses
```
pending → (CA Review) → approved OR rejected
```

**Status Meanings:**
- **pending**: Submitted, awaiting CA review
- **approved**: Selected as scheme's insurance provider
- **rejected**: Not selected, with reason provided

### PFI Application Statuses
```
pending → (CA Review) → approved OR rejected
```

**Status Meanings:**
- **pending**: Submitted, awaiting CA review
- **approved**: Selected as participating PFI (multiple can be approved)
- **rejected**: Not selected, with reason provided

### Beneficiary Application Statuses
```
pending → (CA Review) → approved OR rejected
```

**Status Meanings:**
- **pending**: Submitted, awaiting CA review
- **approved**: Accepted into scheme, funding process begins
- **rejected**: Not accepted, can reapply after addressing issues

---

## Data Storage Structure

### Scheme Record Structure
```javascript
{
  id: 'FS001',
  name: 'Rice Value Chain Financing',
  fundProvider: 'CBN Agricultural Finance',
  amount: '₦25.5B',
  beneficiaries: 12450,
  status: 'Active' | 'Completed',
  state: 'Multi-State',
  startDate: 'Jan 2024',
  applicationDeadline: '2024-12-31',
  recoveryRate: '92%',
  description: 'Detailed scheme description',
  
  // Metadata (full scheme configuration)
  metadata: {
    schemeDetails: { /* Step 1 data */ },
    stateAllocation: { /* Step 2 data */ },
    fundAllocation: { /* Step 3 data */ },
    beneficiaries: { /* Step 4 data */ },
    documents: { /* Step 5 data */ },
    insuranceCompanyRequirements: { /* Step 6 data */ }
  },
  
  // Workflow fields
  workflowStage: 'initial' | 'completed',
  openToBeneficiaries: false | true,
  
  // Insurance Company
  selectedInsuranceCompanyIds: ['ic_123', 'ic_456'],
  insuranceCompanySubmissions: [
    {
      insuranceCompanyId: 'ic_123',
      insuranceCompanyName: 'ABC Insurance',
      premiumRate: '5%',
      premiumFixedAmount: '₦50,000',
      insurancePolicies: 'Detailed policy description',
      documents: [{ fileName: 'policy.pdf', description: 'Policy document' }],
      submittedAt: '2024-12-16T10:00:00Z',
      status: 'pending' | 'approved' | 'rejected',
      reviewedAt: '2024-12-17T14:00:00Z',
      reviewNotes: 'Approval/rejection notes'
    }
  ],
  approvedInsuranceCompanyId: 'ic_123',
  insuranceCompanyPremiumType: 'fixed' | 'rate',
  
  // PFIs
  selectedPFIIds: ['pfi_789', 'pfi_012'],
  pfiApplications: [
    {
      pfiId: 'pfi_789',
      pfiName: 'XYZ Bank',
      proposedInterestRate: '12%',
      documents: [{ fileName: 'terms.pdf', description: 'Loan terms' }],
      submittedAt: '2024-12-16T11:00:00Z',
      status: 'pending' | 'approved' | 'rejected',
      reviewedAt: '2024-12-17T15:00:00Z',
      reviewNotes: 'Approval/rejection notes'
    }
  ],
  
  // Beneficiaries
  beneficiaryApplications: [
    {
      beneficiaryId: 'producer_345',
      beneficiaryName: 'John Farmer',
      beneficiaryType: 'Producer/Farmer' | 'Anchor' | 'Lead Firm' | 'Cooperative Group',
      selectedPFI: 'pfi_789',
      selectedInsuranceCompany: 'ic_123',
      produceType: 'Rice',
      farmerInformation: 'Details about farmers (for Anchors)',
      documents: [{ fileName: 'application.pdf', description: 'Application form' }],
      submittedAt: '2024-12-18T09:00:00Z',
      status: 'pending' | 'approved' | 'rejected',
      reviewedAt: '2024-12-19T10:00:00Z',
      reviewNotes: 'Approval/rejection notes'
    }
  ]
}
```

### LocalStorage Keys
```javascript
'fundSchemes' // All scheme records
```

---

## Notification Types

### 1. IC/PFI Selection Notifications
**Sent to**: Insurance Companies and PFIs
**When**: CA selects them for a scheme
**Message**: "You have been selected for scheme [Scheme Name]. Please submit your proposal."

### 2. IC Submission Notifications
**Sent to**: Coordinating Agency
**When**: IC submits proposal
**Message**: "[IC Name] submitted proposal for scheme [Scheme Name]."

### 3. PFI Application Notifications
**Sent to**: Coordinating Agency
**When**: PFI submits application
**Message**: "[PFI Name] applied to scheme [Scheme Name]."

### 4. IC Approval/Rejection Notifications
**Sent to**: Insurance Companies
**When**: CA approves or rejects IC submission
**Approval Message**: "Your proposal for [Scheme Name] has been approved!"
**Rejection Message**: "Your proposal for [Scheme Name] was not selected. Reason: [reason]"

### 5. PFI Approval/Rejection Notifications
**Sent to**: PFIs
**When**: CA approves or rejects PFI application
**Approval Message**: "Your application for [Scheme Name] has been approved!"
**Rejection Message**: "Your application for [Scheme Name] was not selected. Reason: [reason]"

### 6. Scheme Open Notifications
**Sent to**: Eligible Beneficiaries (Lead Firms, Anchors, Producers, Cooperatives)
**When**: CA opens scheme to beneficiaries
**Message**: "New scheme [Scheme Name] is now open for applications. Deadline: [date]"

### 7. Beneficiary Application Notifications
**Sent to**: Coordinating Agency
**When**: Beneficiary submits application
**Message**: "[Beneficiary Name] applied to scheme [Scheme Name]. Please review."

### 8. Beneficiary Approval/Rejection Notifications
**Sent to**: Beneficiaries
**When**: CA approves or rejects beneficiary application
**Approval Message**: "Your application for [Scheme Name] has been approved! Next steps: [details]"
**Rejection Message**: "Your application for [Scheme Name] was not approved. Reason: [reason]. You may reapply after addressing these issues."

### 9. PFI/IC Assignment Notifications
**Sent to**: Selected PFI and IC
**When**: Beneficiary is approved with their services
**Message**: "[Beneficiary Name] has been approved for [Scheme Name] with your services."

---

## Timeline Example: Complete Scheme Workflow

### Day 1 - CA Creates Scheme
```
CA: Creates "Rice Value Chain Financing" scheme
CA: Fills multi-step form with scheme details
CA: Submits scheme
System: Saves scheme with status 'Active', workflowStage 'initial'
CA: Sees new scheme in Fund Schemes list
```

### Day 2 - CA Selects ICs and PFIs
```
CA: Selects 3 Insurance Companies and 5 PFIs
System: Sends notifications to selected ICs and PFIs
ICs/PFIs: Receive notifications about scheme
```

### Day 3-5 - IC and PFI Submissions
```
Day 3: 2 ICs submit proposals
Day 4: 4 PFIs submit applications
Day 5: 1 more IC submits proposal
System: Sends notifications to CA for each submission
```

### Day 6 - CA Reviews IC Submissions
```
CA: Reviews 3 IC proposals
CA: Approves "ABC Insurance Company"
System: Updates IC submission statuses
System: Sends approval notification to ABC Insurance
System: Sends rejection notifications to other 2 ICs
```

### Day 7 - CA Reviews PFI Applications
```
CA: Reviews 4 PFI applications
CA: Approves 3 PFIs (XYZ Bank, DEF Bank, GHI MFB)
System: Updates PFI application statuses
System: Sends approval notifications to 3 approved PFIs
System: Sends rejection notification to 1 rejected PFI
```

### Day 8 - CA Opens to Beneficiaries
```
CA: Clicks "Open for Beneficiaries"
System: Sets openToBeneficiaries = true
System: Sends notifications to all eligible beneficiaries
Beneficiaries: See scheme in Available Schemes list
```

### Day 9-20 - Beneficiary Applications
```
Day 9: 50 Producers/Farmers apply
Day 12: 10 Anchors apply
Day 15: 5 Lead Firms apply
Day 18: 8 Cooperative Groups apply
System: Sends notification to CA for each application
```

### Day 21-30 - CA Reviews Beneficiary Applications (With M&E for Some)
```
Day 21: CA reviews first batch of applications
Day 21: CA decides 10 high-value applications need M&E verification
Day 21: CA creates M&E projects for these 10 applications
System: Notifies M&E members about new projects

Day 22-28: M&E members conduct verification
  • Physical visits to beneficiary locations
  • Document validation
  • Interview beneficiaries
  • Check financial capacity
  • Assess risk factors
  • Verify PFI and IC selections

Day 29: M&E members submit evaluation reports
  • 8 applications recommended for approval
  • 2 applications recommended for rejection
System: Notifies CA that M&E reports are ready

Day 30: CA reviews M&E reports and makes final decisions
  • Approves 8 applications (following M&E recommendation)
  • Rejects 2 applications (following M&E recommendation)

Day 21-30: CA also reviews and approves straightforward applications directly
  • Approves 35 Producers, 8 Anchors, 4 Lead Firms, 6 Cooperatives (direct)
  • Rejects 10 applications with reasons (direct)

System: Sends approval/rejection notifications
System: Notifies selected PFIs and IC about approved beneficiaries
```

### Day 90 - Scheme Completion
```
CA: Marks scheme as "Completed"
System: Updates status to 'Completed'
System: Moves to completed schemes archive
```

**Total Duration:** 90 days (typical)

---

## Important Notes

### 1. **Workflow Stages**
- **Initial**: Scheme created, IC/PFI selection in progress, not open to beneficiaries
- **Completed**: All selections finalized, can be opened to beneficiaries

### 2. **IC Selection**
- Only ONE Insurance Company can be approved per scheme
- Multiple ICs can submit proposals, but CA selects only one
- Premium type (fixed/rate) is set by Fund Provider during scheme creation

### 3. **PFI Selection**
- MULTIPLE PFIs can be approved per scheme
- Beneficiaries choose from approved PFIs when applying
- Each PFI proposes their own interest rate

### 4. **Beneficiary Eligibility**
- Must be verified by CA before applying
- Can only see schemes that are:
  - Status: 'Active'
  - Workflow Stage: 'initial'
  - Open to Beneficiaries: true
  - Has at least one approved PFI
- Cannot see schemes they've already been approved or rejected for

### 5. **Application Visibility**
- Approved applications: Scheme removed from beneficiary's available list
- Rejected applications: Scheme becomes visible again for reapplication
- Pending applications: Scheme still visible (beneficiary can see application status)

### 6. **Document Management**
- Documents are stored as file names/descriptions in current implementation
- Actual file handling would be implemented in production backend
- Each stakeholder uploads relevant documents for their submissions

### 7. **Notification System**
- All notifications stored in NotificationContext
- Target role-based routing (coordinating-agency, insurance-company, pfi, producer, etc.)
- Notifications include metadata for tracking and linking

### 8. **Data Synchronization**
- Schemes stored in localStorage under 'fundSchemes' key
- Real-time updates via storage events
- Merge strategy prevents overwriting external submissions

### 9. **M&E Verification for Beneficiary Applications (Optional)**
- **When Used**: CA can request M&E verification for high-value or complex beneficiary applications
- **Project Type**: 'scheme-application'
- **Purpose**: Additional layer of verification before final approval
- **Typical Cases**:
  - Large loan amounts
  - New or unproven beneficiaries
  - Complex applications requiring field verification
  - Risk assessment needed
- **Process**:
  - CA creates M&E project linked to beneficiary application
  - M&E member conducts verification (3-7 days)
  - M&E submits evaluation report with recommendation
  - CA reviews M&E report and makes final decision
- **CA Decision**: CA can accept or override M&E recommendation
- **Impact on Timeline**: Adds 3-7 business days to approval process
- **M&E Project Fields**:
  - projectType: 'scheme-application'
  - sourceType: Beneficiary type (producer, anchor, lead-firm, cooperative)
  - sourceId: Beneficiary ID
  - schemeId: Scheme ID
  - schemeName: Scheme name
  - submissionData: Full application data
  - caDecision: Final CA decision (approved/rejected)

---

## Key Functions Reference

### Scheme Creation Functions
```javascript
// Create new scheme (Coordinating Agency)
createScheme(schemeData)

// Update scheme details
updateScheme(schemeId, updates)

// Change scheme status
updateSchemeStatus(schemeId, status)
```

### IC/PFI Selection Functions
```javascript
// Select ICs for scheme
selectInsuranceCompanies(schemeId, icIds)

// Select PFIs for scheme
selectPFIs(schemeId, pfiIds)

// Notify selected ICs/PFIs
notifySelectedParticipants(schemeId)
```

### Submission Review Functions
```javascript
// Approve IC submission
approveICSubmission(schemeId, icSubmissionId, notes)

// Reject IC submission
rejectICSubmission(schemeId, icSubmissionId, reason)

// Approve PFI application
approvePFIApplication(schemeId, pfiApplicationId, notes)

// Reject PFI application
rejectPFIApplication(schemeId, pfiApplicationId, reason)
```

### Beneficiary Management Functions
```javascript
// Open scheme to beneficiaries
openSchemeToBeneficiaries(schemeId)

// Approve beneficiary application
approveBeneficiaryApplication(schemeId, applicationId, notes)

// Reject beneficiary application
rejectBeneficiaryApplication(schemeId, applicationId, reason)
```

### Retrieval Functions
```javascript
// Get all schemes
getSchemes()

// Get scheme by ID
getSchemeById(schemeId)

// Get schemes by status
getSchemesByStatus(status)

// Get schemes by workflow stage
getSchemesByWorkflowStage(stage)

// Get available schemes for beneficiary
getAvailableSchemesForBeneficiary(beneficiaryId, beneficiaryType)
```

---

## Summary

The AFCF scheme creation and application system provides a comprehensive multi-stage workflow:

### **Key Stages:**

1. **Scheme Creation**: Coordinating Agency creates detailed funding schemes
2. **IC/PFI Selection**: CA selects insurance companies and PFIs
3. **IC Submissions**: Insurance companies submit proposals
4. **PFI Applications**: PFIs apply with proposed interest rates
5. **CA Reviews**: CA approves one IC and multiple PFIs
6. **Open to Beneficiaries**: CA makes scheme available for applications
7. **Beneficiary Applications**: Eligible beneficiaries apply
8. **M&E Verification (Optional)**: CA may request M&E verification for complex applications
9. **CA Final Review**: CA approves or rejects beneficiary applications (with or without M&E input)
10. **Scheme Completion**: Scheme reaches deadline or target

### **Key Features:**

- **Multi-Actor Workflow**: Involves CA, ICs, PFIs, M&E Team, and Beneficiaries
- **Staged Approvals**: Sequential approval process ensures quality control
- **Optional M&E Verification**: Additional verification layer for high-value or complex beneficiary applications
- **Flexible Configuration**: Supports various allocation types and beneficiary categories
- **Transparent Process**: All stakeholders notified at each stage
- **Reapplication Support**: Rejected applicants can reapply after addressing issues
- **Complete Audit Trail**: All submissions, M&E reports, and decisions recorded with timestamps
- **Risk Management**: M&E verification helps assess and mitigate risks for large loans

This ensures efficient fund distribution while maintaining oversight and transparency throughout the agricultural financing process.

