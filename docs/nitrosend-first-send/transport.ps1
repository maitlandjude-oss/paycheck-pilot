param([Parameter(Mandatory=$true)][string]$Method,[string]$ParamsJson='{}',[string]$Label='call')
$ErrorActionPreference='Stop'
$secure=ConvertTo-SecureString (Get-Content "$PSScriptRoot/nitrosend-api-key.dpapi" -Raw).Trim()
$key=[System.Net.NetworkCredential]::new('', $secure).Password | ConvertFrom-Json
$session=Get-Content "$PSScriptRoot/nitrosend-mcp-session.json" -Raw | ConvertFrom-Json
$headers=@{Authorization=('Bearer '+$key.secret_key);Accept='application/json, text/event-stream';'User-Agent'='Codex-PowerShell-MCP/1.0';'MCP-Protocol-Version'=$session.protocol}
if($session.session_id){$headers['Mcp-Session-Id']=$session.session_id}
$payload=@{jsonrpc='2.0';id=[DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds();method=$Method;params=($ParamsJson|ConvertFrom-Json -Depth 100)}
if($Method -like 'notifications/*'){$payload.Remove('id')}
$started=[datetime]::UtcNow.ToString('o')
$request=$payload|ConvertTo-Json -Depth 100 -Compress
$response=Invoke-WebRequest 'https://api.nitrosend.com/mcp' -Method Post -ContentType 'application/json' -Headers $headers -Body $request -MaximumRetryCount 0 -TimeoutSec 45
$safe=$response.Content.Replace($key.secret_key,'[REDACTED]')
$safe|Set-Content "$PSScriptRoot/nitro-$Label-response.json"
@{started_at=$started;completed_at=[datetime]::UtcNow.ToString('o');method=$Method;params=$payload.params;http_status=[int]$response.StatusCode;response_file="nitro-$Label-response.json"}|ConvertTo-Json -Depth 100 -Compress|Add-Content "$PSScriptRoot/nitro-events.jsonl"
Write-Output $safe

