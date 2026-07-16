# Encode the rendered legs for smooth scrubbing (native 1080p, small GOP, faststart)
# and produce poster images. Outputs land in ../public/world/.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$FF = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe | Select-Object -First 1 -ExpandProperty FullName
New-Item -ItemType Directory -Force "..\public\world" | Out-Null

for ($i = 1; $i -le 6; $i++) {
  & $FF -y -i "leg_$i.mp4" -an -vf "unsharp=5:5:0.8:5:5:0.0" `
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p `
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "..\public\world\leg_$i.mp4"
  # poster = the leg's own first frame (frame-true fallback)
  & $FF -y -ss 0 -i "leg_$i.mp4" -frames:v 1 -q:v 3 "..\public\world\poster_$i.jpg"
  Write-Host "encoded leg_$i"
}
Write-Host "All legs encoded to public/world/."
