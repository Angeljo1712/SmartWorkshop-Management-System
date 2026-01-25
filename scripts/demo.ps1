$base = "http://localhost:3000/api"

Write-Host "Logging in as seeded customer..."
$customer = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body (@{
  email = "customer@smartworkshop.local"
  password = "Customer123!"
} | ConvertTo-Json)

$customerToken = $customer.token
Write-Host "Customer token acquired."

Write-Host "Creating a new service request..."
$newRequest = Invoke-RestMethod -Method Post -Uri "$base/service-requests" -Headers @{ Authorization = "Bearer $customerToken" } -ContentType "application/json" -Body (@{
  vehicle_reg = "SW-5678"
  vehicle_make = "Honda"
  vehicle_model = "Civic"
  issue_description = "Clunking noise from front suspension."
  preferred_date = "2026-01-30"
} | ConvertTo-Json)

$requestId = $newRequest.request_id
Write-Host "Created request ID $requestId"

Write-Host "Logging in as seeded mechanic..."
$mechanic = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body (@{
  email = "mechanic@smartworkshop.local"
  password = "Mechanic123!"
} | ConvertTo-Json)

$mechanicToken = $mechanic.token
Write-Host "Mechanic token acquired."

Write-Host "Listing available requests..."
$available = Invoke-RestMethod -Method Get -Uri "$base/service-requests/available" -Headers @{ Authorization = "Bearer $mechanicToken" }
$target = $available | Where-Object { $_.request_id -eq $requestId }

if (-not $target) {
  Write-Host "New request not found in available list."
} else {
  Write-Host "Submitting quotation..."
  $quotation = Invoke-RestMethod -Method Post -Uri "$base/quotations" -Headers @{ Authorization = "Bearer $mechanicToken" } -ContentType "application/json" -Body (@{
    request_id = $requestId
    labour_cost = 120
    parts_cost = 80
    estimated_days = 2
    notes = "Replace suspension bushing and inspect alignment."
  } | ConvertTo-Json)

  $quotationId = $quotation.quotation_id
  Write-Host "Quotation ID $quotationId created."

  Write-Host "Customer accepting quotation..."
  $accept = Invoke-RestMethod -Method Post -Uri "$base/quotations/$quotationId/accept" -Headers @{ Authorization = "Bearer $customerToken" }
  $jobId = $accept.job_id
  Write-Host "Job ID $jobId created."

  Write-Host "Mechanic updating job status to InProgress..."
  Invoke-RestMethod -Method Patch -Uri "$base/jobs/$jobId/status" -Headers @{ Authorization = "Bearer $mechanicToken" } -ContentType "application/json" -Body (@{
    status = "InProgress"
    comment = "Vehicle checked in and diagnostics started."
  } | ConvertTo-Json) | Out-Null

  Write-Host "Mechanic updating job status to Completed..."
  Invoke-RestMethod -Method Patch -Uri "$base/jobs/$jobId/status" -Headers @{ Authorization = "Bearer $mechanicToken" } -ContentType "application/json" -Body (@{
    status = "Completed"
    comment = "Suspension repaired and road test complete."
  } | ConvertTo-Json) | Out-Null

  Write-Host "Customer fetching job history..."
  $history = Invoke-RestMethod -Method Get -Uri "$base/jobs/$jobId/history" -Headers @{ Authorization = "Bearer $customerToken" }
  $history | Format-Table status, updated_by_name, updated_at, comment
}
