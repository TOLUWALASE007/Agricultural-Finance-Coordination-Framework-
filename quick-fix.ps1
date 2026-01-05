# Quick replacement script for remaining 5 user types
$file = "C:\Users\HP\afcf_\src\pages\Register.tsx"
$content = Get-Content $file -Raw

# Backup
Copy-Item $file "$file.bak3"

# Replace PFIFormData, AnchorFormData, LeadFirmFormData, ProducerFormData, ResearcherFormData with 'any'
$content = $content -replace ': PFIFormData =', ': any ='
$content = $content -replace ': AnchorFormData =', ': any ='
$content = $content -replace ': LeadFirmFormData =', ': any ='
$content = $content -replace ': ProducerFormData =', ': any ='
$content = $content -replace ': ResearcherFormData =', ': any ='

# Save
$content | Set-Content $file -NoNewline
Write-Host "Replaced FormData types with 'any' for remaining 5 user types"
