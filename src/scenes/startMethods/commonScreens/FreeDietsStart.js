// Libraries

import React, {Component} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {APP_BUTTON_BACKGROUND, APP_TEXT_WHITE} from '../../../assets/colors';
import DropDownText from '../../../components/common/DropDownText/DropDownText';
import {getImage} from '../../../img/images';
import {HERMONMAN} from '../../../utils/data/DietTypes';
import firebase from '../../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../../utils/lang/I18n';

const loadingImage = getImage('loading');

export default class FreeDietsStart extends Component {
	constructor() {
		super();
		this.state = {
			methodID: '',
			days: '',
			userLanauge: '',
			convertedDiets: [],
			dietsLoaded: false,
		};
	}

	convertDietArrayByLanauge = (dietsArray) => {
		let convertedDietByLanauge = [];
		dietsArray.map((dietInfo) => {
			let dietObject = {
				methodType: dietInfo.methodType,
				text: dietInfo.text,
				dietType: dietInfo.dietType,
				title: dietInfo.dietId,
				dietDescription: dietInfo.dietDescription,
				days: dietInfo.days,
				dietId: dietInfo.dietId,
				methodID: HERMONMAN,
				menuDescription: dietInfo.menuDescription,
			};
			convertedDietByLanauge.push(dietObject);
		});
		return convertedDietByLanauge;
	};

	componentWillMount() {
		firebase
			.getCurrentUser()
			.then((user) => {
				const lang = user.language;
				console.log('convertedDiets user.language::::', lang);
				firebase
					.getFreeStaticDiets()
					.then((freeDiets) => {
						const freeDietsConverted = this.convertDietArrayByLanauge(freeDiets);
						this.setState({convertedDiets: freeDietsConverted, dietsLoaded: true, userLanauge: lang}, () =>
							console.log('convertedDiets::::::', this.state.convertedDiets)
						);
					})
					.catch((err) => {
						console.log('There was a problem with getFreeStaticDiets: ', err);
						this.setState({dietsLoaded: true});
					});
			})
			.catch((err) => {
				console.log('There was a problem with getCurrentUser: ', err);
			});
	}

	renderDiets = () => {
		const {convertedDiets} = this.state;
		console.log('renderDiets convertedDiets:::::::::', convertedDiets);
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
		console.log('0000 dietPressed singleMethod:::::', singleMethod);
		return (
			<View key={index}>
				<DropDownText
					singleMethod={singleMethod}
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

	renderLoading = () => {
		return (
			<View style={styles.loadingContainer}>
				<Image source={loadingImage} style={{width: 200, height: 200}} />
			</View>
		);
	};

	renderContent = () => {
		const {dietsLoaded} = this.state;
		if (dietsLoaded) {
			return this.renderDiets();
		}

		return this.renderLoading();
	};

	render() {
		const selectTitle = strings('SELECT_DIET_OF_THREE') + ':';
		return (
			<View>
				<ScrollView style={{height: '90%'}}>
					<Text style={styles.titleStyle}>{selectTitle}</Text>
					{this.renderContent()}
				</ScrollView>
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
};
