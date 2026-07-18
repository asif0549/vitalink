$mavenDir = "d:/vitallink/maven-portable/apache-maven-3.9.6"
if (-not (Test-Path "$mavenDir/bin/mvn.cmd")) {
    Write-Host "Setting up portable Maven..." -ForegroundColor Green
    $url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    $zipFile = "d:/vitallink/maven-portable.zip"
    $destDir = "d:/vitallink/maven-portable"
    
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $zipFile
    Expand-Archive -Path $zipFile -DestinationPath $destDir
    Remove-Item $zipFile
}

Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green
& "$mavenDir/bin/mvn.cmd" spring-boot:run
