import {Icon} from 'native-base';
import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {APP_BACKGROUND_CREAM_COLOR, APP_GRAY_BACKGROUND} from '../../assets/colors';
import LanguageModal from '../../components/modals/modal/LangaugeModal';
import LanguageController from '../../modules/langauge/Language';
import firebase from '../../utils/firebase/Firebase';
import {getStartDirection, initLocale, strings} from '../../utils/lang/I18n';
import localized from '../../utils/lang/localized';
import sceneManager from '../sceneManager';

class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			language: 'Hebrew', //or
			selectedLanauge: '', //shani
			languageName: 'Hebrew', //shani
			user: {},
			lanaugeModalOpen: false,
		};
	}

	async changeLocale(selectedLanguage) {
		console.log('4. changeLanguage changeLocale selectedLanguage', selectedLanguage);
		await initLocale();
		this.setState({selectedLanguage}, () => {
			console.log('7. changeLanguage changeLocale will refresh');
			sceneManager.refresh('Home');
			sceneManager.refresh('Settings');
			//sceneManager.goBack();
		});
	}

	componentWillMount() {
		LanguageController.getLanguage().then((lang) => {
			console.log('lang from settings', lang);
			const languageName = lang === 'he' ? 'Hebrew' : 'English';
			this.setState({language: lang, languageName, loadedLanguage: true, selectedLanauge: lang}, () =>
				console.log('selectedLanauge:::::', this.state.selectedLanauge)
			);
		});
		const user = firebase.getCurrentUser().then((user) => {
			this.setState({user});
		});
	}

	saveLangaugeInLocalStorage = () => {
		const {selectedLanauge} = this.state;
		console.log('2. changeLanguage saveLangaugeInLocalStorage ', selectedLanauge);

		LanguageController.saveLanguage(selectedLanauge)
			.then((lang) => {
				console.log('3. changeLanguage lang ', lang);
				this.changeLocale(lang);
			})
			.catch((err) => {
				console.log('error saving langauge ', err);
			});
	};

	//update language in db and in localstorage
	updateLanguage = (language) => {
		const languageValue = language === 'Hebrew' ? 'he' : 'en';
		this.setState({language, selectedLanauge: languageValue});
	};

	onSelectedLang = () => {
		const {user, selectedLanauge} = this.state;
		firebase
			.updateHermonManUserLanguage(user, selectedLanauge)
			.then(() => {
				this.saveLangaugeInLocalStorage();
			})
			.then(() => {
				this.closeLanaugeModal();
			})
			.catch(() => {
				Alert.alert(localized.ContactUs.changeBadTitle, strings('ERROR_lANAGUE_CHANGED'));
			});
	};

	openLanguageModal = () => {
		this.setState({lanaugeModalOpen: true});
	};

	selectedLanguage = (lanauge) => {
		this.setState({selectedLanauge: lanauge.key}, () => this.onSelectedLang());
	};

	closeLanaugeModal = () => {
		this.setState({lanaugeModalOpen: false});
	};

	renderLanaugeModal = () => {
		return (
			<LanguageModal
				isOpen={this.state.lanaugeModalOpen}
				closeModal={this.closeLanaugeModal}
				setOption={this.selectedLanguage}
				selectedOption={this.state.selectedLanauge}
			/>
		);
	};

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	renderLanguage = () => {
		const displayLanauge =
			this.state.selectedLanauge !== '' &&
			(this.state.selectedLanauge === 'he' || this.state.selectedLanauge === 'Hebrew')
				? strings('HEBREW')
				: strings('ENGLISH');
		const text = this.state.selectedLanauge !== '' ? displayLanauge : '';
		const labelText = strings('SELECT_LANG');
		const {loadedLanguage} = this.state;
		const flexDirection = this.getRtl() ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'};
		const textAlign = this.getRtl() ? {textAlign: 'right'} : {textAlign: 'left'};
		const paddingHor = this.getRtl() ? {paddingHorizontal: 50} : {paddingHorizontal: 15};
		if (loadedLanguage) {
			return (
				<View>
					<View style={{marginVertical: 8}}>
						<Text style={[styles.labelStyle, textAlign, paddingHor]}>{labelText}</Text>
					</View>
					<TouchableOpacity onPress={this.openLanguageModal} style={[styles.textBox]}>
						<View style={[{justifyContent: 'space-between'}, flexDirection]}>
							<Icon name={'ios-arrow-down'} style={{fontSize: 20, margin: '4%'}} />
							<Text style={styles.textStyleForModal}>{text}</Text>
						</View>
					</TouchableOpacity>
				</View>
			);
		}
	};

	render() {
		const textHeader = strings('SELECT_LANGUAGE');
		const select = strings('SELECT');

		return (
			<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%'}}>
				<View>
					<Text style={styles.headerText}>{textHeader}</Text>
				</View>

				<View style={{marginVertical: 15}}>{this.renderLanguage()}</View>

				{this.renderLanaugeModal()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	textHeader: {
		fontSize: 32,
		color: '#29a4dc',
		fontWeight: 'bold',
		textShadowColor: '#066793',
		textShadowOffset: {width: 0, height: 1},
		textAlignVertical: 'top',
	},
	contentContainer: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
	labelStyle: {
		fontSize: 18,
	},
	inputStyle: {
		height: 50,
		width: 300,
		borderColor: 'gray',
	},
	titleText: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		paddingBottom: 4,
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'black',
		textAlign: 'center',
		marginTop: 20,
	},
	textBox: {
		borderColor: APP_GRAY_BACKGROUND,
		borderWidth: 2,
		width: 300,
		height: 50,
		borderRadius: 200 / 2,
		marginRight: '5%',
		marginLeft: '5%',
		backgroundColor: 'white',
	},
	textStyleForModal: {
		alignSelf: 'flex-end',
		color: 'black',
		fontSize: 15,
		margin: '4%',
	},
	buttonStyle: {
		width: 200,
		height: 50,
		borderRadius: 50 / 2,
	},
	selectButtonView: {
		alignContent: 'center',
		marginVertical: 35,
		alignItems: 'center',
	},
	textInButton: {
		fontSize: 20,
	},
});
export default Settings;
