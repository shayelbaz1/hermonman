
import React, { Component } from 'react';
import { Alert,Text, View , StyleSheet,FlatList,Image ,TouchableOpacity} from 'react-native';
import firebase from '../../../utils/firebase/Firebase';
import { APP_BACKGROUND_CREAM_COLOR, HEADER_COLOR, APP_BLACK, APP_BACKGROUND_WHITE, APP_TEXT_WHITE, APP_BUTTON_BACKGROUND } from '../../../assets/colors';
import { strings, getStartDirection } from '../../../utils/lang/I18n';
import Language from "../../../utils/lang/Language";
import { getImage } from '../../../img/images';
import FoodCalorieRow from './FoodCalorieRow';
import sceneManager from '../../sceneManager';
import { CALORIES, CALORIES_MATINATIN } from '../../../utils/data/DietTypes';
import moment from 'moment';

const loadingImage = getImage('loading');
const MINUS = 'minus';
const PLUS = 'plus';

export default class SelectedMenuForCalories extends Component {

    constructor(prop){
        super(prop);
        this.state={
            foodCollection:[],
            caloriesForUser:'',
            calcCaloriesByProducts:0,
            caloriesLoaded:false
        }
    }

    getLatesWeight = (dietArray) => {
        const lastElementArray = dietArray.length;
        return dietArray[lastElementArray-1].weight;
    }

    componentWillMount() {
        const {selectedMenu} = this.props;
        firebase.getCurrentUser()
            .then(user => {
                firebase.getWeightHistory(user)
                .then(weightAndDateStringArray => {
                    const latestWeight = this.getLatesWeight(weightAndDateStringArray);
                    const gender = user.gender;
                    const caloriesForUser = this.calaculateMaxCaloriesForUser(gender,latestWeight);
                    const foodCollection = selectedMenu;
                    const calcCaloriesByProducts = this.calcProductsCalories(foodCollection);

                    this.setState({caloriesForUser,foodTypesLoaded:true,caloriesLoaded:true,foodCollection,calcCaloriesByProducts});
                }) 
               .catch(err => {
                    console.log("error with get food type",err);
               })
            })
    };

    //for male - weight * 24
    //for female - weight * 24 * 0.9
    // and then decrease 1000 calories. 
    // if after decrease is under then 900, the min will be 900 caloris.
    // else, will remain the same.
    calaculateMaxCaloriesForUser = (gender,weight) => {
        const {methodType} = this.props;
        const multipleNumber = 24;
        const multipleNumberForWomen = 0.9;
        const decressCalories = 1000;
        const minCaloriesForUser = 900;
        
        let maxCaloriesForUser = 0;
        let maxCaloriesBeforeDecrese = 0;
        
        if(gender === strings('MALE') && weight > 0) {
            maxCaloriesBeforeDecrese = multipleNumber * weight;
        }else if(gender === strings('FEMALE') && weight > 0){
            maxCaloriesBeforeDecrese = multipleNumber * weight * multipleNumberForWomen;
        }

        if(methodType === CALORIES_MATINATIN) {
            maxCaloriesForUser = maxCaloriesBeforeDecrese;
        }else{
            maxCaloriesForUser = maxCaloriesBeforeDecrese - decressCalories;
        }

        return maxCaloriesForUser > 900 ? maxCaloriesForUser : minCaloriesForUser;
    }

    getRtl = () => {
        return getStartDirection() === 'right' ? true : false;
    }

    getFlexDiretction = () => {
        return this.getRtl() ? {flexDirection:'row-reverse'} : {flexDirection:'row'};
    }

    renderRow = (foodObject,index) => {
        console.log("foodType item:::::",foodObject,index);
        const flexDirection = this.getFlexDiretction();

        return(
            <FoodCalorieRow progress={true} flexDirection={flexDirection} index={index} foodObject={foodObject}/>
        )
    }


    renderColumn = () => {
        const prodCol = strings('PRODUCT');
        const quntCol = strings('QUNT_SELECTED');
        const caloriesQuntCol = strings('CALORIES_FOR_QUNT_SELECTED');
        const flexDirection = this.getFlexDiretction();

        return(
            <View style={[flexDirection,{backgroundColor:HEADER_COLOR,marginHorizontal:5,marginTop:10,borderColor:APP_BACKGROUND_WHITE,borderWidth:2}]}>
                <View style={[styles.viewCol,{width:'30%',height:'100%'}]}>
                    <Text style={styles.colText}>{prodCol}</Text>
                </View>

                <View style={styles.border}/>
                <View style={[styles.viewCol,{width:'30%',height:'100%'}]}>
                    <Text style={styles.colText}>{quntCol}</Text>
                </View>

                <View style={styles.border}/>
                <View style={[styles.viewCol,{width:'30%',height:'100%'}]}>
                    <Text style={styles.colText}>{caloriesQuntCol}</Text>
                </View>
            </View>
        )
    }

    renderLoading = () => {
        return(
            <View style={styles.loadingContainer}>
               <Image source={loadingImage} style={{ width: 200, height: 200 }}/>
            </View>
         )
    }

    calcProductsCalories = (foodCollection) => {
        var totalCalories = 0;
        foodCollection.map(foodObject => {
            return totalCalories += foodObject.countCaloriesForProd;
        })
        console.log("5. setMenuArray calcProd totalCalories!:::::::",totalCalories);
        return totalCalories;
    }

    keyExtractor = (item, index) => item.prodId.toString();

    renderFoodCollationTable = () => {
        const {foodCollection} = this.state;
        return (
            <FlatList 
                data={foodCollection} 
                renderItem={({item,index}) => this.renderRow(item,index)} 
                keyExtractor={this.keyExtractor}
            />
        )
    }

    renderContent = () => {
        const {foodTypesLoaded} = this.state;
        if(!foodTypesLoaded){
            return this.renderLoading();
        }

        return this.renderFoodCollationTable();
    }

    checkCaloriesForUserValid = () => {
        const {calcCaloriesByProducts,caloriesForUser} = this.state;
        if(calcCaloriesByProducts > caloriesForUser ) {
            return false;
        }

        return true;
    }

    getBackgroundColor = () => {
        const caloriesValidation = this.checkCaloriesForUserValid();
        if(!caloriesValidation ) {
            return {backgroundColor:'red'};
        }

        return {backgroundColor:HEADER_COLOR};
    }

    renderMaxCalories = () => {
        const {caloriesForUser,caloriesLoaded,calcCaloriesByProducts} = this.state;
        const maxCaloriesForYou = strings('MAX_CALORIES_FOR_USER');
        const calcCalories = strings('CALC_CALORIES');
        const backgroundColorForCalcCalories = this.getBackgroundColor();

        if(caloriesLoaded) {
            return (
               <View style={{marginVertical:20,alignSelf:'center',justifyContent:'center'}}>
                    <View style={{borderRadius:50,width:310,maxHeight:50,backgroundColor:HEADER_COLOR}}>
                        <Text numberOfLines={2} style={{fontSize:18,textAlign:'center',color:APP_TEXT_WHITE,fontWeight:'bold',maxWidth:300}}>{maxCaloriesForYou + caloriesForUser.toString()}</Text>
                    </View>
                    <View style={[{borderRadius:50,width:310,maxHeight:50,marginTop:10},backgroundColorForCalcCalories]}>
                        <Text numberOfLines={2} style={{fontSize:18,textAlign:'center',color:APP_TEXT_WHITE,fontWeight:'bold',maxWidth:300}}>{calcCalories + calcCaloriesByProducts.toString()}</Text>
                    </View>
               </View> 
            )
        }
    }

    render(){
        return(
            <View style={{backgroundColor:APP_BACKGROUND_CREAM_COLOR,height:'100%',width:'100%'}}>
                <View style={{height:'25%'}}>
                    {this.renderMaxCalories()}
                 </View>
                <View style={{height:'18%',marginTop:10}}>
                    {this.renderColumn()}
                </View>
                <View style={{marginBottom:10,height:'45%'}}>  
                    {this.renderContent()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    border: {
        width: 1,
        height: 50,
        borderWidth: 1,
        borderColor: APP_BACKGROUND_WHITE,
        marginHorizontal:'2%'
    },
    viewCol:{
        justifyContent:'center',
        alignContent:'center',
        textAlign:'center',
        alignSelf:'center',
        alignItems:'center'
    },
    colText:{
        textAlign:'center',
        alignSelf:'center',
        justifyContent:'center',
        color:APP_TEXT_WHITE,
        fontWeight:'bold'
    },
    loadingContainer:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    
    }
})