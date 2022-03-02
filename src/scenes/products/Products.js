import React, {Component} from 'react';
import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {APP_BACKGROUND_CREAM_COLOR, APP_BUTTON_BACKGROUND, APP_TEXT_WHITE} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import TranzilaIFrame from '../../components/common/Tranzila/TranzilaIFrame';
import firebase from '../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../utils/lang/I18n';
import sceneManager from '../sceneManager';

class Products extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			showWebView: false,
			sum: 0,
			productName: props.name,
			user: null,
		};
	}

	async componentDidMount() {
		try {
			const products = await firebase.getAllProducts();
			if (products) {
				const user = await firebase.getCurrentUser();
				this.setState({products, user});
			} else {
				throw "Couldn't get products from database";
			}
		} catch (err) {
			console.log(err);
		}
	}

	recordPayment = () => {
		const {user, sum, productName} = this.state;
		const {email} = user;
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!

		let yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		today = dd + '/' + mm + '/' + yyyy;
		firebase
			.writeNewPaymentToDB(sum, today, email)
			.then((payment) => {
				console.log('Successfully created payment', payment);

				const paymentId = payment.newPaymentRef.path.replace('payments/', '');
				firebase
					.writeNewOrderToDB(sum, today, email, paymentId, productName)
					.then((order) => {
						console.log('Successfully created order', order);
					})
					.catch((error) => {
						console.log('Error in creating order', error);
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
		return (
			<View style={styles.tranzilaWebView}>
				<TranzilaIFrame
					sum={this.state.sum}
					ref='tranzilaRef'
					onPaymentSuccess={this.onPaymentSuccess}
					onPaymentFailed={this.onPaymentFailed}
				/>
			</View>
		);
	}

	renderProduct(product) {
		console.log(product);
		const languageMargin = getStartDirection() === 'right' ? {marginLeft: 10} : {marginRight: 10};
		const name = getStartDirection() === 'right' ? product.item.name.heb : product.item.name.eng;
		const details = getStartDirection() === 'right' ? product.item.details.heb : product.item.details.eng;
		return (
			product.item && (
				<View style={[styles.product, {flexDirection: getStartDirection() === 'right' ? 'row-reverse' : 'row'}]}>
					<View style={[styles.image, languageMargin]}>
						<Image style={{width: '100%', height: '100%'}} resizeMode='contain' source={{uri: product.item.image}} />
					</View>
					<View style={{width: '55%', justifyContent: 'space-evenly'}}>
						<View style={{alignItems: getStartDirection() === 'right' ? 'flex-end' : 'flex-start'}}>
							<Text style={[{fontWeight: 'bold'}, styles.textStyle]}>{name}</Text>
							<Text style={styles.textStyle}>{details}</Text>
							<Text style={styles.textStyle}>{product.item.price + '$'}</Text>
						</View>
						<View>
							<HermonManButton
								onPress={() => {
									this.setState({showWebView: true, sum: product.item.price, productName: product.item.name.eng});
								}}
								textStyle={{fontWeight: 'bold', fontSize: 20}}
								text={strings('PAY')}
								buttonStyle={styles.buttonStyle}
								textColor={APP_TEXT_WHITE}
								backgroundColor={APP_BUTTON_BACKGROUND}
							/>
						</View>
					</View>
				</View>
			)
		);
	}

	renderProducts() {
		const textHeader = strings('PRODUCTS');

		return (
			<View style={styles.viewStyle}>
				<View style={{height: '5%'}}>
					<Text style={styles.headerText}>{textHeader}</Text>
				</View>
				<View style={styles.body}>
					<FlatList data={this.state.products} renderItem={(item) => this.renderProduct(item)} />
				</View>
			</View>
		);
	}

	render() {
		return this.state.showWebView ? <View>{this.renderTranzila()}</View> : <View>{this.renderProducts()}</View>;
	}
}

export default Products;

const styles = StyleSheet.create({
	viewStyle: {
		backgroundColor: APP_BACKGROUND_CREAM_COLOR,
		height: '100%',
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'black',
		textAlign: 'center',
		marginTop: 20,
	},
	body: {
		height: '90%',
		marginTop: 20,
	},
	product: {
		borderColor: APP_BUTTON_BACKGROUND,
		borderWidth: 2,
		marginVertical: 5,
		flexDirection: 'row',
	},
	image: {
		width: '40%',
		height: 150,
		// marginEnd: 10,
	},
	buttonStyle: {
		width: '80%',
		height: 40,
		borderRadius: 80 / 2,
	},
	textStyle: {
		fontSize: 20,
	},
	tranzilaWebView: {
		height: '100%',
		width: '100%',
	},
});
