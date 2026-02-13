$body = @{
    username = "admin"
    email = "admin@example.com"
    password = "admin123456"
    fullName = "System Administrator"
    role = "Super Admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' `
        -Method POST `
        -Body $body `
        -ContentType 'application/json' `
        -ErrorAction Stop
    
    Write-Host "✅ Admin user created successfully!" -ForegroundColor Green
    Write-Host "Token: $($response.token)" -ForegroundColor Cyan
    Write-Host "User Details:" -ForegroundColor Yellow
    $response.user | Format-List
} catch {
    Write-Host "❌ Error creating admin user:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Server Message: $($errorObj.message)" -ForegroundColor Red
        if ($errorObj.error) {
            Write-Host "Details: $($errorObj.error)" -ForegroundColor Red
        }
    }
}
