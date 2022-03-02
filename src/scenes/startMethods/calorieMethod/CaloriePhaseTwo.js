// Libraries //.

import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, Alert} from 'react-native';

// Components //

import sceneManager from '../../sceneManager';
import HermonManButton from '../../../components/common/hermonManButton/HermonManButton';

// Data //

import {foodList, allFood} from '../../../utils/data/foodList';
import localized from "../../../utils/lang/localized";

export default class CaloriePhaseTwo extends Component {
    constructor() {
        super();
        this.state = {
            userSelectedFood: []
        };
        this.minusAmount.bind(this);
        this.plusAmount.bind(this);
    }

    componentWillMount() {
        // this.setState({foodList: foodList});
        let tempArr = allFood;
        let Arr = [];
        let Obj = {};
        for (let i = 0; i < tempArr.length; i++) {
            Obj = {
                id: tempArr[i].id,
                name: tempArr[i].name,
                calories: tempArr[i].calories,
                amount: 0,
                isSelected: false
            };
            Arr.push(Obj);
        }
        console.log('arr is::::::: ', Arr);
        this.setState({userSelectedFood: Arr});
        console.log('ALL FOOD', allFood);
        // console.log('OBJ', foodList);
    }

    goToFood = () => {
        // console.log('the array is: ', this.state.userSelectedFood);
        let foodList = {};
        let selectedFood = [];

        for (let i = 0; i < this.state.userSelectedFood.length; i++) {
            if (this.state.userSelectedFood[i].isSelected) {
                selectedFood.push(this.state.userSelectedFood[i].name)
            }
            foodList[i] = this.state.userSelectedFood[i].name;
        }
        console.log('foodList: ', foodList);
        console.log('selectedFood: ', selectedFood);
        sceneManager.goToFoodChoice(foodList, selectedFood, this.foodSelector);
    };

    foodSelector = (selectedFood) => {
        // this.setState({selectedFood: selectedFood});
        let tempArr = this.state.userSelectedFood;
        for (let i = 0; i < tempArr.length; i++) {
            let isChosen = false;
            for (let j = 0; j < selectedFood.length; j++) {
                if (selectedFood[j] === tempArr[i].name) {
                    isChosen = true;
                    tempArr[i].isSelected = true;
                }
            }
            if (!isChosen) {
                tempArr[i].isSelected = false;
                tempArr[i].amount = 0;
            }
        }
        this.setState({userSelectedFood: tempArr});
    };

    renderFoodChoices = () => {
        if (this.state.userSelectedFood.length > 0) {
            return this.state.userSelectedFood.map(this.renderSingleFood);
        }
    };

    minusAmount=(index)=>{
        let Arr = this.state.userSelectedFood;
        if(Arr[index].amount > 0){
            Arr[index].amount = Arr[index].amount - 1;
        }
        this.setState({userSelectedFood: Arr});
    };

    plusAmount=(index)=>{
        let Arr = this.state.userSelectedFood;
            Arr[index].amount = Arr[index].amount + 1;
        this.setState({userSelectedFood: Arr})
    };

    renderSingleFood = (singleFood, index) => {
        if (singleFood.isSelected) {
            return (
                <View key={index} style={{paddingTop: 5, flexDirection: 'row'}}>
                    <Text style={{marginHorizontal: 20}}> {singleFood.amount}</Text>
                    <TouchableOpacity onPress={() => this.minusAmount(index)}>
                        <Image style={styles.imageStyle} source={require('../../../img/minus.jpg')}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.plusAmount(index)}>
                        <Image style={styles.imageStyle} source={require('../../../img/plus.png')}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, paddingRight:3}}>
                        <Text>{singleFood.name}</Text>
                        <Text style={{color:'red'}}>,            קלוריות:  </Text>
                        <Text style={{color: 'red'}}>{singleFood.calories}</Text>
                    </Text>
                </View>
            )
        }
        // return (
        //     <View key={index}>
        //         <Text style={{paddingTop: 5, fontSize: 12}}>{singleFood}</Text>
        //     </View>
        // )
    };

    onPressNextPhase = () => {
        //TODO: after approving to take the arr and push it somewhere (firebase\ local DB) and moving the user to the process of the diet
        //TODO: this obviously after transferring the array from this component to CalorieMethod 'father' component

        const moveToParent = this.state.userSelectedFood;
        console.log('moving to parent phase 2 : ', moveToParent);
        if (this.props.nextPhase2) {
            this.props.nextPhase2(moveToParent)
        }

    };


    render() {
        return (
            <View>
                <View style={{marginTop: 30}}>
                    <Text style={{fontSize: 20, color: 'red', alignSelf: 'center'}} onPress={this.goToFood}> אנא בחר
                        מזון</Text>
                </View>
                <Text style={{paddingTop: 30, alignSelf: 'center', fontSize: 15, color: 'blue', paddingBottom: 20}}> הבחירות שלך:</Text>
                {this.renderFoodChoices()}

                <HermonManButton text={localized.calorieMethod.approve}
                                 onPress={this.onPressNextPhase}
                                 buttonStyle={{width: 250, alignSelf: 'center', marginTop: 100}}/>
            </View>

        );
    }

    //
    // onPressNextPhase = () => {
    //     const moveToParent = {
    //         weight: this.state.weight,
    //         date: this.state.date
    //     };
    //
    //     console.log("this. state ::: ", this.state);
    //     if (this.props.nextPhase1) {
    //         this.props.nextPhase1(moveToParent)
    //     }
    // };

}
const styles = {
    imageStyle: {
        height: 25,
        width: 25,
        marginHorizontal: 2
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