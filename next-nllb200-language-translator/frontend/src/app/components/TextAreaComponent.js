'use client';

import { MdContentCopy } from "react-icons/md";
import { toast } from "react-toastify";

import { Textarea } from "@/components/ui/textarea";


const TextAreaComponent = ({ isReadOnly, setInputText, wordCount, setWordCount, resultantTranslatedText }) => {

  const wordLimit = 100;


  const acceptInputFromUserAndAlsoCountNumberOfWordsEnteredByTheUser = (e) => {

    const textFromUser = e.target.value;

    const words = textFromUser.trim().split(/\s+/);

    const wordCount = textFromUser.trim() === '' ? 0 : words.length;

    if (wordCount <= wordLimit) {

      setInputText(textFromUser);

      setWordCount(wordCount);

    } else {

      setWordCount(wordCount);

    }

  };

  const copyResultantTextToClipboard = () => {

    navigator.clipboard.writeText(resultantTranslatedText);

    toast.success('text copied to clipboard successfully', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });

  };
  

  return (
    <>
      {isReadOnly ? (

        <div className="flex flex-col gap-2">

          <Textarea
            placeholder="the translated text will be displayed here"
            className="resize-none w-full h-64 border-2 border-slate-400 text-xl"
            value={resultantTranslatedText}
            readOnly
          />

          {resultantTranslatedText && <div className="flex items-center justify-center">

            <MdContentCopy 
              className="mt-2 text-3xl text-orange-500 hover:cursor-pointer font-bold" 
              onClick={copyResultantTextToClipboard}
            />

          </div>}

        </div>

      ) : (

        <div className="flex flex-col gap-3">

          <Textarea
            placeholder="enter your text here."
            className="resize-none w-full h-64 border-2 border-black text-xl"
            onChange={acceptInputFromUserAndAlsoCountNumberOfWordsEnteredByTheUser}
          />

          <p>{wordCount} / 100</p>

          {wordCount > 100 ? (
            <p className="text-red-500 font-bold">Maximum Word Limit Reached. Please remove some words to make the submit button visible.</p>
          ) : <></>}

        </div>
      )}
    </>
  );
};

export default TextAreaComponent;
