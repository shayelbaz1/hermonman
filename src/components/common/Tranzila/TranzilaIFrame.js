import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {strings, getStartDirection} from '../../../utils/lang/I18n';

export default class TranzilaIFrame extends Component {
	constructor(props) {
		super(props);

		// properties
		this.basePaymentUrl = 'https://direct.tranzila.com/hermonman';
		this.redirectSuccessString = 'success';
		this.redirectErrorString = 'error';
		this.callbackOccurred = false;

		// state
		this.state = {
			url: '',
		};
	}

	componentWillMount() {
		this.setStartUrlOnState();
	}

	setStartUrlOnState = () => {
		//Very important: when using tranzila test, pay using nis only, not more than 10 nis,
		// and use the following card:
		// Card number: 4580458045804580
		// cvv: 458
		// id: 123456789
		// any futuristic exp. date
		const sum = this.props.sum;
		// 2 is USD, 1 is NIS
		const currency = getStartDirection() === 'right' ? 1 : 2;
		const lang = getStartDirection() === 'right' ? 'il' : 'us';
		const url = `${
			this.basePaymentUrl
		}/iframenew.php?sum=${sum}&currency=${currency}&lang=${lang}&cred_type=1&t=${Date.now()}`;
		this.setState({url});

		// 15/07/18 - Removed this whole part of code because we removed Tamal
		// localStorage.getCurrentUserMail()
		//     .then(email => {
		//         console.log('email from getCurrentUserMail', email);
		//         const sum = this.props.sum;
		//         // 27/06/18 - Removed Tamal from the application
		//         // const tamalParams = `&product-name-1=${this.productName}&product-quantity-1=1&product-price-1=${sum}&email=${email}&type_code=400`;
		//         // const allUrl = `${tranzilaUrl}${tamalParams}`;
		//         // console.log('allUrl', allUrl);
		//         // return allUrl;
		//         return `${this.basePaymentUrl}/newiframe.php?sum=${sum}&currency=1&cred_type=1&t=${Date.now()}&lang=heb`;
		//     })
		//     .then(url => {
		//         this.setState({url});
		//     });
	};

	render() {
		return (
			<WebView
				style={styles.webView}
				source={{uri: this.state.url}}
				scalesPageToFit={true}
				onNavigationStateChange={(url) => this.onNavChange(url)}
				ref={'tranzilaWebView'}
			/>
		);
	}

	onNavChange = (result) => {
		console.log('result is ', result);
		let resultUrl = result.url;
		let resultLoading = result.loading;

		if (resultUrl && !resultLoading) {
			if (resultUrl.includes(this.redirectSuccessString)) {
				this.handleSuccessRedirect();
			} else if (resultUrl.includes(this.redirectErrorString)) {
				this.handleErrorRedirect();
			}
		}
	};

	handleSuccessRedirect = () => {
		console.log('Tranzila - Handle success redirect');
		this.callPaymentSuccess();
	};

	handleErrorRedirect = () => {
		console.log('Tranzila - Handle error redirect');
		this.callPaymentFailed();
	};

	callPaymentSuccess = () => {
		if (this.props.onPaymentSuccess && !this.callbackOccurred) {
			this.callbackOccurred = true;
			this.props.onPaymentSuccess();
		}
	};

	callPaymentFailed = () => {
		if (this.props.onPaymentFailed && !this.callbackOccurred) {
			this.callbackOccurred = true;
			this.props.onPaymentFailed();
		}
	};

	refreshPaymentProcess = () => {
		this.callbackOccurred = false;
		this.setStartUrlOnState();
		// This line was a bug:
		// this.setState({url: this.setStartUrlOnState()});
	};
}

const styles = {
	container: {},
	webView: {
		backgroundColor: 'skyblue',
		width: '100%',
		height: '100%',
	},
};
