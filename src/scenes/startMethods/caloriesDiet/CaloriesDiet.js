import React, {Component} from 'react';
import {Alert, Text, View, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import firebase from '../../../utils/firebase/Firebase';
import {
	APP_BACKGROUND_CREAM_COLOR,
	HEADER_COLOR,
	APP_BLACK,
	APP_BACKGROUND_WHITE,
	APP_TEXT_WHITE,
	APP_BUTTON_BACKGROUND,
} from '../../../assets/colors';
import {strings, getStartDirection} from '../../../utils/lang/I18n';
import Language from '../../../utils/lang/Language';
import {getImage} from '../../../img/images';
import FoodCalorieRow from './FoodCalorieRow';
import sceneManager from '../../sceneManager';
import {CALORIES, CALORIES_MATINATIN} from '../../../utils/data/DietTypes';
import moment from 'moment';
import HermonManButton from '../../../components/common/hermonManButton/HermonManButton';

const loadingImage = getImage('loading');
const MINUS = 'minus';
const PLUS = 'plus';

export default class CaloriesDiet extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			foodCollection: '',
			caloriesForUser: '',
			calcCaloriesByProducts: 0,
			caloriesLoaded: false,
			foodTypesLoaded: false,
			errorWithLoadFoodType: false,
			menuSelected: [],
		};
	}

	getLatesWeight = (dietArray) => {
		const lastElementArray = dietArray.length;
		return dietArray[lastElementArray - 1].weight;
	};

	//not in use
	setCalcCaloriesByProducts = (value, calcType, foodObject) => {
		const {calcCaloriesByProducts} = this.state;
		let calcCaloriesByProductsNewValue = 0;

		if (calcType === MINUS && calcCaloriesByProducts > value) {
			calcCaloriesByProductsNewValue = calcCaloriesByProducts - value;
		} else if (calcType === PLUS) {
			calcCaloriesByProductsNewValue = calcCaloriesByProducts + value;
		}

		this.setMenuArray(foodObject);

		console.log('5. calcCaloriesByProducts calcCaloriesByProductsNewValue:::::', calcCaloriesByProductsNewValue);

		this.setState({calcCaloriesByProducts: calcCaloriesByProductsNewValue}, () =>
			console.log('calcCaloriesByProducts state::::::', calcCaloriesByProducts)
		);
	};

	convertToFoodCollectionArrayByLangauge = (foodCollection, userLang) => {
		let convertedFoodList = [];
		foodCollection.map((foodObject) => {
			var foodNameByLanauage = Language.getDataByLanguage(foodObject, userLang);
			var foodObjectToPush = {foodName: foodNameByLanauage, calories: foodObject.calories, id: foodObject.id};
			convertedFoodList.push(foodObjectToPush);
		});

		return convertedFoodList;
	};

	componentWillMount() {
		firebase.getCurrentUser().then((user) => {
			firebase
				.getFoodTypes()
				.then((foodCollection) => {
					const collectionConverted = this.convertToFoodCollectionArrayByLangauge(foodCollection, user.language);
					this.setState({foodCollection: collectionConverted, foodTypesLoaded: true});
					return user;
				})
				.then((user) => {
					firebase.getWeightHistory(user).then((weightAndDateStringArray) => {
						const latestWeight = this.getLatesWeight(weightAndDateStringArray);
						const gender = user.gender;
						const caloriesForUser = this.calaculateMaxCaloriesForUser(gender, latestWeight);
						this.setState({caloriesForUser, caloriesLoaded: true});
					});
				})
				.catch((err) => {
					console.log('error with get food type', err);
					this.setState({foodTypesLoaded: true, errorWithLoadFoodType: true});
				});
		});
	}

	//for male - weight * 24
	//for female - weight * 24 * 0.9
	// and then decrease 1000 calories.
	// if after decrease is under then 900, the min will be 900 caloris.
	// else, will remain the same.
	calaculateMaxCaloriesForUser = (gender, weight) => {
		const {maintainType} = this.props;
		const multipleNumber = 24;
		const multipleNumberForWomen = 0.9;
		const decressCalories = 1000;
		const minCaloriesForUser = 900;

		let maxCaloriesForUser = 0;
		let maxCaloriesBeforeDecrese = 0;

		if (gender === strings('MALE') && weight > 0) {
			maxCaloriesBeforeDecrese = multipleNumber * weight;
		} else if (gender === strings('FEMALE') && weight > 0) {
			maxCaloriesBeforeDecrese = multipleNumber * weight * multipleNumberForWomen;
		}

		if (maintainType === CALORIES_MATINATIN) {
			maxCaloriesForUser = maxCaloriesBeforeDecrese;
		} else {
			maxCaloriesForUser = maxCaloriesBeforeDecrese - decressCalories;
		}

		return maxCaloriesForUser > 900 ? maxCaloriesForUser : minCaloriesForUser;
	};

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	getFlexDiretction = () => {
		return this.getRtl() ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'};
	};

	renderRow = (foodObject, index) => {
		const flexDirection = this.getFlexDiretction();

		return (
			<FoodCalorieRow
				setCalcCaloriesByProducts={this.setMenuArray}
				flexDirection={flexDirection}
				index={index}
				foodObject={foodObject}
			/>
		);
	};

	renderColumn = () => {
		const prodCol = strings('PRODUCT');
		const unitCol = strings('UNIT');
		const caloriesCol = strings('CALORIES_FOR_100_GRAM');
		const quntCol = strings('QUNT_SELECTED');
		const caloriesQuntCol = strings('CALORIES_FOR_QUNT_SELECTED');
		const flexDirection = this.getFlexDiretction();

		return (
			<View
				style={[
					flexDirection,
					{
						backgroundColor: HEADER_COLOR,
						marginHorizontal: 5,
						marginTop: 10,
						borderColor: APP_BACKGROUND_WHITE,
						borderWidth: 2,
					},
				]}>
				<View style={[styles.viewCol, {width: '20%'}]}>
					<Text style={styles.colText}>{prodCol}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '12%'}]}>
					<Text style={styles.colText}>{unitCol}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '15%'}]}>
					<Text style={styles.colText}>{caloriesCol}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '20%'}]}>
					<Text style={styles.colText}>{quntCol}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '15%'}]}>
					<Text style={styles.colText}>{caloriesQuntCol}</Text>
				</View>
			</View>
		);
	};

	renderLoading = () => {
		return (
			<View style={styles.loadingContainer}>
				<Image source={loadingImage} style={{width: 200, height: 200}} />
			</View>
		);
	};

	renderNoFoodType = () => {
		const errorMsg = strings('NO_FOOD_TYPE');
		return (
			<View style={{justifyContent: 'center', alignSelf: 'center'}}>
				<Text style={{color: APP_BLACK, fontSize: 18, textAlign: 'center'}}>{errorMsg}</Text>
			</View>
		);
	};

	checkIfFoodExistInArray = (objectToFind) => {
		const {menuSelected} = this.state;
		var found = -1;
		if (menuSelected.length > 0) {
			found = menuSelected.findIndex((foodType) => {
				return foodType.prodId === objectToFind.prodId;
			});
		}

		return found;
	};

	setMenuArray = (foodObjectToAdd) => {
		const {menuSelected} = this.state;
		const foodIndexExist = this.checkIfFoodExistInArray(foodObjectToAdd);
		const foodExist = foodIndexExist === -1 ? false : true;
		if (foodExist) {
			menuSelected[foodIndexExist].countProd = foodObjectToAdd.countProd;
			menuSelected[foodIndexExist].countCaloriesForProd = foodObjectToAdd.countCaloriesForProd;
		} else {
			menuSelected.push(foodObjectToAdd);
		}

		this.setState({menuSelected}, () => {
			this.calcProductsCalories();
		});
	};

	calcProductsCalories = () => {
		const {menuSelected} = this.state;
		var totalCalories = 0;
		menuSelected.map((foodObject) => {
			return (totalCalories += foodObject.countCaloriesForProd);
		});
		this.setState({calcCaloriesByProducts: totalCalories});
	};

	keyExtractor = (item, index) => item.id.toString();

	renderFoodCollationTable = () => {
		let {foodCollection} = this.state;
		foodCollection = foodCollection.sort((a, b) => {
			return a.foodName.toLowerCase().localeCompare(b.foodName.toLowerCase());
		});

		return (
			<FlatList
				data={foodCollection}
				renderItem={({item, index}) => this.renderRow(item, index)}
				keyExtractor={this.keyExtractor}
			/>
		);
	};

	renderContent = () => {
		const {foodTypesLoaded, errorWithLoadFoodType} = this.state;
		if (foodTypesLoaded && errorWithLoadFoodType) {
			return this.renderNoFoodType();
		} else if (!foodTypesLoaded) {
			return this.renderLoading();
		}

		return this.renderFoodCollationTable();
	};

	checkCaloriesForUserValid = () => {
		const {calcCaloriesByProducts, caloriesForUser} = this.state;
		if (calcCaloriesByProducts > caloriesForUser) {
			return false;
		}

		return true;
	};

	updateDiet(user, diet) {
		firebase.updateHermonManUserDiet(user, diet).then((resUser) => {
			sceneManager.goToProgress(resUser);
		});
	}

	convertMenuSelected = () => {
		const {menuSelected} = this.state;
		const convertedMenu = menuSelected.filter((foodObject) => {
			return foodObject.countProd > 0 && foodObject.countCaloriesForProd > 0;
		});
		this.selectDiet(convertedMenu);
	};

	selectDiet = (menuSelected) => {
		const {maintainType} = this.props;
		let dietIDValue = '';
		let methodTypeValue = '';
		if (maintainType === CALORIES_MATINATIN) {
			dietIDValue = CALORIES_MATINATIN;
			methodTypeValue = CALORIES_MATINATIN;
		} else {
			dietIDValue = CALORIES;
			methodTypeValue = CALORIES;
		}

		const dietTypeValue = 'other';

		firebase
			.getCurrentUser()
			.then((user) => {
				var currentDate = moment().format('DD/MM/YYYY');
				var diet = {
					dietId: dietIDValue,
					dietType: dietTypeValue,
					methodType: methodTypeValue,
					date: currentDate.toString(),
					menu: menuSelected,
				};
				firebase.getLastDiet(user).then((diets) => {
					if (diets.length === 0) {
						this.updateDiet(user, diet);
					}
					const lastDiet = diets[diets.length - 1];
					if (
						lastDiet.methodType == 'hermonman' &&
						lastDiet.dietType == 'protein' &&
						diet.methodType == 'hermonman' &&
						diet.dietType == 'carbohydrate'
					) {
						sceneManager.goToHermonManDialog(user, diet);
					} else if (
						lastDiet.methodType == 'hermonman' &&
						lastDiet.dietType == 'carbohydrate' &&
						diet.methodType == 'hermonman' &&
						diet.dietType == 'protein'
					) {
						sceneManager.goToHermonManDialog(user, diet);
					} else {
						this.updateDiet(user, diet);
					}
				});
			})
			.catch((err) => {
				console.log('There was an error with getting the user: ', err);
			});
	};

	//change the sceneManager
	onPressSave = () => {
		const {menuSelected} = this.state;
		const noteTitle = strings('NOTE');
		const errorTitle = strings('ERROR_TITLE');
		const messageError = strings('MUCH_MORE_CALORIES');
		const alertButtonForValidation = [
			{text: strings('OK'), onPress: () => this.convertMenuSelected()},
			{text: strings('BACK_TO_MENU')},
		];
		const noSelectionError = strings('ERROR_FOOD_SELECTION');

		const caloriesValidation = this.checkCaloriesForUserValid();
		if (!caloriesValidation) {
			Alert.alert(noteTitle, messageError, alertButtonForValidation);
		} else if (menuSelected.length > 0 && caloriesValidation) {
			this.convertMenuSelected();
		} else {
			Alert.alert(errorTitle, noSelectionError);
		}
	};

	getBackgroundColor = () => {
		const caloriesValidation = this.checkCaloriesForUserValid();
		if (!caloriesValidation) {
			return {backgroundColor: 'red'};
		}

		return {backgroundColor: HEADER_COLOR};
	};

	renderMaxCalories = () => {
		const {caloriesForUser, caloriesLoaded, calcCaloriesByProducts} = this.state;
		const maxCaloriesForYou = strings('MAX_CALORIES_FOR_USER');
		const calcCalories = strings('CALC_CALORIES');
		const backgroundColorForCalcCalories = this.getBackgroundColor();

		if (caloriesLoaded) {
			return (
				<View style={{marginVertical: 20, alignSelf: 'center', justifyContent: 'center'}}>
					<View style={{borderRadius: 50, width: 310, maxHeight: 50, backgroundColor: HEADER_COLOR}}>
						<Text
							numberOfLines={2}
							style={{fontSize: 18, textAlign: 'center', color: APP_TEXT_WHITE, fontWeight: 'bold', maxWidth: 280}}>
							{maxCaloriesForYou + caloriesForUser.toString()}
						</Text>
					</View>
					<View style={[{borderRadius: 50, width: 310, maxHeight: 50, marginTop: 10}, backgroundColorForCalcCalories]}>
						<Text
							numberOfLines={2}
							style={{fontSize: 18, textAlign: 'center', color: APP_TEXT_WHITE, fontWeight: 'bold'}}>
							{calcCalories + calcCaloriesByProducts.toString()}
						</Text>
					</View>
				</View>
			);
		}
	};

	render() {
		const saveText = strings('SAVE');
		return (
			<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%', width: '100%'}}>
				<View style={{height: '20%'}}>{this.renderMaxCalories()}</View>
				<View style={{height: '11%'}}>{this.renderColumn()}</View>
				<View style={{marginBottom: 10, height: '50%'}}>{this.renderContent()}</View>

				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 10,
						height: '10%',
						flexDirection: getStartDirection() === 'right' ? 'row' : 'row-reverse',
					}}>
					<HermonManButton
						onPress={this.onPressSave}
						buttonStyle={{height: 40, borderRadius: 50, width: 150, justifyContent: 'center'}}
						backgroundColor={APP_BUTTON_BACKGROUND}
						textColor={APP_TEXT_WHITE}
						text={saveText}
					/>
					<HermonManButton
						onPress={() => sceneManager.goBack()}
						buttonStyle={{width: 150, height: 40, borderRadius: 100 / 2}}
						backgroundColor={APP_BUTTON_BACKGROUND}
						textColor={APP_TEXT_WHITE}
						text={strings('BACK')}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	border: {
		width: 1,
		height: 50,
		borderWidth: 1,
		borderColor: APP_BACKGROUND_WHITE,
		marginHorizontal: '2%',
	},
	viewCol: {
		justifyContent: 'center',
	},
	colText: {
		textAlign: 'center',
		alignSelf: 'center',
		color: APP_TEXT_WHITE,
		fontWeight: 'bold',
	},
	loadingContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
