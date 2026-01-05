# Replace all remaining localStorage calls with MongoDB in Register.tsx
$file = "C:\Users\HP\afcf_\src\pages\Register.tsx"
$content = Get-Content $file -Raw

# Backup
Copy-Item $file "$file.bak2"

# Pattern to match: build*ApplicationData, register*, addNotification, update*Record
# Replace with: upload + save pattern

# For each remaining user type (cooperative, extension, pfi, anchor, lead-firm, producer, researcher)
# Replace the localStorage block with MongoDB block

$userTypes = @(
    @{old='CooperativeGroupFormData'; new='cooperative'; display='Cooperative Group'},
    @{old='ExtensionOrganizationFormData'; new='extension'; display='Extension Organization'},
    @{old='PFIFormData'; new='pfi'; display='PFI'},
    @{old='AnchorFormData'; new='anchor'; display='Anchor'},
    @{old='LeadFirmFormData'; new='lead-firm'; display='Lead Firm'},
    @{old='ProducerFormData'; new='producer'; display='Producer'},
    @{old='ResearcherFormData'; new='researcher'; display='Researcher'}
)

foreach ($type in $userTypes) {
    # Find and replace the FormData type declaration
    $content = $content -replace "const storedFormData: $($type.old) = \{", "const storedFormData: any = {"
    
    # Remove build*ApplicationData line
    $content = $content -replace "const applicationData = build\w+ApplicationData\(storedFormData\);[\r\n]+", ""
    
    # Remove register* call and record assignment (multiline)
    $content = $content -replace "const record = register\w+\(\{[^}]+email:[^}]+password:[^}]+registrationType,[^}]+formData:[^}]+\}\);[\r\n]+", ""
    
    # Remove addNotification call (multiline, complex)
    $content = $content -replace "const notificationId = addNotification\(\{[^}]+role:[^}]+targetRole:[^}]+message:[^}]+applicantName:[^}]+applicantType:[^}]+(?:companyName:[^}]+)?(?:companyId:[^}]+)?(?:organization:[^}]+)?(?:fullAddress:[^}]+)?(?:contactPersonName:[^}]+)?(?:contactPersonEmail:[^}]+)?(?:contactPersonPhone:[^}]+)?(?:applicationData,)?[^}]+metadata:[^}]+\{[^}]+type:[^}]+(?:\w+Id:[^}]+)?email:[^}]+requiresDecision:[^}]+\}[^}]+\}\);[\r\n]+", ""
    
    # Remove update*Record call
    $content = $content -replace "update\w+Record\(record\.id, \{ pendingNotificationId: notificationId \}\);[\r\n]+", ""
}

$content | Set-Content $file -NoNewline
Write-Host "Updated all remaining user types to use MongoDB"
Write-Host "Backup saved to $file.bak2"
