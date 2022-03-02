import React, {Component} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {APP_BUTTON_BACKGROUND, APP_TEXT_WHITE} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import TranzilaIFrame from '../../components/common/Tranzila/TranzilaIFrame';
import {strings} from '../../utils/lang/I18n';
import sceneManager from '../sceneManager';

export default class Payment extends Component {
	constructor(props) {
		super(props);
		this.state = {showWebView: false};
	}

	onPaymentSuccess = () => {
		this.setState({showWebView: false});
	};

	onPaymentFailed = () => {
		Alert.alert('Error', "Couldn't create payment");
		this.refs.tranzilaRef.refreshPaymentProcess();
	};

	renderButton = () => {
		return (
			<HermonManButton
				onPress={() => this.setState({showWebView: true})}
				buttonStyle={{width: 150, height: 50, borderRadius: 100 / 2}}
				textColor={APP_TEXT_WHITE}
				backgroundColor={APP_BUTTON_BACKGROUND}
				text={strings('PAY')}
			/>
		);
	};

	renderTranzila = () => {
		return (
			<View style={styles.tranzilaWebView}>
				<TranzilaIFrame
					sum={this.props.sum}
					ref='tranzilaRef'
					onPaymentSuccess={this.onPaymentSuccess}
					onPaymentFailed={this.onPaymentFailed}
				/>
			</View>
		);
	};

	render() {
		// return <View />;

		return this.state.showWebView ? <View>{this.renderTranzila()}</View> : <View>{this.renderButton()}</View>;
	}
}

const styles = StyleSheet.create({
	tranzilaWebView: {
		height: '100%',
		width: '100%',
	},
});
