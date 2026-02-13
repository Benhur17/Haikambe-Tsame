$body = @{
    email = "admin@example.com"
    password = "admin123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' `
        -Method POST `
        -Body $body `
        -ContentType 'application/json' `
        -ErrorAction Stop
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "`nToken:" -ForegroundColor Cyan
    Write-Host $response.token
    Write-Host "`nUser Details:" -ForegroundColor Yellow
    $response.user | Format-List
    
    Write-Host "`n🎉 You can now use this token or login at http://localhost:5173" -ForegroundColor Magenta
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Server Message: $($errorObj.message)" -ForegroundColor Red
    }
}
