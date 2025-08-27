// 📁 src/components/LanguageSwitcher.jsx
import { useTranslation } from "react-i18next";
import { useState } from "react";
import frFlag from "../assets/fr.png";
import enFlag from "../assets/en.png";

const languages = {
  fr: { label: "Français", flag: frFlag },
  en: { label: "English", flag: enFlag },
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const currentLang = i18n.language in languages ? i18n.language : "fr";

  const handleChange = (lng) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all"
        >
          <img
            src={languages[currentLang].flag}
            alt={languages[currentLang].label}
            className="object-cover w-full h-full"
          />
        </button>
      </div>

      {open && (
        <div className="origin-top-right absolute left-0 mt-0 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {Object.entries(languages).map(([code, { label, flag }]) => (
              <button
                key={code}
                onClick={() => handleChange(code)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <img src={flag} alt={label} className="w-5 h-5 rounded-full mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}