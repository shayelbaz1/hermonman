import ReactNative, {Platform, NativeModules, I18nManager} from 'react-native';
import I18n from 'react-native-i18n';
import LocalStorage from '../localStorage/localStorage';
import {KEYS} from '../localStorage/localStorageModels';

import en from './en.json';
import he from './he.json';

const DEFAULT_LANGUAGE = 'en';
//const DEFAULT_LANGUAGE = getDefaultFromDevice();

export function getDefaultFromDevice() {
	console.log('0. getDefaultFromDevice--->');
	let langRegionLocale = 'en_US';

	// If we have an Android phone
	if (Platform.OS === 'android') {
		langRegionLocale = NativeModules.I18nManager.localeIdentifier || '';
	} else if (Platform.OS === 'ios') {
		langRegionLocale = NativeModules.SettingsManager.settings.AppleLocale || '';
	}

	// "en_US" -> "en", "es_CL" -> "es", etc
	let languageLocale = langRegionLocale.substring(0, 2); // get first two characters
	return languageLocale;
}

I18n.translations = {
	en,
	he,
};

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

export function initLocale() {
	console.log('5. changeLanguage initLocale ');
	return LocalStorage.getItem(KEYS.LANGUAGE, DEFAULT_LANGUAGE).then((lang) => {
		console.log('6. changeLanguage initLocale getItem lang:::::::', lang);
		if (lang === 'he' || lang === 'he-IL' || lang === 'Hebrew') {
			I18n.locale = 'he';
		} else {
			I18n.locale = 'en';
		}
		console.log('66. changeLanguage initLocale will return:::::::', lang);
		return lang;
	});
}

export function isRTL() {
	const currentLocale = I18n.currentLocale();
	return currentLocale.indexOf('he') >= 0;
}

export function getStartDirection() {
	return isRTL() ? 'right' : 'left';
}
// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return I18n.t(name, params);
}

export default I18n;
