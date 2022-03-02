import LocalStorage from '../../utils/localStorage/localStorage';
import { KEYS } from '../../utils/localStorage/localStorageModels';

const defaultValueLanaguage = 'he';

class Language {
    constructor() {
    }

    saveLanguage(lang) {
        console.log("4. changeLanguage saveLanguage");
        return LocalStorage.setItem(KEYS.LANGUAGE, lang)
            .then(lang => {
                console.log('saveLanguage- saved new lang successful',lang);
                console.log("4. changeLanguage saveLanguage will return :::",lang);
                return lang;
            })
            .catch(err => {
                console.log('saveLanguage- failed ', err.message);
            });
    }

    getLanguage() {
        return LocalStorage.getItem(KEYS.LANGUAGE,defaultValueLanaguage)
        .then(lang => {
            console.log(`getLanguage- ${lang}`);
            return lang;
        })
        .catch(err => {
            console.log('getLanguage- : ', err.message);
        });
    }
}

export default new Language();
