# Generate the 6 camera legs SEQUENTIALLY (architecture A — continuous forward take).
# Each leg starts from the previous leg's ACTUAL last frame (frame-locked seams).
# Re-rolls each leg up to 3x on failure/NSFW-flag. Run after run-stills.ps1 succeeds.
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot
$FF = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter ffmpeg.exe | Select-Object -First 1 -ExpandProperty FullName

function Get-ResultUrl($jsonPath) {
  try {
    $j = Get-Content $jsonPath -Raw | ConvertFrom-Json
    if ($j -is [array]) { return $j[0].result_url } else { return $j.result_url }
  } catch { return $null }
}

$startImage = "scene_1.png"   # leg 1 conditions on the first still
for ($i = 1; $i -le 6; $i++) {
  $ok = $false
  for ($try = 1; $try -le 3 -and -not $ok; $try++) {
    Write-Host "=== leg $i attempt $try (start: $startImage) ==="
    $prompt = Get-Content "prompts\leg_$i.txt" -Raw
    higgsfield generate create seedance_2_0 --prompt "$prompt" --start-image "$startImage" `
      --mode std --resolution 1080p --aspect_ratio 16:9 --duration 8 `
      --wait --wait-timeout 20m --json 2>"leg_$i.err" | Set-Content "leg_$i.json"
    $url = Get-ResultUrl "leg_$i.json"
    if ($url) {
      Invoke-WebRequest -Uri $url -OutFile "leg_$i.mp4"
      # eyeball frame for QA + the handoff frame for the next leg
      & $FF -y -sseof -0.15 -i "leg_$i.mp4" -frames:v 1 -q:v 2 "leg_$($i)_last.png" 2>$null
      if (Test-Path "leg_$($i)_last.png") { $ok = $true }
    }
    if (-not $ok) { Write-Host "leg $i attempt $try failed (see leg_$i.err / leg_$i.json)" }
  }
  if (-not $ok) { Write-Host "LEG $i FAILED after 3 attempts - stopping."; exit 1 }
  $startImage = "leg_$($i)_last.png"
  Write-Host "leg $i done -> handoff frame $startImage"
}
Write-Host "All 6 legs rendered."
