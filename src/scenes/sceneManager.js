import {Actions} from 'react-native-router-flux';

class sceneManager {
	// General

	goBack() {
		Actions.pop();
	}

	popReturn() {
		return Actions.pop();
	}

	refresh(key) {
		Actions.refresh({key: Math.random()});
	}

	// Login / Registration Screens

	goToLogin() {
		Actions.Login();
	}

	goToFoodChoiseHermon() {
		Actions.ChooseFoodType();
	}

	goToHome(user) {
		Actions.Home({user});
	}

	goToRegistration() {
		Actions.Registration();
	}

	goToForgotPassword() {
		Actions.ForgotPassword();
	}

	goToTerms() {
		Actions.Terms();
	}

	goToProducts() {
		Actions.Products();
	}

	goToRegulations() {
		Actions.Regulations();
	}

	/////////////////
	//Purchase///////
	/////////////////

	goToPurchase(user) {
		Actions.Purchase({user});
	}

	goToAppExplantion(user) {
		Actions.AppExplantion({user});
	}

	goToTerms() {
		Actions.TermsOfUse();
	}

	goToPayment(sum) {
		console.log('sum');

		Actions.Payment({sum});
	}

	/////////////////
	//Common/////////
	/////////////////

	goToInsertWeight(method) {
		Actions.InsertWeight({method});
	}

	goToDietsRenderer(hermonManFoodChoice, methodID, foodTypes) {
		Actions.DietsRenderer({hermonManFoodChoice, methodID, foodTypes});
	}

	goToCaloriesDiet(maintainType) {
		Actions.CaloriesDietRender({maintainType});
	}

	/////////////////
	//Start Methods//
	/////////////////

	// Calorie Method

	goToCalorieMethod(user) {
		Actions.CalorieMethod({user});
	}

	goToFoodChoice(foodList, selectedFood, foodSelector) {
		Actions.FoodChoice({foodList, selectedFood, foodSelector});
	}

	// Hermon-Man Method

	goToFoodChoose() {
		Actions.ChooseFoodType();
	}

	goToHermonManDialog(user, diet) {
		Actions.HermonManDialog({user, diet});
	}

	goToHomePageByUserStatus() {
		Actions.RedirectByUserStatus();
	}

	/////////////////
	//Progress///////
	/////////////////

	goToProgress(user) {
		Actions.Progress({user});
	}

	/////////////////
	//Side Bar///////
	/////////////////

	goToContactUs() {
		Actions.ContactUs();
	}

	goToWriteUs() {
		Actions.WriteUs();
	}

	goToProfile() {
		Actions.Profile();
	}

	goToHistory() {
		Actions.History();
	}

	goToStatistics() {
		Actions.Statistics();
	}

	goToSettings() {
		Actions.Settings();
	}

	goToInsertWeightDialog() {
		Actions.InsertWeightDialog();
	}
}

export default new sceneManager();
