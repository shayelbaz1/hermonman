// Libraries
import moment from 'moment/moment';
import {Icon} from 'native-base';
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BACKGROUND_WHITE,
	APP_BUTTON_BACKGROUND,
	APP_GRAY_TEXT,
	APP_TEXT_COLOR,
} from '../../../assets/colors';
import HermonManButton from '../../../components/common/hermonManButton/HermonManButton';
import {CALORIES, CALORIES_MATINATIN} from '../../../utils/data/DietTypes';
import firebase from '../../../utils/firebase/Firebase';
import {strings, getStartDirection} from '../../../utils/lang/I18n';
import sceneManager from '../../sceneManager';

export default class InsertWeight extends Component {
	constructor() {
		super();
		this.state = {
			method: '',
			weight: getStartDirection() === 'right' ? 70 : 160,
		};
	}

	componentWillMount() {
		let method = this.props.method;
		this.setState({method: method});
	}

	goToHermonmanMaintain() {
		firebase
			.getCurrentUser()
			.then((user) => {
				var currentDate = moment().format('DD/MM/YYYY');
				var diet = {
					dietId: 'שלב א שמירה',
					dietType: 'maintain',
					methodType: 'hermonmanMaintain',
					date: currentDate.toString(),
				};
				firebase.updateHermonManUserDiet(user, diet).then((res) => {
					sceneManager.goToProgress(user);
				});
			})
			.catch((err) => {
				console.log('There was a problem getting the user: ', err);
			});
	}

	goToCaloriesMaintain(CALORIES_MATINATIN) {
		sceneManager.goToCaloriesDiet(CALORIES_MATINATIN);
	}

	goToScreenByMethod() {
		console.log('1. method insertWeight:::::::::::', this.state.method);
		switch (this.state.method) {
			case 'hermonman':
				sceneManager.goToFoodChoose();
				break;
			case 'speedy':
				sceneManager.goToDietsRenderer([], 'speedy');
				break;
			case 'vegetarian':
				sceneManager.goToDietsRenderer([], 'vegetarian');
				break;
			case 'easyway':
				sceneManager.goToDietsRenderer([], 'easyway');
				break;
			case CALORIES:
				sceneManager.goToCaloriesDiet();
				break;
			case 'hermonmanMaintain':
				this.goToHermonmanMaintain();
				break;
			case CALORIES_MATINATIN:
				console.log('2. method insertWeight CALORIES_MATINATIN!!!!');
				this.goToCaloriesMaintain(CALORIES_MATINATIN);
				break;
		}
	}

	onContinuePressed = () => {
		firebase
			.getCurrentUser()
			.then((user) => {
				var currentDate = moment().format('DD/MM/YYYY');
				let weight = {
					date: currentDate.toString(),
					weight: parseInt(getStartDirection() === 'right' ? this.state.weight : this.state.weight * 0.453),
				};
				firebase.updateHermonManUserWeight(user, weight).then((res) => {
					console.log('The insert weight was completed succesfully!', res);
				});
				this.goToScreenByMethod();
			})
			.catch((err) => {
				console.log('There was a problem inserting the weight: ', err);
			});
	};

	plusWeight = (amount) => {
		const {weight} = this.state;
		const updateWeight = weight + amount;
		this.setState({weight: +updateWeight.toFixed(2)});
		this.timer = setTimeout(() => this.plusWeight(amount), 100);
	};

	minusWeight = (amount) => {
		const {weight} = this.state;
		const updateWeight = weight - amount;
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
											fontSize: 50,
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
											marginLeft: 8,
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
											marginRight: 8,
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
											fontSize: 50,
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
							buttonStyle={{width: 200, height: 40, borderRadius: 100 / 2}}
							backgroundColor={APP_BUTTON_BACKGROUND}
							textColor='white'
							text={strings('CONTINUE')}
							onPress={this.onContinuePressed}
						/>
					</View>
				</View>
			</View>
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
		marginHorizontal: '6%',
	},
};
