# 📨 HOW ANCHORS INVITE PRODUCERS/FARMERS - COMPLETE GUIDE

## 🎯 **OVERVIEW**

Anchors can invite **existing verified producers/farmers** to join their network through a multi-step approval process involving the Coordinating Agency (CA).

---

## 📍 **WHERE TO FIND IT**

### **Navigation Path:**
```
Anchor Portal → Producer/Farmer Management → Invite Existing Producers
```

### **Direct URL:**
```
http://localhost:3000/Agricultural-Finance-Coordination-Framework-#/portal/anchor/producer-management/invite
```

### **File Location:**
```
src/pages/portals/Anchor/ProducerManagement/InviteProducers.tsx
```

---

## 🔄 **THE INVITATION WORKFLOW**

### **Step-by-Step Process:**

```
1. ANCHOR selects producers to invite
   ↓
2. ANCHOR sends invitation request to CA
   ↓
3. CA reviews and approves the invitation request
   ↓
4. CA sends invitation to PRODUCER
   ↓
5. PRODUCER accepts or declines the invitation
   ↓
6. If accepted, CA gives final approval
   ↓
7. Relationship becomes ACTIVE
```

---

## 📋 **HOW ANCHORS INVITE PRODUCERS**

### **Step 1: Access the Invitation Page**

1. Login to the **Anchor Portal**
2. Click on **"Producer/Farmer Management 🌾"** in the sidebar
3. Click on **"📨 Invite Existing Producers"** from the dropdown

---

### **Step 2: View Available Producers**

The page displays a list of **verified producers** who:
- ✅ Have been verified by the CA
- ✅ Do NOT already have an active relationship with this anchor
- ✅ Do NOT have a pending invitation from this anchor

**What You'll See:**
- Producer's full name
- Farm/Business name
- Location (City, State)
- Phone number
- Email (if provided)
- Types of farming (Crop, Livestock, Mixed)
- Crops and livestock they produce

---

### **Step 3: Search and Filter Producers**

**Search by:**
- Producer name
- Farm/business name
- Phone number
- Email address

**Example:**
```
Search: "John" → Shows all producers with "John" in their name
Search: "Rice" → Shows producers who grow rice
Search: "Lagos" → Shows producers in Lagos
```

---

### **Step 4: Select Producers to Invite**

**Options:**
1. **Select Individual Producers:**
   - Click the checkbox next to each producer you want to invite

2. **Select All:**
   - Click the **"Select All"** button to select all visible producers

3. **Deselect All:**
   - Click the **"Deselect All"** button to clear your selection

**Visual Feedback:**
- Selected producers are highlighted with a green border
- The selection count is displayed at the top

---

### **Step 5: Send Invitation Requests**

1. Click the **"Send Invitations to CA"** button
2. Confirm your selection
3. The system will:
   - Create a relationship record with status: `pending-ca-approval`
   - Send a notification to the CA for each selected producer
   - Show a confirmation message

**Confirmation Message:**
```
Invitation requests sent to CA for 3 producer(s):
John Doe, Jane Smith, Bob Johnson

The CA will review and approve before sending invitations to the producers.
```

---

## 🔔 **NOTIFICATIONS SENT**

### **1. To Coordinating Agency (CA):**

**Message:**
```
[Anchor Name] wants to invite producer "[Producer Name]" to join their network.
```

**Metadata:**
```typescript
{
    type: 'producer-invitation-request',
    relationshipId: '...',
    anchorId: '...',
    producerId: '...'
}
```

**What CA Sees:**
- Anchor name and details
- Producer name and details
- Invitation request details
- Options to approve or reject

---

### **2. After CA Approval - To Producer:**

**Message:**
```
You have received an invitation from [Anchor Name] to join their network.
```

**What Producer Sees:**
- Anchor organization details
- Invitation details
- Options to accept or decline

---

### **3. After Producer Acceptance - Back to CA:**

**Message:**
```
[Producer Name] has accepted the invitation from [Anchor Name].
```

**What CA Does:**
- Reviews the acceptance
- Gives final approval
- Relationship becomes active

---

## 📊 **RELATIONSHIP STATUSES**

| Status | Description | Who Can See |
|--------|-------------|-------------|
| `pending-ca-approval` | Anchor sent invitation, waiting for CA approval | Anchor, CA |
| `invitation-sent` | CA approved, invitation sent to producer | Anchor, CA, Producer |
| `pending-ca-approval` (again) | Producer accepted, waiting for CA final approval | All parties |
| `active` | CA gave final approval, relationship is active | All parties |
| `invitation-declined` | Producer declined the invitation | Anchor, CA, Producer |
| `rejected` | CA rejected the invitation request | Anchor, CA |

---

## 🚫 **PRODUCERS WHO WON'T APPEAR**

The invitation list **excludes** producers who:

1. ❌ **Are not verified** - Only verified producers can be invited
2. ❌ **Already have an active relationship** with this anchor
3. ❌ **Have a pending invitation** from this anchor
4. ❌ **Have a pending CA approval** for this anchor

**Why?**
- Prevents duplicate invitations
- Ensures only verified producers are invited
- Maintains data integrity

---

## 💡 **IMPORTANT NOTES**

### **1. CA Approval Required:**
- Anchors **cannot** directly invite producers
- All invitations must be **approved by the CA first**
- This ensures quality control and prevents abuse

### **2. Producer Must Accept:**
- Even after CA approval, the producer can **decline**
- Producers have full control over which anchors they join

### **3. Final CA Approval:**
- After producer acceptance, CA gives **final approval**
- This ensures the relationship is legitimate

### **4. Multiple Invitations:**
- Anchors can invite **multiple producers at once**
- Each invitation is processed separately
- All follow the same approval workflow

---

## 🔍 **TECHNICAL IMPLEMENTATION**

### **Key Functions:**

```typescript
// Load available producers
const loadProducers = (anchorId: string) => {
    const allProducers = getProducers().filter(p => p.status === 'verified');
    const availableProducers = allProducers.filter(p => {
        const hasActive = hasActiveRelationship(anchorId, p.id);
        const hasPending = hasPendingInvitation(anchorId, p.id);
        return !hasActive && !hasPending;
    });
    setProducers(availableProducers);
};

// Send invitations
const handleSendInvitations = async () => {
    selectedProducers.forEach(producerId => {
        // Create relationship
        const relationship = createRelationship({
            anchorId: anchorRecord.id,
            producerId: producerId,
            status: 'pending-ca-approval',
            createdBy: 'anchor',
        });

        // Notify CA
        addNotification({
            role: '⚓ Anchor',
            targetRole: 'coordinating-agency',
            message: `${anchorName} wants to invite producer "${producerName}"...`,
            metadata: {
                type: 'producer-invitation-request',
                relationshipId: relationship.id,
            },
        });
    });
};
```

---

## 🎨 **USER INTERFACE**

### **Page Layout:**

```
┌─────────────────────────────────────────────────────┐
│  📨 Invite Existing Producers                       │
│  Select verified producers to invite to your network│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ℹ️ How Invitations Work                            │
│  • Only verified producers can be invited           │
│  • CA must approve before invitation is sent        │
│  • Producer can accept or decline                   │
│  • CA gives final approval after acceptance         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  🔍 Search: [________________]                      │
│  [Select All] [Deselect All]  Selected: 3          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ☐ John Doe                                         │
│     Green Valley Farm | Lagos, Nigeria              │
│     Crops: Rice, Maize | Livestock: Poultry        │
├─────────────────────────────────────────────────────┤
│  ☑ Jane Smith                                       │
│     Sunshine Farms | Ibadan, Oyo                    │
│     Crops: Cassava, Yam | Livestock: Goat          │
├─────────────────────────────────────────────────────┤
│  ☑ Bob Johnson                                      │
│     Happy Harvest | Kano, Kano                      │
│     Crops: Wheat, Sorghum | Livestock: Cattle      │
└─────────────────────────────────────────────────────┘

                [Send Invitations to CA]
```

---

## ✅ **BEST PRACTICES**

### **For Anchors:**

1. **Review Producer Profiles:**
   - Check their farming activities
   - Verify their location
   - Ensure they align with your needs

2. **Select Carefully:**
   - Only invite producers you genuinely want to work with
   - Consider their production capacity
   - Check their experience level

3. **Batch Invitations:**
   - You can invite multiple producers at once
   - But don't spam - be selective

4. **Follow Up:**
   - Monitor invitation status
   - Check notifications for updates
   - Be ready to onboard accepted producers

---

## 🧪 **TESTING THE FLOW**

### **Complete Test Scenario:**

1. **Setup:**
   - Create an Anchor account (verified)
   - Create 2-3 Producer accounts (verified)
   - Login as Anchor

2. **Send Invitations:**
   - Go to Invite Existing Producers
   - Select 2 producers
   - Click "Send Invitations to CA"
   - ✅ Verify confirmation message

3. **CA Approval:**
   - Logout, login as CA
   - Check notifications
   - ✅ Should see invitation requests
   - Approve the invitations

4. **Producer Response:**
   - Logout, login as Producer
   - Check notifications
   - ✅ Should see invitation from anchor
   - Accept the invitation

5. **Final CA Approval:**
   - Logout, login as CA
   - Check notifications
   - ✅ Should see producer acceptance
   - Give final approval

6. **Verify Active Relationship:**
   - Login as Anchor
   - Go to Manage Current Producers
   - ✅ Should see the invited producers

---

## 📞 **RELATED FEATURES**

### **Other Ways to Add Producers:**

1. **Create New Producer:**
   - Anchor creates a new producer account
   - Sends to CA for approval
   - CA approves and creates the producer
   - Relationship is automatically created

2. **Producer Join Requests:**
   - Producer initiates the relationship
   - Sends join request to anchor
   - Anchor reviews and accepts/rejects
   - (This feature may be implemented in the future)

---

## 🎯 **SUMMARY**

**How Anchors Invite Farmers:**

1. ✅ Navigate to **Producer/Farmer Management → Invite Existing Producers**
2. ✅ Search and select **verified producers**
3. ✅ Click **"Send Invitations to CA"**
4. ✅ Wait for **CA approval**
5. ✅ Wait for **producer acceptance**
6. ✅ Wait for **CA final approval**
7. ✅ Relationship becomes **active**

**Key Points:**
- Only **verified** producers can be invited
- **CA approval** required at two stages
- **Producer** must accept the invitation
- **Multi-step** process ensures quality

---

*Last Updated: December 13, 2025 - 04:10*  
*Powered by Mc. George*
