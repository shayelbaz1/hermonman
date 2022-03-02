// Libraries Import //

import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Drawer, Lightbox, Modal, Overlay, Router, Scene, Stack} from 'react-native-router-flux';
import {APP_TEXT_COLOR} from './assets/colors';
import History from './components/startMethodsDrawer/History';
import MenuIcon from './components/startMethodsDrawer/MenuIcon';
import Profile from './components/startMethodsDrawer/Profile';
import StartMethodsDrawer from './components/startMethodsDrawer/StartMethodsDrawer';
import Statistics from './components/startMethodsDrawer/Statistics';
import TermsOfUser from './components/startMethodsDrawer/TermsOfUse';
import AppExplantion from './scenes/afterRegister/AppExplantion';
import ContactUs from './scenes/dialogs/ContactUs';
import FoodChoice from './scenes/dialogs/FoodChoice';
import HermonManDialog from './scenes/dialogs/HermonManDialog';
import InsertWeightDialog from './scenes/dialogs/InsertWeightDialog';
import Settings from './scenes/dialogs/Settings';
import TermsDialog from './scenes/dialogs/TermsDialog';
import WriteUs from './scenes/dialogs/WriteUs';
import HermonHeader from './scenes/hermonHeader/HermonHeader';
import Home from './scenes/homeScreens/Home';
import ForgotPassword from './scenes/login/ForgotPassword';
import Login from './scenes/login/Login';
import Registration from './scenes/login/Registration';
import RedirectByUserStatus from './scenes/login/Splash';
import Progress from './scenes/progress/Progress';
import Purchase from './scenes/purchase/Purchase';
import CalorieMethod from './scenes/startMethods/calorieMethod/CalorieMethod';
import CaloriesDiet from './scenes/startMethods/caloriesDiet/CaloriesDiet';
import DietsRenderer from './scenes/startMethods/commonScreens/DietsRenderer';
import InsertWeight from './scenes/startMethods/commonScreens/InsertWeight';
import ChooseFoodType from './scenes/startMethods/hermonManMethod/ChooseFoodType';
import Payment from './scenes/purchase/Payment';
import {initLocale, strings} from './utils/lang/I18n';
import localized from './utils/lang/localized';
import Products from './scenes/products/Products';
import Regulations from './scenes/purchase/Regulations';
// Components Import //

// Drawers Import //

// Dialogs Import //

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};

		//disable text scaling
		Text.defaultProps = Text.defaultProps || {};
		Text.defaultProps.allowFontScaling = false;
	}

	componentWillMount() {
		initLocale().then(() => {
			this.setState({loading: false});
		});
	}

	renderHermonImage = () => {
		return (
			<View style={{alignSelf: 'center'}}>
				<HermonHeader />
			</View>
		);
	};

	sceneProps = () => {
		let renderTitle = this.renderHermonImage();

		return {
			renderTitle,
		};
	};

	renderSplah() {
		return <RedirectByUserStatus />;
	}

	renderRouter() {
		const hermonmanTitle = strings('HERMONMAN_TITLE');
		return (
			<Router key='router'>
				<Overlay key='overlay'>
					<Modal hideNavBar key='modal'>
						<Lightbox key='lightbox'>
							<Stack key='root' navigationBarStyle={{backgroundColor: 'white'}}>
								<Scene key='RedirectByUserStatus' component={RedirectByUserStatus} hideNavBar />
								<Scene key='Login' component={Login} hideNavBar />
								<Scene key='Registration' component={Registration} {...this.sceneProps()} />
								<Scene key='ForgotPassword' component={ForgotPassword} />
								<Drawer
									key='StartMethodsDrawer'
									title={localized.home.title}
									drawerPosition='right'
									drawerWidth={250}
									contentComponent={StartMethodsDrawer}
									drawerIcon={<MenuIcon />}
									hideNavBar>
									<Scene key='Home' component={Home} {...this.sceneProps()} />
									<Scene key='CalorieMethod' component={CalorieMethod} />
									<Scene key='Purchase' component={Purchase} {...this.sceneProps()} />
									<Scene key='Profile' component={Profile} {...this.sceneProps()} />
									<Scene key='Statistics' component={Statistics} {...this.sceneProps()} />
									<Scene key='History' component={History} {...this.sceneProps()} />
									<Scene key='InsertWeight' component={InsertWeight} {...this.sceneProps()} />
									<Scene key='DietsRenderer' component={DietsRenderer} {...this.sceneProps()} />
									<Scene key='ChooseFoodType' component={ChooseFoodType} {...this.sceneProps()} />
									<Scene key='FoodChoice' component={FoodChoice} {...this.sceneProps()} />
									<Scene key='Progress' component={Progress} {...this.sceneProps()} />
									<Scene key='Settings' component={Settings} {...this.sceneProps()} />
									<Scene key='AppExplantion' component={AppExplantion} {...this.sceneProps()} />
									<Scene key='TermsOfUse' component={TermsOfUser} {...this.sceneProps()} />
									<Scene key='CaloriesDietRender' component={CaloriesDiet} {...this.sceneProps()} />
									<Scene key='ContactUs' component={ContactUs} {...this.sceneProps()} />
									<Scene key='WriteUs' component={WriteUs} {...this.sceneProps()} />
									<Scene key='Payment' component={Payment} {...this.sceneProps()} />
									<Scene key='Products' component={Products} {...this.sceneProps()} />
									<Scene key='Regulations' component={Regulations} {...this.sceneProps()} />
								</Drawer>
								<Scene key='Terms' component={TermsDialog} />
								<Scene key='HermonManDialog' component={HermonManDialog} />
								<Scene key='InsertWeightDialog' component={InsertWeightDialog} />
							</Stack>
						</Lightbox>
					</Modal>
				</Overlay>
			</Router>
		);
	}

	render() {
		if (this.state.loading) {
			return this.renderSplah();
		}

		return this.renderRouter();
	}
}

const styles = StyleSheet.create({
	logoStyle: {
		width: 350,
		height: 100,
		flex: 2,
		justifyContent: 'center',
		resizeMode: 'contain',
	},
	titleStyle: {
		color: APP_TEXT_COLOR,
		fontSize: 22,
		fontWeight: 'bold',
		paddingLeft: '15%',
		textAlign: 'center',
		alignSelf: 'center',
	},
	image: {
		width: '100%',
		height: '100%',
		alignSelf: 'center',
	},
});
