import moment from 'moment';
import { Content } from 'native-base';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BACKGROUND_WHITE,
	APP_BUTTON_BACKGROUND,
	APP_TEXT_COLOR,
} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import { CALORIES, CALORIES_MATINATIN } from '../../utils/data/DietTypes';
import firebase from '../../utils/firebase/Firebase';
import { getStartMethods } from '../../utils/firebase/firebaseActions';
import { getStartDirection, strings } from '../../utils/lang/I18n';
import Language from '../../utils/lang/Language';
import Purchase from '../purchase/Purchase';
import sceneManager from '../sceneManager';
import FreeDietsStart from '../startMethods/commonScreens/FreeDietsStart';
import auth from '@react-native-firebase/auth'

export default class Home extends Component {
	constructor(props) {
		console.log("\x1b[33m ~ file: Home.js ~ line 23 ~ constructor ~ props", props.route)
		console.log('c-tor home');
		super();
		this.state = {
			startMethods: [],
			startMethodsMaintain: [],
			user: props.route?.params?.user,
			userLoaded: false,
			isPurchaseEnabled: false,
		};
		this.startMethods = [];
		// this.onForgotPasswordPress = this.onForgotPasswordPress.bind(this);
		// this.onRegistrationPress = this.onRegistrationPress.bind(this);
		// BackHandler.addEventListener('hardwareBackPress', this.onBackPressed);
		this.methodManager = this.methodManager.bind(this);

	}

	componentWillMount() {

		// firebase
		// 	.getCurrentUser()
		// 	.then((user) => {
		console.log("\x1b[33m ~ file: Home.js ~ line 43 ~ .then ~ user", this.state.user)
		this.setState({ userLoaded: true });
		// this.setState({user: user}, () => console.log('The object arnd language user::::', this.state.user));
		console.log("\x1b[33m ~ file: Home.js ~ line 50 ~ //.then ~ this.state", this.state)
		getStartMethods()
		// getStartMethods().then((startMethods) => {
		// 	console.log("\x1b[33m ~ file: Home.js ~ line 51 ~ firebase.getStartMethods ~ startMethods", startMethods)
		// 	this.startMethods = startMethods;
		// 	const newArr = [];
		// 	for (let i = 0; i < this.startMethods.length; i++) {
		// 		var method = Language.getDataByLanguage(this.startMethods[i], this.state.user.language);
		// 		newArr.push(method);
		// 	}
		// 	console.log('the new arr is :', newArr);
		// 	this.setState({ startMethods: newArr });
		// });

		firebase.getStartMethodsMaintain().then((startMethodsMaintain) => {
			console.log("\x1b[33m ~ file: Home.js ~ line 63 ~ firebase.getStartMethodsMaintain ~ startMethodsMaintain", startMethodsMaintain)
			this.startMethodsMaintain = startMethodsMaintain;
			const newArr2 = [];
			for (let i = 0; i < this.startMethodsMaintain.length; i++) {
				var method = Language.getDataByLanguage(this.startMethodsMaintain[i], this.state.user.language);
				newArr2.push(method);
			}
			console.log('the new arr is :', newArr2);
			this.setState({ startMethodsMaintain: newArr2 });
		});
		// })
		// .catch((err) => {
		// 	console.log('There was an error getting current user in home page: ', err);
		// });
	}

	componentDidMount() {

		firebase.checkPurchaseEnabled().then((isPurchaseEnabled) => {
			this.setState({ isPurchaseEnabled });
		});
	}

	renderMethods = () => {
		if (this.state.startMethods.length > 0) {
			return this.state.startMethods.map(this.renderSingleMethod);
		}
	};

	renderMethodsMaintain = () => {
		if (this.state.startMethodsMaintain.length > 0) {
			return this.state.startMethodsMaintain.map(this.renderSingleMethodMaintain);
		}
	};

	renderSingleMethod = (singleMethod, index) => {
		console.log('0.method singleMethod::::::::::', singleMethod);
		return (
			<View key={index}>
				<HermonManButton
					onPress={() => this.methodManager(singleMethod)}
					textStyle={{ fontWeight: 'bold', fontSize: 20 }}
					text={singleMethod}
					buttonStyle={{
						height: 60,
						marginVertical: 10,
						width: 250,
						alignSelf: 'center',
						borderRadius: 20,
					}}
					textColor={APP_TEXT_COLOR}
					backgroundColor={APP_BACKGROUND_WHITE}
				/>
			</View>
		);
	};

	renderSingleMethodMaintain = (singleMethod, index) => {
		return (
			<View key={index}>
				<HermonManButton
					onPress={() => this.methodManager(singleMethod)}
					textStyle={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}
					text={singleMethod}
					textColor={APP_TEXT_COLOR}
					backgroundColor={APP_BACKGROUND_WHITE}
					buttonStyle={{
						marginVertical: 10,
						width: 250,
						alignSelf: 'center',
						height: 60,
						borderRadius: 20,
					}}
				/>
			</View>
		);
	};

	methodManager = (method) => {
		const user = this.state.user;
		switch (method) {
			case 'שיטת חרמון-מן':
			case 'Hermon-Man Method':
				sceneManager.goToInsertWeight('hermonman');
				break;
			case 'שיטה קלורית':
			case 'Calorie Method':
				sceneManager.goToInsertWeight(CALORIES);
				break;
			case 'שיטת דיאטת ספידי':
			case 'Speedy Diet Method':
				sceneManager.goToInsertWeight('speedy');
				break;
			case 'שיטה צמחונית':
			case 'Vegetarian Method':
				sceneManager.goToInsertWeight('vegetarian');
				break;
			case 'שיטת הדרך הקלה':
			case 'The Easy-Way Method':
				sceneManager.goToInsertWeight('easyway');
				break;
			case 'שיטת חרמון-מן שמירה':
			case 'Hermon-Man Method Maintain':
				sceneManager.goToInsertWeight('hermonmanMaintain');
				break;
			case 'השיטה הקלורית שמירה':
			case 'Calories Method Maintain':
				sceneManager.goToInsertWeight(CALORIES_MATINATIN);
				break;

			default:
				console.log('default value for the array');
				break;
		}
	};

	renderLanguage = () => {
		return (
			<View>
				<Text>{this.state.language}</Text>
			</View>
		);
	};

	convertDateStringToDate = (dateString) => {
		const parts = dateString.split('/');
		const convertStringToDate = moment([parts[2], parts[1] - 1, parts[0]]);

		return convertStringToDate;
	};

	checkDateIsSame = (date, expireSubscriptionFree) => {
		const mDate = moment(date);
		return (
			mDate.isSame(expireSubscriptionFree, 'day') &&
			mDate.isSame(expireSubscriptionFree, 'year') &&
			mDate.isSame(expireSubscriptionFree, 'month')
		);
	};

	//for new user,will return 3 diets
	//for user that purchased - will return all diets
	renderMethodByUser = () => {
		const { user } = this.state;
		console.log("\x1b[33m ~ file: Home.js ~ line 204 ~ this.state", this.state)
		console.log("\x1b[33m ~ file: Home.js ~ line 203 ~ user", user)

		if (user) {
			const { registerDate, expireDate } = user;
			const registerDateConverted = registerDate ? this.convertDateStringToDate(registerDate) : undefined;
			const expireDateConverted = expireDate ? this.convertDateStringToDate(expireDate) : undefined;
			const freeSubscriptionUntil = registerDate ? moment(registerDateConverted).add(7, 'days') : undefined;
			const today = moment(new Date());

			if (expireDateConverted.isBefore(today)) {
				return <Purchase user={user} />;
			} else if (
				this.state.isPurchaseEnabled &&
				freeSubscriptionUntil &&
				(today.isBefore(freeSubscriptionUntil) || this.checkDateIsSame(today, freeSubscriptionUntil))
			) {
				return this.renderDietsForNewUser();
			} else {
				return this.renderDietsForOldUser();
			}
		}
	};

	renderDietsForNewUser = () => {
		const dietMethod = strings('DIET_METHODS');
		const firstWeekExp = strings('FIRST_WEEK_EXP');
		const select3Diets = strings('SELECT_FREE_DIETS');
		const freeTrial = strings('FREE_TRIAL');

		return (
			<View>
				<Text style={styles.titleForNewUser}>{freeTrial}</Text>
				<Text style={styles.textForNewUser}>{firstWeekExp}</Text>
				<Text style={styles.textForNewUser}>{select3Diets}</Text>

				<FreeDietsStart />
			</View>
		);
	};

	renderDietsForOldUser = () => {
		const dietMethod = strings('DIET_METHODS');
		const dietMethodMaintain = strings('DIET_MANTAIN_METHODS');
		console.log('The object and language getStartDirection::::', getStartDirection());
		return (
			<View style={{ paddingTop: 20 }}>
				<Text style={styles.titleStyle}>{dietMethod + ':'}</Text>
				{/* {this.renderMethods()} */}
				<Text style={styles.titleStyle}>{dietMethodMaintain + ':'}</Text>
				{/* {this.renderMethodsMaintain()} */}
			</View>
		);
	};

	render() {
		return <>{this.renderMethodByUser()}</>
		// return (
		// <Content style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR}}>{this.renderMethodByUser()}</Content>);
	}
}

const styles = {
	titleStyle: {
		fontSize: 16,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: 'black',
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'center',
	},
	textForNewUser: {
		marginVertical: 10,
		textAlign: 'center',
		fontSize: 16,
		color: 'black',
		marginHorizontal: 15,
	},
	titleForNewUser: {
		marginVertical: 10,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: APP_BUTTON_BACKGROUND,
	},
};
