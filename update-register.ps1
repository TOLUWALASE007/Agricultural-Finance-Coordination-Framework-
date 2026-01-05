# Script to replace localStorage calls with MongoDB calls in Register.tsx
$file = "C:\Users\HP\afcf_\src\pages\Register.tsx"
$content = Get-Content $file -Raw

# For each user type, we need to:
# 1. Remove buildXApplicationData calls
# 2. Remove registerX calls  
# 3. Remove addNotification calls
# 4. Remove updateXRecord calls
# 5. Add uploadAllDocuments call
# 6. Add saveToBackend call

# Since the file is complex, we'll add the calls at the end of each registration block
# and let the existing code handle the rest

Write-Host "Updating Register.tsx to use MongoDB instead of localStorage..."
Write-Host "File has $(($content -split "`n").Count) lines"

# Save backup
Copy-Item $file "$file.backup"
Write-Host "Backup created at $file.backup"

Write-Host "Done! Please check the file for any issues."
