$cert = Get-ChildItem -Path Cert:\CurrentUser\My -CodeSigningCert | Where-Object { $_.Subject -eq "CN=VersoLyn" } | Select-Object -First 1
if (-not $cert) {
    Write-Host "Creating self-signed Code Signing Certificate for VersoLyn..."
    $cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=VersoLyn" -CertStoreLocation "Cert:\CurrentUser\My"
    $rootStore = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "CurrentUser")
    $rootStore.Open("ReadWrite")
    $rootStore.Add($cert)
    $rootStore.Close()
    $pubStore = New-Object System.Security.Cryptography.X509Certificates.X509Store("TrustedPublisher", "CurrentUser")
    $pubStore.Open("ReadWrite")
    $pubStore.Add($cert)
    $pubStore.Close()
    Write-Host "Certificate created and added to Trusted Publisher store!"
} else {
    Write-Host "Existing VersoLyn certificate found."
}

Write-Host "Signing executables..."
if (Test-Path "release\VersoLyn Setup 1.0.0.exe") {
    Set-AuthenticodeSignature -FilePath "release\VersoLyn Setup 1.0.0.exe" -Certificate $cert | Out-Null
    Write-Host "Signed: release\VersoLyn Setup 1.0.0.exe"
}
if (Test-Path "release\win-unpacked\VersoLyn.exe") {
    Set-AuthenticodeSignature -FilePath "release\win-unpacked\VersoLyn.exe" -Certificate $cert | Out-Null
    Write-Host "Signed: release\win-unpacked\VersoLyn.exe"
}
Write-Host "Done!"
