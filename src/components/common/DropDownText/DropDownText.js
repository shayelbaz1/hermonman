import moment from 'moment/moment';
import {Icon} from 'native-base';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {APP_BLACK, APP_BUTTON_BACKGROUND, APP_TEXT_WHITE, LIGHT_GREEN} from '../../../assets/colors';
import HermonManButton from '../../../components/common/hermonManButton/HermonManButton';
import {getImage} from '../../../img/images';
import sceneManager from '../../../scenes/sceneManager';
import firebase from '../../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../../utils/lang/I18n';

const loadingImage = getImage('loading');

const MONDAY = 1;
const TUESDAY = 0;
const FRIDAY = 1;
const SATERDAY = 0;

export default class DropDownText extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: this.props.singleMethod.title,
			menuDescription: this.props.singleMethod.menuDescription,
			methodID: this.props.singleMethod.methodID,
			dietType: this.props.singleMethod.dietType,
			userLanauge: this.props.userLanauge,
			isPressed: false,
			days: this.props.singleMethod.days,
			dietPressed: false,
			allData: this.props.singleMethod.text,
		};
	}

	componentDidMount() {
		const {userLanauge} = this.state;
		if (!userLanauge) {
			const userLang = getStartDirection() === 'right' ? 'Hebrew' : 'English';
			this.setState({userLanauge: userLang});
		}
	}

	updateDiet(user, diet) {
		firebase
			.updateHermonManUserDiet(user, diet)
			.then((resUser) => {
				console.log('3. dietPressed The diet update was succesfull!!', resUser);
				sceneManager.goToProgress(resUser);
			})
			.catch((err) => {
				console.log('dietPressed error with updateDiet', err);
			});
	}

	onContinuePressed = () => {
		this.setState({dietPressed: true}, () => this.dietPressed());
	};

	checkIfDietIsProtein = (diet) => {
		const startDietDiet = moment(diet.date);
		const startDietDay = startDietDiet.day();

		if (diet.dietType === 'protein' || (diet.dietId === 15 && startDietDay === SATERDAY) || startDietDay === FRIDAY) {
			return true;
		}

		return false;
	};

	checkIfDietIsCarbohydrate = (diet) => {
		const startDietDiet = moment(diet.date);
		const startDietDay = startDietDiet.day();

		if (
			diet.dietType === 'carbohydrate' ||
			(diet.dietId === 15 && startDietDay === MONDAY) ||
			startDietDay === TUESDAY
		) {
			return true;
		}

		return false;
	};

	//dietType
	//methodType
	validSelection = (newDiet, lastDiet) => {
		const startDietDiet = moment(lastDiet.date);
		const startDietDay = startDietDiet.day();
		console.log('1. validSelection newDiet:::::::::::', newDiet);
		console.log('2. validSelection lastDiet:::::::::::', lastDiet);
		if (
			newDiet.methodType === 'hermonman' &&
			this.checkIfDietIsProtein(newDiet) &&
			lastDiet.methodType === 'hermonman' &&
			this.checkIfDietIsCarbohydrate(lastDiet)
		) {
			return false;
		} else if (
			newDiet.methodType === 'hermonman' &&
			this.checkIfDietIsCarbohydrate(newDiet) &&
			lastDiet.methodType === 'hermonman' &&
			this.checkIfDietIsProtein(lastDiet)
		) {
			return false;
		} else if (
			(lastDiet.dietType === 'maintain' &&
				lastDiet.dietId === 20 &&
				(this.checkIfDietIsProtein(newDiet) || this.checkIfDietIsCarbohydrate(newDiet))) ||
			(newDiet.dietType === 'maintain' &&
				newDiet.dietId === 20 &&
				(this.checkIfDietIsProtein(lastDiet) || this.checkIfDietIsCarbohydrate(lastDiet)))
		) {
			return false;
		} else if (
			(lastDiet.methodType === 'other' && lastDiet.dietId === 9.1 && this.checkIfDietIsProtein(newDiet)) ||
			(lastDiet.methodType === 'other' && lastDiet.dietId === 9.4 && this.checkIfDietIsProtein(newDiet)) ||
			(newDiet.methodType === 'other' && newDiet.dietId === 9.4 && this.checkIfDietIsProtein(lastDiet)) ||
			(newDiet.methodType === 'other' && newDiet.dietId === 9.1 && this.checkIfDietIsProtein(lastDiet))
		) {
			return false;
		} else if (
			(lastDiet.methodType === 'other' && lastDiet.dietId === 12 && is.checkIfDietIsProtein(newDiet)) ||
			(newDiet.methodType === 'other' && newDiet.dietId === 12 && this.checkIfDietIsProtein(lastDiet))
		) {
			return false;
		} else if (
			(lastDiet.methodType === 'other' && lastDiet.dietId === 15 && this.checkIfDietIsProtein(newDiet)) ||
			(newDiet.methodType === 'other' && newDiet.dietId === 15 && this.checkIfDietIsProtein(lastDiet))
		) {
			return false;
		} else if (
			(lastDiet.methodType === 'other' &&
				lastDiet.dietId === 15 &&
				newDiet.dietType === 'protein' &&
				(startDietDay === SATERDAY || startDietDay === FRIDAY)) ||
			(newDiet.methodType === 'other' &&
				newDiet.dietId === 15 &&
				lastDiet.dietType === 'protein' &&
				(startDietDay === SATERDAY || startDietDay === FRIDAY))
		) {
			return false;
		}

		return true;
	};

	/*
    decriptionDiet
title
days
methodID
dietType
menuDescription
    */

	dietPressed = () => {
		console.log('0.  dietPressed dietPressed1');
		const {methodType, dietId} = this.props.singleMethod;
		firebase
			.getCurrentUser()
			.then((user) => {
				var currentDate = moment().format('DD/MM/YYYY');
				var newDietToUpdate = {
					dietId: dietId,
					dietType: this.state.dietType,
					methodType: methodType,
					date: currentDate.toString(),
				};
				firebase.getLastDiet(user).then((diets) => {
					console.log('dietPressed getLastDiet return', diets);
					if (diets.length === 0) {
						this.updateDiet(user, newDietToUpdate);
					}
					const lastDiet = diets[diets.length - 1];
					const validNewDietSelection = this.validSelection(newDietToUpdate, lastDiet);
					if (!validNewDietSelection) {
						sceneManager.goToHermonManDialog(user, newDietToUpdate);
					} else {
						this.updateDiet(user, newDietToUpdate);
					}
				});
			})
			.catch((err) => {
				console.log('There was an error with getting the user: ', err);
			});
	};

	/*
    if (lastDiet.methodType == 'hermonman' && lastDiet.dietType == 'protein' &&
                                newDietToUpdate.methodType == 'hermonman' && newDietToUpdate.dietType == 'carbohydrate') {
                            }
                            else if (lastDiet.methodType == 'hermonman' && lastDiet.dietType == 'carbohydrate' &&
                                newDietToUpdate.methodType == 'hermonman' && newDietToUpdate.dietType == 'protein') {
                                sceneManager.goToHermonManDialog(user, newDietToUpdate);
                            } else {
                                this.updateDiet(user, newDietToUpdate);
                            }
    */

	goBack = () => {
		sceneManager.goBack();
	};

	renderButtons = () => {
		const selectText = strings('SELECT');
		return (
			<TouchableOpacity onPress={this.onContinuePressed} style={styles.selectButtonView}>
				<HermonManButton
					buttonStyle={styles.selectButton}
					text={selectText}
					enabled={false}
					textColor={APP_TEXT_WHITE}
					backgroundColor={APP_BUTTON_BACKGROUND}
				/>
			</TouchableOpacity>
		);
	};

	getAlignContent = () => {
		if (this.getRtl()) {
			return {justifyContent: 'flex-end', alignSelf: 'flex-end', alignContent: 'flex-end'};
		}

		return {justifyContent: 'flex-start', alignSelf: 'flex-start', alignContent: 'flex-start'};
	};

	isBodyDroppedDown = () => {
		const {menuDescription} = this.state;
		const durationTitle = strings('DURATION_DIET');
		const menuTitle = strings('MENU');

		const {days} = this.state;
		const daysToDisplay = days + ' ' + strings('DAYS');

		const shortDescription = this.getMenuDescriptionByTypeAndLanauge(menuDescription.shortDescription);

		if (this.state.isPressed) {
			return (
				<View style={[{backgroundColor: 'white'}]}>
					{/* For some reason, Rony decided to not show this, and instead show the whole menu */}
					{/* <View style={{marginTop: 5}}>{this.renderInfo(durationTitle, daysToDisplay)}</View>

					<View style={{marginTop: 2}}>{this.renderInfo(menuTitle, shortDescription)}</View>

					<View>{this.renderMoreMenuDetails()}</View> */}
					<View>{this.renderAllInfo()}</View>

					{this.renderButtons()}
				</View>
			);
		}
	};

	getMenuDescriptionByTypeAndLanauge = (menuData) => {
		const {userLanauge} = this.state;
		if (userLanauge === 'Hebrew' && menuData) {
			return menuData.he || menuData.heb;
		} else if (userLanauge === 'English' && menuData) {
			return menuData.en || menuData.eng;
		}
	};

	getTextAlign = () => {
		const {userLanauge} = this.state;
		if (userLanauge === 'Hebrew') {
			return {textAlign: 'right'};
		}

		return {textAlign: 'left'};
	};

	renderMoreInfo = (title, value) => {
		const numberOfLines = 50;
		const alignContent = this.getAlignContent();
		const flexDirection = this.getFlexDirection();
		const textAlign = this.getTextAlign();
		if (value) {
			return (
				<View style={[alignContent, flexDirection, {marginHorizontal: 8}]}>
					<Text style={styles.titleInfoText}>{title}</Text>
					<Text> </Text>
					<Text numberOfLines={numberOfLines} style={[styles.valueInfoText, textAlign]}>
						{value}
					</Text>
				</View>
			);
		}
	};

	//separate to other function - maybe will remove in the future
	renderMoreMenuDetails = () => {
		const {menuDescription} = this.state;
		const limitedMenu = this.getMenuDescriptionByTypeAndLanauge(menuDescription.limitedMenu);
		const forbbidenMenu = this.getMenuDescriptionByTypeAndLanauge(menuDescription.forbbidenMenu);
		const limitTitle = strings('LIMITED_MENU');
		const forbbidenMenuTitle = strings('FORBIDDEN_MENU');

		return (
			<View>
				{this.renderMoreInfo(forbbidenMenuTitle, forbbidenMenu)}
				{this.renderMoreInfo(limitTitle, limitedMenu)}
			</View>
		);
	};

	renderInfo = (title, value, limitForRows) => {
		const numberOfLines = limitForRows ? 3 : 100;
		const alignContent = this.getAlignContent();
		const flexDirection = this.getFlexDirection();
		const textAlign = this.getTextAlign();

		if (value) {
			return (
				<View style={[{marginHorizontal: 8}, flexDirection, alignContent]}>
					<Text style={styles.titleInfoText}>{title}</Text>
					<Text> </Text>
					<Text style={[styles.valueInfoText, textAlign]} numberOfLines={numberOfLines}>
						{value}
					</Text>
				</View>
			);
		}
	};

	renderAllInfo = () => {
		const alignContent = this.getAlignContent();
		const flexDirection = this.getFlexDirection();
		const textAlign = this.getTextAlign();
		const allData = this.getMenuDescriptionByTypeAndLanauge(this.state.allData);

		console.log('This AllData', this.props.singleMethod);
		if (allData) {
			return (
				<View style={[alignContent, flexDirection, {marginHorizontal: 8}]}>
					{/* <Text style={styles.titleInfoText}>{title}</Text> */}
					<Text> </Text>
					<Text style={[styles.valueInfoText, textAlign]}>{allData}</Text>
				</View>
			);
		}
	};

	renderLoading = () => {
		return (
			<View style={styles.loadingContainer}>
				<Image source={loadingImage} style={{width: 200, height: 200}} />
			</View>
		);
	};

	renderContent = () => {
		const {dietPressed} = this.state;
		if (dietPressed) {
			return this.renderLoading();
		}

		return this.renderDiet();
	};

	isPressed = () => {
		this.setState({isPressed: !this.state.isPressed}, () =>
			console.log('getMenuDescriptionByTypeAndLanauge isPressed state')
		);
	};

	getDietDescriptionByLanauge = (decriptionDiet) => {
		const {userLanauge} = this.state;
		if (userLanauge === 'Hebrew' && decriptionDiet) {
			return decriptionDiet.heb;
		} else if (userLanauge === 'English' && decriptionDiet) {
			return decriptionDiet.eng;
		}
	};

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	getFlexDirection = () => {
		if (this.getRtl()) {
			return {flexDirection: 'row-reverse'};
		}

		return {flexDirection: 'row'};
	};

	renderDiet = () => {
		return (
			<View>
				{this.renderCardDetails()}
				{this.isBodyDroppedDown()}
			</View>
		);
	};

	renderCardDetails = () => {
		const {isPressed} = this.state;
		let dietDescription = this.props.singleMethod.dietDescription || this.props.singleMethod.decriptionDiet;
		const descriptionTitle = this.getDietDescriptionByLanauge(dietDescription);
		const subTitleText = strings('DIET_INFO_GEN');
		const flexDirection = this.getFlexDirection();
		const backgroundColorByPressed = isPressed ? {backgroundColor: LIGHT_GREEN} : {backgroundColor: 'white'};

		const textColorByPressed = isPressed ? {color: APP_TEXT_WHITE} : {color: APP_BLACK};
		const textAlign = this.getRtl()
			? {alignSelf: 'flex-end', alignContent: 'flex-end', textAlign: 'right'}
			: {alignSelf: 'flex-start', alignContent: 'flex-start', textAlign: 'left'};

		const iconNameByLanauage = this.getRtl() ? 'left' : 'right';
		const iconNameIfPressed = isPressed ? 'down' : iconNameByLanauage;
		const iconColor = {color: APP_BLACK};

		return (
			<TouchableOpacity onPress={this.isPressed} style={backgroundColorByPressed}>
				<View style={[{marginVertical: 5, marginHorizontal: 8, justifyContent: 'space-around'}, flexDirection]}>
					<View style={{flexDirection: 'column'}}>
						<View style={[textAlign]}>
							<Text style={[styles.textTitle, textColorByPressed, styles.maxWidthTitle, textAlign]}>
								{descriptionTitle}
							</Text>
						</View>
						<View>
							<Text style={[styles.subTitleText, textColorByPressed]}>{subTitleText}</Text>
						</View>
					</View>

					<TouchableOpacity onPress={this.isPressed} style={{marginVertical: 5}}>
						<Icon name={iconNameIfPressed} type='AntDesign' style={[{fontSize: 35}, iconColor]} />
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		return <View style={{marginVertical: 8}}>{this.renderContent()}</View>;
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
		fontWeight: 'bold',
	},
	maxWidthTitle: {
		maxWidth: 160,
	},
	subTitleText: {
		color: 'black',
		fontSize: 15,
		textAlign: 'right',
	},
	titleInfoText: {
		fontSize: 15,
		fontWeight: 'bold',
		textAlign: 'right',
	},
	valueInfoText: {
		fontSize: 15,
		maxWidth: 250,
	},
	selectButton: {
		width: 130,
		height: 35,
		borderRadius: 50 / 2,
	},
	iconView: {
		width: 120,
		height: 35,
		borderRadius: 50 / 2,
	},
	displayAllList: {
		width: 120,
		height: 30,
		justifyContent: 'center',
		borderRadius: 100 / 2,
	},
	dispalyAllView: {
		alignContent: 'flex-start',
		marginVertical: 12,
		alignItems: 'flex-start',
	},
	selectButtonView: {
		alignContent: 'center',
		alignSelf: 'center',
		marginVertical: 12,
		justifyContent: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
