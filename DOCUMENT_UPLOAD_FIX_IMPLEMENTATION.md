# Document Upload Fix - Implementation Summary

## Problem
During user registration, only document **filenames** were being stored in MongoDB Atlas, not the actual document files.

## Root Cause
1. Frontend stored `File` objects in state but only sent `file.name` to backend
2. Backend received only the filename string and stored it in the database
3. No actual file upload happened to the `/api/documents/upload` endpoint

## Solution Implemented

### 1. Backend Changes (`backend/src/routes/documents.ts`)
- ✅ Created `optionalAuth` middleware to allow uploads without authentication
- ✅ Modified `/upload` endpoint to work for both authenticated and unauthenticated requests
- ✅ Documents uploaded during registration are stored with `userId: null`
- ✅ Documents uploaded by logged-in users are associated with their `userId`

### 2. Frontend API Changes (`src/utils/api.ts`)
- ✅ Added `documentAPI` with `upload()`, `getAll()`, and `download()` methods
- ✅ Upload function accepts `requireAuth` parameter (default: false for registration)
- ✅ Returns uploaded filename from backend response

### 3. Frontend Registration Changes (`src/pages/Register.tsx`)
- ✅ Imported `documentAPI`
- ✅ Created `uploadDocument()` helper function
- ✅ Created `uploadAllDocuments()` helper function that uploads:
  - ID documents (`idDocument`)
  - Organization logos (`organizationLogo`)
  - Certificates of incorporation (`certificateOfIncorporation`)
  - Supporting documents (`supportingDocument` - for researchers)
  - Farm images (`farmImages` - for producers)
  - Certifications (`certification` - for producers)
- ✅ Modified Fund Provider registration to:
  1. Upload all documents FIRST
  2. Use uploaded filenames in registration data
  3. Show upload progress to user
  4. Handle upload errors gracefully

## Status

### ✅ Completed
- Backend document upload endpoint (no auth required)
- Frontend documentAPI utility
- Document upload helper functions
- **Fund Provider registration** with document uploads

### ⏳ Pending (Same Pattern Needed)
Apply the same upload logic to:
1. **Insurance Company** registration (line ~565)
2. **PFI** registration
3. **Cooperative Group** registration (line ~700)
4. **Extension Organization** registration (line ~870)
5. **Anchor** registration
6. **Lead Firm** registration
7. **Producer/Farmer** registration
8. **Researcher/Student** registration

## How It Works Now

### Registration Flow:
1. User fills registration form with documents
2. User clicks "Submit"
3. **NEW**: System uploads all documents to `/api/documents/upload`
4. **NEW**: Backend stores files in `/uploads` directory
5. **NEW**: Backend returns uploaded filenames
6. **NEW**: Frontend uses uploaded filenames in registration data
7. Registration data (with actual uploaded filenames) is saved to MongoDB
8. User can now see actual documents in MongoDB Atlas

### Document Storage:
- **Files**: Stored in `/uploads` directory on server
- **Metadata**: Stored in `documents` collection in MongoDB
- **Reference**: Filename stored in user's `contactInfo` or `organizationInfo`

## Testing
To test the fix:
1. Register as Fund Provider
2. Upload ID document, logo, and certificate
3. Check MongoDB Atlas - should see actual filenames
4. Check `/uploads` directory - should see actual files
5. Check `documents` collection - should see document metadata

## Next Steps
1. Apply same pattern to remaining 7 user types
2. Test each registration type
3. Verify documents are accessible after login
4. Consider adding upload progress indicators
5. Consider adding file validation (size, type)
