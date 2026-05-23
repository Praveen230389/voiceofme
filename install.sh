#!/bin/bash
set -e

echo "=========================================================================="
echo "Unified Setup Script: Whisper, Fish-Speech, NLLB-200"
echo "Hardware Profile: Strict Download-Only Mode & LOW RAM Safe"
echo "=========================================================================="

if [ ! -d "venv" ]; then
    echo ">>> Creating Python Virtual Environment (venv)..."
    python3 -m venv venv
else
    echo ">>> Virtual Environment already exists. Skipping creation..."
fi

source venv/bin/activate

echo ">>> Upgrading base tools (pinning setuptools safely)..."
# We pin setuptools to <82 to appease PyTorch's strict requirements
pip install --upgrade pip "setuptools<82" setuptools-scm wheel ninja

echo ">>> Fetching and Installing Fish-Speech..."
if [ ! -d "fish-speech" ]; then
    git clone https://github.com/fishaudio/fish-speech.git
fi
cd fish-speech
# We install Fish-Speech first so it can dictate exactly which PyTorch version it desires
pip install -e . --index-url https://download.pytorch.org/whl/cu121 --extra-index-url https://pypi.org/simple
cd ..

echo ">>> Installing Support API and NLP components..."
# We install the rest of the dependencies, letting pip respect the PyTorch version Fish-Speech just installed
pip install torchvision transformers accelerate fastapi uvicorn pydantic python-dotenv langid huggingface_hub --index-url https://download.pytorch.org/whl/cu121 --extra-index-url https://pypi.org/simple

echo "=========================================================================="
echo ">>> Caching AI Models Locally (LOW RAM MODE)..."
echo "NOTE: We are ONLY downloading. We are NOT running or memory-loading anything."
echo "We are explicitly limiting concurrent downloads to 1 to prevent 'Killed' OOM errors."
echo "=========================================================================="

# 🚨 This is the magic command to prevent RAM overload during download! 🚨
# By default HuggingFace tries to download chunks simultaneously, which eats RAM and causes 'Killed'.
export HF_HUB_DOWNLOAD_MAX_WORKERS=1
export HF_HUB_DISABLE_SYMLINKS_WARNING=1

echo "--- Downloading NLLB-200 (Translation Model) ---"
huggingface-cli download facebook/nllb-200-distilled-600M

echo "--- Downloading Whisper Large V3 Turbo (Transcription Model) ---"
huggingface-cli download openai/whisper-large-v3-turbo

echo "--- Downloading Fish-Speech TTS/Cloning Models ---"
huggingface-cli download fishaudio/fish-speech-1.5 --local-dir checkpoints/fish-speech-1.5

echo ">>> Installing UI Dependencies..."
npm install
if [ -d "next-nllb200-language-translator/frontend" ]; then
    cd next-nllb200-language-translator/frontend
    npm install --legacy-peer-deps
    cd ../..
fi

echo "=========================================================================="
echo "✅ DOWNLOAD & INSTALLATION COMPLETE."
echo "All assets have been fetched to disk. Safe for EC2 or localized testing."
echo "=========================================================================="
