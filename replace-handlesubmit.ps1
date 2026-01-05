# Replace handleSubmit in Login.tsx with MongoDB-only version
$file = "C:\Users\HP\afcf_\src\pages\Login.tsx"
$content = Get-Content $file -Raw

# Backup
Copy-Item $file "$file.bak2"

# Replace the entire handleSubmit function with a clean MongoDB version
$oldHandleSubmit = "(?s)const handleSubmit = async \(e: React\.FormEvent\) => \{.*?^\s+\};"
$newHandleSubmit = @"
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Try MongoDB backend login first
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (response.success && response.token) {
        // Backend login successful
        handleSuccessfulLogin(response.user, formData.role, response.token);
        return;
      } else {
        throw new Error(response.error || 'Invalid credentials');
      }
    } catch (backendError: any) {
      console.error('Backend login failed:', backendError);
      
      // Fallback to demo login
      const demoHandled = tryDemoLogin();
      if (!demoHandled) {
        alert('Login failed. Please verify your credentials or use demo accounts.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
"@

$content = $content -replace $oldHandleSubmit, $newHandleSubmit

$content | Set-Content $file -NoNewline
Write-Host "Replaced handleSubmit with MongoDB-only version"
