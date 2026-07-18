Set-Location $PSScriptRoot
$mavenDir = "$PSScriptRoot/maven-portable/apache-maven-3.9.6"
if (-not (Test-Path "$mavenDir/bin/mvn.cmd")) {
    Write-Host "Setting up portable Maven..." -ForegroundColor Green
    $url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    $zipFile = "$PSScriptRoot/maven-portable.zip"
    $destDir = "$PSScriptRoot"
    
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $zipFile
    Expand-Archive -Path $zipFile -DestinationPath $destDir
    Remove-Item $zipFile
}

# Set MAVEN_OPTS to prefer IPv6 addresses (necessary for MongoDB Atlas connection in NAT64 environments)
$env:MAVEN_OPTS = "-Djava.net.preferIPv6Addresses=true"

# Set MONGODB_URI environment variable containing the database connection string.
# To use remote MongoDB Atlas, uncomment the line below:
# $env:MONGODB_URI = "mongodb+srv://asif:Vit%40Link2026@cluster0.cfhripw.mongodb.net/vitallink?retryWrites=true&w=majority&appName=Cluster0"
# By default, we connect to the local MongoDB database:
$env:MONGODB_URI = "mongodb://127.0.0.1:27017/vitallink"

Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green
& "$mavenDir/bin/mvn.cmd" spring-boot:run
