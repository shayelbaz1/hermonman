import React, {Component} from 'react';
import {Text, View} from 'react-native';
import firebase from '../../utils/firebase/Firebase';
import sceneManager from '../../scenes/sceneManager';
import SideMenuComponent from './SideMenuComponent';
import {strings} from '../../utils/lang/I18n';

export const black = 'black';

export default class SideMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPurchaseEnabled: false,
		};
	}

	componentDidMount() {
		firebase.checkPurchaseEnabled().then((isPurchaseEnabled) => {
			this.setState({isPurchaseEnabled});
		});
	}
	onPurchasePress = () => {
		sceneManager.goToPurchase();
	};

	onContactUsPress = () => {
		sceneManager.goBack();
		sceneManager.goToContactUs();
	};

	onWriteUsPress = () => {
		sceneManager.goBack();
		sceneManager.goToWriteUs();
	};

	onProfilePress = () => {
		sceneManager.goBack();
		sceneManager.goToProfile();
	};

	onHistoryPress = () => {
		sceneManager.goBack();
		sceneManager.goToHistory();
	};

	onStatisticsPress = () => {
		sceneManager.goBack();
		sceneManager.goToStatistics();
	};

	onSettingsPress = () => {
		sceneManager.goBack();
		sceneManager.goToSettings();
	};

	goToTerms = () => {
		sceneManager.goToTerms();
	};

	goToProducts = () => {
		sceneManager.goToProducts();
	};

	goToRegulations = () => {
		sceneManager.goToRegulations();
	};

	onHomePagePress = () => {
		firebase
			.getCurrentUser()
			.then((user) => {
				console.log('USER IS:::::::', user);
				if (user.status === '1') {
					sceneManager.goBack();
					sceneManager.goToHome(user);
				} else if (user.status === '0') {
					sceneManager.goBack();
					sceneManager.goToPurchase(user);
				} else {
					sceneManager.goBack();
					sceneManager.goToProgress(user);
				}
			})

			.catch((error) => {
				console.log('user not logged in to firebase', error);
				sceneManager.goToLogin();
			});
	};

	render() {
		const profile = strings('PROFILE');
		const home = strings('HOME');
		const writeUs = strings('WRITE_US');
		const statics = strings('STATISTIC');
		const settings = strings('LANG');
		const contactUs = strings('CONTACT_US');
		const purchase = strings('PURCHASE');
		const history = strings('HISTORY');
		const logout = strings('LOGOUT');
		const menu = strings('MENU');
		const terms = strings('TERMS');
		const products = strings('PRODUCTS');
		const regulations = strings('REGULATIONS');

		return (
			<View style={{marginTop: 50}}>
				<Text style={styles.headerStyle}>{menu}</Text>
				<SideMenuComponent title={home} icon={require('../../img/home.png')} onPress={this.onHomePagePress} />
				<SideMenuComponent title={profile} icon={require('../../img/avatar.png')} onPress={this.onProfilePress} />
				<SideMenuComponent title={writeUs} icon={require('../../img/writing.png')} onPress={this.onWriteUsPress} />
				<SideMenuComponent title={statics} icon={require('../../img/diagram.png')} onPress={this.onStatisticsPress} />
				<SideMenuComponent title={settings} icon={require('../../img/settings.png')} onPress={this.onSettingsPress} />
				<SideMenuComponent title={contactUs} icon={require('../../img/contact.png')} onPress={this.onContactUsPress} />
				{this.state.isPurchaseEnabled && (
					<SideMenuComponent
						title={purchase}
						icon={require('../../img/shopping-cart.png')}
						onPress={this.onPurchasePress}
					/>
				)}
				{this.state.isPurchaseEnabled && (
					<SideMenuComponent
						title={products}
						icon={'reorder'}
						iconType={'MaterialIcons'}
						displayIcon
						onPress={this.goToProducts.bind(this)}
					/>
				)}
				{this.state.isPurchaseEnabled && (
					<SideMenuComponent
						title={regulations}
						icon={'assignment'}
						iconType={'MaterialIcons'}
						displayIcon
						onPress={this.goToRegulations.bind(this)}
					/>
				)}
				<SideMenuComponent title={history} icon={require('../../img/history.png')} onPress={this.onHistoryPress} />
				<SideMenuComponent
					title={logout}
					icon={require('../../img/logout.png')}
					onPress={this.onLogoutPress.bind(this)}
				/>
				<SideMenuComponent
					title={terms}
					icon={'library-books'}
					iconType={'MaterialIcons'}
					displayIcon
					onPress={this.goToTerms.bind(this)}
				/>
			</View>
		);
	}

	onLogoutPress = () => {
		return firebase
			.logoutFromFirebase()
			.then(() => {
				sceneManager.goToLogin();
			})
			.catch((error) => {
				console.log('error in logout', error);
			});
	};
}

const styles = {
	headerStyle: {
		fontSize: 20,
		color: black,
		fontWeight: 'bold',
		textShadowColor: '#938b8a',
		textShadowOffset: {width: 0, height: 1},
		textAlignVertical: 'top',
		alignSelf: 'center',
		marginTop: -15,
		marginBottom: 25,
	},
};
