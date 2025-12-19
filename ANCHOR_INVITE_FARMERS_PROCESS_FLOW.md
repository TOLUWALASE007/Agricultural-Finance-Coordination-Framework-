# 🔄 ANCHOR INVITES FARMERS - COMPLETE PROCESS FLOW

## 📊 **VISUAL PROCESS FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ANCHOR INVITES FARMERS - COMPLETE WORKFLOW                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 1: ANCHOR INITIATES INVITATION                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  👤 ANCHOR                                                                   │
│   │                                                                           │
│   ├─► Login to Anchor Portal                                                │
│   │                                                                           │
│   ├─► Navigate: Producer/Farmer Management → Invite Existing Producers      │
│   │                                                                           │
│   ├─► View list of VERIFIED producers (who don't have relationship)         │
│   │                                                                           │
│   ├─► Search/Filter producers by:                                           │
│   │    • Name                                                                │
│   │    • Farm name                                                           │
│   │    • Location                                                            │
│   │    • Crops/Livestock                                                     │
│   │                                                                           │
│   ├─► Select producer(s) to invite (can select multiple)                    │
│   │                                                                           │
│   └─► Click "Send Invitations to CA"                                        │
│                                                                               │
│  📤 SYSTEM ACTION:                                                           │
│   ├─► Create Relationship Record                                            │
│   │    • Status: "pending-ca-approval"                                       │
│   │    • Created By: "anchor"                                                │
│   │    • Anchor ID: [anchor-id]                                              │
│   │    • Producer ID: [producer-id]                                          │
│   │                                                                           │
│   └─► Send Notification to CA                                               │
│        • Type: "producer-invitation-request"                                 │
│        • Message: "[Anchor] wants to invite [Producer]..."                  │
│                                                                               │
│  ✅ CONFIRMATION:                                                            │
│   └─► "Invitation requests sent to CA for X producer(s)"                    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 2: CA REVIEWS INVITATION REQUEST                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  👔 COORDINATING AGENCY (CA)                                                │
│   │                                                                           │
│   ├─► Receives notification: "Anchor wants to invite Producer..."           │
│   │                                                                           │
│   ├─► Navigate: Relationships → Invitation Requests                         │
│   │                                                                           │
│   ├─► View invitation request details:                                      │
│   │    • Anchor information                                                  │
│   │    • Producer information                                                │
│   │    • Request date                                                        │
│   │    • Status: "Pending CA Approval"                                       │
│   │                                                                           │
│   └─► Decision: APPROVE or REJECT                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                │
                    │                                │
        ┌───────────┴──────────┐        ┌───────────┴──────────┐
        │                      │        │                      │
        ▼                      │        ▼                      │
   ✅ APPROVE                  │   ❌ REJECT                   │
        │                      │        │                      │
        │                      │        │                      │
┌───────┴──────────────────────┴────────┴──────────────────────┴──────────────┐
│  OPTION A: CA APPROVES                │  OPTION B: CA REJECTS               │
├───────────────────────────────────────┼─────────────────────────────────────┤
│                                       │                                     │
│  📤 SYSTEM ACTION:                    │  📤 SYSTEM ACTION:                  │
│   ├─► Update Relationship             │   ├─► Update Relationship           │
│   │    • Status: "invitation-sent"    │   │    • Status: "rejected"         │
│   │    • Invitation Sent At: [date]   │   │    • Rejection Reason: [text]   │
│   │                                    │   │                                 │
│   ├─► Send Notification to PRODUCER   │   └─► Send Notification to ANCHOR  │
│   │    • Type: "producer-invitation"  │        • Type: "invitation-rejected"│
│   │    • Message: "You have received  │        • Message: "Your invitation  │
│   │      an invitation from [Anchor]" │          request was rejected..."   │
│   │                                    │                                     │
│   └─► Send Notification to ANCHOR     │  ✅ PROCESS ENDS                    │
│        • Type: "invitation-approved"  │                                     │
│        • Message: "CA approved your   │                                     │
│          invitation to [Producer]"    │                                     │
│                                       │                                     │
└───────────────────────────────────────┴─────────────────────────────────────┘
        │
        │ (If Approved)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 3: PRODUCER RECEIVES INVITATION                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🌾 PRODUCER/FARMER                                                          │
│   │                                                                           │
│   ├─► Receives notification: "You have an invitation from [Anchor]"         │
│   │                                                                           │
│   ├─► Navigate: Anchor Relationships → Accept/Decline Invitations           │
│   │                                                                           │
│   ├─► View invitation details:                                              │
│   │    • Anchor organization name                                            │
│   │    • Anchor contact person                                               │
│   │    • Anchor industry                                                     │
│   │    • Anchor location                                                     │
│   │    • Anchor mission statement                                            │
│   │    • Areas of operation                                                  │
│   │                                                                           │
│   ├─► Click "View Full Details" (optional)                                  │
│   │    • See complete anchor profile                                         │
│   │                                                                           │
│   └─► Decision: ACCEPT or DECLINE                                           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                │
                    │                                │
        ┌───────────┴──────────┐        ┌───────────┴──────────┐
        │                      │        │                      │
        ▼                      │        ▼                      │
   ✅ ACCEPT                   │   ❌ DECLINE                  │
        │                      │        │                      │
        │                      │        │                      │
┌───────┴──────────────────────┴────────┴──────────────────────┴──────────────┐
│  OPTION A: PRODUCER ACCEPTS           │  OPTION B: PRODUCER DECLINES        │
├───────────────────────────────────────┼─────────────────────────────────────┤
│                                       │                                     │
│  📤 SYSTEM ACTION:                    │  📤 SYSTEM ACTION:                  │
│   ├─► Update Relationship             │   ├─► Update Relationship           │
│   │    • Status: "pending-ca-approval"│   │    • Status: "invitation-       │
│   │      (again, for final approval)  │   │      declined"                  │
│   │                                    │   │    • Decline Reason: [text]     │
│   │                                    │   │    • Declined At: [date]        │
│   ├─► Send Notification to CA         │   │                                 │
│   │    • Type: "producer-invitation-  │   ├─► Send Notification to CA       │
│   │      accepted"                     │   │    • Type: "producer-invitation-│
│   │    • Message: "[Producer] has     │   │      declined"                  │
│   │      accepted invitation from     │   │    • Message: "[Producer]       │
│   │      [Anchor]"                     │   │      declined invitation..."    │
│   │                                    │   │                                 │
│   └─► Send Notification to ANCHOR     │   └─► Send Notification to ANCHOR  │
│        • Type: "producer-invitation-  │        • Type: "producer-invitation-│
│          accepted"                     │          declined"                  │
│        • Message: "[Producer] has     │        • Message: "[Producer]       │
│          accepted your invitation.    │          declined your invitation"  │
│          Awaiting CA final approval"  │                                     │
│                                       │  ✅ PROCESS ENDS                    │
│                                       │                                     │
└───────────────────────────────────────┴─────────────────────────────────────┘
        │
        │ (If Accepted)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  STEP 4: CA GIVES FINAL APPROVAL                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  👔 COORDINATING AGENCY (CA)                                                │
│   │                                                                           │
│   ├─► Receives notification: "[Producer] accepted invitation from [Anchor]" │
│   │                                                                           │
│   ├─► Navigate: Relationships → Invitation Requests                         │
│   │                                                                           │
│   ├─► View accepted invitation:                                             │
│   │    • Status: "Pending CA Approval" (final)                               │
│   │    • Producer accepted at: [date]                                        │
│   │                                                                           │
│   ├─► Review the acceptance                                                 │
│   │                                                                           │
│   └─► Click "Approve Final Relationship"                                    │
│                                                                               │
│  📤 SYSTEM ACTION:                                                           │
│   ├─► Update Relationship                                                   │
│   │    • Status: "active"                                                    │
│   │    • Approved At: [date]                                                 │
│   │                                                                           │
│   ├─► Send Notification to ANCHOR                                           │
│   │    • Type: "relationship-active"                                         │
│   │    • Message: "Your relationship with [Producer] is now active!"        │
│   │                                                                           │
│   └─► Send Notification to PRODUCER                                         │
│        • Type: "relationship-active"                                         │
│        • Message: "Your relationship with [Anchor] is now active!"          │
│                                                                               │
│  ✅ RELATIONSHIP IS NOW ACTIVE!                                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  FINAL RESULT: ACTIVE RELATIONSHIP                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🎉 SUCCESS!                                                                 │
│                                                                               │
│  ✅ Anchor can now:                                                          │
│   ├─► See producer in "Manage Current Producers"                            │
│   ├─► View producer details and activity                                    │
│   ├─► Communicate with producer                                             │
│   └─► Include producer in their network                                     │
│                                                                               │
│  ✅ Producer can now:                                                        │
│   ├─► See anchor in "View Current Anchors"                                  │
│   ├─► View anchor details                                                   │
│   ├─► Communicate with anchor                                               │
│   ├─► Access anchor's schemes and opportunities                             │
│   └─► Request to leave anchor (if needed)                                   │
│                                                                               │
│  📊 Relationship Details:                                                   │
│   • Status: ACTIVE                                                           │
│   • Created By: Anchor                                                       │
│   • Created At: [original date]                                             │
│   • Approved At: [final approval date]                                      │
│   • Visible to: Anchor, Producer, CA                                        │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 **DETAILED STEP-BY-STEP BREAKDOWN**

### **STEP 1: ANCHOR INITIATES INVITATION**

**Who:** Anchor  
**Where:** Anchor Portal → Producer/Farmer Management → Invite Existing Producers  
**Duration:** 2-5 minutes

**Actions:**
1. Login to Anchor Portal
2. Click "Producer/Farmer Management 🌾" in sidebar
3. Click "📨 Invite Existing Producers"
4. View list of verified producers
5. Search/filter producers (optional)
6. Select one or more producers (checkbox)
7. Click "Send Invitations to CA"
8. Confirm action

**System Creates:**
- Relationship record with status: `pending-ca-approval`
- Notification to CA

**Anchor Sees:**
- Confirmation message: "Invitation requests sent to CA for X producer(s)"

---

### **STEP 2: CA REVIEWS INVITATION REQUEST**

**Who:** Coordinating Agency  
**Where:** CA Portal → Relationships → Invitation Requests  
**Duration:** 1-2 business days (typical)

**Actions:**
1. CA receives notification
2. Navigate to Invitation Requests page
3. View request details:
   - Anchor name and info
   - Producer name and info
   - Request date
4. Review the request
5. Make decision: Approve or Reject

**If APPROVED:**
- Relationship status → `invitation-sent`
- Notification sent to Producer
- Notification sent to Anchor (confirmation)

**If REJECTED:**
- Relationship status → `rejected`
- Notification sent to Anchor with reason
- Process ends

---

### **STEP 3: PRODUCER RECEIVES INVITATION**

**Who:** Producer/Farmer  
**Where:** Producer Portal → Anchor Relationships → Accept/Decline Invitations  
**Duration:** Variable (producer's discretion)

**Actions:**
1. Producer receives notification
2. Navigate to Invitations page
3. View invitation details:
   - Anchor organization name
   - Contact person
   - Industry
   - Location
   - Mission statement
4. Click "View Full Details" (optional)
5. Make decision: Accept or Decline

**If ACCEPTED:**
- Relationship status → `pending-ca-approval` (for final approval)
- Notification sent to CA
- Notification sent to Anchor

**If DECLINED:**
- Relationship status → `invitation-declined`
- Must provide decline reason
- Notification sent to CA
- Notification sent to Anchor
- Process ends

---

### **STEP 4: CA GIVES FINAL APPROVAL**

**Who:** Coordinating Agency  
**Where:** CA Portal → Relationships → Invitation Requests  
**Duration:** 1-2 business days (typical)

**Actions:**
1. CA receives notification of producer acceptance
2. Navigate to Invitation Requests page
3. View the accepted invitation
4. Review the acceptance
5. Click "Approve Final Relationship"

**System Updates:**
- Relationship status → `active`
- Approved at timestamp set
- Notifications sent to both parties

**Result:**
- ✅ Relationship is now ACTIVE
- Both parties can see each other in their portals
- Communication and collaboration can begin

---

## 🔄 **RELATIONSHIP STATUS FLOW**

```
pending-ca-approval (Initial)
        │
        ├─► CA Approves ──► invitation-sent
        │                          │
        │                          ├─► Producer Accepts ──► pending-ca-approval (Final)
        │                          │                                │
        │                          │                                └─► CA Approves ──► ACTIVE ✅
        │                          │
        │                          └─► Producer Declines ──► invitation-declined ❌
        │
        └─► CA Rejects ──► rejected ❌
```

---

## 📊 **TIMELINE EXAMPLE**

| Day | Time | Actor | Action | Status |
|-----|------|-------|--------|--------|
| **Day 1** | 10:00 AM | Anchor | Sends invitation request | `pending-ca-approval` |
| **Day 1** | 10:01 AM | CA | Receives notification | `pending-ca-approval` |
| **Day 2** | 2:00 PM | CA | Reviews and approves | `invitation-sent` |
| **Day 2** | 2:01 PM | Producer | Receives notification | `invitation-sent` |
| **Day 3** | 9:00 AM | Producer | Reviews invitation | `invitation-sent` |
| **Day 3** | 9:15 AM | Producer | Accepts invitation | `pending-ca-approval` |
| **Day 3** | 9:16 AM | CA | Receives acceptance notification | `pending-ca-approval` |
| **Day 4** | 11:00 AM | CA | Gives final approval | `active` ✅ |
| **Day 4** | 11:01 AM | Both | Relationship is active | `active` ✅ |

**Total Duration:** 3-4 days (typical)

---

## 🎯 **KEY POINTS**

### **Multiple Approval Stages:**
1. **CA Approval #1:** Before invitation is sent to producer
2. **Producer Decision:** Accept or decline
3. **CA Approval #2:** Final approval after producer accepts

### **Why Multiple Approvals?**
- **Quality Control:** CA ensures only legitimate relationships
- **Producer Protection:** Producer can review and decide
- **Fraud Prevention:** Prevents spam invitations
- **Audit Trail:** Complete record of all decisions

### **Notifications Sent:**
- **To CA:** When anchor sends request, when producer responds
- **To Anchor:** When CA approves/rejects, when producer responds, when final approval
- **To Producer:** When invitation is sent, when relationship is active

---

## 🚫 **POSSIBLE REJECTION POINTS**

### **1. CA Rejects Initial Request**
- **Reason:** Anchor not legitimate, producer not suitable, etc.
- **Result:** Process ends, anchor notified

### **2. Producer Declines Invitation**
- **Reason:** Not interested, wrong anchor, timing issues, etc.
- **Result:** Process ends, both parties notified

### **3. CA Rejects Final Approval** (rare)
- **Reason:** New information, policy change, etc.
- **Result:** Process ends, both parties notified

---

## 📱 **USER INTERFACE TOUCHPOINTS**

### **Anchor Portal:**
1. **Invite Existing Producers** - Send invitations
2. **Manage Current Producers** - View active relationships
3. **Notifications** - Track invitation status

### **Producer Portal:**
1. **Accept/Decline Invitations** - Respond to invitations
2. **View Current Anchors** - See active relationships
3. **Notifications** - Track invitation status

### **CA Portal:**
1. **Invitation Requests** - Review and approve/reject
2. **Notifications** - Track all invitation activities
3. **Relationships** - Monitor all relationships

---

## 🎉 **SUCCESS CRITERIA**

A successful invitation process results in:

✅ **Active Relationship** between Anchor and Producer  
✅ **Both parties notified** of active status  
✅ **Visible in both portals** (Manage Producers / Current Anchors)  
✅ **Communication enabled** between parties  
✅ **Complete audit trail** of all decisions  
✅ **CA oversight** maintained throughout  

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues:**

**Issue:** Producer doesn't see invitation  
**Solution:** Check if CA approved the request, check producer notifications

**Issue:** Invitation stuck in pending  
**Solution:** Contact CA to review and approve

**Issue:** Want to cancel invitation  
**Solution:** Contact CA (no self-service cancellation currently)

**Issue:** Producer declined, want to re-invite  
**Solution:** Must wait for relationship status to clear, then send new invitation

---

*Last Updated: December 13, 2025 - 04:35*  
*Powered by Mc. George*
