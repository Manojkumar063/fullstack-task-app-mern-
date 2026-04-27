# Jenkins Setup Guide

## Prerequisites
- Docker installed
- Git installed
- Node.js 18+ installed

## 1. Install Jenkins

### Using Docker (Recommended)
```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts
```

### Get Initial Admin Password
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

## 2. Configure Jenkins

1. Open http://localhost:8080
2. Enter the initial admin password
3. Install suggested plugins
4. Create admin user

## 3. Install Required Plugins

Go to **Manage Jenkins** → **Manage Plugins** → **Available**

Install:
- Docker Pipeline
- NodeJS Plugin
- Git Plugin
- Pipeline Plugin

## 4. Configure Tools

### NodeJS Configuration
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Add NodeJS installation:
   - Name: `NodeJS 18`
   - Version: `18.x`
   - Check "Install automatically"

### Docker Configuration
1. Ensure Docker is accessible from Jenkins
2. Add Docker Hub credentials:
   - Go to **Manage Jenkins** → **Manage Credentials**
   - Add credentials (Username with password)
   - ID: `docker-hub-credentials`

## 5. Create Pipeline Job

1. Click **New Item**
2. Enter name: `task-manager-pipeline`
3. Select **Pipeline**
4. Click **OK**

### Configure Pipeline
1. Under **Pipeline** section:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: Your Git repository URL
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

2. Click **Save**

## 6. Environment Variables

Add these credentials in Jenkins:
- `docker-hub-credentials`: Docker Hub username/password
- Update `DOCKER_REGISTRY` in Jenkinsfile if using private registry

## 7. Run Pipeline

1. Click **Build Now**
2. Monitor the build in **Console Output**

## Pipeline Stages

1. **Checkout**: Clones the repository
2. **Install Dependencies**: Installs npm packages for backend and frontend
3. **Build**: Builds the application
4. **Docker Build**: Creates Docker images
5. **Docker Push**: Pushes images to registry (main branch only)
6. **Deploy**: Deploys using docker-compose (main branch only)

## Troubleshooting

### Docker Permission Issues
```bash
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Node Memory Issues
Add to Jenkinsfile environment:
```groovy
NODE_OPTIONS = '--max-old-space-size=4096'
```

## Webhook Setup (Optional)

For automatic builds on Git push:
1. Go to your Git repository settings
2. Add webhook: `http://your-jenkins-url:8080/github-webhook/`
3. Select "Just the push event"
