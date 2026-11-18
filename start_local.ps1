$rootDir = $PSScriptRoot
Set-Location $rootDir

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   Starting DeepSafe by Sonakshi Kumari        " -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "[1/3] Starting model detector services..." -ForegroundColor Yellow
$modelProcess = Start-Process -FilePath "$rootDir\venv\Scripts\python.exe" -ArgumentList "$rootDir\scripts\mock_model_server.py" -PassThru -WindowStyle Minimized

Write-Host "[2/3] Starting FastAPI gateway on http://localhost:8000..." -ForegroundColor Yellow
$env:DEEPSAFE_CONFIG_FILE_PATH = "$rootDir\config\deepsafe_config.local.json"
$env:META_MODEL_ARTIFACTS_DIR = "$rootDir\api\meta_model_artifacts"
$env:PORT = "8000"
$env:PYTHONPATH = "$rootDir\api;$rootDir\sdk"

$apiProcess = Start-Process -FilePath "$rootDir\venv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "main:app", "--app-dir", "$rootDir\api", "--host", "0.0.0.0", "--port", "8000" -PassThru -WindowStyle Minimized

Start-Sleep -Seconds 3

Write-Host "[3/3] Starting React Frontend on http://localhost:3000..." -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
npm start
