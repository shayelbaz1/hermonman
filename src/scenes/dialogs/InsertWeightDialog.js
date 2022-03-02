import moment from 'moment/moment';
import {Icon} from 'native-base';
import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BACKGROUND_WHITE,
	APP_BUTTON_BACKGROUND,
	APP_GRAY_TEXT,
	APP_TEXT_COLOR,
	APP_TEXT_WHITE,
} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import firebase from '../../utils/firebase/Firebase';
import localized from '../../utils/lang/localized';
import sceneManager from '../sceneManager';
import BaseLightbox from './BaseLightbox';
import {getStartDirection, strings} from '../../utils/lang/I18n';

export default class InsertWeightDialog extends Component {
	constructor() {
		super();
		this.state = {
			method: '',
			weight: getStartDirection() === 'right' ? 70.0 : 160.0,
		};
		this.timer = null;
	}

	onContinuePressed = () => {
		firebase
			.getCurrentUser()
			.then((user) => {
				var currentDate = moment().format('DD/MM/YYYY');
				console.log('currentDate::::', currentDate);
				let weight = {
					date: currentDate,
					weight: parseInt(getStartDirection() === 'right' ? this.state.weight : this.state.weight * 0.453),
				};
				firebase.updateHermonManUserWeight(user, weight).then((res) => {
					console.log('The insert weight was completed succesfully!', res);
				});
				sceneManager.popReturn();
			})
			.catch((err) => {
				console.log('There was a problem inserting the weight: ', err);
			});
	};

	plusWeight = (amount) => {
		const {weight} = this.state;
		const updateWeight = weight + amount;
		console.log(updateWeight, +updateWeight.toFixed(2));

		this.setState({weight: +updateWeight.toFixed(2)});
		this.timer = setTimeout(() => this.plusWeight(amount), 100);
	};

	minusWeight = (amount) => {
		const {weight} = this.state;
		const updateWeight = weight - amount;
		console.log(updateWeight, +updateWeight.toFixed(2));
		if (updateWeight > 0) {
			this.setState({weight: +updateWeight.toFixed(2)});
		}
		this.timer = setTimeout(() => this.minusWeight(amount), 100);
	};

	stopTimer() {
		clearTimeout(this.timer);
	}

	render() {
		const {weight} = this.state;
		return (
			<BaseLightbox verticalPercent={0.7} horizontalPercent={0.9}>
				<View
					style={{
						backgroundColor: APP_BACKGROUND_CREAM_COLOR,
						height: '100%',
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR}}>
						<View>
							<Text style={[styles.titleStyle, {fontSize: 30, marginBottom: 20, color: APP_TEXT_COLOR}]}>
								{strings('MY_WEIGHT')}
							</Text>
							<View style={styles.viewStyle}>
								<TouchableOpacity
									onPressIn={() => (getStartDirection() === 'right' ? this.minusWeight(1) : this.plusWeight(1))}
									onPressOut={() => this.stopTimer()}>
									<View style={[styles.viewStyle, {flexDirection: 'column'}]}>
										<Icon
											name={getStartDirection() === 'right' ? 'ios-arrow-dropdown' : 'ios-arrow-dropup'}
											style={{
												fontSize: 30,
												color: APP_GRAY_TEXT,
											}}
										/>
										<Text>{getStartDirection() === 'right' ? 'kg' : 'lbs'}</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPressIn={() => (getStartDirection() === 'right' ? this.minusWeight(0.1) : this.plusWeight(0.1))}
									onPressOut={() => this.stopTimer()}
									style={{marginLeft: '7%'}}>
									<View style={[styles.viewStyle, {flexDirection: 'column'}]}>
										<Icon
											name={getStartDirection() === 'right' ? 'ios-arrow-down' : 'ios-arrow-up'}
											style={{
												fontSize: 30,
												color: APP_GRAY_TEXT,
											}}
										/>
										<Text>{getStartDirection() === 'right' ? 'g' : 'oz'}</Text>
									</View>
								</TouchableOpacity>
								<View style={styles.numberViewBox}>
									<Text style={[styles.titleStyle, {color: APP_TEXT_COLOR, fontSize: 50}]}>{weight}</Text>
								</View>
								<TouchableOpacity
									onPressIn={() => (getStartDirection() === 'right' ? this.plusWeight(0.1) : this.minusWeight(0.1))}
									onPressOut={() => this.stopTimer()}
									style={{marginRight: '7%'}}>
									<View style={[styles.viewStyle, {flexDirection: 'column'}]}>
										<Icon
											name={getStartDirection() === 'right' ? 'ios-arrow-up' : 'ios-arrow-down'}
											style={{
												fontSize: 30,
												color: APP_GRAY_TEXT,
											}}
										/>
										<Text>{getStartDirection() === 'right' ? 'g' : 'oz'}</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPressIn={() => (getStartDirection() === 'right' ? this.plusWeight(1) : this.minusWeight(1))}
									onPressOut={() => this.stopTimer()}>
									<View style={[styles.viewStyle, {flexDirection: 'column'}]}>
										<Icon
											name={getStartDirection() === 'right' ? 'ios-arrow-dropup' : 'ios-arrow-dropdown'}
											style={{
												fontSize: 30,
												color: APP_GRAY_TEXT,
											}}
										/>
										<Text>{getStartDirection() === 'right' ? 'kg' : 'lbs'}</Text>
									</View>
								</TouchableOpacity>
							</View>
							<Text style={[styles.titleStyle, {marginTop: 20}]}>{strings('KG')}</Text>
						</View>

						<View style={{alignItems: 'center', marginTop: 30}}>
							<HermonManButton
								buttonStyle={{width: 200, height: 50, borderRadius: 100 / 2}}
								backgroundColor={APP_BUTTON_BACKGROUND}
								textColor={APP_TEXT_WHITE}
								text={strings('CONTINUE')}
								onPress={this.onContinuePressed}
							/>
						</View>
					</View>
				</View>
			</BaseLightbox>
		);
	}
}

const styles = {
	titleStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	viewStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	numberViewBox: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		height: 100,
		width: 140,
		borderWidth: 1,
		borderColor: APP_TEXT_COLOR,
		backgroundColor: APP_BACKGROUND_WHITE,
		marginHorizontal: '8%',
	},
};
