import { useState, useEffect } from 'react';

const AudioTranslator = ({ isLocal }) => {
  const [translatedText, setTranslatedText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");

  useEffect(() => {
    if (!isLocal) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US"; // Adjust this based on the language of the speaker
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const speechText = event.results[0][0].transcript;
        setTranscribedText(speechText);
        translateText(speechText);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.start();

      return () => recognition.stop();
    }
  }, [isLocal]);

  const translateText = (text) => {
    // Use Google Translate API here (like in your provided code)
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "hi", // Specify the language for translation (e.g., Spanish)
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      "google_translate_element"
    );

    // Simulating the translation, since this is a widget
    setTranslatedText("Translated version of: " + text);
  };

  return (
    <div className='top-0 text-white z-40 w-[400px] h-[300px] ' >
      <h4>Original Transcribed Text:</h4>
    
      <p>{transcribedText}</p>
      <h4>Translated Text:  </h4>
      {console.log('text ',transcribedText )
      }
      <p>{translatedText}</p>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default AudioTranslator;
