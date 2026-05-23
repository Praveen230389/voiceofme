# NextNLLB200 Language Translator

Welcome to the NextNLLB200 Language Translator. This application allows you to translate text between over 50 languages using the powerful NLLB-200 model by Meta. Built with modern technologies such as Next.js, Tailwind CSS, ShadcnUI, and FastAPI, this web app provides a seamless and efficient translation experience.

## Tech Stack Used

- **Next.js**: A React framework that enables server-side rendering and static site generation.
- **Tailwind CSS**: A utility-first CSS framework for styling the application.
- **ShadcnUI**: A component library to create consistent and customizable UI elements.
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python.
- **Meta's NLLB-200 Model**: A state-of-the-art language model that supports translation between 200 languages (Note: This application utilizes 50 languages out of the 200 supported by the NLLB-200 model.).

## Supported Languages

This application supports translation for the following 50 languages:

- English
- Hindi
- Bengali
- Bhojpuri
- Urdu
- Tamil
- Telugu
- Malayalam
- Spanish
- French
- German
- Chinese (Simplified)
- Russian
- Portuguese
- Japanese
- Korean
- Italian
- Dutch
- Greek
- Polish
- Turkish
- Swedish
- Danish
- Finnish
- Hungarian
- Czech
- Norwegian Bokmål
- Romanian
- Slovak
- Croatian
- Bulgarian
- Ukrainian
- Serbian
- Hebrew
- Arabic
- Thai
- Vietnamese
- Indonesian
- Malay
- Filipino
- Swahili
- Amharic
- Somali
- Hausa
- Yoruba
- Zulu
- Xhosa
- Igbo
- Uzbek
- Kazakh

## Features

- **Fast and Accurate Translations**: Utilizes Meta's NLLB-200 model for high-quality translations.
- **User-Friendly Interface**: Built with ShadCN UI and Tailwind CSS for a clean and responsive design.
- **API Integration**: FastAPI seamlessly connects the backend translation model with the frontend interface.
- **Language Support**: Translate text in over 50 languages.
- **Word Limit**: The text area on the frontend supports up to 100 words for translation.
- **Copy to Clipboard**: User can copy the translated text to clipboard.

## How to Use

1. Enter the text you want to translate in the text area (maximum 100 words).
2. Select the source and target languages from the dropdown menus.
3. Click the "Translate" button to see the translated text.

## Deployment

The frontend of this application is deployed on Vercel and the backend of this application is deployed on Huggingface Spaces

### Issues Regarding Deployment

While deploying the application on Huggingface Spaces, if anyone faces any error, then, make sure to do the following changes:

#### Dockerfile
```dockerfile
FROM python:3.9.7

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Create a writable cache directory and set permissions
RUN mkdir -p /code/.cache/huggingface/hub && \
    chmod -R 777 /code/.cache/huggingface

# Set environment variables for Hugging Face cache directory
ENV HF_HOME=/code/.cache/huggingface

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
```

#### app.py

Make sure to add this line:
```py
os.environ["HF_HOME"] = "/code/.cache/huggingface"
```
after 
```py
os.environ["HF_TOKEN"] = os.getenv('HF_TOKEN')
```

Here is the full code:

```py
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import langid
import os


load_dotenv()


os.environ["HF_TOKEN"] = os.getenv('HF_TOKEN')

os.environ["HF_HOME"] = "/code/.cache/huggingface"


app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")

tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")

translator = pipeline('translation', model=model, tokenizer=tokenizer, max_length=400)


class LanguageTextModel(BaseModel):
    languageText: str
    sourceLanguageCode: str
    targetLanguageCode: str


language_code_mapping = {
    'en': 'eng_Latn',
    'hi': 'hin_Deva',
    'bn': 'ben_Beng',
    'bho': 'bho_Deva',
    'ur': 'urd_Arab',
    'ta': 'tam_Taml',
    'te': 'tel_Telu',
    'ml': 'mal_Mlym',
    'es': 'spa_Latn',
    'fr': 'fra_Latn',
    'de': 'deu_Latn',
    'zh-cn': 'zho_Hans',
    'ru': 'rus_Cyrl',
    'pt': 'por_Latn',
    'ja': 'jpn_Jpan',
    'ko': 'kor_Hang',
    'it': 'ita_Latn',
    'nl': 'nld_Latn',
    'el': 'ell_Grek',
    'pl': 'pol_Latn',
    'tr': 'tur_Latn',
    'sv': 'swe_Latn',
    'da': 'dan_Latn',
    'fi': 'fin_Latn',
    'hu': 'hun_Latn',
    'cs': 'ces_Latn',
    'no': 'nob_Latn',
    'ro': 'ron_Latn',
    'sk': 'slk_Latn',
    'hr': 'hrv_Latn',
    'bg': 'bul_Cyrl',
    'uk': 'ukr_Cyrl',
    'sr': 'srp_Cyrl',
    'he': 'heb_Hebr',
    'ar': 'arb_Arab',
    'th': 'tha_Thai',
    'vi': 'vie_Latn',
    'id': 'ind_Latn',
    'ms': 'zsm_Latn',
    'tl': 'tgl_Latn',
    'sw': 'swh_Latn',
    'am': 'amh_Ethi',
    'so': 'som_Latn',
    'ha': 'hau_Latn',
    'yo': 'yor_Latn',
    'zu': 'zul_Latn',
    'xh': 'xho_Latn',
    'ig': 'ibo_Latn',
    'uz': 'uzb_Latn',
    'kk': 'kaz_Cyrl',
}


@app.get('/')
def welcome():
    return {
        'success': True,
        'message': 'Server of "NLLB language translator" is up and running successfully'
    }


@app.post('/translate')
async def translate_text(allInput: LanguageTextModel):

    try:

        detected_language, confidence = langid.classify(allInput.languageText)


        if detected_language not in language_code_mapping:

            return {
                "success": False,
                "message": "Detected Language is not supported."
            }
        

        detected_source_language_code = language_code_mapping[detected_language]

        if detected_source_language_code != allInput.sourceLanguageCode:
            
            return {
                "success": False,
                "message": "Wrong combination of source language code and input text."
            }


        response = translator(allInput.languageText, src_lang=allInput.sourceLanguageCode, tgt_lang=allInput.targetLanguageCode)
        
        return {
            "success": True,
            "translated_text": response[0]['translation_text']
        }

    except Exception as e:

        print(f"Error: {e}")

        return {
            "success": False,
            "message": "Something went wrong. Please try again after sometime."
        }
```

## Deployment Links

01) Live Preview: https://language-translator-nllb-200-nextjs.vercel.app/
02) Backend FastAPI API of the NLLB-200: https://som11-language-translator.hf.space/
03) Swagger docs of the FastAPI API of the NLLB-200: https://som11-language-translator.hf.space/docs

## Demo video of the application

https://github.com/user-attachments/assets/51a442c9-c851-4bab-853e-03ca3cf3aaad

## Disclaimer

The creator of this application is not responsible for any inaccuracies or errors in translations, as the NLLB-200 model's functioning is beyond the creator's control.

