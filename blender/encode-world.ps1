# Encode the full 1152-frame render into ONE scrub-optimized film + poster.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$FF = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe | Select-Object -First 1 -ExpandProperty FullName
New-Item -ItemType Directory -Force "..\public\world" | Out-Null
Remove-Item "..\public\world\leg_*.mp4", "..\public\world\poster_*.jpg" -ErrorAction SilentlyContinue

& $FF -y -framerate 24 -start_number 1 -i "out\frame_%04d.png" -frames:v 1152 `
  -an -vf "unsharp=5:5:0.6:5:5:0.0" `
  -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p `
  -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "..\public\world\world.mp4"
& $FF -y -i "out\frame_0001.png" -frames:v 1 -update 1 -q:v 3 "..\public\world\poster.jpg"
Write-Host "world.mp4 + poster.jpg done"
