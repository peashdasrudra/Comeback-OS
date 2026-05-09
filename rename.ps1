Get-ChildItem -Path "src/components" -Filter "*.jsx" | ForEach-Object {
    $newName = [System.IO.Path]::ChangeExtension($_.Name, ".tsx")
    Rename-Item -Path $_.FullName -NewName $newName
}