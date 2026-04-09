$ErrorActionPreference = "Stop"

$MavenZip = "maven.zip"
$MavenDir = "apache-maven-3.9.6"
$MavenCmd = ".\$MavenDir\bin\mvn.cmd"

if (-not (Test-Path $MavenDir)) {
    Write-Host "Downloading Maven because winget couldn't find it... Please wait a moment." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip" -OutFile $MavenZip
    
    Write-Host "Extracting Maven..." -ForegroundColor Cyan
    Expand-Archive -Path $MavenZip -DestinationPath "." -Force
    Remove-Item $MavenZip
    Write-Host "Maven successfully set up locally!" -ForegroundColor Green
}

Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green
& $MavenCmd spring-boot:run
