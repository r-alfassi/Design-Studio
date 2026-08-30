#Requires -Version 5.1
<#
  link-skills.ps1 — expose the Design Studio skill packages to this machine's
  agent skill-discovery scopes by directory junction. Never copies. The
  design-studio repository stays the single source of truth; a junction is a
  pointer, so an edit in the repo is live in the next session with no resync.

  Discovery scopes:
    Claude Code  reads  ~/.claude/skills/<name>/SKILL.md
    Codex        reads  ~/.agents/skills/<name>/SKILL.md

  A skill package is any immediate subdirectory of skills/ that contains a
  SKILL.md. skill-creator is excluded from the Claude Code scope because the
  official claude-plugins-official skill-creator plugin already provides that
  name and a second copy collides.

  Re-run this after cloning the repo on a new machine, or whenever a skill
  package is added, renamed, or removed. Restart running agent sessions to pick
  up the change — skill discovery is a session-start scan.

  Usage:
    pwsh bin/link-skills.ps1                 # both scopes
    pwsh bin/link-skills.ps1 -Scope claude-code
    pwsh bin/link-skills.ps1 -WhatIf         # preview only
#>
[CmdletBinding(SupportsShouldProcess)]
param(
  [ValidateSet('claude-code', 'codex', 'both')]
  [string]$Scope = 'both'
)

$ErrorActionPreference = 'Stop'

$repoRoot   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$skillsRoot = Join-Path $repoRoot 'skills'
if (-not (Test-Path $skillsRoot)) { throw "skills/ not found under $repoRoot" }

$packages = Get-ChildItem $skillsRoot -Directory |
  Where-Object { Test-Path (Join-Path $_.FullName 'SKILL.md') }
if (-not $packages) { throw "No skill packages (subdirs with SKILL.md) under $skillsRoot" }

$scopes = @{
  'claude-code' = @{ Dir = Join-Path $HOME '.claude\skills'; Exclude = @('skill-creator') }
  'codex'       = @{ Dir = Join-Path $HOME '.agents\skills'; Exclude = @() }
}
$run = if ($Scope -eq 'both') { 'claude-code', 'codex' } else { , $Scope }

function Get-JunctionTarget($item) {
  if ($item.LinkType -ne 'Junction') { return $null }
  $t = $item.Target | Select-Object -First 1
  if ($t) { try { (Resolve-Path -LiteralPath $t -ErrorAction Stop).Path } catch { $t } }
}

foreach ($name in $run) {
  $cfg = $scopes[$name]
  $dir = $cfg.Dir
  Write-Host "== $name  ->  $dir"

  if (-not (Test-Path $dir) -and $PSCmdlet.ShouldProcess($dir, 'create directory')) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  $wanted = @($packages | Where-Object { $cfg.Exclude -notcontains $_.Name })

  foreach ($pkg in $wanted) {
    $link = Join-Path $dir $pkg.Name
    $cur  = Get-Item -LiteralPath $link -ErrorAction SilentlyContinue
    if ($cur) {
      if ($cur.LinkType -ne 'Junction') {
        Write-Warning "  skip  $($pkg.Name): a real directory/file exists at $link"
        continue
      }
      if ((Get-JunctionTarget $cur) -eq $pkg.FullName) {
        Write-Host  "  ok    $($pkg.Name)"
        continue
      }
      if ($PSCmdlet.ShouldProcess($link, "repoint junction -> $($pkg.FullName)")) {
        $cur.Delete()
        New-Item -ItemType Junction -Path $link -Target $pkg.FullName | Out-Null
        Write-Host "  fixed $($pkg.Name)"
      }
      continue
    }
    if ($PSCmdlet.ShouldProcess($link, "create junction -> $($pkg.FullName)")) {
      New-Item -ItemType Junction -Path $link -Target $pkg.FullName | Out-Null
      Write-Host "  added $($pkg.Name)"
    }
  }

  # Prune junctions that point back into this repo's skills/ but no longer match
  # a wanted package (renamed or removed). Links to anything else are left alone.
  $keep = $wanted.Name
  Get-ChildItem $dir -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    $tgt = Get-JunctionTarget $_
    if ($tgt -and ($tgt -like (Join-Path $skillsRoot '*')) -and ($keep -notcontains $_.Name)) {
      if ($PSCmdlet.ShouldProcess($_.FullName, 'remove stale junction')) {
        $_.Delete()
        Write-Host "  pruned $($_.Name)"
      }
    }
  }
}

Write-Host "`nDone. Restart running agent sessions to pick up changes."
