import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import BaseLightbox from './BaseLightbox';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import sceneManager from '../sceneManager';
import localized from '../../utils/lang/localized';
import firebase from '../../utils/firebase/Firebase';
import Language from '../../utils/lang/Language';
import DropDownText from '../../components/common/DropDownText/DropDownText';
import {strings} from '../../utils/lang/I18n';
import {APP_BUTTON_BACKGROUND} from '../../assets/colors';

export default class HermonManDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user,
			diet: this.props.diet,
			suggestedDiets: [],
			parsedDietsArray: [],
		};
	}

	componentWillMount() {
		firebase
			.getNeutralAndOtherDiets()
			.then((diets) => {
				this.setState({suggestedDiets: diets});
				console.log('1 validSelection diets:::::', diets);
				var temparray = diets;
				var tempParsedArray = [];
				for (let i = 0; i < temparray.length; i++) {
					var t = {
						title: Language.getDataByLanguage(temparray[i].dietDescription, this.state.user.language),
						decriptionDiet: temparray[i].dietDescription,
						menuDescription: temparray[i].menuDescription,
						body: Language.getDataByLanguage(temparray[i].text, this.state.user.language),
						methodID: Language.getDataByLanguage(temparray[i].dietDescription, this.state.user.language),
						dietType: temparray[i].dietType,
						days: temparray[i].days,
						dietId: temparray[i].dietId,
						methodType: temparray[i].methodType,
						text: temparray[i].text,
					};
					tempParsedArray.push(t);
				}
				console.log('2 validSelection tempParsedArray:::::', tempParsedArray);
				this.setState({parsedDietsArray: tempParsedArray});
			})
			.catch((err) => {
				console.log('There was error getting the suggested diets: ', err);
			});
	}

	renderDiets = () => {
		if (this.state.parsedDietsArray.length > 0) {
			console.log('ParsedDietArray: ', this.state.parsedDietsArray);
			return this.state.parsedDietsArray.map(this.renderSingleDiet);
		}
	};

	/*
    title: this.props.title,  
            menuDescription:this.props.menuDescription,
            methodID: this.props.methodID, 
            dietType: this.props.dietType, 
    */

	renderSingleDiet = (singleMethod, index) => {
		console.log('3 validSelection singel singleMethod:::::', singleMethod);
		return (
			<View key={index}>
				<DropDownText
					singleMethod={singleMethod}
					dietId={singleMethod.dietId}
					methodType={singleMethod.methodType}
					decriptionDiet={singleMethod.decriptionDiet}
					userLanauge={this.state.user.language}
					title={singleMethod.title}
					days={singleMethod.days}
					methodID={singleMethod.methodID}
					dietType={singleMethod.dietType}
					menuDescription={singleMethod.menuDescription}
				/>
			</View>
		);
	};

	onPress = () => {
		firebase.updateHermonManUserDiet(this.state.user, this.state.diet).then((resUser) => {
			console.log('The diet update was succesfull!!');
			sceneManager.goToProgress(resUser);
		});
	};

	render() {
		const buttonTitle = strings('CONTINUE_ANYWAY');
		const noteText = strings('PASS_BY_DIETS');
		return (
			<BaseLightbox verticalPercent={0.7} horizontalPercent={0.9}>
				<ScrollView style={{paddingTop: 20, paddingBottom: 50, height: '55%'}}>
					<Text style={styles.titleStyle}>{noteText}</Text>
					{this.renderDiets()}
				</ScrollView>
				<TouchableOpacity
					onPress={this.onPress}
					style={{
						backgroundColor: APP_BUTTON_BACKGROUND,
						width: 250,
						borderRadius: 25,
						alignSelf: 'center',
						marginVertical: 30,
					}}>
					<Text style={{color: 'white', fontSize: 16, alignSelf: 'center', textAlign: 'center'}}>{buttonTitle}</Text>
				</TouchableOpacity>
			</BaseLightbox>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
	},
	textHeader: {
		fontSize: 32,
		color: '#29a4dc',
		fontWeight: 'bold',
		textShadowColor: '#066793',
		textShadowOffset: {width: 0, height: 1},
		textAlignVertical: 'top',
	},
	contentContainer: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingVertical: 20,
		paddingHorizontal: 20,
	},
	labelStyle: {
		fontSize: 18,
		alignSelf: 'flex-end',
	},
	inputStyle: {
		height: 50,
		width: 300,
		borderColor: 'gray',
	},
	titleText: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		paddingBottom: 4,
	},
	titleStyle: {
		fontSize: 16,
		fontWeight: 'bold',
		alignSelf: 'center',
		color: APP_BUTTON_BACKGROUND,
	},
});
