# 🚪 PRODUCER/FARMER LEAVES ANCHOR - COMPLETE PROCESS FLOW

## 📊 **VISUAL PROCESS FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           PRODUCER/FARMER LEAVES ANCHOR - COMPLETE WORKFLOW                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: PRODUCER SUBMITS LEAVE REQUEST                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🌾 PRODUCER/FARMER                                                          │
│   │                                                                           │
│   ├─► Login to Producer Portal                                              │
│   │                                                                           │
│   ├─► Navigate: Anchor Relationships → Request to Leave Anchor              │
│   │                                                                           │
│   ├─► View list of ACTIVE anchor relationships                              │
│   │                                                                           │
│   ├─► Select anchor to leave (radio button)                                 │
│   │    • View anchor details:                                                │
│   │      - Organization name                                                 │
│   │      - Contact person                                                    │
│   │      - Industry                                                          │
│   │      - Location                                                          │
│   │      - Relationship start date                                           │
│   │                                                                           │
│   ├─► Provide detailed reason for leaving (required)                        │
│   │    • Text area for explanation                                           │
│   │    • Must be clear and honest                                            │
│   │                                                                           │
│   ├─► Click "Submit Leave Request"                                          │
│   │                                                                           │
│   └─► Confirm action in dialog:                                             │
│        "Are you sure you want to request to leave [Anchor Name]?            │
│         This request will be sent to the CA for review and M&E verification."│
│                                                                               │
│  📤 SYSTEM ACTION:                                                           │
│   ├─► Create Leave Request Record                                           │
│   │    • Status: "pending-ca"                                                │
│   │    • Producer ID: [producer-id]                                          │
│   │    • Anchor ID: [anchor-id]                                              │
│   │    • Relationship ID: [relationship-id]                                  │
│   │    • Reason: [producer's reason]                                         │
│   │    • Created At: [timestamp]                                             │
│   │                                                                           │
│   └─► Send Notification to CA                                               │
│        • Type: "producer-leave-request"                                      │
│        • Message: "[Producer] has requested to leave anchor [Anchor]..."    │
│                                                                               │
│  ✅ CONFIRMATION:                                                            │
│   └─► "Leave request submitted successfully!                                │
│        The CA will review your request and initiate M&E verification.       │
│        You will be notified of the decision."                                │
│                                                                               │
│  📊 CURRENT STATUS: pending-ca                                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: CA REVIEWS AND CREATES M&E PROJECT                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  👔 COORDINATING AGENCY (CA)                                                │
│   │                                                                           │
│   ├─► Receives notification: "[Producer] has requested to leave [Anchor]"   │
│   │                                                                           │
│   ├─► Navigate: Relationships → Leave Requests                              │
│   │                                                                           │
│   ├─► View leave request details:                                           │
│   │    • Producer information (name, farm, location)                         │
│   │    • Anchor information (organization, industry, contact)                │
│   │    • Reason for leaving                                                  │
│   │    • Request date                                                        │
│   │    • Status: "Pending CA Review"                                         │
│   │                                                                           │
│   ├─► Review the request                                                    │
│   │    • Is the reason valid?                                                │
│   │    • Are there any issues?                                               │
│   │    • Should M&E verify?                                                  │
│   │                                                                           │
│   └─► Decision: CREATE M&E PROJECT or REJECT                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                │
                    │                                │
        ┌───────────┴──────────┐        ┌───────────┴──────────┐
        │                      │        │                      │
        ▼                      │        ▼                      │
   ✅ CREATE M&E               │   ❌ REJECT                   │
        │                      │        │                      │
        │                      │        │                      │
┌───────┴──────────────────────┴────────┴──────────────────────┴──────────────┐
│  OPTION A: CA CREATES M&E PROJECT     │  OPTION B: CA REJECTS REQUEST       │
├───────────────────────────────────────┼─────────────────────────────────────┤
│                                       │                                     │
│  👔 CA ACTIONS:                       │  👔 CA ACTIONS:                     │
│   ├─► Click "Create M&E Project"      │   ├─► Click "Reject" button         │
│   │                                    │   │                                 │
│   ├─► M&E Project Modal Opens:        │   ├─► Rejection modal opens         │
│   │    • Project Title: [auto-filled] │   │                                 │
│   │    • Project Type: "Registration" │   ├─► Enter rejection reason        │
│   │    • Source: "Producer"           │   │    (required)                   │
│   │    • Description: [auto-filled]   │   │                                 │
│   │    • Assign M&E Member            │   └─► Confirm rejection             │
│   │    • Set Priority                 │                                     │
│   │    • Add notes                    │  📤 SYSTEM ACTION:                  │
│   │                                    │   ├─► Update Leave Request          │
│   └─► Submit M&E Project               │   │    • Status: "rejected"         │
│                                       │   │    • Rejection Reason: [text]   │
│  📤 SYSTEM ACTION:                    │   │    • Reviewed At: [timestamp]   │
│   ├─► Create M&E Project              │   │                                 │
│   │    • Project ID: [me_project_id]  │   ├─► Send Notification to PRODUCER │
│   │    • Assigned to M&E member       │   │    • Message: "Your leave       │
│   │                                    │   │      request has been rejected" │
│   ├─► Update Leave Request            │   │    • Include rejection reason   │
│   │    • Status: "pending-me"         │   │                                 │
│   │    • M&E Project ID: [id]         │   └─► Send Notification to ANCHOR  │
│   │                                    │        • Message: "Leave request    │
│   ├─► Send Notification to PRODUCER   │          rejected, relationship     │
│   │    • Message: "Your leave request │          remains active"            │
│   │      has been sent for M&E        │                                     │
│   │      verification"                 │  ✅ PROCESS ENDS                    │
│   │                                    │  📊 STATUS: rejected ❌             │
│   └─► Send Notification to ANCHOR     │                                     │
│        • Message: "Leave request is   │                                     │
│          being verified by M&E"       │                                     │
│                                       │                                     │
│  📊 CURRENT STATUS: pending-me        │                                     │
│                                       │                                     │
└───────────────────────────────────────┴─────────────────────────────────────┘
        │
        │ (If M&E Project Created)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: M&E TEAM VERIFIES THE REQUEST                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📋 M&E TEAM MEMBER                                                          │
│   │                                                                           │
│   ├─► Receives M&E project assignment                                       │
│   │                                                                           │
│   ├─► Navigate: M&E Portal → My Projects                                    │
│   │                                                                           │
│   ├─► View project details:                                                 │
│   │    • Producer information                                                │
│   │    • Anchor information                                                  │
│   │    • Leave reason                                                        │
│   │    • Relationship details                                                │
│   │                                                                           │
│   ├─► Conduct verification:                                                 │
│   │    • Verify producer identity                                            │
│   │    • Confirm current relationship status                                 │
│   │    • Check for pending obligations                                       │
│   │    • Review relationship history                                         │
│   │    • Validate leave reason                                               │
│   │    • Interview producer (if needed)                                      │
│   │    • Interview anchor (if needed)                                        │
│   │    • Check for any disputes                                              │
│   │                                                                           │
│   ├─► Document findings                                                     │
│   │    • Create verification report                                          │
│   │    • Add photos/evidence                                                 │
│   │    • Note any issues                                                     │
│   │                                                                           │
│   └─► Submit M&E Report                                                     │
│        • Recommendation: Approve or Reject                                   │
│        • Detailed findings                                                   │
│        • Supporting evidence                                                 │
│                                                                               │
│  📤 SYSTEM ACTION:                                                           │
│   └─► M&E Report submitted to CA                                            │
│        • CA can now make final decision                                      │
│                                                                               │
│  ⏱️ TYPICAL DURATION: 3-7 business days                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 4: CA MAKES FINAL DECISION BASED ON M&E REPORT                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  👔 COORDINATING AGENCY (CA)                                                │
│   │                                                                           │
│   ├─► Receives M&E verification report                                      │
│   │                                                                           │
│   ├─► Navigate: Relationships → Leave Requests                              │
│   │                                                                           │
│   ├─► Filter by: "Pending M&E" → Now shows verified requests                │
│   │                                                                           │
│   ├─► View leave request with M&E report:                                   │
│   │    • Original request details                                            │
│   │    • M&E verification report                                             │
│   │    • M&E recommendation                                                  │
│   │    • M&E findings                                                        │
│   │    • Status: "Pending M&E" (ready for approval)                          │
│   │                                                                           │
│   ├─► Review M&E report                                                     │
│   │    • Check M&E recommendation                                            │
│   │    • Review findings                                                     │
│   │    • Verify all checks completed                                         │
│   │                                                                           │
│   └─► Make Final Decision: APPROVE or REJECT                                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                │
                    │                                │
        ┌───────────┴──────────┐        ┌───────────┴──────────┐
        │                      │        │                      │
        ▼                      │        ▼                      │
   ✅ APPROVE & TERMINATE      │   ❌ REJECT                   │
        │                      │        │                      │
        │                      │        │                      │
┌───────┴──────────────────────┴────────┴──────────────────────┴──────────────┐
│  OPTION A: CA APPROVES (TERMINATES)   │  OPTION B: CA REJECTS (MAINTAINS)  │
├───────────────────────────────────────┼─────────────────────────────────────┤
│                                       │                                     │
│  👔 CA ACTIONS:                       │  👔 CA ACTIONS:                     │
│   ├─► Click "Approve & Terminate"     │   ├─► Click "Reject" button         │
│   │                                    │   ├─► Enter rejection reason        │
│   └─► Confirm termination             │   └─► Confirm rejection             │
│                                       │                                     │
│  📤 SYSTEM ACTION:                    │  📤 SYSTEM ACTION:                  │
│   ├─► Update Relationship             │   ├─► Update Leave Request          │
│   │    • Status: "terminated"         │   │    • Status: "rejected"         │
│   │    • Terminated At: [timestamp]   │   │    • Rejection Reason: [text]   │
│   │    • Termination Reason: [reason] │   │                                 │
│   │                                    │   ├─► Relationship REMAINS ACTIVE   │
│   ├─► Update Leave Request            │   │    • No changes to relationship │
│   │    • Status: "approved"           │   │                                 │
│   │    • Reviewed At: [timestamp]     │   ├─► Send Notification to PRODUCER │
│   │                                    │   │    • Message: "Leave request    │
│   ├─► Send Notification to PRODUCER   │   │      rejected"                  │
│   │    • Message: "Your leave request │   │    • Include rejection reason   │
│   │      has been approved. The       │   │                                 │
│   │      relationship has been        │   └─► Send Notification to ANCHOR  │
│   │      terminated."                  │        • Message: "Leave request    │
│   │                                    │          rejected, relationship     │
│   └─► Send Notification to ANCHOR     │          remains active"            │
│        • Message: "[Producer] has     │                                     │
│          left your organization.      │  ✅ PROCESS ENDS                    │
│          The relationship has been    │  📊 STATUS: rejected ❌             │
│          terminated."                  │  🔗 RELATIONSHIP: active (unchanged)│
│        • Include leave reason         │                                     │
│                                       │                                     │
│  ✅ RELATIONSHIP TERMINATED!          │                                     │
│  📊 STATUS: approved ✅               │                                     │
│  🔗 RELATIONSHIP: terminated           │                                     │
│                                       │                                     │
└───────────────────────────────────────┴─────────────────────────────────────┘
        │
        │ (If Approved)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FINAL RESULT: RELATIONSHIP TERMINATED                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🎉 PRODUCER HAS SUCCESSFULLY LEFT THE ANCHOR!                              │
│                                                                               │
│  ✅ Producer Status:                                                         │
│   ├─► Relationship terminated                                               │
│   ├─► No longer in anchor's network                                         │
│   ├─► Can view relationship in history                                      │
│   ├─► Can join other anchors                                                │
│   └─► Receives termination confirmation                                     │
│                                                                               │
│  ✅ Anchor Status:                                                           │
│   ├─► Producer removed from network                                         │
│   ├─► Relationship marked as terminated                                     │
│   ├─► Can view in relationship history                                      │
│   ├─► Receives termination notification                                     │
│   └─► Knows the reason for leaving                                          │
│                                                                               │
│  📊 Relationship Record:                                                    │
│   • Status: TERMINATED                                                       │
│   • Terminated At: [date]                                                    │
│   • Termination Reason: [producer's reason]                                 │
│   • Created At: [original relationship start date]                          │
│   • Approved At: [original approval date]                                   │
│   • Duration: [calculated]                                                   │
│   • Visible in history for both parties                                     │
│                                                                               │
│  📋 Leave Request Record:                                                   │
│   • Status: APPROVED                                                         │
│   • Submitted At: [date]                                                     │
│   • M&E Project ID: [id]                                                     │
│   • Reviewed At: [date]                                                      │
│   • Reason: [producer's reason]                                             │
│   • Complete audit trail                                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 **DETAILED STEP-BY-STEP BREAKDOWN**

### **STEP 1: PRODUCER SUBMITS LEAVE REQUEST**

**Who:** Producer/Farmer  
**Where:** Producer Portal → Anchor Relationships → Request to Leave Anchor  
**Duration:** 5-10 minutes

#### **What the Producer Does:**

1. **Login and Navigate**
   - Login to Producer Portal
   - Click "Anchor Relationships ⚓" in sidebar
   - Click "🚪 Request to Leave Anchor"

2. **View Active Relationships**
   - System displays list of ACTIVE anchor relationships
   - Each relationship shows:
     - Anchor organization name
     - Contact person
     - Industry
     - Location
     - Relationship start date
     - Approval date

3. **Select Anchor to Leave**
   - Click radio button next to the anchor
   - Selected anchor is highlighted
   - Can only select ONE anchor at a time

4. **Provide Reason for Leaving**
   - Required text area (minimum length)
   - Must be clear and detailed
   - Examples of reasons:
     - "Better opportunities with another anchor"
     - "Dissatisfaction with support services"
     - "Geographic relocation"
     - "Change in farming activities"
     - "Payment or contract disputes"
     - "Personal or business reasons"

5. **Submit Request**
   - Click "Submit Leave Request" button
   - Confirmation dialog appears:
     ```
     Are you sure you want to request to leave [Anchor Name]?
     
     This request will be sent to the Coordinating Agency for 
     review and M&E verification.
     ```
   - Click "Confirm"

#### **What the System Does:**

1. **Creates Leave Request Record**
   ```typescript
   LeaveRequest {
     id: "leave_req_123",
     producerId: "producer_456",
     producerName: "John Doe",
     anchorId: "anchor_789",
     anchorName: "Green Valley Anchor",
     relationshipId: "rel_012",
     reason: "Better opportunities elsewhere",
     status: "pending-ca",
     createdAt: "2025-12-13T10:00:00Z"
   }
   ```

2. **Sends Notification to CA**
   ```typescript
   Notification {
     role: "🌾 Producer/Farmer",
     targetRole: "coordinating-agency",
     message: "John Doe has requested to leave anchor 'Green Valley Anchor'.",
     type: "producer-leave-request",
     leaveRequestId: "leave_req_123",
     producerId: "producer_456",
     anchorId: "anchor_789"
   }
   ```

#### **What the Producer Sees:**
```
✅ Leave request submitted successfully!

The Coordinating Agency will review your request and initiate 
M&E verification. You will be notified of the decision.
```

**Current Status:** `pending-ca`

---

### **STEP 2: CA REVIEWS AND CREATES M&E PROJECT**

**Who:** Coordinating Agency  
**Where:** CA Portal → Relationships → Leave Requests  
**Duration:** 1-2 business days

#### **What the CA Does:**

1. **Receives Notification**
   - Notification: "John Doe has requested to leave anchor 'Green Valley Anchor'"
   - Click notification to navigate to Leave Requests page

2. **View Request Details**
   - Producer information
   - Anchor information
   - Reason for leaving
   - Request date
   - Status: "Pending CA Review"

3. **Review the Request**
   - Is the reason valid?
   - Are there any red flags?
   - Should M&E verify?
   - Any disputes or issues?

4. **Create M&E Project**
   - Click "Create M&E Project" button
   - M&E Project Modal opens with pre-filled data:
     - **Project Title:** "Leave Request Verification - [Producer] from [Anchor]"
     - **Project Type:** "Registration"
     - **Source Type:** "Producer"
     - **Source ID:** [producer-id]
     - **Description:** Auto-filled with request details
   - CA fills in:
     - Assign M&E Member (dropdown)
     - Set Priority (High/Medium/Low)
     - Add additional notes
   - Click "Create Project"

#### **What the System Does:**

1. **Creates M&E Project**
   ```typescript
   MEProject {
     id: "me_project_789",
     title: "Leave Request Verification - John Doe from Green Valley",
     type: "registration",
     sourceType: "producer",
     sourceId: "producer_456",
     assignedTo: "me_member_123",
     priority: "medium",
     status: "pending",
     createdAt: "2025-12-14T14:00:00Z"
   }
   ```

2. **Updates Leave Request**
   ```typescript
   LeaveRequest {
     status: "pending-me",  // Changed from pending-ca
     meProjectId: "me_project_789"
   }
   ```

3. **Sends Notification to Producer**
   ```typescript
   Notification {
     role: "🏛️ Coordinating Agency",
     targetRole: "producer",
     message: "Your leave request from 'Green Valley Anchor' has been sent for M&E verification.",
     type: "leave-request-me-verification"
   }
   ```

4. **Sends Notification to Anchor**
   ```typescript
   Notification {
     role: "🏛️ Coordinating Agency",
     targetRole: "anchor",
     message: "Leave request from 'John Doe' is being verified by M&E.",
     type: "leave-request-me-verification"
   }
   ```

**Current Status:** `pending-me`

---

### **STEP 3: M&E TEAM VERIFIES THE REQUEST**

**Who:** M&E Team Member  
**Where:** M&E Portal → My Projects  
**Duration:** 3-7 business days

#### **What M&E Does:**

1. **Receives Project Assignment**
   - Email/notification about new M&E project
   - Project appears in "My Projects"

2. **Conducts Verification**
   - **Identity Verification:**
     - Verify producer identity
     - Confirm producer is who they claim to be
   
   - **Relationship Verification:**
     - Confirm current relationship status is "active"
     - Check relationship start date
     - Review relationship history
   
   - **Obligations Check:**
     - Check for pending payments
     - Review any contracts or agreements
     - Verify no outstanding obligations
   
   - **Reason Validation:**
     - Interview producer (phone/in-person)
     - Understand the reason for leaving
     - Check if reason is legitimate
   
   - **Anchor Contact (if needed):**
     - Interview anchor
     - Get anchor's perspective
     - Check for any disputes
   
   - **Documentation:**
     - Take photos/evidence
     - Document all findings
     - Create detailed report

3. **Submits M&E Report**
   - **Recommendation:** Approve or Reject
   - **Findings:** Detailed verification results
   - **Evidence:** Photos, documents, interview notes
   - **Notes:** Any additional observations

#### **Typical M&E Verification Checklist:**

✅ Producer identity verified  
✅ Relationship status confirmed as active  
✅ No pending obligations found  
✅ Leave reason validated  
✅ Producer interviewed  
✅ Anchor contacted (if needed)  
✅ No disputes or issues found  
✅ Documentation complete  

**M&E Recommendation:** APPROVE or REJECT

---

### **STEP 4: CA MAKES FINAL DECISION**

**Who:** Coordinating Agency  
**Where:** CA Portal → Relationships → Leave Requests  
**Duration:** 1-2 business days after M&E report

#### **What the CA Does:**

1. **Receives M&E Report**
   - M&E submits verification report
   - Leave request status still shows "Pending M&E"
   - But now has M&E report attached

2. **Review M&E Report**
   - Navigate to Leave Requests
   - Filter by "Pending M&E"
   - Click on the request
   - View M&E report:
     - M&E recommendation
     - Verification findings
     - Evidence and documentation
     - Any issues or concerns

3. **Make Final Decision**
   - Based on M&E recommendation
   - Based on findings
   - Based on policy

---

#### **OPTION A: CA APPROVES (Terminates Relationship)**

**CA Actions:**
- Click "Approve & Terminate" button
- Confirm termination

**System Actions:**

1. **Updates Relationship**
   ```typescript
   Relationship {
     status: "terminated",  // Changed from active
     terminatedAt: "2025-12-20T11:00:00Z",
     terminationReason: "Better opportunities elsewhere"
   }
   ```

2. **Updates Leave Request**
   ```typescript
   LeaveRequest {
     status: "approved",  // Changed from pending-me
     reviewedAt: "2025-12-20T11:00:00Z"
   }
   ```

3. **Notifies Producer**
   ```typescript
   Notification {
     role: "🏛️ Coordinating Agency",
     targetRole: "producer",
     message: "Your leave request from 'Green Valley Anchor' has been approved. The relationship has been terminated.",
     type: "leave-request-approved"
   }
   ```

4. **Notifies Anchor**
   ```typescript
   Notification {
     role: "🏛️ Coordinating Agency",
     targetRole: "anchor",
     message: "John Doe has left your organization. The relationship has been terminated.",
     type: "producer-left",
     reason: "Better opportunities elsewhere"
   }
   ```

**Result:**
- ✅ Relationship is TERMINATED
- ✅ Producer is no longer in anchor's network
- ✅ Both parties notified
- ✅ Visible in relationship history

---

#### **OPTION B: CA REJECTS (Maintains Relationship)**

**CA Actions:**
- Click "Reject" button
- Enter rejection reason
- Confirm rejection

**System Actions:**

1. **Updates Leave Request**
   ```typescript
   LeaveRequest {
     status: "rejected",
     reviewedAt: "2025-12-20T11:00:00Z",
     rejectionReason: "Outstanding obligations must be fulfilled first"
   }
   ```

2. **Relationship Remains Active**
   - No changes to relationship
   - Status stays "active"

3. **Notifies Producer**
   ```typescript
   Notification {
     role: "🏛️ Coordinating Agency",
     targetRole: "producer",
     message: "Your leave request from 'Green Valley Anchor' has been rejected.",
     type: "leave-request-rejected",
     rejectionReason: "Outstanding obligations must be fulfilled first"
   }
   ```

4. **Notifies Anchor**
   ```typescript
   Notification {
     role: "🏛️ Coordinating Agency",
     targetRole: "anchor",
     message: "Leave request from 'John Doe' has been rejected. The relationship remains active.",
     type: "leave-request-rejected"
   }
   ```

**Result:**
- ❌ Leave request REJECTED
- 🔗 Relationship remains ACTIVE
- 📝 Producer knows the reason
- ⏳ Producer can submit new request later

---

## 🔄 **STATUS FLOW DIAGRAM**

```
pending-ca (Producer submits)
    │
    ├─► CA creates M&E project ──► pending-me (M&E verifies)
    │                                    │
    │                                    ├─► CA approves ──► approved ✅
    │                                    │                   (Relationship: terminated)
    │                                    │
    │                                    └─► CA rejects ──► rejected ❌
    │                                                       (Relationship: active)
    │
    └─► CA rejects directly ──► rejected ❌
                                (Relationship: active)
```

---

## ⏱️ **TYPICAL TIMELINE**

| Day | Time | Actor | Action | Status After |
|-----|------|-------|--------|--------------|
| **Monday** | 10:00 AM | Producer | Submits leave request | `pending-ca` |
| **Monday** | 10:01 AM | System | Notifies CA | `pending-ca` |
| **Tuesday** | 2:00 PM | CA | Creates M&E project | `pending-me` |
| **Tuesday** | 2:01 PM | System | Notifies Producer & Anchor | `pending-me` |
| **Tuesday** | 3:00 PM | M&E | Receives project assignment | `pending-me` |
| **Wed-Fri** | Various | M&E | Conducts verification | `pending-me` |
| **Friday** | 4:00 PM | M&E | Submits report | `pending-me` |
| **Monday** | 11:00 AM | CA | Reviews M&E report | `pending-me` |
| **Monday** | 11:30 AM | CA | Approves & terminates | `approved` ✅ |
| **Monday** | 11:31 AM | System | Notifies both parties | `approved` ✅ |

**Total Duration:** 7-10 business days (typical)

---

## 🔔 **ALL NOTIFICATIONS SENT**

### **To Coordinating Agency:**
1. When producer submits leave request

### **To Producer:**
1. When CA creates M&E project (verification started)
2. When CA approves leave request (relationship terminated)
3. When CA rejects leave request (relationship remains active)

### **To Anchor:**
1. When CA creates M&E project (verification started)
2. When CA approves leave request (producer left)
3. When CA rejects leave request (relationship remains active)

**Total Notifications:** Up to 7 notifications across all parties

---

## ✅ **SUCCESS CRITERIA**

A successful leave request process results in:

✅ **Relationship Terminated** - Status is "terminated"  
✅ **Both Parties Notified** - Producer and Anchor receive confirmation  
✅ **M&E Verification Complete** - Full verification conducted  
✅ **CA Oversight Maintained** - CA approved based on M&E report  
✅ **Complete Audit Trail** - All actions and decisions recorded  
✅ **Reason Documented** - Leave reason stored in relationship record  
✅ **History Preserved** - Relationship visible in history for both parties  

---

## 🚫 **REJECTION SCENARIOS**

### **CA Rejects Before M&E:**
- **Reason:** Invalid request, missing information, policy violation
- **Result:** No M&E verification, relationship stays active

### **CA Rejects After M&E:**
- **Reason:** M&E found issues, outstanding obligations, disputes
- **Result:** Relationship stays active, producer must resolve issues

### **Common Rejection Reasons:**
- Outstanding financial obligations
- Pending contracts or agreements
- Unresolved disputes
- Insufficient reason for leaving
- Policy violations
- M&E verification failed

---

## 💡 **IMPORTANT NOTES**

### **1. M&E Verification is Mandatory:**
- Cannot approve without M&E verification
- Ensures legitimate leave requests
- Protects both parties

### **2. Producer Can Resubmit:**
- If rejected, can submit new request
- Must address rejection reasons
- No limit on resubmissions

### **3. Relationship History Preserved:**
- Terminated relationships visible in history
- Both parties can view past relationships
- Complete timeline of events

### **4. No Self-Service Termination:**
- Producer cannot leave directly
- Must go through CA and M&E
- Ensures proper oversight

---

*Last Updated: December 13, 2025 - 05:15*  
*Powered by Mc. George*
