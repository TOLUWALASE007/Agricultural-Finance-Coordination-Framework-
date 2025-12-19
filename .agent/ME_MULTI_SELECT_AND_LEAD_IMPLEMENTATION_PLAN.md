# M&E Multi-Select and Lead M&E Implementation Plan

## Overview
This document outlines the implementation plan for enabling the Coordinating Agency (CA) to select multiple M&E entities for a single project, designate one as the Lead M&E, and ensure proper prioritization of Lead M&E reports in the notification portal.

## Requirements Summary

### 1. Multi-Select M&E Functionality
- CA must be able to select **more than one M&E** for a single project
- Selection interface should support **multi-select functionality**
- Include a **"Select All"** option for easy selection of multiple M&E entities

### 2. Lead M&E Designation
- CA must be able to designate **one selected M&E as the Lead M&E**
- Only **one Lead M&E** can be assigned per project at any given time
- Lead M&E must be chosen from the **already selected M&E entities** for that project

### 3. Report Prioritization
- All reports from both Lead and non-Lead M&E entities should be received at CA's notification portal
- Reports from **Lead M&E must be clearly marked as priority**
- Lead M&E reports must be **distinguished** from other M&E reports in:
  - CA's notification portal
  - Related approval/review lists
- Lead M&E report takes **precedence** over other M&E reports

### 4. Consistency
- This behavior should apply consistently across all projects
- Ensure clear prioritization, traceability, and proper workflow control

---

## Current System Analysis

### Existing M&E Structure (from localDatabase.ts)

```typescript
export interface MEProject {
  id: string;
  name: string;
  description?: string;
  projectType: MEProjectType;
  status: MEProjectStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Assignment - CURRENTLY SUPPORTS MULTIPLE M&E
  assignedMemberIds: string[];        // ✅ Already supports multiple
  assignedMemberNames: string[];      // ✅ Already supports multiple
  
  // Evaluation reports from assigned members
  evaluationReports: MEEvaluationReport[];  // ✅ Already supports multiple reports
  
  // ... other fields
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
}
```

**Key Findings:**
- ✅ System already supports assigning multiple M&E members to a project
- ✅ System already supports multiple evaluation reports
- ❌ No concept of "Lead M&E" currently exists
- ❌ No priority marking for Lead M&E reports in notifications

---

## Implementation Plan

### Phase 1: Database Schema Updates

#### 1.1 Update MEProject Interface
**File:** `src/utils/localDatabase.ts`

Add new fields to `MEProject` interface:

```typescript
export interface MEProject {
  // ... existing fields ...
  
  // NEW: Lead M&E designation
  leadMEMemberId?: string;           // ID of the designated Lead M&E
  leadMEMemberName?: string;         // Name of the designated Lead M&E
  leadMEAssignedAt?: string;         // Timestamp when Lead M&E was assigned
  leadMEAssignedBy?: string;         // CA user who assigned the Lead M&E
}
```

#### 1.2 Update MEEvaluationReport Interface
Add a flag to identify Lead M&E reports:

```typescript
export interface MEEvaluationReport {
  // ... existing fields ...
  
  // NEW: Lead M&E indicator
  isLeadMEReport?: boolean;          // True if submitted by Lead M&E
}
```

#### 1.3 Create Helper Functions
Add new functions to `localDatabase.ts`:

```typescript
// Assign Lead M&E to a project
export const assignLeadMEToProject = (
  projectId: string,
  leadMEMemberId: string,
  assignedBy: string
): MEProject | undefined

// Remove Lead M&E from a project
export const removeLeadMEFromProject = (
  projectId: string
): MEProject | undefined

// Check if M&E member is Lead for a project
export const isLeadMEForProject = (
  projectId: string,
  memberId: string
): boolean
```

---

### Phase 2: UI Updates - M&E Team Portal

#### 2.1 M&E Assignment Modal Enhancement
**File:** `src/pages/portals/CoordinatingAgency/METeamPortal.tsx`

**Current State:**
- Modal allows selecting multiple M&E members
- Uses checkboxes for selection

**Required Changes:**

1. **Add "Select All" Checkbox**
   - Position: Above the M&E member list
   - Functionality: Toggle all M&E members selection
   - Label: "Select All M&E Members"

2. **Add Lead M&E Designation Section**
   - Position: Below M&E member selection, only visible when members are selected
   - Component: Radio button group
   - Label: "Designate Lead M&E (Required)"
   - Options: Only show selected M&E members
   - Validation: Ensure one Lead M&E is selected before submission

**UI Mockup:**
```
┌─────────────────────────────────────────────────┐
│ Assign M&E Members to Project                   │
├─────────────────────────────────────────────────┤
│                                                  │
│ ☐ Select All M&E Members                        │
│                                                  │
│ Available M&E Members:                           │
│ ☑ John Doe (State M&E - Lagos)                  │
│ ☑ Jane Smith (Central M&E)                      │
│ ☐ Mike Johnson (Local M&E - Ikeja)              │
│                                                  │
├─────────────────────────────────────────────────┤
│ Designate Lead M&E (Required) *                 │
│                                                  │
│ ○ John Doe (State M&E - Lagos)                  │
│ ● Jane Smith (Central M&E)                      │
│                                                  │
├─────────────────────────────────────────────────┤
│ [Cancel]                      [Assign Members]  │
└─────────────────────────────────────────────────┘
```

#### 2.2 Project Details View Enhancement
**Display Lead M&E Badge:**
- Show a "LEAD" badge next to the Lead M&E member name
- Use distinct styling (e.g., gold/yellow badge)
- Position: In assigned members list

---

### Phase 3: Notification System Updates

#### 3.1 Update Notification Creation
**File:** `src/context/NotificationContext.tsx` or relevant notification handler

**When M&E submits a report:**

1. Check if the submitting M&E is the Lead M&E for the project
2. Add priority flag to notification metadata
3. Add visual indicator in notification message

**Notification Structure:**
```typescript
{
  id: string;
  type: 'me-report-submitted';
  message: string;
  timestamp: string;
  metadata: {
    projectId: string;
    evaluatorId: string;
    evaluatorName: string;
    isLeadMEReport: boolean;        // NEW: Priority flag
    priority: 'high' | 'normal';     // NEW: Priority level
  }
}
```

#### 3.2 Notification Display Enhancement
**File:** `src/pages/portals/CoordinatingAgency/[NotificationComponent].tsx`

**Visual Indicators for Lead M&E Reports:**

1. **Priority Badge:**
   - Text: "PRIORITY" or "LEAD M&E"
   - Color: Red or Gold
   - Position: Next to notification title

2. **Icon:**
   - Use a star (⭐) or priority icon (🔴)
   - Position: Before notification message

3. **Sorting:**
   - Lead M&E reports appear at the top of the list
   - Secondary sort by timestamp

**Example Display:**
```
┌─────────────────────────────────────────────────┐
│ Notifications                                    │
├─────────────────────────────────────────────────┤
│ ⭐ [PRIORITY] M&E Report Submitted               │
│    Lead M&E Jane Smith submitted evaluation     │
│    report for Project: Rice Scheme Verification │
│    2 hours ago                                   │
├─────────────────────────────────────────────────┤
│ 📋 M&E Report Submitted                          │
│    M&E John Doe submitted evaluation report     │
│    for Project: Rice Scheme Verification        │
│    3 hours ago                                   │
└─────────────────────────────────────────────────┘
```

---

### Phase 4: Reports Page Enhancement

#### 4.1 Update Reports List Display
**File:** `src/pages/portals/CoordinatingAgency/Reportings.tsx`

**Required Changes:**

1. **Add Priority Column:**
   - Column Header: "Priority"
   - Display: Badge showing "LEAD M&E" or "-"

2. **Add Lead M&E Filter:**
   - Filter Option: "Show Lead M&E Reports Only"
   - Position: In filter section

3. **Visual Distinction:**
   - Lead M&E reports: Highlighted row background (subtle gold/yellow tint)
   - Lead M&E badge in report type column

**Table Structure:**
```
┌──────────┬──────────────────┬─────────────┬──────────┬──────────┐
│ Priority │ Report Title     │ M&E Name    │ Date     │ Actions  │
├──────────┼──────────────────┼─────────────┼──────────┼──────────┤
│ ⭐ LEAD  │ Rice Scheme Eval │ Jane Smith  │ Dec 17   │ [View]   │
│          │                  │ (Lead M&E)  │          │          │
├──────────┼──────────────────┼─────────────┼──────────┼──────────┤
│    -     │ Rice Scheme Eval │ John Doe    │ Dec 17   │ [View]   │
│          │                  │             │          │          │
└──────────┴──────────────────┴─────────────┴──────────┴──────────┘
```

---

### Phase 5: Scheme Application Flow Integration

#### 5.1 Update Scheme Application Review
**Files:**
- `src/pages/portals/CoordinatingAgency/FundBeneficiaries/ProducersFarmers.tsx`
- `src/pages/portals/CoordinatingAgency/FundBeneficiaries/Anchors.tsx`
- `src/pages/portals/CoordinatingAgency/FundBeneficiaries/LeadFirms.tsx`

**When CA creates M&E project for scheme application:**

1. Show M&E selection modal with:
   - Multi-select checkboxes
   - "Select All" option
   - Lead M&E designation (radio buttons)

2. Validation:
   - At least one M&E must be selected
   - Exactly one Lead M&E must be designated
   - Lead M&E must be from selected M&E list

---

### Phase 6: M&E Member Portal Updates

#### 6.1 Project View Enhancement
**File:** `src/pages/portals/MEMemberPortal.tsx`

**Display Lead M&E Status:**
- Show badge if current user is the Lead M&E for the project
- Badge text: "You are the Lead M&E for this project"
- Badge color: Gold/Yellow
- Position: At the top of project details

**Example:**
```
┌─────────────────────────────────────────────────┐
│ Project: Rice Scheme Verification               │
│ ⭐ You are the Lead M&E for this project        │
├─────────────────────────────────────────────────┤
│ Project Details...                              │
└─────────────────────────────────────────────────┘
```

#### 6.2 Report Submission Enhancement
**When M&E submits report:**
- Automatically flag report as Lead M&E report if submitter is Lead M&E
- No UI changes needed (handled in backend logic)

---

## Implementation Steps

### Step 1: Database Schema (Priority: High)
1. ✅ Update `MEProject` interface with Lead M&E fields
2. ✅ Update `MEEvaluationReport` interface with `isLeadMEReport` flag
3. ✅ Create helper functions for Lead M&E management
4. ✅ Test database functions

### Step 2: M&E Team Portal UI (Priority: High)
1. ✅ Add "Select All" checkbox to M&E assignment modal
2. ✅ Add Lead M&E designation section (radio buttons)
3. ✅ Add validation for Lead M&E selection
4. ✅ Update project details view to show Lead M&E badge
5. ✅ Test M&E assignment flow

### Step 3: Notification System (Priority: High)
1. ✅ Update notification creation to include Lead M&E flag
2. ✅ Add priority badge to Lead M&E report notifications
3. ✅ Implement sorting to prioritize Lead M&E reports
4. ✅ Test notification display

### Step 4: Reports Page (Priority: Medium)
1. ✅ Add priority column to reports table
2. ✅ Add Lead M&E filter option
3. ✅ Add visual distinction for Lead M&E reports
4. ✅ Test reports list display

### Step 5: Scheme Application Integration (Priority: Medium)
1. ✅ Update scheme application review modals
2. ✅ Integrate Lead M&E selection in M&E project creation
3. ✅ Test end-to-end scheme application flow

### Step 6: M&E Member Portal (Priority: Low)
1. ✅ Add Lead M&E badge to project view
2. ✅ Update report submission logic
3. ✅ Test M&E member experience

### Step 7: Testing & Validation (Priority: High)
1. ✅ Test multi-select M&E functionality
2. ✅ Test Lead M&E designation
3. ✅ Test report prioritization in notifications
4. ✅ Test consistency across all projects
5. ✅ Test edge cases (reassignment, removal, etc.)

---

## Edge Cases & Considerations

### 1. Lead M&E Reassignment
**Scenario:** CA wants to change the Lead M&E for a project

**Solution:**
- Allow CA to edit M&E assignments
- When changing Lead M&E, update all future reports
- Past reports retain their original Lead M&E flag

### 2. Lead M&E Removal
**Scenario:** CA removes the Lead M&E from the project

**Options:**
- **Option A:** Prevent removal (require reassignment first)
- **Option B:** Automatically assign another M&E as Lead
- **Recommended:** Option A (explicit reassignment)

### 3. Single M&E Assignment
**Scenario:** Only one M&E is assigned to a project

**Solution:**
- Automatically designate that M&E as Lead
- Hide Lead M&E selection (not needed)

### 4. Report Submission Before Lead Assignment
**Scenario:** M&E submits report before Lead M&E is designated

**Solution:**
- Allow submission
- Mark as non-Lead report
- Update flag if M&E is later designated as Lead

### 5. Multiple Lead M&E Reports
**Scenario:** Lead M&E submits multiple reports

**Solution:**
- All reports from Lead M&E are marked as priority
- Sort by timestamp within priority group

---

## Testing Checklist

### Unit Tests
- [ ] `assignLeadMEToProject` function
- [ ] `removeLeadMEFromProject` function
- [ ] `isLeadMEForProject` function
- [ ] Notification priority flagging logic

### Integration Tests
- [ ] M&E assignment with Lead designation
- [ ] Report submission by Lead M&E
- [ ] Report submission by non-Lead M&E
- [ ] Notification creation and display
- [ ] Reports page filtering and sorting

### User Acceptance Tests
- [ ] CA can select multiple M&E for a project
- [ ] CA can use "Select All" to select all M&E
- [ ] CA can designate one M&E as Lead
- [ ] Lead M&E reports appear as priority in notifications
- [ ] Lead M&E reports are distinguished in reports list
- [ ] M&E member can see their Lead status
- [ ] Consistent behavior across all projects

---

## Rollout Plan

### Phase 1: Development (Week 1)
- Implement database schema updates
- Implement M&E Team Portal UI changes
- Implement notification system updates

### Phase 2: Testing (Week 2)
- Conduct unit tests
- Conduct integration tests
- Fix bugs and issues

### Phase 3: User Acceptance Testing (Week 3)
- Deploy to staging environment
- Conduct UAT with CA users
- Gather feedback and make adjustments

### Phase 4: Production Deployment (Week 4)
- Deploy to production
- Monitor for issues
- Provide user training/documentation

---

## Success Criteria

1. ✅ CA can select multiple M&E for a single project
2. ✅ "Select All" option works correctly
3. ✅ CA can designate exactly one Lead M&E per project
4. ✅ Lead M&E must be from the selected M&E list
5. ✅ Lead M&E reports are clearly marked as priority
6. ✅ Lead M&E reports appear at the top of notification lists
7. ✅ Lead M&E reports are distinguished in reports page
8. ✅ Behavior is consistent across all projects
9. ✅ No regression in existing M&E functionality

---

## Documentation Updates

### User Documentation
- [ ] Update CA user guide with M&E multi-select instructions
- [ ] Add section on Lead M&E designation
- [ ] Document report prioritization behavior

### Technical Documentation
- [ ] Update database schema documentation
- [ ] Update API documentation (if applicable)
- [ ] Update component documentation

### Training Materials
- [ ] Create video tutorial for CA users
- [ ] Create quick reference guide
- [ ] Update onboarding materials

---

## Appendix

### A. Database Migration Script
```typescript
// Migrate existing MEProjects to include Lead M&E fields
export const migrateMEProjectsForLeadME = () => {
  const projects = getMEProjects();
  const migratedProjects = projects.map(project => {
    // If project has only one assigned member, make them Lead
    if (project.assignedMemberIds.length === 1) {
      return {
        ...project,
        leadMEMemberId: project.assignedMemberIds[0],
        leadMEMemberName: project.assignedMemberNames[0],
        leadMEAssignedAt: new Date().toISOString(),
        leadMEAssignedBy: 'system-migration'
      };
    }
    // Otherwise, leave Lead M&E unassigned (CA will assign later)
    return {
      ...project,
      leadMEMemberId: undefined,
      leadMEMemberName: undefined
    };
  });
  saveMEProjects(migratedProjects);
};
```

### B. Notification Priority Sorting Function
```typescript
const sortNotificationsByPriority = (notifications: Notification[]) => {
  return notifications.sort((a, b) => {
    // Lead M&E reports first
    if (a.metadata?.isLeadMEReport && !b.metadata?.isLeadMEReport) return -1;
    if (!a.metadata?.isLeadMEReport && b.metadata?.isLeadMEReport) return 1;
    
    // Then sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};
```

### C. UI Component Styling
```css
/* Lead M&E Badge */
.lead-me-badge {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.75rem;
  text-transform: uppercase;
}

/* Priority Notification */
.priority-notification {
  border-left: 4px solid #FFD700;
  background: rgba(255, 215, 0, 0.1);
}

/* Lead M&E Report Row */
.lead-me-report-row {
  background: rgba(255, 215, 0, 0.05);
}
```

---

## End of Implementation Plan
