#!/bin/bash

# Set the root directory as the directory where the script is located
root_directory="$(cd "$(dirname "$0")" && pwd)"

# Change to the root directory
cd "$root_directory"

# Prompt for and store the account name
read -p "Enter your account name: " account_name

# Prompt for Docker registry credentials
docker login -u $account_name

# Function to build and push Docker images
build_and_push_docker_images() {
  for folder in */; do
    if [ -f "$folder/Dockerfile" ]; then
      sub_folder_name="${folder%/}"

      # Build Docker image
      docker build -t "$account_name/$sub_folder_name" "$folder"

      # Push Docker image
      docker push "$account_name/$sub_folder_name"
    fi
  done
}

# Check inside each sub-folder
build_and_push_docker_images