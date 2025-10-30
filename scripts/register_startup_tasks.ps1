<#
  register_startup_tasks.ps1

  Registers two scheduled tasks: GuestRoomBackend and GuestRoomNgrok
  that run the provided batch scripts at system startup.

  Run this script as Administrator on the server machine.
#>

param(
  [string]$RepoRoot = 'D:\guest room'
)

Write-Output "Registering Task Scheduler tasks using repo root: $RepoRoot"

$backendScript = Join-Path $RepoRoot 'scripts\start-backend.bat'
$ngrokScript = Join-Path $RepoRoot 'scripts\start-ngrok.bat'

# Backend task
$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$backendScript`""
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -TaskName 'GuestRoomBackend' -Action $action -Trigger $trigger -RunLevel Highest -Description 'Start GuestRoom backend at startup' -Force

# Ngrok task (delay to allow network services to start)
$action2 = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$ngrokScript`""
$trigger2 = New-ScheduledTaskTrigger -AtStartup -Delay (New-TimeSpan -Seconds 10)
Register-ScheduledTask -TaskName 'GuestRoomNgrok' -Action $action2 -Trigger $trigger2 -RunLevel Highest -Description 'Start ngrok at startup' -Force

Write-Output "Tasks registered. Verify in Task Scheduler (taskschd.msc)."
