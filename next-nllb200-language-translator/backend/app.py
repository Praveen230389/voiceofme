from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import langid
import os


load_dotenv()


hf_token = os.getenv('HF_TOKEN')
if hf_token:
    os.environ["HF_TOKEN"] = hf_token


app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = None
tokenizer = None
translator = None

def get_translator():
    global model, tokenizer, translator
    if translator is None:
        print(">>> Lazy Loading NLLB Model into RAM...")
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
        model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")
        tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")
        translator = pipeline('translation', model=model, tokenizer=tokenizer, max_length=400)
    return translator


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


        loaded_translator = get_translator()
        response = loaded_translator(allInput.languageText, src_lang=allInput.sourceLanguageCode, tgt_lang=allInput.targetLanguageCode)
        
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
