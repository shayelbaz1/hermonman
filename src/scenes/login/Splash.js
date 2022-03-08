import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {APP_BACKGROUND_WHITE} from '../../assets/colors';
import {getImage} from '../../img/images';
import firebase from '../../utils/firebase/Firebase';
console.log("\x1b[33m ~ file: Splash.js ~ line 6 ~ firebase", firebase)
import sceneManager from '../sceneManager';
import moment from 'moment/moment';

const hermonManLogo = getImage('hermonmanLogo');

export default class RedirectByUserStatus extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		firebase.subscribeToTopic('app');
        console.log("\x1b[33m ~ file: Splash.js ~ line 18 ~ componentDidMount ~ firebase", firebase)

		console.log('sceneManager RedirectByUserStatus::::::::::');
		firebase
			.getCurrentUser()
			.then((user) => {
				const {expireDate} = user;
				const expireDateConverted = expireDate ? this.convertDateStringToDate(expireDate) : undefined;
				const today = moment(new Date());
				console.log('sceneManager USER IS:::::::', user);
				if (user.status === '0' || expireDateConverted.isBefore(today)) {
					sceneManager.goToPurchase(user);
				} else if (user.status === '1') {
					console.log('sceneManager.goToHome::::::::::');
					sceneManager.goToHome(user);
					// sceneManager.goToProfile(user)
					// sceneManager.goToLogin(user);
                    console.log("\x1b[33m ~ file: Splash.js ~ line 35 ~ .then ~ user", user)
				} else {
					console.log('sceneManager.goToProgress::::::::::');
					sceneManager.goToProgress(user);
				}
			})

			.catch((error) => {
                console.log("\x1b[33m ~ file: Splash.js ~ line 41 ~ componentDidMount ~ error ~ user not logged in to firebase:", error)
				sceneManager.goToLogin();
			});
	}

	convertDateStringToDate = (dateString) => {
		const parts = dateString.split('/');
		const convertStringToDate = moment([parts[2], parts[1] - 1, parts[0]]);

		return convertStringToDate;
	};

	render() {
		return (
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flex: 1,
					backgroundColor: APP_BACKGROUND_WHITE,
				}}>
				<Image source={hermonManLogo} style={styles.imageStyle} />
			</View>
		);
	}
}

const styles = {
	containerStyle: {
		flex: 1,
		justifyContent: 'center',
	},
	imageStyle: {
		marginBottom: '25%',
		resizeMode: 'contain',
		alignSelf: 'center',
		width: '50%',
		height: '50%',
	},
};
