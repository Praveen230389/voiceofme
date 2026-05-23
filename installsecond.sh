#!/bin/bash
set -e

echo "=========================================================================="
echo "Unified Setup Script: EC2 / Heavy GPU Environment"
echo "Includes strict version locks & ALL model variants (Tiny -> Massive)"
echo "Warning: This will download 20GB+ of AI models."
echo "=========================================================================="

# 1. Environment Setup
if [ ! -d "venv" ]; then
    echo ">>> Creating Python Virtual Environment (venv)..."
    python3 -m venv venv
else
    echo ">>> Virtual Environment already exists."
fi

source venv/bin/activate

# 2. Base Build Tools (Locked setuptools to prevent PyTorch conflicts)
echo ">>> Upgrading base tools... (setuptools<82 is crucial)"
pip install --upgrade pip "setuptools<82" setuptools-scm wheel ninja

# 3. Core Dependencies (Strictly locked to versions we know work perfectly together)
# - PyTorch 2.8.0 with CUDA 12.1 is strictly mandated by Fish-Speech. 
# - Overriding the URLs ensures we don't accidentally install CPU versions.
echo ">>> Installing PyTorch & NLP/API frameworks..."
pip install "torch==2.8.0" "torchaudio==2.8.0" torchvision transformers accelerate fastapi uvicorn pydantic python-dotenv langid huggingface_hub --index-url https://download.pytorch.org/whl/cu121 --extra-index-url https://pypi.org/simple

# 4. Fish-Speech Installation
echo ">>> Fetching and Installing Fish-Speech..."
if [ ! -d "fish-speech" ]; then
    git clone https://github.com/fishaudio/fish-speech.git
fi
cd fish-speech
# We force the local install to respect our PyTorch repo so it doesn't break our environment
pip install -e . --index-url https://download.pytorch.org/whl/cu121 --extra-index-url https://pypi.org/simple
cd ..

# 5. Massive Model Downloading (EC2 Optimized)
echo "=========================================================================="
echo ">>> Caching ALL AI Models (Tiny -> Massive)..."
echo "EC2 instances have high bandwidth, so we will use multiple concurrent workers."
echo "=========================================================================="

# EC2 usually has plenty of RAM, so 4 workers is safe and much faster.
export HF_HUB_DOWNLOAD_MAX_WORKERS=4
export HF_HUB_DISABLE_SYMLINKS_WARNING=1

echo "--- 5A. Downloading ALL NLLB-200 Translation Models ---"
huggingface-cli download facebook/nllb-200-distilled-600M
huggingface-cli download facebook/nllb-200-1.3B
huggingface-cli download facebook/nllb-200-3.3B

echo "--- 5B. Downloading ALL Whisper Transcription Models ---"
huggingface-cli download openai/whisper-tiny
huggingface-cli download openai/whisper-base
huggingface-cli download openai/whisper-small
huggingface-cli download openai/whisper-medium
huggingface-cli download openai/whisper-large-v3-turbo
huggingface-cli download openai/whisper-large-v3

echo "--- 5C. Downloading Fish-Speech TTS/Cloning Models ---"
# Only 1 main architecture checkpoint needed for Fish-Speech TTS
huggingface-cli download fishaudio/fish-speech-1.5 --local-dir checkpoints/fish-speech-1.5

# 6. Frontend Setup
echo ">>> Installing UI Dependencies..."
npm install
if [ -d "next-nllb200-language-translator/frontend" ]; then
    cd next-nllb200-language-translator/frontend
    npm install --legacy-peer-deps
    cd ../..
fi

echo "=========================================================================="
echo "✅ FULL EC2 INSTALLATION COMPLETE."
echo "Locked python environment is ready."
echo "All heavy LLM/Audio models are cached."
echo "=========================================================================="
