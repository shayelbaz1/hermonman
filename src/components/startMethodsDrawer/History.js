import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';
import {APP_BACKGROUND_CREAM_COLOR, APP_BLACK} from '../../assets/colors';
import firebase from '../../utils/firebase/Firebase';
import {strings} from '../../utils/lang/I18n';
import HistoryDropDown from './HistoryDropDown';

export default class History extends Component {
	constructor() {
		super();
		this.state = {
			diets: [],
			user: '',
			indexToDecrease: 0,
		};
	}

	componentWillMount() {
		firebase
			.getCurrentUser()
			.then((user) => {
				firebase.getHistoryDiets(user).then((diets) => {
					this.setState({diets: diets, user: user});
					console.log('The diet history is: ', diets);
				});
			})
			.catch((err) => {
				console.log('There was an error getting the user diets: ', err);
			});
	}

	renderHistoryDiet = (historyDiet, dietIndex) => {
		const {user} = this.state;
		return <HistoryDropDown dietIndex={dietIndex + this.state.indexToDecrease} user={user} historyDiet={historyDiet} />;
	};

	keyExtractor = (item, index) => item.dietId.toString();

	render() {
		const {diets} = this.state;
		const historyTitle = strings('HISTORY');
		return (
			<View style={styles.containerStyle}>
				<Text style={styles.headerStyle}>{historyTitle}</Text>

				<View style={{marginVertical: 5, height: '90%'}}>
					<FlatList
						data={diets}
						renderItem={({item, index}) => this.renderHistoryDiet(item, index)}
						keyExtractor={this.keyExtractor}
					/>
				</View>
			</View>
		);
	}
}

const styles = {
	textForgotPassword: {
		textDecorationLine: 'underline',
		alignSelf: 'flex-end',
		color: 'red',
		marginBottom: 20,
		fontSize: 18,
	},
	youCanAlso: {
		alignSelf: 'center',
		marginTop: 16,
		marginBottom: 10,
		fontSize: 15,
		color: 'red',
	},
	dontHaveUserContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 20,
	},
	bottomText: {
		marginTop: 5,
		color: 'red',
	},
	bottomLink: {
		color: 'blue',
		textDecorationLine: 'underline',
		padding: 3,
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'flex-start',
		backgroundColor: APP_BACKGROUND_CREAM_COLOR,
	},
	headerStyle: {
		fontSize: 20,
		color: APP_BLACK,
		fontWeight: 'bold',
		textAlignVertical: 'top',
		alignSelf: 'center',
		paddingTop: 20,
	},
	keyStyle: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	valueStyle: {
		fontSize: 18,
		fontWeight: '300',
	},
};
