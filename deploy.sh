bash
#!/bin/bash

set -e

# Configurações
AWS_REGION="ap-northeast-1"
AWS_ACCOUNT_ID="518014098041"
ECR_REPOSITORY="task-manager"
IMAGE_TAG="latest"

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo "1. Building Docker image for Linux AMD64..."

docker build \
  --platform linux/amd64 \
  -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

echo "2. Logging in to Amazon ECR..."

aws ecr get-login-password --region ${AWS_REGION} | \
docker login \
  --username AWS \
  --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

echo "3. Tagging image..."

docker tag \
  ${ECR_REPOSITORY}:${IMAGE_TAG} \
  ${ECR_URI}:${IMAGE_TAG}

echo "4. Pushing image to ECR..."

docker push ${ECR_URI}:${IMAGE_TAG}

echo "5. Deployment image pushed successfully!"

echo "Image: ${ECR_URI}:${IMAGE_TAG}"

