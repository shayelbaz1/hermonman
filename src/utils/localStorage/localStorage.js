import {AsyncStorage} from 'react-native';
import {KEYS} from './localStorageModels';

class localStorage {

    constructor() {
    }
    
    // Client user

    setCurrentUserMail(email) {
        return AsyncStorage.setItem(KEYS.EMAIL, email)
            .then(() => {
                console.log(`set ${KEYS.EMAIL} = ${email}`);
                return email;
            });
    }

    getCurrentUserMail() {
        return AsyncStorage.getItem(KEYS.EMAIL)
            .then(value => {
                console.log(`${KEYS.EMAIL} is :${value}`);
                return value;
            });
    }

    getItem(key, defaultVal) {
        console.log("initLocale key-----> ",key);
        console.log("initLocale defaultVal-----> ",defaultVal);

        return AsyncStorage.getItem(key)
            .then(val => {
                if (val) {
                    console.log("initLocale val isnt undedind");
                    console.log(`initLocale getItem ${key}: ${val}`);
                    return val;
                }
                console.log(`initLocale getItem ${key}: ${val}`);
                return defaultVal;
            })
            .catch(err => {
                console.log('error in local storage: ', err.message);
            });
    }

    setItem(key, value) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, value)
                .then(() => {
                    resolve(value);
                })
                .catch(err => reject(err));
        });
    }


}

export default new localStorage();

export const USER_CHOICES = {
    STORE_ADMIN: 'storeAdmin',
    STORE: 'store',
    CLIENT: 'client',
    NONE: 'none'
};