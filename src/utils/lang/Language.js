import { getStartDirection } from "./I18n";

class Language {
    getDataByLanguage(object) {
        const language = getStartDirection() === 'right'? 'Hebrew' : 'English';
        console.log('The object and language is: ', object, language);
        // TODO:: CHECK IF NOT NOT NULL
        if (language == "Hebrew") {
            return object.heb;
        } else {
            return object.eng;
        }
    }
}

export default new Language();