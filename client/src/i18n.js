import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Anywhere": "Anywhere",
      "Any week": "Any week",
      "Add guests": "Add guests",
      "Profile": "Profile",
      "Sign up": "Sign up",
      "Login": "Login",
      "Dashboard": "Dashboard",
      "List your home": "List your home",
      "See your favorites": "See your favorites",
      "Listed homes": "Listed homes",
      "Logout": "Logout"
    }
  },
  hi: {
    translation: {
      "Anywhere": "कहीं भी",
      "Any week": "कोई भी सप्ताह",
      "Add guests": "अतिथि जोड़ें",
      "Profile": "प्रोफ़ाइल",
      "Sign up": "साइन अप करें",
      "Login": "लॉग इन करें",
      "Dashboard": "डैशबोर्ड",
      "List your home": "अपना घर सूचीबद्ध करें",
      "See your favorites": "अपने पसंदीदा देखें",
      "Listed homes": "सूचीबद्ध घर",
      "Logout": "लॉग आउट"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
