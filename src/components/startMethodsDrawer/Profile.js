import React, {Component} from 'react';
import {Linking, BackHandler, Image, Text, View, Alert, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import firebase from '../../utils/firebase/Firebase';
import localStorage from '../../utils/localStorage/localStorage';
import sceneManager from '../../scenes/sceneManager';
import HermonManTextInput, {types} from '../../components/common/hermonManTextInput/HermonManTextInput';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import localized from '../../utils/lang/localized';
import {APP_BACKGROUND_CREAM_COLOR, APP_BLACK, APP_TEXT_COLOR, APP_GRAY_BACKGROUND} from '../../assets/colors';
import {strings, getStartDirection} from '../../utils/lang/I18n';
import HermonManModal from '../modals/HermonManModal';
import {Icon} from 'native-base';

const black = 'black';

export default class Profile extends Component {
	constructor() {
		super();
		this.state = {
			firstName: '',
			lastName: '',
			birthDate: '',
			gender: '',
			email: '',
			weight: '',
			height: '',
			isModalOpen: false,
			modalTitle: '',
			modalSubTitle: '',
			fieldToUpdate: '',
		};
		this.openModal.bind(this);
		this.closeModal.bind(this);
	}

	openModal = (title, subTitle, fieldToUpdate) => {
		this.setState({
			isModalOpen: true,
			fieldToUpdate,
			modalTitle: title,
			modalSubTitle: subTitle,
		});
	};

	closeModal = () => {
		this.setState({isModalOpen: false});
	};

	updateProfileFieldValue = (field) => {
		let fieldValue = this.state[field];
		if (field === 'height') {
			fieldValue = getStartDirection() === 'right' ? this.state[field] : this.state[field] * 2.54;
			if (getStartDirection() === 'left') {
				this.setState({[field]: fieldValue * 2.54});
			}
		}
		this.setState({[field]: fieldValue});
		console.log(field, fieldValue);
		firebase.getCurrentUser().then((user) => {
			if (field === 'height') {
				firebase.updateHermonManUserHeight(user, fieldValue).then((res) => {
					console.log(`The insert ${field} was completed succesfully!`, res);
					this.closeModal();
				});
			}
		});
	};

	renderModal = (fieldName) => {
		const selectButton = strings('SELECT');
		const label = strings(fieldName.toString().toUpperCase() || '');
		const hebrew = getStartDirection() === 'right' ? true : false;
		const labelDirection = hebrew ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
		const marginByPlatform = Platform.OS === 'ios' ? styles.marginHorizontalIphone : styles.marginHorizontal;
		return (
			<HermonManModal
				isOpen={this.state.isModalOpen}
				closeModal={this.closeModal}
				titleText={strings(`EDIT_${fieldName.toString().toUpperCase() || ''}_SUBJECT`)}
				height={{height: 340}}>
				<View style={styles.subTitleStyle}>
					<Text>{strings(`EDIT_${fieldName.toString().toUpperCase() || ''}_SUBTITLE`)}</Text>
				</View>
				<View style={{height: 140, marginTop: 20}}>
					{/* <Text style={[styles.textStyleForModal]}>{this.state.height}</Text> */}
					<HermonManTextInput
						type={types.number}
						labelStyle={[styles.labelStyle, labelDirection, marginByPlatform]}
						viewInputStyle={styles.textBox}
						placeholder={label}
						required
						labelTitle={label}
						required
						onChangeText={(text) =>
							this.setState({
								[fieldName]: text,
							})
						}
					/>
				</View>
				<TouchableOpacity
					style={[styles.buttonStyle, this.getUpdateButtonColorStyle()]}
					onPress={() => this.updateProfileFieldValue(fieldName)}>
					<Text style={styles.buttonsTextStyle}>{selectButton}</Text>
				</TouchableOpacity>
			</HermonManModal>
		);
	};

	getUpdateButtonColorStyle = () => {
		if (this.state.selectedOption) {
			return {backgroundColor: APP_BUTTON_BACKGROUND};
		}
		return {backgroundColor: 'gray'};
	};

	getLatesWeight = (dietArray) => {
		const lastElementArray = dietArray.length;
		return dietArray[lastElementArray - 1].weight;
	};

	componentDidMount() {
		firebase
			.getCurrentUser()
			.then((user) => {
				let birdthdateConvert = new Date(user.birthDate);
				this.setState({
					firstName: user.firstName,
					lastName: user.lastName,
					gender: user.gender,
					email: user.email,
					height: user.data.height,
					birthDate: birdthdateConvert,
				});
				return user;
			})
			.then((user) => {
				firebase.getWeightHistory(user).then((weightAndDateStringArray) => {
					const latestWeight = this.getLatesWeight(weightAndDateStringArray);
					this.setState({weight: latestWeight});
				});
			})

			.catch((error) => {
				console.log('There was a problem with getting the user to profile page; ', error);
			});
	}

	styleByLanaguage = () => {
		return this.getRtl()
			? {justifyContent: 'flex-end', flexDirection: 'row'}
			: {alignSelf: 'flex-start', flexDirection: 'row-reverse'};
	};

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	renderKeyAndValue(key, value, editable = false, cbOnPress = () => {}) {
		const valueStyle = Platform.OS === 'ios' ? styles.valueIphoneStyle : styles.valueStyle;
		const textAlign = this.getRtl() ? {textAlign: 'right'} : {textAlign: 'left'};
		if (editable) {
			const flexDirection = this.getRtl() ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'};
			return (
				<View style={[{paddingTop: 25}, this.styleByLanaguage]}>
					<View style={[{alignContent: 'center', justifyContent: 'flex-start'}, flexDirection]}>
						<Text style={[styles.keyStyle, textAlign]} onPress={() => cbOnPress()}>
							{key}{' '}
						</Text>
						<Icon name={'ios-create'} style={{fontSize: 24, margin: 2, color: '#555'}} onPress={() => cbOnPress()} />
					</View>
					<Text style={[valueStyle, textAlign]}>{value}</Text>
				</View>
			);
		} else {
			return (
				<View style={[{paddingTop: 25}, this.styleByLanaguage]}>
					<Text style={[styles.keyStyle, textAlign]} onPress={() => cbOnPress()}>
						{key}{' '}
					</Text>
					<Text style={[valueStyle, textAlign]}>{value}</Text>
				</View>
			);
		}
	}

	render() {
		const birthdateDay = this.state.birthDate !== '' ? this.state.birthDate.getDate() : '';
		const birthdateMonth = this.state.birthDate !== '' ? Number(this.state.birthDate.getMonth()) + 1 : '';
		const birthdateYear = this.state.birthDate !== '' ? this.state.birthDate.getFullYear() : '';
		const birthdateText = birthdateDay + '/' + birthdateMonth + '/' + birthdateYear;
		const {weight, email, gender, lastName, firstName, height} = this.state;

		const firstNameKey = strings('FIRST_NAME');
		const lastNameKey = strings('LAST_NAME');
		const emailKey = strings('EMAIL');
		const weightKey = strings('WEIGHT');
		const heightKey = strings('HEIGHT');
		const birthdayKey = strings('BIRTHDAY');
		const genderKey = strings('GENDER');

		return (
			<View style={styles.viewStyle}>
				<Text style={styles.headerStyle}>{strings('PROFILE')}</Text>
				<View style={{marginHorizontal: 16}}>
					{this.renderKeyAndValue(firstNameKey, firstName)}
					{this.renderKeyAndValue(lastNameKey, lastName)}
					{this.renderKeyAndValue(genderKey, gender)}
					{this.renderKeyAndValue(birthdayKey, birthdateText)}
					{this.renderKeyAndValue(emailKey, email)}
					{this.renderKeyAndValue(weightKey, this.getRtl() ? (weight / 1.0).toFixed(1) : (weight / 0.453).toFixed(1))}
					{this.renderKeyAndValue(
						heightKey,
						this.getRtl() ? (height / 1.0).toFixed(1) : (height / 2.54).toFixed(1),
						true,
						() => {
							this.openModal();
						}
					)}
				</View>
				{this.renderModal('height')}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	viewStyle: {
		height: '100%',
		backgroundColor: APP_BACKGROUND_CREAM_COLOR,
	},
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
		color: APP_TEXT_COLOR,
	},
	valueStyle: {
		fontSize: 18,
		fontWeight: '300',
		marginTop: 2,
	},
	valueIphoneStyle: {
		fontSize: 16,
		fontWeight: '300',
		marginHorizontal: 4,
		marginTop: 5,
	},
	subTitleStyle: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	optionItemStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 8,
		marginBottom: 8,
	},
	optionTextStyle: {
		fontSize: 20,
	},
	buttonStyle: {
		paddingVertical: 8,
		marginTop: 8,
		marginBottom: 8,
		marginHorizontal: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonsTextStyle: {
		color: 'white',
	},
	labelStyle: {
		marginTop: '2%',
		color: black,
		fontWeight: 'bold',
		margin: 5,
	},
	marginHorizontalIphone: {
		marginHorizontal: '4%',
	},
	marginHorizontal: {
		marginHorizontal: '8%',
	},
	textStyle: {
		alignSelf: 'center',
		color: black,
		fontSize: 15,
	},
	textStyleForModal: {
		alignSelf: 'flex-end',
		color: black,
		fontSize: 15,
		margin: '4%',
	},
	textBox: {
		borderColor: APP_GRAY_BACKGROUND,
		borderWidth: 2,
		width: 260,
		borderRadius: 200 / 2,
		backgroundColor: 'white',
	},
});
