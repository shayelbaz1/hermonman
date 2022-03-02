import moment from 'moment/moment';
import {Icon} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {APP_BLACK, APP_BUTTON_BACKGROUND, APP_TEXT_COLOR, APP_TEXT_WHITE, LIGHT_GREEN} from '../../assets/colors';
import firebase from '../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../utils/lang/I18n';

const HERMON_KEY = 'hermonman';
const SPEEDY_KEY = 'speedy';
const VEGETRIAN_KEY = 'vegetarian';
const EASY_WAY_KEY = 'easyway';
const HERMON_MANTIANE_KEY = 'hermonmanMaintain';
const CALORIES_KEY = 'calories';
const CALORIES_MAINTAIN_KEY = 'caloriesMaintain';

export default class HistoryDropDown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dietHisotryPressed: false,
			loadedDiet: false,
			weightAndDateStringArray: [],
		};
	}

	componentDidMount() {
		const {historyDiet, user} = this.props;
		if (historyDiet.dietId === 'calories' || historyDiet.dietId === 'caloriesMaintain') {
			const currentDiet = {
				diet: {
					...historyDiet,
				},
			};
			this.setState({
				loadedDiet: true,
				currentDiet,
			});
		} else {
			firebase
				.getDietByDietId(historyDiet.dietId)
				.then((diet) => {
					if (diet) {
						this.setState({currentDiet: diet, loadedDiet: true});
					}
				})
				.catch((err) => {
					console.log('error with getDietByDietId HistoryDropDown', historyDiet, err);
				});
		}
		firebase.getWeightHistory(user).then((weightAndDateStringArray) => {
			this.setState({weightAndDateStringArray: weightAndDateStringArray});
		});
	}

	renderMenuButton = () => {
		const buttonTitle = 'תפריט';
		return (
			<TouchableOpacity
				style={[
					styles.displayAllList,
					{backgroundColor: APP_BUTTON_BACKGROUND, alignContent: 'center', marginHorizontal: 15},
				]}>
				<Text style={{color: APP_TEXT_WHITE, textAlign: 'center', alignSelf: 'center'}}>{buttonTitle}</Text>
			</TouchableOpacity>
		);
	};

	getTextDietType = (methodType) => {
		switch (methodType) {
			case HERMON_KEY:
				return strings('HERMON_NAME');
			case SPEEDY_KEY:
				return strings('SPEEDY_NAME');
			case VEGETRIAN_KEY:
				return strings('VEG_NAME');
			case EASY_WAY_KEY:
				return strings('EASYWAY_NAME');
			case HERMON_MANTIANE_KEY:
				return strings('HERMONMAN_MANTAINE_NAME');
			case CALORIES_KEY:
				return strings('CALORIT_NAME');
			case CALORIES_MAINTAIN_KEY:
				return strings('CALORIT_MAINTAIN_NAME');
			default:
				return '';
		}
	};

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	//renderCardDetails
	getDataByLanauage = (data) => {
		const rtl = this.getRtl();
		console.log('data::::::::::::::', data);
		if (data) {
			return rtl ? data.heb : data.eng;
		}

		return '';
	};

	getDietName = () => {
		const {currentDiet} = this.state;
		let firstProprty;
		for (var key in currentDiet) {
			if (currentDiet.hasOwnProperty(key)) {
				firstProprty = currentDiet[key];
				break;
			}
		}
		if (!firstProprty) {
			return null;
		}
		let dietName = this.getDataByLanauage(firstProprty.dietDescription);
		return dietName;
	};

	isBodyDroppedDown = () => {
		const {dietHisotryPressed} = this.state;
		const {historyDiet} = this.props;
		const nameTitle = strings('DIET_NAME');
		const weightTitle = strings('DIET_WEIGHT');
		const methodTitle = strings('METHOD_NAME');

		const startDateDiet = historyDiet.date;
		const startWeight = this.getStartWeight(startDateDiet);
		const weightText = startWeight
			? getStartDirection() === 'right'
				? startWeight + 'kg'
				: parseInt(startWeight / 0.453) + ' pounds'
			: strings('NO_START_WEIGHT');
		const methodName = this.getTextDietType(historyDiet.methodType);
		const dietName = this.getDietName();

		if (dietHisotryPressed) {
			return (
				<View style={{backgroundColor: 'white', height: 90}}>
					<View style={{marginTop: 5}}>{this.renderInfo(nameTitle, dietName)}</View>
					<View style={{marginTop: 5}}>{this.renderInfo(methodTitle, methodName)}</View>
					<View style={{marginVertical: 5}}>{this.renderInfo(weightTitle, weightText, 'red')}</View>

					{/*<TouchableOpacity style={{backgroundColor:APP_BUTTON_BACKGROUND,justifyContent:'center',width:100,height:25,borderRadius:20,marginBottom:10,marginHorizontal:8}}>
                        <Text style={{textAlign:'center',alignSelf:'center',color:APP_TEXT_WHITE}}>{menuTitleButton}</Text>
                      </TouchableOpacity>*/}
				</View>
			);
		}
	};

	renderInfo = (title, value, textColor) => {
		const color = textColor ? {color: textColor} : {color: APP_BLACK};
		const styleByLang = this.getStyleByLang();
		const flexDirectionByLang = this.getFlexDirectionByLang();
		if (value) {
			return (
				<View style={[{marginHorizontal: 12}, flexDirectionByLang, styleByLang]}>
					<Text style={styles.titleInfoText}>{title}</Text>
					<Text> </Text>
					<Text style={[styles.valueInfoText, color]}>{value}</Text>
				</View>
			);
		}
	};

	isPressed = () => {
		const {dietHisotryPressed} = this.state;
		const dietHistoryNewValue = !dietHisotryPressed;
		this.setState({dietHisotryPressed: dietHistoryNewValue});
	};

	getStartWeight = (startDate) => {
		const {weightAndDateStringArray} = this.state;
		let weightInStartDate = weightAndDateStringArray.find((weightAndDateObject) => {
			return weightAndDateObject.date === startDate;
		});

		if (weightInStartDate) {
			return weightInStartDate.weight;
		}

		return '';
	};

	getFinalWeight = (endDateDiet) => {
		const {weightAndDateStringArray} = this.state;
		let weightInEndDate = weightAndDateStringArray.find((weightAndDateObject) => {
			return weightAndDateObject.date === endDateDiet;
		});

		if (weightInEndDate) {
			return weightInEndDate.weight;
		}

		return null;
	};

	getEndDateForDiet = (daysInDiet, startDate) => {
		const parts = startDate.split('/');
		const endDate = moment([parts[2], parts[1] - 1, parts[0]])
			.add(daysInDiet, 'days')
			.format('DD/MM/YYYY')
			.toString();
		return endDate;
	};

	renderWeight = (weight) => {
		const {dietHisotryPressed} = this.state;
		const textColorByPressed = dietHisotryPressed ? {color: APP_TEXT_WHITE} : {color: APP_TEXT_COLOR};
		// const weightText = weight ? weight + 'kg' : strings('NO_WEIGHT_YET');
		const weightText = weight
			? getStartDirection() === 'right'
				? weight + 'kg'
				: parseInt(weight / 0.453) + ' pounds'
			: strings('NO_WEIGHT_YET');
		const fontWeightSize = weight ? {fontSize: 18} : {fontSize: 14};
		const title = strings('FINAL_WEIGHT');

		return (
			<View style={{flexDirection: 'column'}}>
				<Text style={{color: APP_BLACK, fontSize: 10, textAlign: 'center', fontWeight: 'bold'}}>{title}</Text>
				<Text style={[fontWeightSize, textColorByPressed, {textAlign: 'center', fontWeight: 'bold'}]}>
					{weightText}
				</Text>
			</View>
		);
	};

	getHebrew = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	getFlexDirectionByLang = () => {
		return this.getHebrew() ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'};
	};

	getIconName = () => {
		return this.getHebrew() ? 'left' : 'right';
	};

	getStyleByLang = () => {
		return this.getHebrew()
			? {alignSelf: 'flex-end', alignContent: 'flex-end'}
			: {alignSelf: 'flex-start', alignContent: 'flex-start'};
	};

	renderCardDetails = () => {
		const {dietHisotryPressed, currentDiet} = this.state;
		const {dietIndex, historyDiet} = this.props;
		console.log('renderCardDetails currentDiet:::::::::::', currentDiet);
		console.log('renderCardDetails historyDiet:::::::::::', historyDiet);

		let firstProprty;
		for (var key in currentDiet) {
			if (currentDiet.hasOwnProperty(key)) {
				firstProprty = currentDiet[key];
				break;
			}
		}
		if (!firstProprty) {
			return null;
		}
		let dietDays = firstProprty.days;
		const startDateDiet = historyDiet.date;
		const endDateDiet = this.getEndDateForDiet(dietDays, startDateDiet);

		const finalWeight = this.getFinalWeight(endDateDiet);
		const backgroundColorByPressed = dietHisotryPressed ? {backgroundColor: LIGHT_GREEN} : {backgroundColor: 'white'};
		const textColorByPressed = dietHisotryPressed ? {color: APP_TEXT_WHITE} : {color: APP_BLACK};
		const iconNameByLang = this.getIconName();
		const iconNameIfPressed = dietHisotryPressed ? 'down' : iconNameByLang;
		const iconColor = {color: APP_BLACK};

		const dietIndexTitle = dietIndex + 1;
		const dietText = strings('DIET_NUM') + ' ' + dietIndexTitle;
		const subTitleText = strings('BETWEEN_DATES') + startDateDiet + ' - ' + endDateDiet;
		const flexDirection = this.getFlexDirectionByLang();
		const styleByLang = this.getStyleByLang();

		return (
			<TouchableOpacity onPress={this.isPressed} style={backgroundColorByPressed}>
				<View style={[flexDirection, {marginVertical: 5, marginHorizontal: 8, justifyContent: 'space-around'}]}>
					<View style={{flexDirection: 'column'}}>
						<View style={[styleByLang]}>
							<Text style={[styles.textTitle, textColorByPressed]}>{dietText}</Text>
						</View>

						<View>
							<Text style={[styles.subTitleText, textColorByPressed]}>{subTitleText}</Text>
						</View>
					</View>

					{this.renderWeight(finalWeight)}

					<TouchableOpacity onPress={this.isPressed} style={{marginVertical: 5}}>
						<Icon name={iconNameIfPressed} type='AntDesign' style={[{fontSize: 30}, iconColor]} />
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		const {loadedDiet, currentDiet} = this.state;
		if (loadedDiet && currentDiet) {
			return (
				<View style={{marginVertical: 5}}>
					{this.renderCardDetails()}
					{this.isBodyDroppedDown()}
				</View>
			);
		} else {
			return null;
		}
	}
}

const styles = StyleSheet.create({
	view: {
		flexDirection: 'row',
		justifyContent: 'center',
		borderRadius: 5,
		height: 45,
	},
	textHeader: {
		fontWeight: 'bold',
		fontSize: 20,
		color: 'blue',
		alignSelf: 'center',
		paddingTop: 20,
	},
	textBody: {
		fontWeight: 'bold',
		fontSize: 16,
		alignSelf: 'center',
		paddingBottom: 5,
	},
	textTitle: {
		color: 'black',
		fontSize: 18,
		textAlign: 'right',
		fontWeight: 'bold',
	},
	subTitleText: {
		color: 'black',
		fontSize: 12,
		textAlign: 'right',
	},
	titleInfoText: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'right',
		color: APP_BLACK,
	},
	valueInfoText: {
		fontSize: 15,
		textAlign: 'right',
		maxWidth: 250,
	},
	selectButton: {
		width: 100,
		height: 50,
		borderRadius: 50 / 2,
	},
	displayAllList: {
		width: 120,
		height: 30,
		justifyContent: 'center',
		borderRadius: 100 / 2,
	},
	selectButtonView: {
		alignContent: 'center',
		marginVertical: 12,
		alignItems: 'center',
	},
	weightContainer: {
		flexDirection: 'column',
		width: '20%',
	},
	weightText: {
		textAlign: 'center',
	},
});
