================================================================================
DEPLOYING TO AWS EC2 (GPU INSTANCE)
================================================================================

1. CHOOSING THE RIGHT INSTANCE
Because we are going to be expanding to ALL models (including the massive NLLB 3.3B 
which requires ~14GB VRAM and Whisper Large-v3 which requires ~6GB VRAM), you need 
an instance with minimum 24GB of GPU memory.
- Recommended Instance: `g5.xlarge` or `g5.2xlarge` (Features an NVIDIA A10G 24GB GPU).
- Budget Instance: `g4dn.xlarge` (NVIDIA T4 16GB GPU) -> Warning: You won't be able to run the absolute biggest models simultaneously on 16GB.
- Recommended OS: "Ubuntu Server 22.04 LTS" OR "Deep Learning AMI GPU PyTorch" 
  (The Deep Learning AMI is awesome because NVIDIA drivers and CUDA are already installed!).
- Storage: Give the EC2 at least 150GB of SSD (gp3) storage. The models are HUGE.

2. SECURITY GROUPS (FIREWALL)
In your AWS EC2 Console, go to Security Groups and open these Inbound ports to the internet (0.0.0.0/0):
- Port 22 (SSH) -> So you can log into the server.
- Port 3000 (TCP) -> So you can access the frontend React UI.
- Port 8000 (TCP) -> So your UI can talk to the FastAPI backend.

3. SETTING IT UP ON EC2
SSH into your instance:
  ssh -i "your-key.pem" ubuntu@<your-ec2-ip>

Clone your git repository to the server:
  git clone <your-repo-link>
  cd <your-repo>

Run the heavy script we just made:
  chmod +x installsecond.sh
  ./installsecond.sh

4. HOW TO RUN THE SITE
We need both the backend and frontend to stay alive even if you close your SSH terminal window. We can use a tool called `tmux` or `pm2`. The easiest way is `tmux`:

Terminal 1 (Backend):
  tmux new -s backend
  source venv/bin/activate
  uvicorn backend:app --host 0.0.0.0 --port 8000
  (Press Ctrl+B, then D to detach and leave it running)

Terminal 2 (Frontend):
  tmux new -s frontend
  npm run dev -- --host 0.0.0.0
  (Press Ctrl+B, then D to detach)

Now your site is accessible via http://<your-ec2-ip>:3000!

================================================================================
DOCKER HUB & CONTAINERIZING (ARCHITECTURE ADVICE)
================================================================================

Should you pack EVERYTHING (All 50GB of models + code + tools) into ONE Docker image?
Short Answer: NO, absolutely not.

Why?
1. Container Size limits: A 50GB Docker image will take hours to push and pull from Docker Hub. Many CI/CD tools break or time out on images larger than 5GB.
2. Inefficient Updates: If you change one line of HTML in your frontend, Docker has to process a 50GB image layer all over again.

The Industry Standard "Docker Volume" Approach:
Ideally, you build your Docker image to ONLY contain your code and your requirements (PyTorch, Node, etc.). This makes the image about 4-5GB.

When you run the container, you mount an external "Volume" from your EC2 hard drive to the container:
`docker run -v /home/ubuntu/cached_models:/root/.cache/huggingface ...`

How it works:
1. Docker image boots up fast.
2. It looks inside the volume for the models.
3. If the models are empty (first time), it runs your download script to populate the local disk.
4. From then on, every time you stop/start the container, the heavy models stay persistently on your EC2 hard drive!

Storing just the code on Git and the Docker Hub, while letting the script pull the heavy models automatically, is the safest, most professional way to do this.
