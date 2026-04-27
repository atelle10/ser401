### EC2 Deployment MVP Set Up

1. SSH into EC2 instance. (Verify that docker is installed on the ec2)
2. Git clone ser401 repo.
3. cd into repo folder.
4. copy the `.env.example` and create a `.env` file with the valid credentials. The file must be inside `/deployment` direc.
5. Set PUBLIC_URL to the ec2 public IP and port 3000
6. Set VITE_API_URL to ec2 public IP and port 8000
7. Make deployment script executable: `chmod +x mvp_ec2_deploy.sh`
8. Run deployment script `./mvp_ec2_deployment.sh`
9. To kill the containers, run the kill script: `./kill_container.sh`
