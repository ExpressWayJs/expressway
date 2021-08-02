pipeline{
    stages{
        stage("build"){
            steps{
                echo "executing A"
            }
            post{
                always{
                    echo "Building the stage branch"
                }
                success{
                    echo "Stage executed successfully"
                }
                failure{
                    echo "Stage execution failed"
                }
            }
        }
    }
    post{
        always{
            echo "Pipeline build init"
        }
        success{
            echo "Pipeline executed successfully "
        }
        failure{
            echo "Pipeline execution failed"
        }
    }
}