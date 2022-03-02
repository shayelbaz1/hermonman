// Libraries

import React, {Component} from 'react';
import {Alert, Image, Text, View} from 'react-native';
import CheckBox from 'react-native-checkbox';
import {APP_BACKGROUND_CREAM_COLOR, APP_BLACK, APP_BUTTON_BACKGROUND, APP_TEXT_WHITE} from '../../../assets/colors';
import HermonManButton from '../../../components/common/hermonManButton/HermonManButton';
import MultipleSelections from '../../../components/common/multipleSelections/MultipleSelections';
import SearchBox from '../../../components/common/SearchBox/SearchBox';
import {getImage} from '../../../img/images';
import firebase from '../../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../../utils/lang/I18n';
import Language from '../../../utils/lang/Language';
import sceneManager from '../../sceneManager';

// Components
const loadingImage = getImage('loading');

export default class ChooseFoodType extends Component {
	constructor() {
		super();
		this.state = {
			foodType: [],
			chosenFoodType: [],
			originalFoodType: [],
			searchQuery: '',
			foodTypesLoaded: false,
			errorWithLoadFoodType: false,
		};
		this.foodType = [];
	}

	componentWillMount() {
		console.log('2. methodID ChooseFoodType:::::::');
		firebase.getCurrentUser().then((user) => {
			firebase
				.getFoodTypesHermon()
				.then((foodTypes) => {
					this.setState({originalFoodType: foodTypes});
					this.foodType = foodTypes;
					const newArr = [];
					for (let i = 0; i < this.foodType.length; i++) {
						var method = Language.getDataByLanguage(this.foodType[i], user.language);
						newArr.push(method);
					}
					console.log('the new arr is :', newArr);
					this.setState({foodType: newArr, foodTypesLoaded: true});
				})
				.catch((err) => {
					console.log('error with get food type', err);
					this.setState({foodTypesLoaded: true, errorWithLoadFoodType: true});
				});
		});
	}

	renderFoodTypes = () => {
		if (this.state.foodType.length > 0) {
			return this.state.foodType.map(this.renderSingleFood);
		}
	};

	renderSingleFood = (singleFood, index) => {
		return (
			<View key={index}>
				<CheckBox
					value={this.state.validation}
					onChange={() =>
						this.setState((prevState) => {
							console.log('prev state: ', prevState);
							return {validation: !prevState.validation};
						})
					}
					label={singleFood}
				/>
			</View>
		);
	};

	validateFoodSelection = () => {
		if (this.state.chosenFoodType.length > 0) {
			return true;
		}
		return false;
	};

	onSelectionsChange = (chosenFoodType) => {
		console.log('chosenFoodType recived: ', chosenFoodType);
		this.setState({chosenFoodType}, () => console.log('chosenFoodType state: ', this.state.chosenFoodType));
	};

	onPress = () => {
		const alertBadTitle = strings('ALERT_TITLE_BAD');
		const noFoodType = strings('NO_FOOD_SELECTED');
		if (this.validateFoodSelection()) {
			var goToDietsRenderer = [];
			var index;
			for (index = 0; index < this.state.chosenFoodType.length; index++) {
				goToDietsRenderer.push(this.state.chosenFoodType[index].item);
			}

			sceneManager.goToDietsRenderer(goToDietsRenderer, 'hermonman', this.foodType);
		} else {
			Alert.alert(alertBadTitle, noFoodType);
		}
	};

	searchQueryChanged = (newQuery) => {
		this.setState({searchQuery: newQuery});
	};

	filterFoodTypes = () => {
		const {searchQuery, foodType} = this.state;
		const filteredFoodType = foodType
			.filter((foodName) => foodName.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort();
		return filteredFoodType;
	};

	addFoodType = (option) => {
		this.setState({chosenFoodType: [...this.state.chosenFoodType, option]});
	};

	removeFoodType = (option) => {
		let filteredFoodTypes = [...this.state.chosenFoodType];
		const index = filteredFoodTypes.findIndex((item) => item.item === option.item);
		filteredFoodTypes.splice(index, 1);

		if (index !== -1) {
			this.setState({chosenFoodType: filteredFoodTypes});
		}
	};

	renderFoodTypesContent = () => {
		const textAlign =
			getStartDirection() === 'right'
				? {alignSelf: 'flex-end', textAlign: 'right'}
				: {alignSelf: 'flex-start', textAlign: 'left'};
		return (
			<View>
				<View style={{height: '75%'}}>
					<View style={{marginTop: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
						<SearchBox
							placeholder={strings('SEARCH')}
							searchQueryChangedHandler={this.searchQueryChanged}
							textAlign={textAlign}
						/>
					</View>

					<View style={{marginTop: '5%'}}>
						<MultipleSelections
							options={this.filterFoodTypes()}
							onSelectionsChange={this.onSelectionsChange}
							chosen={this.state.chosenFoodType}
							addFoodType={this.addFoodType}
							removeFoodType={this.removeFoodType}
						/>
					</View>
				</View>

				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 10,
						height: '20%',
						marginTop: '5%',
						flexDirection: getStartDirection() === 'right' ? 'row' : 'row-reverse',
					}}>
					<HermonManButton
						onPress={this.onPress}
						buttonStyle={{width: 150, height: 40, borderRadius: 100 / 2}}
						backgroundColor={APP_BUTTON_BACKGROUND}
						textColor={APP_TEXT_WHITE}
						text={strings('CONTINUE')}
					/>
					<View style={{width: 10}} />
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

	renderContent = () => {
		const {foodTypesLoaded, errorWithLoadFoodType} = this.state;
		if (foodTypesLoaded) {
			return this.renderFoodTypesContent();
		} else if (errorWithLoadFoodType && foodTypesLoaded) {
			return this.renderNoFoodType();
		}

		return this.renderLoading();
	};

	render() {
		return (
			<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%'}}>
				<View style={{marginHorizontal: 10, marginTop: 5}}>
					<Text style={styles.titleStyle}>{strings('SELECT_TYPE_FOOD') + ':'}</Text>
				</View>

				{this.renderContent()}
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
	contentContainer: {
		paddingVertical: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
};
