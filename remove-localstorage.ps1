# Replace remaining localStorage blocks for PFI, Anchor, Lead Firm, Producer, Researcher
$file = "C:\Users\HP\afcf_\src\pages\Register.tsx"
$content = Get-Content $file -Raw

# Backup
Copy-Item $file "$file.bak4"

# Pattern 1: Remove buildXApplicationData lines
$content = $content -replace "[\r\n]+\s+const applicationData = build\w+ApplicationData\(storedFormData\);", ""

# Pattern 2: Remove registerX function calls (multiline)
$content = $content -replace "[\r\n]+\s+const record = register\w+\(\{[^\}]*email:[^\}]*password:[^\}]*(?:registrationType,)?[^\}]*formData:[^\}]*\}\);", ""

# Pattern 3: Remove record validation blocks
$content = $content -replace "[\r\n]+\s+if \(!record \|\| !record\.id \|\| !record\.id\.startsWith\('[^']+'\)\) \{[^\}]*console\.error[^\}]*alert[^\}]*setIsSubmitting[^\}]*return;[\r\n]+\s+\}", ""

# Pattern 4: Remove addNotification calls (complex multiline)
$content = $content -replace "[\r\n]+\s+const notificationId = addNotification\(\{[^\}]*role:[^\}]*targetRole:[^\}]*message:[^\}]*applicantName:[^\}]*(?:applicantType:[^\}]*)?(?:companyName:[^\}]*)?(?:companyId:[^\}]*)?(?:organization:[^\}]*)?(?:fullAddress:[^\}]*)?(?:contactPersonName:[^\}]*)?(?:contactPersonEmail:[^\}]*)?(?:contactPersonPhone:[^\}]*)?(?:applicationData,)?[^\}]*metadata:[^\}]*\{[^\}]*\}[^\}]*\}\);", ""

# Pattern 5: Remove updateXRecord calls
$content = $content -replace "[\r\n]+\s+update\w+Record\(record\.id, \{ pendingNotificationId: notificationId \}\);", ""

$content | Set-Content $file -NoNewline
Write-Host "Removed all localStorage calls for remaining 5 user types"
