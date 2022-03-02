import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, Linking} from 'react-native';
import {View} from 'native-base';
import {APP_BACKGROUND_CREAM_COLOR, APP_TEXT_COLOR} from '../../assets/colors';
import {strings, getStartDirection} from '../../utils/lang/I18n';

class ContactUs extends Component {
	constructor(props) {
		super(props);
	}

	getHebrew = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	getDirectionView = () => {
		return this.getHebrew()
			? {alignSelf: 'flex-end', justifyContent: 'flex-end'}
			: {alignSelf: 'flex-start', justifyContent: 'flex-start'};
	};

	getDirectionText = () => {
		return this.getHebrew() ? {justifyContent: 'flex-end'} : {justifyContent: 'flex-start'};
	};

	getFlexDirection = () => {
		return this.getHebrew() ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'};
	};

	onPhonePress = () => {
		Linking.openURL('tel:03-5234303');
	};

	onEmailPress = () => {
		Linking.openURL('mailto:hermonmanclinic@gmail.com?subject=&body=');
	};

	styleByLanaguage = () => {
		return this.getRtl()
			? {justifyContent: 'flex-end', flexDirection: 'row'}
			: {alignSelf: 'flex-start', flexDirection: 'row-reverse'};
	};

	render() {
		const headerText = strings('CONTACT_US');
		const locationLabel = strings('PRIMIRY_CLINIC');
		const locationValue = 'רחוב רמברנט 14, תל אביב';
		const emailLabel = strings('EMAIL');
		const emailValue = 'hermonmanclinic@gmail.com';
		const phoneLabel = strings('PHONE');
		const phoneValue = '03-5234303';
		const textAlign = getStartDirection() === 'right' ? {textAlign: 'right'} : {textAlign: 'left'};
		const valueStyle = Platform.OS === 'ios' ? styles.valueIphoneStyle : styles.valueStyle;

		return (
			<View style={[{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%', width: '100%'}]}>
				<View style={styles.viewForHeader}>
					<Text style={styles.headerText}>{headerText}</Text>
				</View>

				<View style={{marginTop: 15, marginHorizontal: 15}}>
					<View style={[{paddingTop: 25}, this.styleByLanaguage]}>
						<Text style={[styles.keyStyle, textAlign]}>{locationLabel} </Text>
						<Text style={[valueStyle, textAlign]}>{locationValue}</Text>
					</View>

					<View style={[{paddingTop: 25}, this.styleByLanaguage]}>
						<Text style={[styles.keyStyle, textAlign]}>{emailLabel}</Text>
						<Text style={[valueStyle, textAlign]} onPress={this.onEmailPress}>
							{emailValue}
						</Text>
					</View>

					<View style={[{paddingTop: 25}, this.styleByLanaguage]}>
						<Text style={[styles.keyStyle, textAlign]}>{phoneLabel}</Text>
						<Text style={[valueStyle, textAlign]} onPress={this.onPhonePress}>
							{phoneValue}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	viewForHeader: {
		alignContent: 'center',
		alignItems: 'center',
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'black',
		textAlign: 'center',
		marginTop: 20,
	},
	labelText: {
		color: APP_TEXT_COLOR,
		fontSize: 19,
		width: '30%',
		fontWeight: 'bold',
	},
	valueText: {
		color: 'black',
		fontSize: 18,
		width: '70%',
	},
	keyStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: APP_TEXT_COLOR,
	},
	valueStyle: {
		fontSize: 18,
		fontWeight: '300',
		marginTop: 2,
	},
	valueIphoneStyle: {
		fontSize: 16,
		fontWeight: '300',
		marginHorizontal: 4,
		marginTop: 5,
	},
});

export default ContactUs;
