import {Icon, Label} from 'native-base';
import React, {Component} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BUTTON_BACKGROUND,
	APP_GRAY_BACKGROUND,
	APP_TEXT_WHITE,
} from '../../assets/colors';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import SubjectModal from '../../components/modals/modal/SubjectModal';
import firebase from '../../utils/firebase/Firebase';
import {getStartDirection, strings} from '../../utils/lang/I18n';

class WriteUs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subject: '',
			content: '',
			userId: '',
			subjectModalOpen: false,
		};
	}

	componentDidMount() {
		firebase
			.getCurrentUser()
			.then((user) => {
				if (user) {
					const userId = user._id;
					this.setState({userId, user});
				}
			})
			.catch((err) => {
				console.log('error while getCurrentUser', err);
			});
	}

	openSubjectModal = () => {
		this.setState({subjectModalOpen: true});
	};

	closeSubjectModal = () => {
		this.setState({subjectModalOpen: false});
	};

	onSubjectSelected = (subjectObject) => {
		this.setState({subject: subjectObject}, () => this.closeSubjectModal());
	};

	renderSubjectModal = () => {
		return (
			<SubjectModal
				isOpen={this.state.subjectModalOpen}
				closeModal={this.closeSubjectModal}
				setOption={this.onSubjectSelected}
				selectedOption={this.state.subject}
			/>
		);
	};

	renderSubject = () => {
		const text =
			(this.state.subject || this.state.subject !== '') && this.state.subject.name !== ''
				? this.state.subject.name
				: strings('SELECT');
		const labelText = strings('SUBJECT');
		const direction = this.getHebrew()
			? {alignSelf: 'flex-end', textAlign: 'right'}
			: {alignSelf: 'flex-start', textAlign: 'left'};
		const flexDirection = this.getHebrew() ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'};
		const marginHorizontalByLang = this.getHebrew() ? {marginHorizontal: '15%'} : {marginHorizontal: '10%'};
		return (
			<View>
				<View>
					<Text style={[direction, styles.labelSubjectStyle]}>{labelText}</Text>
				</View>
				<TouchableOpacity
					onPress={this.openSubjectModal}
					style={[styles.textBox, styles.textBoxBorder, marginHorizontalByLang]}>
					<View style={[flexDirection, {justifyContent: 'space-between'}]}>
						<Icon name={'ios-arrow-down'} style={{fontSize: 20, margin: '4%'}} />
						<Text style={styles.textStyleForModal}>{text}</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	getHebrew = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	renderContent = () => {
		const {content} = this.state;
		const text = this.state.content !== '' ? this.state.content : strings('TYPE');
		const textLabel = strings('CONTENT_MESSAGE');
		const direction = this.getHebrew() ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'};
		const textAlign = this.getHebrew() ? 'right' : 'left';
		return (
			<View style={[direction, {width: '100%'}]}>
				<Label style={[direction, styles.labelStyle]}>{textLabel}</Label>
				<View
					style={[
						{backgroundColor: APP_TEXT_WHITE, height: '65%', width: '95%', borderRadius: 25, APP_GRAY_BACKGROUND},
						direction,
					]}>
					<View>
						<TextInput
							underlineColorAndroid='transparent'
							placeholder={text}
							onChangeText={(text) => this.setState({content: text})}
							multiline={true}
							style={[{textAlign}, {width: '100%'}]}
							// numberOfLines={10}
							value={content}
						/>
					</View>
				</View>
			</View>
		);
	};

	validation = () => {
		const alertTitle = strings('ALERT_TITLE');
		const noSubjectError = strings('NO_SUBJECT_ERROR');
		const noContentError = strings('NO_CONTENT_ERROR');

		if (this.state.subject === '') {
			Alert.alert(alertTitle, noSubjectError);
			return false;
		}
		if (this.state.content === '') {
			Alert.alert(alertTitle, noContentError);
			return false;
		}
		return true;
	};

	onPressSend = () => {
		const {userId} = this.state;
		const doneTitle = strings('DONE_SUCCES');
		const errorTitle = strings('ERROR_TITLE');

		const successMessage = strings('MESSAGE_SUCCES');
		const errorMessage = strings('MESSAGE_ERROR');
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!

		let yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		today = dd + '/' + mm + '/' + yyyy;
		if (this.validation()) {
			let message = {
				subject: this.state.subject.key,
				content: this.state.content,
				email: this.state.user.email,
				date: today,
				read: false,
			};
			firebase
				.writeNewMessageToDB(userId, message)
				.then(() => {
					const {user} = this.state;
					Alert.alert(doneTitle, successMessage);
				})
				.catch(() => {
					Alert.alert(errorTitle, errorMessage);
				});
		}
	};

	render() {
		const textHeader = strings('WRITE_US');
		const sendText = strings('SEND');
		return (
			<View style={styles.viewStyle}>
				<ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
					<View style={{height: '5%'}}>
						<Text style={styles.headerText}>{textHeader}</Text>
					</View>

					<View style={{marginVertical: 15}}>
						<View style={{height: '70%'}}>
							{this.renderSubject()}

							<View style={{marginVertical: 8, marginHorizontal: '10%'}}>{this.renderContent()}</View>
						</View>

						<TouchableOpacity onPress={this.onPressSend} style={styles.selectButtonView}>
							<HermonManButton
								buttonStyle={styles.buttonStyle}
								text={sendText}
								enabled={false}
								textColor={APP_TEXT_WHITE}
								textStyle={styles.textInButton}
								backgroundColor={APP_BUTTON_BACKGROUND}
							/>
						</TouchableOpacity>
					</View>
				</ScrollView>

				{this.renderSubjectModal()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	viewStyle: {
		backgroundColor: APP_BACKGROUND_CREAM_COLOR,
		height: '100%',
	},
	labelStyle: {
		fontSize: 18,
		color: 'black',
		paddingVertical: 5,
	},
	labelSubjectStyle: {
		fontSize: 18,
		color: 'black',
		paddingHorizontal: '10%',
		paddingVertical: 5,
	},
	inputStyle: {
		width: 300,
		borderColor: 'gray',
	},
	titleText: {
		fontSize: 18,
		fontWeight: 'bold',
		alignSelf: 'center',
		paddingBottom: 4,
	},
	headerText: {
		fontWeight: 'bold',
		fontSize: 18,
		color: 'black',
		textAlign: 'center',
		marginTop: 20,
	},
	buttonStyle: {
		width: 200,
		height: 50,
		borderRadius: 50 / 2,
	},
	selectButtonView: {
		alignContent: 'center',
		marginVertical: 20,
		alignItems: 'center',
	},
	textBox: {
		borderColor: APP_GRAY_BACKGROUND,
		borderWidth: 2,
		width: '75%',
		backgroundColor: 'white',
	},
	textBoxBorder: {
		height: 50,
		borderRadius: 200 / 2,
	},
	contentTextBox: {
		height: 280,
		borderRadius: 35,
	},
	textStyleForModal: {
		alignSelf: 'flex-end',
		color: 'black',
		fontSize: 15,
		margin: '4%',
	},
	textInButton: {
		fontSize: 22,
	},
});
export default WriteUs;
