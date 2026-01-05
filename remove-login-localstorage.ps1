# Replace Login.tsx localStorage with MongoDB
$file = "C:\Users\HP\afcf_\src\pages\Login.tsx"
$content = Get-Content $file -Raw

# Backup
Copy-Item $file "$file.bak"

# 1. Replace localStorage with sessionStorage in handleSuccessfulLogin
$content = $content -replace "localStorage\.setItem\('authToken'", "sessionStorage.setItem('authToken'"
$content = $content -replace "localStorage\.setItem\('user'", "sessionStorage.setItem('user'"

# 2. Remove all attemptXLocalLogin functions (lines 219-313)
# These functions use localStorage authentication which we're removing
$content = $content -replace "(?s)const attemptFundProviderLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptInsuranceCompanyLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptCooperativeGroupLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptExtensionOrganizationLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptPFILocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptAnchorLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptLeadFirmLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptProducerLocalLogin.*?return true;[\r\n]+\s+\};", ""
$content = $content -replace "(?s)const attemptResearcherLocalLogin.*?return true;[\r\n]+\s+\};", ""

# 3. Remove all calls to attemptXLocalLogin in handleSubmit
$content = $content -replace "const localLoginHandled = attemptFundProviderLocalLogin\(\).*?attemptResearcherLocalLogin\(\);", ""
$content = $content -replace "if \(localLoginHandled\) \{[\r\n]+\s+setIsSubmitting\(false\);[\r\n]+\s+return;[\r\n]+\s+\}", ""

$content | Set-Content $file -NoNewline
Write-Host "Updated Login.tsx to remove localStorage authentication"
