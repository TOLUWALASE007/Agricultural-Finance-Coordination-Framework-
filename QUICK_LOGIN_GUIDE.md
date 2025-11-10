# Quick Login Guide for Coordinating Agency

## Login Credentials

**Email:** `ca@email.com`  
**Password:** `123456` (Note: Changed from 1234 to meet minimum 6 character requirement)  
**Role:** Coordinating Agency

## Steps to Login:

1. **Ensure Backend Server is Running**
   - The server should be running on `http://localhost:5000`
   - If not, run: `cd DEVELOPMENT/backend && npm run dev`

2. **Register/Login via Frontend:**
   - Go to the Login page
   - Enter:
     - Email: `ca@email.com`
     - Password: `123456`
     - Role: Select `Coordinating Agency`
   - Click "Sign In"

3. **Or Register via API (if user doesn't exist):**
   - Open browser console or Postman
   - POST to: `http://localhost:5000/api/auth/register`
   - Body:
   ```json
   {
     "email": "ca@email.com",
     "password": "123456",
     "firstName": "Coordinating",
     "lastName": "Agency",
     "userType": "coordinating_agency",
     "organizationName": "AFCF Coordinating Agency"
   }
   ```

4. **After Login:**
   - Token will be stored in localStorage
   - Navigate to: Coordinating Agency → Fund Schemes
   - You can now create schemes!

## Notes:

- Password must be at least 6 characters (that's why we use `123456` instead of `1234`)
- The token will be automatically stored and used for authenticated requests
- You can create schemes once logged in as Coordinating Agency

