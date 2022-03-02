// Libraries //

import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {Alert, BackHandler, View} from 'react-native';

// Components //
import CaloriePhaseOne from './CaloriePhaseOne';
import CaloriePhaseTwo from './CaloriePhaseTwo';
import Firebase from '../../../utils/firebase/Firebase';
import sceneManager from "../../sceneManager";

export default class CalorieMethod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPhase: 1,
            Phase1: {},
            Phase2: {},
            Phase3: {},
            user: this.props.user
        };
        BackHandler.addEventListener('hardwareBackPress', this.onBackPressed);
    }


    onBackPressed = () => {
        Actions.Home();
        return true;
    };

    renderByPhase = () => {
        if (this.state.currentPhase === 1) {
            return (
                <CaloriePhaseOne nextPhase1={this.stateOfPhase1}/>
            )
        } else if (this.state.currentPhase === 2) {
            return (
                <CaloriePhaseTwo nextPhase2={this.stateOfPhase2}/>
            )
        }
    };

    stateOfPhase1 = (stateOfPhase1) => {
        this.setState({
            Phase1: stateOfPhase1,
            currentPhase: 2
        });
    };

    stateOfPhase2 = (stateOfPhase2) => {
        this.setState({
            Phase2: stateOfPhase2,
            currentPhase: 3
        });
        const Diet = {name: 'Calorie Diet', data: stateOfPhase2};
        Firebase.updateHermonManUserDiet(this.state.user, Diet)
            .then(() => {
                let tempUser = this.state.user;
                tempUser.diet = Diet;
                Alert.alert('אישור', 'הדיאטה נשמרה בהצלחה!');
                sceneManager.goToProgress(tempUser);
            })

    };

    render() {
        return (
            <View>
                {this.renderByPhase()}
            </View>
        )
    }

}