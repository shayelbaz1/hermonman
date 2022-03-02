// Libraries
import React, {Component} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {APP_BUTTON_BACKGROUND, APP_TEXT_WHITE, APP_TEXT_COLOR} from '../../../assets/colors';
import DropDownText from '../../../components/common/DropDownText/DropDownText';
import {getImage} from '../../../img/images';
import {HERMONMAN} from '../../../utils/data/DietTypes';
import firebase from '../../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../../utils/lang/I18n';
import sceneManager from '../../sceneManager';

const loadingImage = getImage('loading');

export default class DietsRenderer extends Component {
	constructor() {
		super();
		this.state = {
			hermonManFoodChoice: [],
			methodID: '',
			dietsArray: [],
			parsedDietsArray: [],
			days: '',
			convertedDiets: [],
			dietsLoaded: false,
			errorWithLoadDiets: false,
			allFoodTypes: [],
		};
	}

	convertDietArrayByLanauge = (dietsArray) => {
		const {methodID} = this.props;
		let convertedDietByLanauge = [];
		dietsArray.map((dietInfo) => {
			console.log('dietInfo:::::::::::::::::::::::::', dietInfo);
			let dietObject = {
				methodType: dietInfo.methodType,
				dietType: dietInfo.dietType,
				title: dietInfo.dietId,
				decriptionDiet: dietInfo.dietDescription,
				days: dietInfo.days,
				dietId: dietInfo.dietId,
				methodID: methodID,
				menuDescription: dietInfo.menuDescription,
				text: dietInfo.text,
			};
			convertedDietByLanauge.push(dietObject);
		});
		return convertedDietByLanauge;
	};

	componentDidMount() {
		const {methodID} = this.props;
		// let foodChoice = this.props.hermonManFoodChoice;
		// this.setState({hermonManFoodChoice: foodChoice});
		// const foodTypes = firebase.getFoodTypes();
		firebase
			.getCurrentUser()
			.then((user) => {
				firebase
					.getRelevantDiets(methodID)
					.then((dietArray) => {
						if (this.props.foodTypes != null) {
							// This checks for null and undefined
							// If chose food types beforehand
							console.log('hmfc', this.props.foodTypes, this.props.hermonManFoodChoice);
							let hermonManFoodChoice;
							if (getStartDirection() === 'right') {
								hermonManFoodChoice = this.props.foodTypes.filter((foodType) =>
									this.props.hermonManFoodChoice.includes(foodType.heb)
								);
							} else {
								hermonManFoodChoice = this.props.foodTypes.filter((foodType) =>
									this.props.hermonManFoodChoice.includes(foodType.eng)
								);
							}
							const filteredDiets = this.filterDietsByFoodTypes(dietArray, hermonManFoodChoice);
							const convertedDiets = this.convertDietArrayByLanauge(filteredDiets);

							this.setState({
								convertedDiets,
								userLanauge: user.language,
								dietsLoaded: true,
								allFoodTypes: this.props.foodTypes,
								hermonManFoodChoice,
								errorWithLoadDiets: convertedDiets.length === 0 ? true : false,
							});
						} else {
							const convertedDiets = this.convertDietArrayByLanauge(dietArray);
							this.setState({
								convertedDiets,
								userLanauge: user.language,
								dietsLoaded: true,
								errorWithLoadDiets: convertedDiets.length === 0 ? true : false,
							});
						}
					})
					.catch((err) => {
						console.log('error with firebase.getRelevantDiets: ', err);
						this.setState({dietsLoaded: true, errorWithLoadDiets: true});
					});
			})
			.catch((err) => {
				console.log('There was a problem with DietsRenderer: ', err);
			});
	}

	includesByPercent(listToFilter, listToFindIn, percent) {
		// Returns true if listToFindIn includes at least params.percent percents of listToFilter, else returns false.
		let count = 0;
		listToFilter.forEach((item) => {
			if (listToFindIn.includes(item)) {
				count++;
			}
		});
		return (count / listToFilter.length) * 100 >= percent;
	}

	filterDietsByFoodTypes = (allDiets, selectedFoodTypes) => {
		const selectedIds = selectedFoodTypes.map((sft) => {
			return sft.id;
		});
		const filteredDiets = allDiets.filter((diet) => {
			return this.includesByPercent(diet.foodType, selectedIds, 1);
		});
		return filteredDiets;
	};

	renderDiets = () => {
		const {convertedDiets} = this.state;
		if (convertedDiets.length > 0) {
			return convertedDiets.map(this.renderSingleDiet);
		}
	};

	getLanauge = () => {
		const userLang = getStartDirection() === 'right' ? 'Hebrew' : 'English';
		return userLang;
	};

	renderSingleDiet = (singleMethod, index) => {
		const userLanauge = this.getLanauge();
		return (
			<View key={index}>
				<DropDownText
					singleMethod={singleMethod}
					methodType={singleMethod.methodType}
					dietId={singleMethod.dietId}
					decriptionDiet={singleMethod.decriptionDiet}
					userLanauge={userLanauge}
					title={singleMethod.title}
					days={singleMethod.days}
					methodID={singleMethod.methodID}
					dietType={singleMethod.dietType}
					menuDescription={singleMethod.menuDescription}
				/>
			</View>
		);
	};

	alignItemsByLanauge = () => {
		if (getStartDirection() === 'right') {
			return {justifyContent: 'center', alignSelf: 'flex-start'};
		}

		return {justifyContent: 'center', alignSelf: 'flex-end'};
	};

	goBack = () => {
		const {methodID} = this.props;
		if (methodID === HERMONMAN) {
			sceneManager.goToFoodChoose();
		} else {
			sceneManager.goToHomePageByUserStatus();
		}
	};

	renderLoading = () => {
		return (
			<View style={styles.loadingContainer}>
				<Image source={loadingImage} style={{width: 200, height: 200}} />
			</View>
		);
	};

	renderContent = (selectTitle) => {
		const {dietsLoaded, errorWithLoadDiets} = this.state;
		console.log(dietsLoaded, errorWithLoadDiets);
		if (dietsLoaded && !errorWithLoadDiets) {
			return (
				<View>
					<Text style={styles.titleStyle}>{selectTitle}</Text>
					{this.renderDiets()}
				</View>
			);
		} else if (errorWithLoadDiets && dietsLoaded) {
			console.log('no diets found');
			return (
				<View style={styles.noDietsContainer}>
					<Text style={styles.noDietsTitle}>{strings('NO_DIETS_FOUND')}</Text>
				</View>
			);
		}

		return this.renderLoading();
	};

	render() {
		const selectTitle = strings('SELECT_DIET') + ':';
		const backTitle = strings('BACK');
		const alignItems = this.alignItemsByLanauge();
		return (
			<View>
				<ScrollView style={{height: '90%'}}>{this.renderContent(selectTitle)}</ScrollView>
				<TouchableOpacity onPress={this.goBack} style={[styles.buttonView, alignItems]}>
					<Text style={styles.textStyle}>{backTitle}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = {
	titleStyle: {
		marginVertical: 20,
		color: 'black',
		fontSize: 20,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	buttonView: {
		width: 100,
		height: 30,
		borderRadius: 20,
		marginHorizontal: 10,
		backgroundColor: APP_BUTTON_BACKGROUND,
	},
	textStyle: {
		fontSize: 18,
		color: APP_TEXT_WHITE,
		textAlign: 'center',
		alignSelf: 'center',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noDietsTitle: {
		fontSize: 18,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	noDietsContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		color: APP_TEXT_COLOR,
		marginVertical: 20,
	},
};
