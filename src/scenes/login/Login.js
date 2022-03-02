import React, {Component} from 'react';
import {Alert, Dimensions, Image, Text, TouchableOpacity, View, Keyboard} from 'react-native';
import {APP_BUTTON_BACKGROUND, APP_GRAY_BACKGROUND, APP_TEXT_WHITE, DARK_GRAY} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import HermonManTextInput, {types} from '../../components/common/hermonManTextInput/HermonManTextInput';
import {getImage} from '../../img/images';
import LanguageController from '../../modules/langauge/Language';
import firebase from '../../utils/firebase/Firebase';
import {getStartDirection, initLocale, strings} from '../../utils/lang/I18n';
import localStorage from '../../utils/localStorage/localStorage';
import sceneManager from '../sceneManager';
import moment from 'moment/moment';

const hermonmanLogo = getImage('hermonmanLogo');

const black = 'black';
const screenWidth = Dimensions.get('window').width;

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			language: 'Hebrew', //or
			selectedLanauge: '', //shani
			languageName: 'Hebrew', //shani
			lanaugeModalOpen: false,

			email: '',
			password: '',
			enabled: true,
		};
		console.log('state now is: ', this.state);
	}

	componentWillMount() {
		localStorage.getCurrentUserMail().then((email) => {
			this.setState({email});
		});
		LanguageController.getLanguage().then((lang) => {
			console.log('lang from settings', lang);
			const languageName = lang === 'Hebrew' ? 'עברית' : 'English';
			this.setState({language: lang, languageName, loadedLanguage: true, selectedLanauge: lang}, () =>
				console.log('selectedLanauge:::::', this.state.selectedLanauge)
			);
		});
	}

	trimMail = (text) => {
		if (text) {
			this.setState({email: text.trim()});
		} else {
			this.setState({email: ''});
		}
	};

	renderLoginButton = () => {
		const loginText = strings('LOGIN!');

		if (this.state.enabled) {
			return (
				<View style={{alignItems: 'center', justifyContent: 'center', marginTop: '10%'}}>
					<HermonManButton
						onPress={this.onLoginPress.bind(this)}
						buttonStyle={{width: 150, height: 50, borderRadius: 100 / 2}}
						textColor={APP_TEXT_WHITE}
						backgroundColor={APP_BUTTON_BACKGROUND}
						text={loginText}
					/>
				</View>
			);
		} else {
			return (
				<View style={{alignItems: 'center', justifyContent: 'center'}}>
					<HermonManButton
						buttonStyle={{width: 150, height: 50, borderRadius: 100 / 2}}
						text={loginText}
						enabled={false}
						onPress={this.onLoginPress.bind(this)}
						textColor={APP_TEXT_WHITE}
						backgroundColor={APP_BUTTON_BACKGROUND}
					/>
				</View>
			);
		}
	};

	onLoginPress = () => {
		this.setState({enabled: false});
		console.log('state now is: ', this.state);
		const {email, password} = this.state;
		localStorage.setCurrentUserMail(email);
		firebase
			.signInHermonManUser(email, password)
			.then((user) => {
				if (user) {
					const {expireDate} = user;
					const expireDateConverted = expireDate ? this.convertDateStringToDate(expireDate) : undefined;
					const today = moment(new Date());
					console.log('signed in with firebase.signInHermonManUser, going to home screen', user);
					Keyboard.dismiss();
					if (user.status === '0' || expireDateConverted.isBefore(today)) {
						sceneManager.goToPurchase(user);
					} else if (user.status === '1') {
						sceneManager.goToHome(user);
					} else {
						sceneManager.goToProgress(user);
					}
				}
			})
			.catch((error) => {
				this.setState({enabled: true});
				console.log('error in firebase.signInHermonManUser', error);
				this.showError();
			});
	};

	convertDateStringToDate = (dateString) => {
		const parts = dateString.split('/');
		const convertStringToDate = moment([parts[2], parts[1] - 1, parts[0]]);

		return convertStringToDate;
	};

	onForgotPasswordPress = () => {
		sceneManager.goToForgotPassword();
	};

	onRegistrationPress = () => {
		sceneManager.goToRegistration();
	};

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

	saveLangaugeInLocalStorage = () => {
		const {selectedLanauge} = this.state;
		console.log('2. changeLanguage saveLangaugeInLocalStorage ', selectedLanauge);

		LanguageController.saveLanguage(selectedLanauge)
			.then((lang) => {
				console.log('3. changeLanguage lang ', lang);
				this.changeLocale(lang);
				this.closeLanaugeModal();
			})
			.catch((err) => {
				console.log('error saving langauge ', err);
			});
	};

	onSelectedLang = () => {
		this.saveLangaugeInLocalStorage();
	};

	selectedLanguage = (lanauge) => {
		if (lanauge !== this.state.selectedLanauge) {
			this.setState({selectedLanauge: lanauge}, () => this.onSelectedLang());
		}
	};

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	renderLanguage = () => {
		const {loadedLanguage} = this.state;
		const flexDirection = this.getRtl() ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'};
		if (loadedLanguage) {
			return (
				<View style={{alignItems: 'center'}}>
					<View style={[{justifyContent: 'space-between', fontSize: 20}, flexDirection]}>
						<TouchableOpacity onPress={() => this.selectedLanguage('Hebrew')}>
							<Text>{strings('HEBREW')}</Text>
						</TouchableOpacity>
						<View style={{width: 10}} />
						<TouchableOpacity onPress={() => this.selectedLanguage('English')}>
							<Text>{strings('ENGLISH')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	};

	render() {
		const hebrew = getStartDirection() === 'right' ? true : false;
		const hermonmanLogo = hebrew ? getImage('hermonmanLogoHe') : getImage('hermonmanLogoEn');
		const emailLabel = strings('EMAIL');
		const passwordLabel = strings('PASSWORD');
		const typePlaceholder = strings('TYPE');
		const newUserLabel = strings('NEW_USER');
		const forgotPasswordLabel = strings('FORGOT_PASSWORD');
		const labelDirection = hebrew ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
		const textAlign = hebrew
			? {alignSelf: 'flex-end', textAlign: 'right'}
			: {alignSelf: 'flex-start', textAlign: 'left'};
		return (
			<View style={styles.containerStyle}>
				<View style={{marginVertical: 10, alignItems: 'center', justifyContent: 'center'}}>
					<Image source={hermonmanLogo} resizeMode={'contain'} style={{width: '100%'}} />
				</View>
				<View
					style={{
						left: '50%',
						marginLeft: screenWidth / -2,
						marginBottom: 30,
						marginTop: 10,
						marginRight: 0,
						width: screenWidth,
					}}>
					{this.renderLanguage()}
				</View>
				<View>
					<View style={{justifyContent: 'center', alignItems: 'center'}}>
						<HermonManTextInput
							textInputStyle={[{alignSelf: 'center', fontSize: 18, color: DARK_GRAY}, textAlign]}
							labelTitle={emailLabel}
							labelStyle={[styles.labelStyle, labelDirection]}
							viewInputStyle={styles.textBox}
							type={types.email}
							onChangeText={this.trimMail}
							placeholder={typePlaceholder}
							textValue={this.state.email}
						/>
						<HermonManTextInput
							textInputStyle={[{fontSize: 18, color: DARK_GRAY, alignSelf: 'center'}, textAlign]}
							labelStyle={[styles.labelStyle, labelDirection]}
							labelTitle={passwordLabel}
							viewInputStyle={styles.textBox}
							type={types.password}
							onChangeText={(text) => this.setState({password: text})}
							placeholder={typePlaceholder}
						/>
					</View>
					<View style={{marginBottom: 20}}>
						<Text style={[styles.textStyle, {borderBottomWidth: 1}]} onPress={this.onForgotPasswordPress}>
							{forgotPasswordLabel}
						</Text>
					</View>
					{this.renderLoginButton()}
					<View style={{alignItems: 'center', justifyContent: 'center', marginVertical: 20}}>
						{/* <Text style={[styles.textStyle, {borderBottomWidth: 1}]} onPress={this.onRegistrationPress}>
							{newUserLabel}
						</Text> */}
						<HermonManButton
							onPress={this.onRegistrationPress}
							buttonStyle={{width: 150, height: 50, borderRadius: 100 / 2}}
							textColor={APP_TEXT_WHITE}
							backgroundColor={APP_BUTTON_BACKGROUND}
							text={newUserLabel}
						/>
					</View>
				</View>
			</View>
		);
	}

	showError = () => {
		const errorMessage = strings('ERROR_LOGIN');
		Alert.alert('', errorMessage);
	};
}

const styles = {
	labelStyle: {
		marginRight: '5%',
		color: black,
		fontWeight: 'bold',
		margin: 5,
	},
	textStyle: {
		alignSelf: 'center',
		color: black,
		fontSize: 15,
	},
	textBox: {
		borderColor: APP_GRAY_BACKGROUND,
		borderWidth: 2,
		width: 300,
		height: 50,
		borderRadius: 200 / 2,
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
	},
	textBox2: {
		borderColor: APP_GRAY_BACKGROUND,
		borderWidth: 2,
		width: 300,
		height: 50,
		borderRadius: 200 / 2,
		marginVertical: 'auto',
		backgroundColor: 'white',
	},
	textForgotPassword: {
		textDecorationLine: 'underline',
		alignSelf: 'flex-end',
		color: 'red',
		marginBottom: 20,
		fontSize: 18,
	},
	youCanAlso: {
		alignSelf: 'center',
		marginTop: 16,
		marginBottom: 10,
		fontSize: 15,
		color: 'red',
	},
	dontHaveUserContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 20,
	},
	bottomText: {
		marginTop: 5,
		color: 'red',
	},
	bottomLink: {
		color: 'blue',
		textDecorationLine: 'underline',
		padding: 3,
	},
	containerStyle: {
		backgroundColor: 'white',
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
	},
	textStyleForModal: {
		alignSelf: 'flex-end',
		color: 'black',
		fontSize: 15,
		margin: '4%',
	},
};
