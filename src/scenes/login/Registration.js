import React, {Component} from 'react';
import {
	Alert,
	ImageBackground,
	Keyboard,
	Picker,
	Platform,
	ScrollView,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import HermonManTextInput, {types} from '../../components/common/hermonManTextInput/HermonManTextInput';
import DateInput from '../../components/datePicker/DateInput';
import moment from 'moment';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import CheckBox from 'react-native-checkbox';
import {
	APP_GRAY_BACKGROUND,
	APP_BACKGROUND_CREAM_COLOR,
	APP_TEXT_WHITE,
	APP_BUTTON_BACKGROUND,
} from '../../assets/colors';
import GenderModal from '../../components/modals/modal/GenderModal';
import LanguageModal from '../../components/modals/modal/LangaugeModal';
import localized from '../../utils/lang/localized';
import firebase from '../../utils/firebase/Firebase';
import {regexValidation} from '../../utils/RegexValidation';
import sceneManager from '../sceneManager';
import {Content, Icon} from 'native-base';
import {strings, getStartDirection, initLocale} from '../../utils/lang/I18n';
import LanguageController from '../../modules/langauge/Language';
import localStorage from '../../utils/localStorage/localStorage';

const black = 'black';

export default class RegisterScreen extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			pass1: '',
			pass2: '',
			firstName: '',
			lastName: '',
			birthDate: '',
			isGenderModalOpen: false,
			isLanguageModalOpen: false,
			keyboardStats: {
				imageStyle: {},
				registerActionContainerStyle: {},
			},
			validation: false,
			gender: '',
			languageKey: '',
			language: '',
			selectedLanguage: '',
			languageName: '',
			height: '',
			weight: '',
		};

		//        this.onRegisterPress = this.onRegisterPress.bind(this);
	}

	renderGenderModal = () => (
		<GenderModal
			isOpen={this.state.isGenderModalOpen}
			closeModal={this.closeGenderModal}
			setGender={this.setGender}
			selectedGender={this.state.gender}
		/>
	);

	openGenderModal = () => {
		this.setState({isGenderModalOpen: true});
	};

	setGender = (selectedGender) => {
		this.setState({
			gender: selectedGender.key,
		});
		this.closeGenderModal();
	};

	getHebrew = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	getFlexDirection = () => {
		return this.getHebrew() ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'};
	};

	renderGender = () => {
		const selectByLang = strings('SELECT');
		const text = this.state.gender ? this.state.gender : selectByLang;
		const flexDirection = this.getFlexDirection();
		console.log(this.state.gender);
		return (
			<TouchableOpacity onPress={this.openGenderModal} style={[styles.textBox]}>
				<View style={[flexDirection, {justifyContent: 'space-between'}]}>
					<Icon name={'ios-arrow-down'} style={{fontSize: 20, margin: '4%'}} />
					<Text style={[styles.textStyleForModal]}>{text}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	closeGenderModal = () => {
		this.setState({isGenderModalOpen: false});
	};

	renderLanguageModal = () => (
		<LanguageModal
			isOpen={this.state.isLanguageModalOpen}
			closeModal={this.closeLanguageModal}
			setOption={this.setLanguage}
			selectedLanguage={this.state.language}
		/>
	);

	openLanguageModal = () => {
		this.setState({isLanguageModalOpen: true});
	};

	closeLanguageModal = () => {
		this.setState({isLanguageModalOpen: false});
	};

	setLanguage = (selectedLanguage) => {
		console.log(this.state, selectedLanguage);
		this.setState(
			{
				language: selectedLanguage.key,
				languageName: selectedLanguage.name,
			},
			() => {
				// console.log(this.state, selectedLanguage);
				this.closeLanguageModal();
				this.saveLangaugeInLocalStorage();
			}
		);
	};

	saveLangaugeInLocalStorage = () => {
		const {language} = this.state;
		console.log('2. changeLanguage saveLangaugeInLocalStorage ', language);

		LanguageController.saveLanguage(language)
			.then((lang) => {
				console.log('3. changeLanguage lang ', lang);
				this.changeLocale(lang);
				this.closeLanguageModal();
			})
			.catch((err) => {
				console.log('error saving langauge ', err);
			});
	};

	async changeLocale(selectedLanguage) {
		console.log('4. changeLanguage changeLocale selectedLanguage', selectedLanguage);
		await initLocale();
		sceneManager.refresh('Home');
	}

	renderLanguage = () => {
		const selectByLang = strings('SELECT');
		const text = this.state.languageName ? this.state.languageName : selectByLang;
		const flexDirection = this.getFlexDirection();
		return (
			<TouchableOpacity onPress={this.openLanguageModal} style={[styles.textBox]}>
				<View style={[flexDirection, {justifyContent: 'space-between'}]}>
					<Icon name={'ios-arrow-down'} style={{fontSize: 20, margin: '4%'}} />
					<Text style={[styles.textStyleForModal]}>{text}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	keyboardWillShow = (event) => {
		const keyboardStats = {
			imageStyle: {
				height: 50,
			},
			registerActionContainerStyle: {
				height: 0,
			},
		};
		this.setState({keyboardStats: keyboardStats});
	};
	keyboardWillHide = (event) => {
		const keyboardStats = {
			imageStyle: {},
			registerActionContainerStyle: {},
		};
		this.setState({keyboardStats: keyboardStats});
	};
	trimMail = (text) => {
		if (text) {
			this.setState({email: text.trim()});
		} else {
			this.setState({email: ''});
		}
	};

	onRegisterPress = () => {
		const {email, pass1, pass2, firstName, lastName, birthDate, gender, language, height, weight} = this.state;
		const errorTitle = strings('ERROR_TITLE');
		const errorRegistation = strings('ERROR_REGISTRATION');
		const weightNumber = Number(weight);
		var expireDate = moment().format('DD/MM/YYYY');
		expireDate = moment()
			.add(7, 'days')
			.format('DD/MM/YYYY');
		var registerDate = moment().format('DD/MM/YYYY');

		let newHermonManUser = {
			email,
			password: pass1,
			firstName,
			lastName,
			birthDate,
			expireDate: expireDate.toString(),
			registerDate: registerDate.toString(),
			gender,
			language,
			height: getStartDirection() === 'right' ? height : height * 2.54,
			weight: getStartDirection() === 'right' ? weightNumber : weightNumber * 0.453,
		};
		if (this.checkValidation()) {
			firebase
				.registerNewHermonManUser(newHermonManUser)
				.then((newUser) => {
					console.log('--------------- changeLanguage newUser', newUser);
					this.saveLangaugeInLocalStorage();
					console.log('--------------- changeLanguage saveLangaugeInLocalStorage');
					return newUser;
				})
				.then((newUser) => {
					console.log('2 . --------------- changeLanguage newUser', newUser);
					sceneManager.goToAppExplantion(newUser);
				})
				.catch((error) => {
					console.log('2. registered error in registerNewHermonManUser', error);
					Alert.alert(errorTitle, errorRegistation);
				});
		}
	};

	componentWillMount() {
		let keyboardShowEventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
		let keyboardHideEventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
		this.keyboardWillShowListener = Keyboard.addListener(keyboardShowEventName, this.keyboardWillShow);
		this.keyboardWillHideListener = Keyboard.addListener(keyboardHideEventName, this.keyboardWillHide);
		LanguageController.getLanguage().then((lang) => {
			console.log('lang from settings', lang);
			const languageName = lang === 'Hebrew' ? 'עברית' : 'English';
			this.setState({language: lang, languageName, loadedLanguage: true, selectedLanauge: lang}, () => {
				console.log('selectedLanauge:::::', this.state.selectedLanauge);
				console.log(this.state);
			});
		});
	}

	componentWillUnmount() {
		this.keyboardWillShowListener.remove();
		this.keyboardWillHideListener.remove();
	}

	updateGender = (gender) => {
		this.setState({gender: gender});
	};

	updateLanguage = (language) => {
		this.setState({language: language});
	};

	render() {
		const hebrew = getStartDirection() === 'right' ? true : false;
		const labelDirection = hebrew ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};

		const placeholderBirthday = 'DD/MM/YY';
		const firstNameLabel = strings('FIRST_NAME');
		const lastNameLabel = strings('LAST_NAME');
		const passwordLabel = strings('PASSWORD_PLACEHOLDER');
		const repeatPasswordLabel = strings('REPEAT_PASSWORD');
		const emailLabel = strings('EMAIL');
		const weightLabel = strings('WEIGHT');
		const heightLabel = strings('HEIGHT');
		const birthdayLabel = strings('BIRTHDAY');
		const genderLabel = strings('GENDER');
		const registrationTitle = strings('REGISTER');
		const typePlaceholder = strings('TYPE');
		const lanauagePlaceholder = strings('LANGAUAGE');
		const registerText = strings('REGISTER_TEXT');
		const flexDirection = this.getFlexDirection();
		const marginByPlatform = Platform.OS === 'ios' ? styles.marginHorizontalIphone : styles.marginHorizontal;
		return (
			<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%'}}>
				<Text style={{marginTop: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
					{registrationTitle}
				</Text>
				<View style={{height: '90%', marginTop: '5%'}}>
					<ScrollView style={styles.scrollViewContainer}>
						<Text style={[styles.labelStyle, labelDirection, marginByPlatform]}>{' * ' + lanauagePlaceholder}</Text>
						<View>{this.renderLanguage()}</View>

						{/* first + last name */}

						<HermonManTextInput
							placeholder={typePlaceholder}
							required
							labelTitle={firstNameLabel}
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							onChangeText={(text) => this.setState({firstName: text})}
						/>

						<HermonManTextInput
							placeholder={typePlaceholder}
							required
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							labelTitle={lastNameLabel}
							required
							onChangeText={(text) => this.setState({lastName: text})}
						/>

						{/* password */}
						<HermonManTextInput
							type={types.password}
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							placeholder={typePlaceholder}
							required
							labelTitle={passwordLabel}
							required
							onChangeText={(text) => this.setState({pass1: text})}
						/>

						<HermonManTextInput
							type={types.password}
							required
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							placeholder={typePlaceholder}
							required
							labelTitle={repeatPasswordLabel}
							onChangeText={(text) => this.setState({pass2: text})}
						/>

						{/* email */}
						<HermonManTextInput
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							placeholder={typePlaceholder}
							required
							type={types.email}
							labelTitle={emailLabel}
							required
							onChangeText={this.trimMail}
						/>

						{/* weight */}
						<HermonManTextInput
							type={types.number}
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							placeholder={typePlaceholder}
							required
							labelTitle={weightLabel}
							required
							onChangeText={(text) => this.setState({weight: text})}
						/>

						{/* height */}
						<HermonManTextInput
							type={types.number}
							labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
							viewInputStyle={styles.textBox}
							placeholder={heightLabel}
							required
							labelTitle={heightLabel}
							required
							onChangeText={(text) => this.setState({height: text})}
						/>

						{/* birthday */}

						<Text style={[styles.labelStyle, labelDirection, marginByPlatform]}>{birthdayLabel}</Text>
						<DateInput
							flexDirection={flexDirection}
							imageSource={'calendar'}
							textInput={styles.textStyleBirthday}
							dateInputStyle={styles.textBox}
							placeholder={placeholderBirthday}
							openDateForRegistration
							onDatePicked={this.datePicked.bind(this)}
						/>

						<Text style={[styles.labelStyle, labelDirection, marginByPlatform]}>{genderLabel}</Text>
						<View>{this.renderGender()}</View>
					</ScrollView>
					<View
						style={[
							styles.registerActionContainer,
							{alignItems: 'center', justifyContent: 'center'},
							this.state.keyboardStats.registerActionContainerStyle,
						]}>
						<HermonManButton
							text={registerText}
							textColor={APP_TEXT_WHITE}
							backgroundColor={APP_BUTTON_BACKGROUND}
							buttonStyle={{width: 150, height: 50, borderRadius: 100 / 2}}
							onPress={this.onRegisterPress}
						/>
					</View>
					{this.renderGenderModal()}
					{this.renderLanguageModal()}
				</View>
			</View>
		);
	}

	datePicked(date) {
		let time = date.getTime();
		console.log(time);
		this.setState({birthDate: time});
	}

	checkEmailValidation = () => {
		const {email} = this.state;
		const {emailCheck} = regexValidation;

		if (email) {
			return (checkValidation = emailCheck.test(String(email).toLowerCase()));
		}
	};

	checkValidation() {
		const {email, weight, height, language} = this.state;
		const emailValidation = this.checkEmailValidation();
		const errorTitle = strings('ERROR_TITLE');
		const weightError = strings('NO_WEIGHT_ERROR');
		const heightError = strings('NO_HEIGHT_ERROR');
		const emailError = strings('EMAIL_VALIDATION');
		const languageError = strings('LANGUAGE_VALIDATION');
		const passwordError = strings('NO_PASSWORD');
		const passwordsError = strings('PASSWORD_DONT_MATCH');
		const errorPWLength = strings('ERROR_PASSWORD_LENGHT_AFTER_FILL');
		const nameError = strings('ERROR_NAME');
		const genderError = strings('ERROR_GENDER');
		const errorRegistrationPasswordLenght = strings('ERROR_PASSWORD_LENGTH');

		if (language === '') {
			Alert.alert(errorTitle, languageError);
			return false;
		}

		if (email && email.length > 0 && !emailValidation) {
			Alert.alert(errorTitle, emailError);
			return false;
		} else if (email && email.length === 0) {
			Alert.alert(errorTitle, emailError);
			return false;
		} else if (email === '') {
			Alert.alert(errorTitle, emailError);
			return false;
		}

		if (weight === '') {
			Alert.alert(errorTitle, weightError);
			return false;
		}

		if (height === '') {
			Alert.alert(errorTitle, heightError);
			return false;
		}

		if (this.state.pass1 === '' || this.state.pass2 === '') {
			Alert.alert(errorTitle, passwordError);
			return false;
		}

		if (this.state.pass1 !== this.state.pass2) {
			Alert.alert(errorTitle, passwordsError);
			return false;
		} else if (this.state.pass1.length < 6 || this.state.pass2.length < 6) {
			Alert.alert(errorTitle, errorRegistrationPasswordLenght);
			return false;
		}

		if (this.state.pass1.length <= 5) {
			Alert.alert(errorTitle, errorPWLength);
			return false;
		}

		if (this.state.firstName === '') {
			Alert.alert(errorTitle, nameError);
			return false;
		}

		if (this.state.lastName === '') {
			Alert.alert(errorTitle, nameError);
			return false;
		}

		if (this.state.gender === '') {
			Alert.alert(errorTitle, genderError);
			return false;
		}

		return true;
	}
}

const styles = {
	scrollViewContainer: {
		marginBottom: 20,
		marginHorizontal: '8%',
	},
	textStyleBirthday: {
		fontSize: 15,
		margin: '4%',
	},
	labelStyle: {
		marginTop: '2%',
		color: black,
		fontWeight: 'bold',
		margin: 5,
	},
	marginHorizontalIphone: {
		marginHorizontal: '4%',
	},
	marginHorizontal: {
		marginHorizontal: '8%',
	},
	textStyle: {
		alignSelf: 'center',
		color: black,
		fontSize: 15,
	},
	textStyleForModal: {
		alignSelf: 'flex-end',
		color: black,
		fontSize: 15,
		margin: '4%',
	},
	textBox: {
		borderColor: APP_GRAY_BACKGROUND,
		borderWidth: 2,
		width: 300,
		height: 50,
		borderRadius: 200 / 2,
		backgroundColor: 'white',
	},
	kidsExplanationContainer: {
		alignItems: 'center',
		marginTop: 15,
	},
	kidsExplanationTitle: {
		color: '#F77B6D',
		fontSize: 25,
		fontWeight: 'bold',
		marginBottom: 3,
	},
	kidsExplanationText: {
		textAlign: 'center',
		color: '#697279',
		marginBottom: 5,
	},
	addKidbuttonStyle: {
		marginTop: 10,
		marginHorizontal: 40,
	},
	registerActionContainer: {
		paddingBottom: 10,
	},
	agreeToTermsContainer: {
		marginTop: 10,
		alignItems: 'center',
		paddingBottom: 20,
	},
	agreeToTermsText: {
		color: 'blue',
		marginTop: 7,
	},
	agreeToTermsLink: {
		color: 'lightblue',
		textDecorationLine: 'underline',
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'center',
	},
};
