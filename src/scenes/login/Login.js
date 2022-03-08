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
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
	USER
} from '../../utils/firebase/firebaseModels';
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
			password: 'Aa123456',
			enabled: true,
		};
		console.log('state now is: ', this.state);
	}

	UNSAFE_componentWillMount() {
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
		const loginText = strings('LOGIN');

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
        console.log("\x1b[33m ~ file: Login.js ~ line 95 ~ email, password", email, password)
		localStorage.setCurrentUserMail(email);
		firebase.signInHermonManUser('sguides28@gmail.com', 'Aa123456').then(()=>{
			console.log('success login');
		})
		// firebase.signInHermonManUser(email, password).then(()=>{})
			// .then((user) => {
            //     console.log("\x1b[33m ~ file: Login.js ~ line 95 ~ .then ~ user", user)
			// 	if (user) {
			// 		const {expireDate} = user;
			// 		const expireDateConverted = expireDate ? this.convertDateStringToDate(expireDate) : undefined;
			// 		const today = moment(new Date());
			// 		console.log('signed in with firebase.signInHermonManUser, going to home screen', user);
			// 		Keyboard.dismiss();
			// 		if (user.status === '0' || expireDateConverted.isBefore(today)) {
			// 			sceneManager.goToPurchase(user);
			// 		} else if (user.status === '1') {
			// 			// sceneManager.goToHome(user);
            //             console.log("\x1b[33m ~ file: Login.js ~ line 107 ~ .then ~ Home")
			// 			this.props.navigation.navigate('Home',{user})
			// 		} else {
			// 			sceneManager.goToProgress(user);
			// 		}
			// 	}
			// })
			// .catch((error) => {
			// 	this.setState({enabled: true});
			// 	console.log('error in firebase.signInHermonManUser', error);
			// 	this.showError();
			// });
	};

	componentDidMount(){
		// const subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
	}
	// Handle user state changes
	//  onAuthStateChanged=(user) =>{
    //     console.log("\x1b[33m ~ file: App.js ~ line 57 ~ onAuthStateChanged ~ user", user)
	// 		const firebaseUser = user._user
	// 		const userId = firebaseUser.uid || firebaseUser.user.uid;
	// 		console.log('firebaseuser USER ID!!!!!!:   ', userId);
	// 		let currentUser;
	// 		database().ref(`${USER.REF}/${userId}`).on('value', snapshot => {
	// 			const userRef = snapshot.val()
	// 			console.log("\x1b[33m ~ file: Firebase.js ~ line 346 ~ database ~ userRef", userRef)
	// 			currentUser= userRef
	// 			console.log("\x1b[33m ~ file: Login.js ~ line 133 ~ currentUser", currentUser)
			
	// 					const {expireDate} = currentUser;
	// 					console.log("\x1b[33m ~ file: Login.js ~ line 135 ~ expireDate", expireDate)
	// 					const expireDateConverted = expireDate ? this.convertDateStringToDate(expireDate) : undefined;
	// 					const today = moment(new Date());
	// 					console.log('signed in with firebase.signInHermonManUser, going to home screen', currentUser);
	// 					Keyboard.dismiss();
	// 					if (currentUser.status === '0' || expireDateConverted.isBefore(today)) {
	// 						sceneManager.goToPurchase(currentUser);
	// 					} else if (currentUser.status === '1') {
	// 						// sceneManager.goToHome(currentUser);
	// 						console.log("\x1b[33m ~ file: Login.js ~ line 107 ~ .then ~ Home")
	// 						this.props.navigation.navigate('Home',{user:currentUser})
	// 					} else {
	// 						sceneManager.goToProgress(currentUser);
	// 					}
	
		
	// 		if (initializing) setInitializing(false);
	// 		});
	// }

	

	convertDateStringToDate = (dateString) => {
		const parts = dateString.split('/');
		const convertStringToDate = moment([parts[2], parts[1] - 1, parts[0]]);

		return convertStringToDate;
	};

	onForgotPasswordPress = () => {
		// sceneManager.goToForgotPassword(this.props.navigation);
		this.props.navigation.navigate('ForgotPassword')
	};

	onRegistrationPress = () => {
    console.log("\x1b[33m ~ file: Login.js ~ line 129 ~ onRegistrationPress")
		// sceneManager.goToRegisterScreen();
		this.props.navigation.navigate('RegisterScreen')
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
							textValue={"Aa123456"}
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
