import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import BaseLightbox from './BaseLightbox';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import sceneManager from '../sceneManager';
import localized from '../../utils/lang/localized';


export default class FoodChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userSelectedFood: this.props.userSelectedFood,
            foodList: this.props.foodList,
            selectedFood: this.props.selectedFood,
        };

    }


    render() {
        return (
            <BaseLightbox verticalPercent={0.7} horizontalPercent={0.9}>
                <View>
                    <View>

                    </View>
                    <View style={{marginTop: -100}}>
                        <HermonManButton text={localized.calorieMethod.approve}
                                         onPress={this.onPressNextPhase}
                                         buttonStyle={{width: 250, alignSelf: 'center'}}/>
                    </View>
                </View>
            </BaseLightbox>
        )
    }

    onPressNextPhase = () => {
        const allFoodSelect = this.state.selectedFood;
        this.props.foodSelector(allFoodSelect);
        sceneManager.goBack();
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 32,
        color: '#29a4dc',
        fontWeight: 'bold',
        textShadowColor: '#066793',
        textShadowOffset: {width: 0, height: 1},
        textAlignVertical: 'top'
    },
    contentContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    labelStyle: {
        fontSize: 18,
        alignSelf: 'flex-end'
    },
    inputStyle: {
        height: 50,
        width: 300,
        borderColor: 'gray',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingBottom: 4
    }
});