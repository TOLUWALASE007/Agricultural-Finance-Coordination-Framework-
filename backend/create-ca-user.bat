@echo off
echo Creating Coordinating Agency User...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ca@email.com\",\"password\":\"123456\",\"firstName\":\"Coordinating\",\"lastName\":\"Agency\",\"userType\":\"coordinating_agency\",\"organizationName\":\"AFCF Coordinating Agency\"}"
echo.
echo User created! You can now log in with:
echo Email: ca@email.com
echo Password: 123456
pause

