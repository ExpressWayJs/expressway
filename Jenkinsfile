pipeline{
    agent any
    stages{
        stage("build"){
            steps{
                echo 'Build starts!!'
                nodejs('NodeJs-14.15.1') {
                    sh 'echo Installing Deps!'
                    sh 'yarn'
                    sh 'echo Testing!'
                    sh 'yarn test'
                    sh "echo Test Done"
                }

            }
        }
    }
}