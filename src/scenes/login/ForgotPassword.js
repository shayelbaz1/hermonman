import React, {Component} from 'react';
import {Alert, Text, View,StyleSheet} from 'react-native';

import firebase from '../../utils/firebase/Firebase';
import localized from '../../utils/lang/localized';
import sceneManager from '../sceneManager';

import HermonManTextInput from '../../components/common/hermonManTextInput/HermonManTextInput';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import { APP_TEXT_WHITE, APP_BUTTON_BACKGROUND, APP_BACKGROUND_CREAM_COLOR, APP_BLACK } from '../../assets/colors';
import { regexValidation } from '../../utils/RegexValidation';
import { strings, getStartDirection } from '../../utils/lang/I18n';

export default class ForgotPassword extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            emailError:''
        };
    }

    checkEmailValidation = () => {
        const {email} = this.state;
        const {emailCheck} = regexValidation;
        const emailNotValidError = strings("EMAIL_VALIDATION");

        if(email) {
            return checkValidation = emailCheck.test(String(email).toLowerCase())
        }else{
            this.setState({emailError:emailNotValidError})
        }
    }

    getTextAlign = () => {
        getStartDirection() === 'right' ? {textAlign:'right'} : {textAlign:'left'};
    }

    renderMailError = () => {
        const {emailError} = this.state;
        const textAlign = this.getTextAlign();

        if(emailError !== '') {
            return (
                <Text style={[textAlign,styles.requiredFiled]}>{emailError}</Text>
            )
        }
    }

    render() {
        const titleButton = strings('FORGOT_PASSWORD');

        return (
            <View style={{backgroundColor:APP_BACKGROUND_CREAM_COLOR,height:'100%'}}>
                <View>
                    <Text style={{marginTop:40, fontSize: 30, alignSelf: 'center', color: APP_BLACK}}>
                        {titleButton}
                    </Text>

                    <View style={{marginTop:20,marginHorizontal:16}}>
                        <HermonManTextInput onChangeText={text => this.setState({email: text,emailError:''})}
                                            placeholder={localized.forgotPassword.emailPlaceHolder}/>
                       {this.renderMailError()}
                    </View>

                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' ,marginTop:30}}>
                        <HermonManButton onPress={this.onSendPasswordResetEmail.bind(this)}
                            buttonStyle={{ width: 250, height: 40, borderRadius: 100 / 2 }}
                            textColor={APP_TEXT_WHITE}
                            backgroundColor={APP_BUTTON_BACKGROUND}
                            text={localized.forgotPassword.forgotPasswordButton} />
                </View>

            </View>
        );
    }

    onSendPasswordResetEmail() {
        const {email} = this.state;
        const emailValidation = this.checkEmailValidation();
        const forgotPasswordSentMessage = strings('FORGOT_PASSWORD_MAIL_SENT');
        const emailNotValidError = strings("EMAIL_VALIDATION");

        if(emailValidation) {
            firebase.sendPasswordResetEmail(email)
                .then(() => {
                    Alert.alert(localized.Alerts.forgotPasswordAlertTitle, forgotPasswordSentMessage);
                    return sceneManager.goToLogin();
                })
                .catch(error => {
                    console.log('error in sending reset email', error);
                    Alert.alert(localized.Alerts.forgotPasswordAlertTitle, localized.Alerts.forgotPasswordNotSent);
                });
            }else{
                this.setState({emailError:emailNotValidError})
            }
        }
}

const styles = StyleSheet.create({
    requiredFiled:{
        color:'red',
        fontSize:14,
        marginHorizontal:4
    }
})