// Libraries //

import React, {Component} from 'react';
import {View} from 'react-native';
import localized from '../../../utils/lang/localized';
import HermonManTextInput from '../../../components/common/hermonManTextInput/HermonManTextInput';
import HermonManButton from '../../../components/common/hermonManButton/HermonManButton';

// Components //


export default class CaloriePhaseOne extends Component {
    constructor() {
        super();
        this.state = {
            weight: '',
            date: 'december 2 kapara'
        }
    }

    render() {
        return (
            <View>
                <View style={{marginTop: 30}}>
                    <HermonManTextInput onChangeText={text => this.setState({weight: text})}
                                        placeholder={localized.calorieMethod.weight}
                                        viewInputStyle={{width: 250, alignSelf: 'center'}}/>
                    <HermonManButton text={localized.calorieMethod.continue}
                                     onPress={this.onPressNextPhase}
                                     buttonStyle={{width: 250, marginTop: 50, alignSelf: 'center'}}/>
                </View>
            </View>

        );
    }

    onPressNextPhase = () => {
        const moveToParent = {
            weight: this.state.weight,
            date: this.state.date
        };

        console.log("this. state ::: ", this.state);
        if (this.props.nextPhase1) {
            this.props.nextPhase1(moveToParent)
        }
    };

}
const styles = {
    imageStyle: {
        width: '100%',
        height: 75,
        resizeMode: 'stretch',
        marginTop: -10,
        alignSelf: 'flex-start',
        // backgroundColor: 'yellow'
    },
    containerStyle: {
        padding: -20
    },
    iStyle: {
        height: 20,
        width: 20
    },
    buttonStyle: {
        width: 275,
        marginVertical: 10,
        alignSelf: 'center'
    },
    textInputStyle: {
        width: 120,
        paddingHorizontal: 5,
        alignSelf: 'center',
        marginLeft: 10
    }
};