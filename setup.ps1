# Set the root directory as the directory where the script is located
$root_directory = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the root directory
Set-Location $root_directory

# Prompt for and store the account name
$account_name = Read-Host "Enter your account name"

# Prompt for Docker registry credentials
docker login -u $account_name

# Function to build and push Docker images
function build_and_push_docker_images {
  Get-ChildItem | Where-Object { $_.PSIsContainer } | ForEach-Object {
    $folder = $_

    if (Test-Path "$folder\Dockerfile") {
      $sub_folder_name = $folder.Name

      # Build Docker image
      docker build -t "$account_name/$sub_folder_name" "$folder"

      # Push Docker image
      docker push "$account_name/$sub_folder_name"
    }
  }
}

# Check inside each sub-folder
build_and_push_docker_images
