import moment from 'moment/moment';
import React, {Component} from 'react';
import {Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BACKGROUND_WHITE,
	APP_BUTTON_BACKGROUND,
	APP_TEXT_COLOR,
	APP_TEXT_WHITE,
} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import TranzilaIFrame from '../../components/common/Tranzila/TranzilaIFrame';
import Firebase from '../../utils/firebase/Firebase';
import {strings, getStartDirection} from '../../utils/lang/I18n';
import sceneManager from '../sceneManager';
// import * as RNIap from 'react-native-iap';

const oneMonth = 'oneMonth';
const threeMonths = 'threeMonths';
const halfYear = 'halfYear';
const allYear = 'allYear';

const items = Platform.select({
	ios: ['oneMonthSubscription', 'threeMonthSubscription', 'sixMonthSubscription', 'twelveMonthSubscription'],
	android: ['oneMonthSubscription', 'threeMonthSubscription', 'sixMonthSubscription', 'twelveMonthSubscription'],
});

class Purchase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
			dietType: '',
			showWebView: false,
			sum: 0,
			subscriptionPrices: [],
		};
	}

	componentWillMount() {
		const user = Firebase.getCurrentUser().then((user) => {
			this.setState({user});
			console.log(this.state.user);
		});
	}

	async componentDidMount() {
		Firebase.getSubscriptionPrices().then((prices) => {
			this.setState({subscriptionPrices: prices});
		});
		try {
			// const result = await RNIap.initConnection();
			// console.log('result', result);
		} catch (err) {
			console.warn(err.code, err.message);
		}

		try {
			// const subs = await RNIap.requestSubscription(items);
			// console.log('Purchases', subs);
		} catch (err) {
			console.warn(err.code, err.message);
		}

		// purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
		// 	console.log('purchaseUpdatedListener', purchase);
		// 	this.setState(
		// 		{
		// 			receipt: purchase.transactionReceipt,
		// 		},
		// 		() => this.goNext()
		// 	);
		// });
		// purchaseErrorSubscription = purchaseErrorListener((error) => {
		// 	console.log('purchaseErrorListener', error);
		// 	Alert.alert('purchase error', JSON.stringify(error));
		// });

		// RNIap.getProducts(items)
		// 	.then((products) => {
		// 		console.log('Products', products);
		// 		//handle success of fetch product list
		// 	})
		// 	.catch((error) => {
		// 		console.log(error.message);
		// 	});
		// RNIap.getSubscriptions(items)
		// 	.then((products) => {
		// 		console.log('Products', products);
		// 		//handle success of fetch product list
		// 	})
		// 	.catch((error) => {
		// 		console.log(error.message);
		// 	});
	}

	componentWillUnmount() {
		sceneManager.goToHomePageByUserStatus();
		// RNIap.endConnectionAndroid();
	}

	onPressPurchase = () => {
		const {dietType} = this.state;
		if (dietType) {
			this.updateUserStatus(dietType);
		}
	};

	updateUserStatus = (dietType) => {
		this.setState({showWebView: true});
		// Firebase.updateHermonManUserStatus(this.state.user, '1').then(() => {
		// 	this.refreshButton.refresh();
		// 	alert('dietType:  ' + dietType);
		// 	//sceneManager.goToHome();
		// });
	};

	selectDietType = (dietTypeValue, price) => {
		this.setState({dietType: dietTypeValue, sum: getStartDirection() === 'right' ? price.he : price.en});
	};

	getBackgroundColor = (dietTypeValue) => {
		const {dietType} = this.state;
		if (dietTypeValue === dietType) {
			return {backgroundColor: APP_BUTTON_BACKGROUND};
		}

		return {backgroundColor: APP_BACKGROUND_WHITE};
	};

	getTextColor = (dietTypeValue) => {
		const {dietType} = this.state;
		if (dietTypeValue === dietType) {
			return {color: APP_TEXT_WHITE};
		}

		return {color: APP_TEXT_COLOR};
	};

	recordPayment = () => {
		let {user, sum} = this.state;
		const {email} = user;
		const dateString = user.expireDate;
		console.log(this.state);

		const dateParts = dateString.split('/');

		// month is 0-based, that's why we need dataParts[1] - 1
		let dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		// todo: get expire date, find max
		if (moment(this.state.user.expireDate, 'DD-MM-YYYY') < moment()) {
			const dateString = moment().format('DD/MM/YYYY');
			const dateParts = dateString.split('/');

			// month is 0-based, that's why we need dataParts[1] - 1
			dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		}

		const {dietType} = this.state;
		if (dietType === oneMonth) {
			dateObject = new Date(dateObject.setMonth(dateObject.getMonth() + 1));
		} else if (dietType === threeMonths) {
			dateObject = new Date(dateObject.setMonth(dateObject.getMonth() + 3));
		} else if (dietType === halfYear) {
			dateObject = new Date(dateObject.setMonth(dateObject.getMonth() + 6));
		} else if (dietType === allYear) {
			dateObject = new Date(dateObject.setMonth(dateObject.getMonth() + 12));
		}
		const expireDate = moment(dateObject).format('DD/MM/YYYY');

		const today = moment().format('DD/MM/YYYY');
		Firebase.writeNewPaymentToDB(sum, today, email)
			.then((payment) => {
				console.log('Successfully created payment', payment);

				let registerDate = new Date(moment(user.registerDate, 'DD-MM-YYYY'));
				registerDate = new Date(registerDate.setDate(registerDate.getDate() - 8));
				registerDate = moment(registerDate).format('DD/MM/YYYY');
				Firebase.updateUserExpirationRegistrationDate(user, expireDate, registerDate)
					.then((user) => {
						console.log('Successfully updated user', user);
					})
					.catch((error) => {
						console.log('Error in updating user', error);
					});
			})
			.catch((error) => {
				console.log('Error in creating payment', error);
			});
	};

	onPaymentSuccess = () => {
		this.recordPayment();
		this.setState({showWebView: false});

		Alert.alert(
			strings('PAYMENT_SUCCEEDED'),
			'',
			[{text: strings('OK'), onPress: () => sceneManager.goToHomePageByUserStatus()}],
			{
				cancelable: false,
			}
		);
	};

	onPaymentFailed = () => {
		Alert.alert('Error', "Couldn't create payment");
		this.refs.tranzilaRef.refreshPaymentProcess();
	};

	renderTranzila() {
		console.log('entered renderTranzila');
		return (
			<View style={{height: Dimensions.get('window').height * 0.8}}>
				<TranzilaIFrame
					sum={this.state.sum}
					ref='tranzilaRef'
					onPaymentSuccess={this.onPaymentSuccess}
					onPaymentFailed={this.onPaymentFailed}
				/>
			</View>
		);
	}

	renderPurchase = () => {
		const {subscriptionPrices} = this.state;
		const purchaseText = strings('PURCHASE');
		const selectTypeText = strings('SELECT_TYPE');
		const oneMonthText = purchaseText + ' ' + strings('FOR_ONE_MONTH');
		const threeMonthText = purchaseText + ' ' + strings('FOR_THREE_MONTH');
		const sixMonthText = purchaseText + ' ' + strings('FOR_HALF_YEAR_MONTH');
		const twelveMonthText = purchaseText + ' ' + strings('FOR_YEAR_MONTH');

		const continueText = strings('CONTINUE');
		return (
			<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%'}}>
				<Text style={styles.titleStyle}> {selectTypeText}</Text>
				<View style={{alignItems: 'center', justifyContent: 'center'}}>
					<TouchableOpacity
						onPress={() => this.selectDietType(oneMonth, subscriptionPrices[0])}
						style={[{marginVertical: 10}, styles.buttonStyle, this.getBackgroundColor(oneMonth)]}>
						<Text style={[{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}, this.getTextColor(oneMonth)]}>
							{oneMonthText}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => this.selectDietType(threeMonths, subscriptionPrices[1])}
						style={[{marginVertical: 10}, styles.buttonStyle, this.getBackgroundColor(threeMonths)]}>
						<Text style={[{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}, this.getTextColor(threeMonths)]}>
							{threeMonthText}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => this.selectDietType(halfYear, subscriptionPrices[2])}
						style={[{marginVertical: 10}, styles.buttonStyle, this.getBackgroundColor(halfYear)]}>
						<Text style={[{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}, this.getTextColor(halfYear)]}>
							{sixMonthText}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => this.selectDietType(allYear, subscriptionPrices[3])}
						style={[{marginVertical: 10}, styles.buttonStyle, this.getBackgroundColor(allYear)]}>
						<Text
							style={[
								{textAlign: 'center', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'},
								this.getTextColor(allYear),
							]}>
							{twelveMonthText}
						</Text>
					</TouchableOpacity>

					<View style={{marginTop: 30}}>
						<HermonManButton
							text={continueText}
							textColor={APP_TEXT_WHITE}
							backgroundColor={APP_BUTTON_BACKGROUND}
							buttonStyle={{width: 150, height: 50, borderRadius: 100 / 2}}
							onPress={this.onPressPurchase}
						/>
					</View>
				</View>
			</View>
		);
	};

	render() {
		return this.state.showWebView ? <View>{this.renderTranzila()}</View> : <View>{this.renderPurchase()}</View>;
	}
}
export default Purchase;

const styles = StyleSheet.create({
	containerStyle: {
		flex: 1,
		justifyContent: 'center',
	},
	buttonStyle: {
		alignSelf: 'center',
		justifyContent: 'center',
		width: '90%',
		height: 50,
		borderRadius: 250 / 2,
	},

	imageStyle: {
		marginBottom: '40%',
		resizeMode: 'contain',
		alignSelf: 'center',
		width: '70%',
		height: '40%',
		borderWidth: 15,
		borderColor: 'red',
		borderRadius: 15,
	},
	titleStyle: {
		fontSize: 18,
		alignSelf: 'center',
		fontWeight: 'bold',
		paddingTop: 30,
	},
	buttonSeperate: {
		marginVertical: 15,
	},
	tranzilaWebView: {
		height: '100%',
		width: '100%',
	},
});
