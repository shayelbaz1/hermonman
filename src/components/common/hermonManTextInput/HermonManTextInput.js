import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, Platform} from 'react-native';
import styles from './styles';
import {getStartDirection} from '../../../utils/lang/I18n';

export default class HermonManTextInput extends Component {
	constructor(props) {
		super(props);
		const {placeholder, type, onChangeText, onSubmitEditing} = this.props;
		this.state = {
			onSubmitEditing: onSubmitEditing,
			placeholder: placeholder,
			onChangeText: onChangeText,
			showAsPassword: false,
			autoCorrect: true,
			keyBoardType: 'default',
		};

		if (type) {
			switch (type) {
				case types.password:
					this.state.showAsPassword = true;
					this.state.autoCorrect = false;
					break;
				case types.email:
					this.state.keyBoardType = 'email-address';
					this.state.showAsPassword = false;
					this.state.autoCorrect = false;
					break;
				case types.number:
					this.state.keyBoardType = 'numeric';
					this.state.showAsPassword = false;
					this.state.autoCorrect = false;
					break;
			}
		}
	}

	renderContent = () => {
		if (this.props.labelTitle) {
			return this.renderLabelAndTextInput();
		}

		return this.renderTextInput();
	};

	renderTextInput = () => {
		console.log('renderTextInput');
		const hebrew = getStartDirection() === 'right' ? true : false;
		const textAlign = hebrew
			? {
					alignSelf: 'flex-end',
					textAlign: 'right',
					...Platform.select({
						ios: {
							marginVertical: '4%',
						},
						android: {},
					}),
			  }
			: {
					alignSelf: 'flex-start',
					textAlign: 'left',
					...Platform.select({
						ios: {
							marginVertical: '4%',
						},
						android: {marginTop: 6},
					}),
			  };
		return (
			<View style={[styles.view, this.props.viewInputStyle]}>
				<TextInput
					style={[styles.textInput, this.props.textInputStyle, textAlign]}
					placeholder={this.state.placeholder}
					onChangeText={this.state.onChangeText}
					autoCorrect={this.state.autoCorrect}
					ref={(ref) => (this.ref = ref)}
					maxLength={this.props.maxLength}
					keyboardType={this.state.keyBoardType}
					multiline={this.props.multiline}
					selectTextOnFocus={this.props.selectTextOnFocus}
					secureTextEntry={this.state.showAsPassword}
					underlineColorAndroid='transparent'
					value={this.props.textValue}
					onSubmitEditing={this.state.onSubmitEditing}
					returnKeyType='done'
				/>
			</View>
		);
	};

	renderLabelAndTextInput = () => {
		const {required} = this.props;
		const requiredField = required ? ' * ' : ' ';
		return (
			<View>
				<Text style={this.props.labelStyle}>{requiredField + this.props.labelTitle}</Text>
				{this.renderTextInput()}
			</View>
		);
	};

	render() {
		return this.renderContent();
	}

	renderRequired() {
		if (!this.props.required) {
			return null;
		} else {
			return (
				<View style={styles.requiredView}>
					<Text style={{color: 'gray', alignSelf: 'center'}}>*</Text>
				</View>
			);
		}
	}
}

export const types = {
	password: 'password',
	email: 'email',
	number: 'number',
};
