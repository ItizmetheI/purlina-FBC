# Generate the 6 scene stills concurrently (gpt_image_2, 16:9).
# Run from the higgsfield/ directory: powershell -File run-stills.ps1
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot

$jobs = @()
1..6 | ForEach-Object {
  $i = $_
  $jobs += Start-Job -ScriptBlock {
    param($i, $root)
    Set-Location $root
    $prompt = Get-Content "prompts\scene_$i.txt" -Raw
    higgsfield generate create gpt_image_2 --prompt "$prompt" --aspect_ratio 16:9 --resolution 2k --quality high --wait --wait-timeout 15m --json 2>"scene_$i.err" | Set-Content "scene_$i.json"
  } -ArgumentList $i, $PSScriptRoot
}
Write-Host "6 still generations launched. Waiting (3-8 min each, concurrent)..."
$jobs | Wait-Job | Out-Null
$jobs | Receive-Job | Out-Null

1..6 | ForEach-Object {
  $i = $_
  try {
    $j = Get-Content "scene_$i.json" -Raw | ConvertFrom-Json
    $url = if ($j -is [array]) { $j[0].result_url } else { $j.result_url }
    if ($url) {
      Invoke-WebRequest -Uri $url -OutFile "scene_$i.png"
      Write-Host "scene_$i.png downloaded"
    } else { Write-Host "scene_$i FAILED - no result_url (see scene_$i.err)" }
  } catch { Write-Host "scene_$i FAILED - $_" }
}
