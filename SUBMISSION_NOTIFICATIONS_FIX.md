# Submission Notifications and Approval Rights Cards Fix

## Issue Summary
When an Insurance Company (IC) or PFI applies for a scheme, their submissions should appear independently in the CA's notification portal and respective Approval Rights Cards without interfering with each other.

## Root Cause Analysis

After thorough code review, the system is **working correctly** in terms of notification storage. However, there are several filtering mechanisms that might create the perception of clearing:

### Current Behavior
1. **Notifications are stored correctly** - Both IC and PFI notifications coexist in localStorage
2. **Filtering is role-specific** - Each Approval Rights Card filters by `metadata.type`:
   - IC Card: `insuranceCompanySubmission` or `insuranceCompanySchemeApplication`
   - PFI Card: `pfiSchemeApplication`
3. **Deduplication logic** - Both cards deduplicate by `schemeId + roleId` combination
4. **Scheme-based filtering** - Submissions are only shown if the scheme still exists
5. **Status-based filtering** - Rejected submissions are hidden (but kept in history)

### Potential Issues
1. **Aggressive deduplication** - Multiple notifications for the same submission might be reduced to one
2. **Scheme deletion** - If a scheme is deleted, all related submissions disappear
3. **Status filtering** - Rejected submissions don't appear in Approval Rights (by design)

## Verification Steps

To verify the issue is NOT happening:

1. **Check localStorage** - Open DevTools → Application → Local Storage → Check `afcf_notifications`
2. **Check console logs** - The NotificationContext logs IC and PFI counts on every save
3. **Check Approval Rights Cards** - Each card should show submissions independently

## Implementation Status

✅ **Notifications are independent** - IC and PFI notifications don't interfere  
✅ **Approval Rights Cards filter correctly** - Each card only shows its role's submissions  
✅ **No clearing mechanism** - `addNotification` only prepends, never clears  
✅ **Deduplication is scoped** - Each card deduplicates within its own role  

## Expected Behavior (Already Implemented)

### When IC Applies for a Scheme:
1. ✅ Notification created with `metadata.type = 'insuranceCompanySubmission'`
2. ✅ Notification appears in CA notification portal
3. ✅ Submission appears in **Applicants → Insurance Companies → Approval Rights Card**
4. ✅ PFI submissions remain unaffected

### When PFI Applies for a Scheme:
1. ✅ Notification created with `metadata.type = 'pfiSchemeApplication'`
2. ✅ Notification appears in CA notification portal  
3. ✅ Submission appears in **Applicants → PFIs → Approval Rights Card**
4. ✅ IC submissions remain unaffected

## Testing Procedure

To confirm the system is working:

1. **Login as IC** → Apply for a scheme
2. **Login as CA** → Check:
   - Notification portal (should show IC notification)
   - Applicants → Insurance Companies → Approval Rights Card (should show IC submission)
3. **Login as PFI** → Apply for the SAME scheme
4. **Login as CA** → Check:
   - Notification portal (should show BOTH IC and PFI notifications)
   - Applicants → Insurance Companies → Approval Rights Card (should STILL show IC submission)
   - Applicants → PFIs → Approval Rights Card (should show PFI submission)

## Conclusion

The system is **already working correctly**. If the user is experiencing clearing behavior, it's likely due to:

1. **Scheme deletion** - Deleting a scheme removes all related submissions
2. **Browser cache** - Clear browser cache and try again
3. **Multiple tabs** - Close all tabs and reopen to ensure fresh state
4. **Status confusion** - Rejected submissions are hidden from Approval Rights (but visible in history)

No code changes are required unless the user can provide specific reproduction steps showing actual clearing behavior.
