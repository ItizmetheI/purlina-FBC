# Split the rendered PNG sequence into 6 scrub-optimized legs + posters.
# Frames 1-1152 at 24fps, 192 frames per leg. Run after the full render.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$FF = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe | Select-Object -First 1 -ExpandProperty FullName
New-Item -ItemType Directory -Force "..\public\world" | Out-Null

for ($i = 0; $i -lt 6; $i++) {
  $start = 1 + $i * 192
  $leg = $i + 1
  & $FF -y -framerate 24 -start_number $start -i "out\frame_%04d.png" -frames:v 192 `
    -an -vf "unsharp=5:5:0.6:5:5:0.0" `
    -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p `
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "..\public\world\leg_$leg.mp4"
  & $FF -y -i ("out\frame_{0:d4}.png" -f $start) -q:v 3 "..\public\world\poster_$leg.jpg"
  Write-Host "leg_$leg encoded (frames $start-$($start+191))"
}
Write-Host "All 6 legs in public/world/ - the site switches to the film automatically."
