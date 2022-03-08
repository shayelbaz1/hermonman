import {Actions} from 'react-native-router-flux';
import { NavigationContext } from '@react-navigation/native';
import React from 'react';
// import { useNavigation } from "@react-navigation/native";

export default sceneManager = (props) => {
	const navigation = props
	// const getNavigation = () => {
	// 	return React.useContext(NavigationContext);
	// }
	const goToForgotPassword = () => {
		// Actions.ForgotPassword();
		navigation.navigate('ForgotPassword')
	}
}
// class sceneManager {
// 	// General

// 	getNavigation(){
// 		return React.useContext(NavigationContext);
// 	}
	
// 	goBack() {
// 		Actions.pop();
// 	}

// 	popReturn() {
// 		return Actions.pop();
// 	}

// 	refresh(key) {
// 		Actions.refresh({key: Math.random()});
// 	}

// 	// Login / Registration Screens

// 	goToLogin() {
// 		// Actions.Login();
// 		this.getNavigation().navigate('Login')
// 	}

// 	goToFoodChoiseHermon() {
// 		// Actions.ChooseFoodType();
// 		this.getNavigation().navigate('ChooseFoodType')
// 	}

// 	goToHome(user) {
// 		// Actions.Home({user});
// 		this.getNavigation().navigate('Home',{user})

// 	}

// 	goToRegisterScreen() {
// 		// Actions.RegisterScreen();
// 		this.getNavigation().navigate('RegisterScreen')
// 	}

// 	goToForgotPassword() {
// 		// Actions.ForgotPassword();
// 		this.getNavigation().navigate('ForgotPassword')
// 	}

// 	goToTerms() {
// 		// Actions.Terms();
// 		this.getNavigation().navigate('Terms')
// 	}

// 	goToProducts() {
// 		// Actions.Products();
// 		this.getNavigation().navigate('Products')
// 	}

// 	goToRegulations() {
// 		// Actions.Regulations();
// 		this.getNavigation().navigate('Regulations')
// 	}

// 	/////////////////
// 	//Purchase///////
// 	/////////////////

// 	goToPurchase(user) {
// 		// Actions.Purchase({user});
// 		this.getNavigation().navigate('Purchase',{user})
// 	}

// 	goToAppExplantion(user) {
// 		// Actions.AppExplantion({user});
// 		this.getNavigation().navigate('AppExplantion',{user})
// 	}

// 	goToTerms() {
// 		// Actions.TermsOfUse();
// 		this.getNavigation().navigate('TermsOfUse')
// 	}

// 	goToPayment(sum) {
// 		console.log('sum');

// 		// Actions.Payment({sum});
// 		this.getNavigation().navigate('Payment',{sum})
// 	}

// 	/////////////////
// 	//Common/////////
// 	/////////////////

// 	goToInsertWeight(method) {
// 		// Actions.InsertWeight({method});
// 		this.getNavigation().navigate('InsertWeight',{method})
// 	}

// 	goToDietsRenderer(hermonManFoodChoice, methodID, foodTypes) {
// 		// Actions.DietsRenderer({hermonManFoodChoice, methodID, foodTypes});
// 		this.getNavigation().navigate('DietsRenderer',{hermonManFoodChoice, methodID, foodTypes})
// 	}

// 	goToCaloriesDiet(maintainType) {
// 		// Actions.CaloriesDietRender({maintainType});
// 		this.getNavigation().navigate('CaloriesDietRender',{maintainType})
// 	}

// 	/////////////////
// 	//Start Methods//
// 	/////////////////

// 	// Calorie Method

// 	goToCalorieMethod(user) {
// 		// Actions.CalorieMethod({user});
// 		this.getNavigation().navigate('CalorieMethod',{user})
// 	}

// 	goToFoodChoice(foodList, selectedFood, foodSelector) {
// 		// Actions.FoodChoice({foodList, selectedFood, foodSelector});
// 		this.getNavigation().navigate('FoodChoice',{foodList, selectedFood, foodSelector})
// 	}

// 	// Hermon-Man Method

// 	goToFoodChoose() {
// 		// Actions.ChooseFoodType();
// 		this.getNavigation().navigate('ChooseFoodType')
// 	}

// 	goToHermonManDialog(user, diet) {
// 		// Actions.HermonManDialog({user, diet});
// 		this.getNavigation().navigate('HermonManDialog',{user, diet})
// 	}

// 	goToHomePageByUserStatus() {
// 		// Actions.RedirectByUserStatus();
// 		this.getNavigation().navigate('RedirectByUserStatus')
// 	}

// 	/////////////////
// 	//Progress///////
// 	/////////////////

// 	goToProgress(user) {
// 		// Actions.Progress({user});
// 		this.getNavigation().navigate('Progress',{user})
// 	}

// 	/////////////////
// 	//Side Bar///////
// 	/////////////////

// 	goToContactUs() {
// 		// Actions.ContactUs();
// 		this.getNavigation().navigate('ContactUs')
// 	}

// 	goToWriteUs() {
// 		// Actions.WriteUs();
// 		this.getNavigation().navigate('WriteUs')
// 	}

// 	goToProfile() {
// 		// Actions.Profile();
// 		this.getNavigation().navigate('Profile')
// 	}

// 	goToHistory() {
// 		// Actions.History();
// 		this.getNavigation().navigate('History')
// 	}

// 	goToStatistics() {
// 		// // Actions.Statistics();
// 		this.getNavigation().navigate('Statistics')
// 	}

// 	goToSettings() {
// 		// // Actions.Settings();
// 		this.getNavigation().navigate('Settings')
// 	}

// 	goToInsertWeightDialog() {
// 		// // Actions.InsertWeightDialog();
// 		this.getNavigation().navigate('InsertWeightDialog')
// 	}
// }

// export default new sceneManager();
