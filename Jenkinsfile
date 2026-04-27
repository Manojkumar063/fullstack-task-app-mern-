pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
        BACKEND_IMAGE = 'task-manager-backend'
        FRONTEND_IMAGE = 'task-manager-frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build || echo "No build script"'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
                    sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }
        
        stage('Docker Push') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                        sh "docker push ${BACKEND_IMAGE}:latest"
                        sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose -f docker-compose.prod.yml up -d'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            sh 'docker system prune -f'
        }
    }
}
