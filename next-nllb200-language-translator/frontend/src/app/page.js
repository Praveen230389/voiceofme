'use client';

import { useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';

import SelectComponent from './components/SelectComponent';
import TextAreaComponent from './components/TextAreaComponent';


const page = () => {

  const listOf50Languages = [
    { id: 1, languageName: 'English', languageCode: 'eng_Latn' },
    { id: 2, languageName: 'Hindi', languageCode: 'hin_Deva' },
    { id: 3, languageName: 'Bengali', languageCode: 'ben_Beng' },
    { id: 4, languageName: 'Bhojpuri', languageCode: 'bho_Deva' },
    { id: 5, languageName: 'Urdu', languageCode: 'urd_Arab' },
    { id: 6, languageName: 'Tamil', languageCode: 'tam_Taml' },
    { id: 7, languageName: 'Telugu', languageCode: 'tel_Telu' },
    { id: 8, languageName: 'Malayalam', languageCode: 'mal_Mlym' },
    { id: 9, languageName: 'Spanish', languageCode: 'spa_Latn' },
    { id: 10, languageName: 'French', languageCode: 'fra_Latn' },
    { id: 11, languageName: 'German', languageCode: 'deu_Latn' },
    { id: 12, languageName: 'Chinese (Simplified)', languageCode: 'zho_Hans' },
    { id: 13, languageName: 'Russian', languageCode: 'rus_Cyrl' },
    { id: 14, languageName: 'Portuguese', languageCode: 'por_Latn' },
    { id: 15, languageName: 'Japanese', languageCode: 'jpn_Jpan' },
    { id: 16, languageName: 'Korean', languageCode: 'kor_Hang' },
    { id: 17, languageName: 'Italian', languageCode: 'ita_Latn' },
    { id: 18, languageName: 'Dutch', languageCode: 'nld_Latn' },
    { id: 19, languageName: 'Greek', languageCode: 'ell_Grek' },
    { id: 20, languageName: 'Polish', languageCode: 'pol_Latn' },
    { id: 21, languageName: 'Turkish', languageCode: 'tur_Latn' },
    { id: 22, languageName: 'Swedish', languageCode: 'swe_Latn' },
    { id: 23, languageName: 'Danish', languageCode: 'dan_Latn' },
    { id: 24, languageName: 'Finnish', languageCode: 'fin_Latn' },
    { id: 25, languageName: 'Hungarian', languageCode: 'hun_Latn' },
    { id: 26, languageName: 'Czech', languageCode: 'ces_Latn' },
    { id: 27, languageName: 'Norwegian Bokmål', languageCode: 'nob_Latn' },
    { id: 28, languageName: 'Romanian', languageCode: 'ron_Latn' },
    { id: 29, languageName: 'Slovak', languageCode: 'slk_Latn' },
    { id: 30, languageName: 'Croatian', languageCode: 'hrv_Latn' },
    { id: 31, languageName: 'Bulgarian', languageCode: 'bul_Cyrl' },
    { id: 32, languageName: 'Ukrainian', languageCode: 'ukr_Cyrl' },
    { id: 33, languageName: 'Serbian', languageCode: 'srp_Cyrl' },
    { id: 34, languageName: 'Hebrew', languageCode: 'heb_Hebr' },
    { id: 35, languageName: 'Arabic', languageCode: 'arb_Arab' },
    { id: 36, languageName: 'Thai', languageCode: 'tha_Thai' },
    { id: 37, languageName: 'Vietnamese', languageCode: 'vie_Latn' },
    { id: 38, languageName: 'Indonesian', languageCode: 'ind_Latn' },
    { id: 39, languageName: 'Malay', languageCode: 'zsm_Latn' },
    { id: 40, languageName: 'Filipino', languageCode: 'tgl_Latn' },
    { id: 41, languageName: 'Swahili', languageCode: 'swh_Latn' },
    { id: 42, languageName: 'Amharic', languageCode: 'amh_Ethi' },
    { id: 43, languageName: 'Somali', languageCode: 'som_Latn' },
    { id: 44, languageName: 'Hausa', languageCode: 'hau_Latn' },
    { id: 45, languageName: 'Yoruba', languageCode: 'yor_Latn' },
    { id: 46, languageName: 'Zulu', languageCode: 'zul_Latn' },
    { id: 47, languageName: 'Xhosa', languageCode: 'xho_Latn' },
    { id: 48, languageName: 'Igbo', languageCode: 'ibo_Latn' },
    { id: 49, languageName: 'Uzbek', languageCode: 'uzb_Latn' },
    { id: 50, languageName: 'Kazakh', languageCode: 'kaz_Cyrl' },
  ];


  const [inputText, setInputText] = useState('');

  const [sourceLanguageInput, setSourceLanguageInput] = useState('');

  const [targetLanguageInput, setTargetLanguageInput] = useState('');

  const [resultantText, setResultantText] = useState('');

  const [loading, setLoading] = useState(false);

  const [wordCount, setWordCount] = useState(0);


  const onSendDataToBackend = async () => {

    try {

      setLoading(true);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_FASTAPI_URL}/translate`, {

        languageText: inputText,

        sourceLanguageCode: sourceLanguageInput,

        targetLanguageCode: targetLanguageInput,

      });

      if (response?.data?.success === true) {

        setResultantText(response?.data?.translated_text);

      } else if (response?.data?.success === false) {

        setResultantText(response?.data?.message);

      }

    } catch (error) {

      console.log(error);

      toast.error('Something went wrong. Please try again after sometime.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

    } finally {

      setLoading(false);

    }

  };

  console.log(wordCount > 100 ? "don't display button" : "display button");

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 bg-gradient-to-t from-orange-100 to-white">
      
      <p className="text-lg lg:text-2xl text-center mt-28 text-orange-500 tracking-wider font-bold">
        NextNLLB200 Language Translator
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-11/12 mb-20">


        <div className="w-full flex flex-col gap-3">

          <SelectComponent
            languageText="select source language"
            allLanguages={listOf50Languages}
            setLanguageSelectInput={setSourceLanguageInput}
          />

          <TextAreaComponent
            isReadOnly={false}
            setInputText={setInputText}
            wordCount={wordCount}
            setWordCount={setWordCount}
          />

          <div className="flex flex-col gap-3">


            {wordCount > 100 ? <></> : <>
              {!loading ? (
                <Button
                  variant="outline"
                  className="transition-all duration-200 !bg-orange-200 text-black h-12 border-2 border-solid border-black text-lg tracking-wider disabled:!bg-gray-200"
                  onClick={onSendDataToBackend}
                  disabled={
                    !inputText || !sourceLanguageInput || !targetLanguageInput
                  }
                >
                  Translate
                </Button>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <ImSpinner2 className="text-4xl text-orange-600 transition-all animate-spin" />
                </div>
              )}
            </>}

          </div>

        </div>


        <div className="w-full flex flex-col gap-3">

          <SelectComponent
            languageText="select target language"
            allLanguages={listOf50Languages}
            setLanguageSelectInput={setTargetLanguageInput}
          />

          <TextAreaComponent
            isReadOnly={true}
            resultantTranslatedText={resultantText}
          />

        </div>

      </div>
      

    </div>
  );
};

export default page;
