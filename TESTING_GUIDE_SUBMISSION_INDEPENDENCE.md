# Testing Guide: Submission Notifications Independence

## Overview
This guide will help you verify that Insurance Company (IC) and PFI submissions are handled independently and do not interfere with each other.

## Debug Logging Added

I've added console logging to both `InsuranceCompanies.tsx` and `PFIs.tsx` that will help track notifications:

### Console Logs to Monitor:
- `[IC Approval Rights] Total CA notifications:` - Total notifications for CA
- `[IC Approval Rights] IC notifications found:` - Number of IC-specific notifications
- `[PFI Approval Rights] Total CA notifications:` - Total notifications for CA  
- `[PFI Approval Rights] PFI notifications found:` - Number of PFI-specific notifications
- `[NotificationContext] Saving notifications - IC count:` - IC count when saving
- `[NotificationContext] Saving notifications - PFI count:` - PFI count when saving

## Step-by-Step Testing Procedure

### Setup
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console (Ctrl+L or Cmd+K)

### Test 1: IC Submission Only

1. **Login as Insurance Company**
   - Use credentials: `demo-ic@example.com` / `password123`
   
2. **Apply for a Scheme**
   - Navigate to "Scheme Application"
   - Select any available scheme
   - Fill out and submit the application

3. **Login as Coordinating Agency**
   - Use credentials: `demo-ca@example.com` / `password123`
   
4. **Check Notifications**
   - Look at notification bell - should show new notification
   - Check console logs:
     ```
     [NotificationContext] Saving notifications - IC count: 1, PFI count: 0
     ```

5. **Check Approval Rights Card**
   - Navigate to: **Applicants → Insurance Companies**
   - Scroll to "Approval Rights Card"
   - Console should show:
     ```
     [IC Approval Rights] IC notifications found: 1
     ```
   - Verify IC submission appears in the card

### Test 2: PFI Submission (Without Clearing IC)

1. **Login as PFI**
   - Use credentials: `demo-pfi@example.com` / `password123`

2. **Apply for the SAME Scheme**
   - Navigate to "Scheme Application"
   - Select the same scheme IC applied to
   - Fill out and submit the application

3. **Login as Coordinating Agency**
   - Use credentials: `demo-ca@example.com` / `password123`

4. **Check Notifications**
   - Notification bell should show 2 notifications (IC + PFI)
   - Check console logs:
     ```
     [NotificationContext] Saving notifications - IC count: 1, PFI count: 1
     ```
   - **CRITICAL**: IC count should STILL be 1 (not 0)

5. **Check IC Approval Rights Card**
   - Navigate to: **Applicants → Insurance Companies**
   - Console should show:
     ```
     [IC Approval Rights] IC notifications found: 1
     ```
   - **VERIFY**: IC submission should STILL be visible
   - **FAIL CONDITION**: If IC submission disappeared, there's a bug

6. **Check PFI Approval Rights Card**
   - Navigate to: **Applicants → PFIs**
   - Console should show:
     ```
     [PFI Approval Rights] PFI notifications found: 1
     ```
   - **VERIFY**: PFI submission should be visible

### Test 3: Multiple Submissions

1. **Repeat Test 1 and Test 2 with different schemes**

2. **Expected Console Output:**
   ```
   [NotificationContext] Saving notifications - IC count: 2, PFI count: 2
   [IC Approval Rights] IC notifications found: 2
   [PFI Approval Rights] PFI notifications found: 2
   ```

3. **Verify Both Cards:**
   - IC Approval Rights Card should show 2 IC submissions
   - PFI Approval Rights Card should show 2 PFI submissions
   - **CRITICAL**: Neither card should affect the other

## What to Look For

### ✅ PASS Conditions:
- IC and PFI notification counts remain independent
- IC Approval Rights Card always shows IC submissions
- PFI Approval Rights Card always shows PFI submissions
- Notification portal shows all notifications chronologically
- Console logs show stable counts (no unexpected drops)

### ❌ FAIL Conditions:
- IC count drops to 0 when PFI submits (or vice versa)
- IC submissions disappear from IC Approval Rights Card when PFI submits
- PFI submissions disappear from PFI Approval Rights Card when IC submits
- Notification portal clears previous notifications

## Troubleshooting

### If Submissions Disappear:

1. **Check localStorage:**
   - DevTools → Application → Local Storage
   - Find `afcf_notifications`
   - Verify both IC and PFI notifications exist

2. **Check scheme status:**
   - Submissions only appear if the scheme still exists
   - Navigate to Fund Schemes and verify scheme is Active

3. **Check submission status:**
   - Rejected submissions are hidden from Approval Rights Card
   - But they remain in notification history

4. **Clear cache and retry:**
   - Close all browser tabs
   - Clear browser cache
   - Reopen and test again

## Expected Results

After completing all tests, you should see:

1. **Notification Portal:**
   - All IC and PFI notifications listed chronologically
   - No clearing or removal of notifications

2. **IC Approval Rights Card:**
   - All IC submissions visible
   - Unaffected by PFI submissions

3. **PFI Approval Rights Card:**
   - All PFI submissions visible
   - Unaffected by IC submissions

4. **Console Logs:**
   - Stable notification counts
   - No unexpected drops in IC or PFI counts

## Reporting Issues

If you find that submissions ARE being cleared, please provide:

1. **Console logs** - Copy all logs from the test
2. **localStorage snapshot** - Export `afcf_notifications` content
3. **Exact steps** - Detailed reproduction steps
4. **Screenshots** - Before and after states

This will help identify the exact cause of any clearing behavior.
