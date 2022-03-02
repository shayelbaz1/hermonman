import React, {Component} from 'react';
import {Dimensions, Text, View,TouchableOpacity,ScrollView} from 'react-native';
import firebase from '../../utils/firebase/Firebase';
import PureChart from 'react-native-pure-chart';
import { APP_BACKGROUND_WHITE, APP_BUTTON_BACKGROUND, APP_TEXT_WHITE, APP_BACKGROUND_CREAM_COLOR } from '../../assets/colors';
import moment from 'moment';
import { APP_GRAY_BACKGROUND } from '../common/hermonManButton/colors';
import {Icon} from 'native-base';
import FilterByModal from '../modals/modal/FilterByModal';
import sceneManager from '../../scenes/sceneManager';
import HermonManButton from '../common/hermonManButton/HermonManButton';
import {strings, getStartDirection} from '../../utils/lang/I18n';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;
const data = [];

const WEEK = 'Week';
const MONTHLY = 'Monthly';
const YEAR = 'Year';

const firstWeek = "FIRST_WEEK";
const secondWeek = "SECOND_WEEK";
const thirdWeek = "THIRD_WEEK";
const fourtWeek = "FOURTH_WEEK";

export default class Statistics extends Component {

    constructor() {
        super();
        this.state = {
            weightAndDateStringArray: [],
            weightAndDateConverted:[],
            filterBy:WEEK,
            isFilterByModalOpen:false
        };
    }

    componentWillMount() {
        firebase.getCurrentUser()
            .then(user => {
                firebase.getWeightHistory(user)
                    .then(weightAndDateStringArray => {
                        const weightAndDatesUniqe =  this.removeDuplicateDates(weightAndDateStringArray);
                        this.setState({weightAndDateStringArray: weightAndDatesUniqe});
                    })
            })
            .catch(err => {
                console.log('There was problem getting weight arr: ', err);
            })
    }

    removeDuplicateDates = (weightAndDateArray) => {
        let seen = new Set();

        const filteredWeightAndDate = weightAndDateArray.filter(weightAndDateObj => {
            const duplicate = seen.has(weightAndDateObj.date);
            seen.add(weightAndDateObj.date);
            return !duplicate;
        });

        return filteredWeightAndDate;
    }

    getSunday = () => {
        return moment().day("Sunday");
    }

    getSaturday = () => {
        return moment().day("Saturday");
    }

    //return true or false if the date in the range
    betweenSundayUntilSaturday = (dateConverted) => {
        const saturday = this.getSaturday();
        const sunday = this.getSunday();
        const dateBetween = (moment(dateConverted).isBefore(saturday) && 
        moment(dateConverted).isAfter(sunday)) ||
        moment(dateConverted).isSame(sunday,'month') && moment(dateConverted).isSame(sunday,'day') && moment(dateConverted).isSame(sunday,'year') ||
        moment(dateConverted).isSame(saturday,'month') && moment(dateConverted).isSame(saturday,'day') && moment(dateConverted).isSame(saturday,'year');
        return dateBetween;
    }

    sortData = (weightByDaysInWeek) => {
        return weightByDaysInWeek.sort((a,b) =>  a.dateConverted.valueOf() - b.dateConverted.valueOf());
    }

    filterByDaysInWeek = (convertStringDateArrayToDate) => {
        let weightByDaysInWeek = [];
        weightByDaysInWeek = convertStringDateArrayToDate.filter(weightAndDateObject => { 
            return this.betweenSundayUntilSaturday(weightAndDateObject.dateConverted)});

        const sortedweightByDaysInWeek  = weightByDaysInWeek.sort((a,b) =>  a.dateConverted.valueOf() - b.dateConverted.valueOf());
        return sortedweightByDaysInWeek;
    }

    checkBetweenRange = (startDate,endDate,dateConverted) => {
        const dateBetween = (moment(dateConverted).isBefore(endDate) && 
        moment(dateConverted).isAfter(startDate)) ||
        moment(dateConverted).isSame(startDate,'month') && moment(dateConverted).isSame(startDate,'day') && moment(dateConverted).isSame(startDate,'year') ||
        moment(dateConverted).isSame(endDate,'month') && moment(dateConverted).isSame(endDate,'day') && moment(dateConverted).isSame(endDate,'year');
       
        return dateBetween;
    }

    getMonthArray = (month,datesAndWeightArray) => {
        let monthArray = [];
        monthArray = datesAndWeightArray.filter(dateAndWeight => {
            return moment(dateAndWeight.dateConverted).month() === month;
        })

        console.log("1. getMonthArray monthArray",monthArray ," month :::::",month);
        return monthArray;
    }


    getWeeksArrayInMonth = (convertStringDateArrayToDate) => {
        const year = moment().year();
        const month = moment().month();

        const monthRange = this.getMonthDateRange(month,year);
        const startDate = monthRange.start;
        const endOfDate = monthRange.end;
        let endOfRange;

        // 01-08
        let firstWeek = convertStringDateArrayToDate.filter(weightAndDateObject =>{
            endOfRange = moment(startDate, "DD-MM-YYYY").add(7, 'days');
            return this.checkBetweenRange(startDate,endOfRange,weightAndDateObject.dateConverted)
        });   

        //09-16
        let startOfRange = moment(startDate, "DD-MM-YYYY").add(8, 'days');
        let secondWeek = convertStringDateArrayToDate.filter(weightAndDateObject =>{
            endOfRange = moment(startOfRange, "DD-MM-YYYY").add(7, 'days');
            return this.checkBetweenRange(startOfRange,endOfRange,weightAndDateObject.dateConverted)
        });  
        
        //17-24
        startOfRange = moment(startOfRange, "DD-MM-YYYY").add(8, 'days');
        let thirdWeek = convertStringDateArrayToDate.filter(weightAndDateObject =>{
            endOfRange = moment(startOfRange, "DD-MM-YYYY").add(7, 'days');
            return this.checkBetweenRange(startOfRange,endOfRange,weightAndDateObject.dateConverted)
        });
        
        //25- end of month
        startOfRange = moment(startOfRange, "DD-MM-YYYY").add(8, 'days');
        const diffDaysUntilLastDayInMonth = endOfDate.diff(startOfRange, 'days');
        
        let fourthWeek = convertStringDateArrayToDate.filter(weightAndDateObject =>{
            endOfRange = moment(startOfRange, "DD-MM-YYYY").add(diffDaysUntilLastDayInMonth, 'days');
            return this.checkBetweenRange(startOfRange,endOfRange,weightAndDateObject.dateConverted)
        }); 

        return {first:firstWeek,second:secondWeek,third:thirdWeek,fourth:fourthWeek};
    }
    
    

    convertDateStringToDate = (weightAndDateStringArray) => {
        let weightAndDateConverted = [];

        weightAndDateStringArray.map(weightDateObject => {
            const parts = weightDateObject.date.split('/');
            const convertStringToDate = moment([parts[2],parts[1]-1,parts[0]]);
            let objectToPush = {weight:weightDateObject.weight,dateConverted:convertStringToDate._d};
            weightAndDateConverted.push(objectToPush);
            });

            return weightAndDateConverted;
    }

    getMonthValue = () => {
        const momentDate = moment();
        const month = momentDate.month();

        switch(month) {
            case 0:
                return strings("JAN");
            case 1:
                return strings("FEB");
            case 2:
                return strings("MARCH");
            case 3:
                return strings("ARPIL");
            case 4:
                return strings("MAY");
            case 5:
                return strings("JUN");
            case 6:
                return strings("JULY");
            case 7:
                return strings("AUG");
            case 8:
                 return strings("SEP");
            case 9:
                 return strings("OCT");
            case 10:
                 return strings("NOV");
            case 11:
                 return strings("DEC");
                                  
            }    
    
        }

    renderSundayUntilSaturdayTitle = () => {
        const sunday = moment(this.getSunday()).format("DD/MM/YYYY").toString();
        const saturday = moment(this.getSaturday()).format("DD/MM/YYYY").toString();
        const weekBetween = strings('WEEK_BETWEEN');
        return (
           <View style={{alignSelf:'center',marginTop:10}}>
               <Text numberOfLines={2} style={{textAlign:'center',color:'black',fontSize:14,maxWidth:250}}>{weekBetween +  " " + sunday + "-" + saturday}</Text>
           </View> 
        )
    }

    //return all days in the specfic week - with dates + days.
    getAllDaysInWeek = () => {
        const allDays = moment.weekdays();
        const allDaysMommentArray = allDays.map(dayInWeek => moment().day(dayInWeek)._d);
        return allDaysMommentArray;
    }

    //check if there is date that not include in weekWieghtData
    // if not found - we will create a new object {weight:0,dateConvert:day} --- day will be any day that not found in weekWieghtData.
    // this is for chart - if no weight for unfound date  , it will print nothing. - so will dispaly "0kg" instead of nothing
    getAllDaysWithWeight = (weekWieghtData) => {
        const allDaysInWeek =  this.getAllDaysInWeek();
        
        allDaysInWeek.map(day => {
            let found =  weekWieghtData.find(weightDate => (
                moment(day).isSame(weightDate.dateConverted,'year') &&
                moment(day).isSame(weightDate.dateConverted,'month') &&
                moment(day).isSame(weightDate.dateConverted,'day')         
            ))

            if(!found) {
                const objectToPush = {weight:0,dateConverted:day}; 
                weekWieghtData.push(objectToPush); 
            }
        })

        return this.sortData(weekWieghtData);
        
    }

    getValueDate = (date) => {
        return moment(date).format("DD/MM");
    }

    //render charts by days --- filter by days in week
    renderChartByDays = (filterByDaysInWeek) => {
        const allDaysWithWeight = this.getAllDaysWithWeight(filterByDaysInWeek);
        const flexDirection = this.getRtl() ? {flexDirection:'row-reverse'} : {flexDirection:'row'};
        const chartView = allDaysWithWeight.map((weightAndDate)=> 
        <View key={weightAndDate.date} style={{marginHorizontal:10}}>
             <View style={{marginVertical:4}}>
                 <Text style={{color:'black',fontSize:14,textAlign:'center'}}>{weightAndDate.weight + " " + "kg"}</Text>
            </View>
            <View style={{height:weightAndDate.weight,width:6,marginHorizontal:22,backgroundColor:APP_BUTTON_BACKGROUND}}/>
            <View style={{backgroundColor:APP_BUTTON_BACKGROUND,borderRadius:15,width:50,marginVertical:4}}>
                <Text style={{color:APP_BACKGROUND_WHITE,fontSize:14,textAlign:'center'}}>{this.getValueDate(weightAndDate.dateConverted)}</Text>
            </View>
         </View>
          );                       

          return (
             <View style={{backgroundColor:APP_BACKGROUND_WHITE,marginTop:10,width:'95%',alignSelf:'center'}}>
                {this.renderSundayUntilSaturdayTitle()}
              <ScrollView horizontal={true} contentContainerStyle={[flexDirection,{justifyContent:'space-between',bottom:0,marginVertical:15},styles.bottomView]}>
                  <View style={{alignSelf:'center'}}>
                  </View>
                  {chartView}
              </ScrollView>
             </View> 
          )
    }

    renderMonthTitle = () => {
        const monthTitle = this.getMonthValue();
        const avg_title = strings('AVG_PER_MONTH');

        return (
            <View style={{alignSelf:'center',marginTop:10}}>
                <Text numberOfLines={2} style={{textAlign:'center',color:'black',fontSize:14,maxWidth:250}}>{avg_title + " : " + monthTitle}</Text>
            </View> 
         ) 
    }

    //render charts by MONTH --- CALCULATE BY AVG IN 4 WEEKS
    renderChartByMonth = (avarageWeeksArray) => {
        const flexDirection = this.getRtl() ? {flexDirection:'row-reverse'} : {flexDirection:'row'};

        const chartView = avarageWeeksArray.map((weekObj)=> 
        <View key={weekObj.id} style={{marginHorizontal:10}}>
             <View style={{marginVertical:4}}>
                 <Text style={{color:'black',fontSize:14,textAlign:'center'}}>{weekObj.avg + " " + "kg"}</Text>
            </View>
            <View style={{height:weekObj.avg,width:6,marginHorizontal:25,backgroundColor:APP_BUTTON_BACKGROUND}}/>
            <View style={{backgroundColor:APP_BUTTON_BACKGROUND,borderRadius:15,width:60,marginVertical:4}}>
                <Text style={{color:APP_BACKGROUND_WHITE,fontSize:14,textAlign:'center'}}>{strings(weekObj.id)}</Text>
            </View>
         </View>
          );                       

          return (
             <View style={{backgroundColor:APP_BACKGROUND_WHITE,marginTop:10,width:'95%',alignSelf:'center'}}>
                {this.renderMonthTitle()}
              <ScrollView horizontal={true} contentContainerStyle={[flexDirection,{justifyContent:'center',alignSelf:'center',bottom:0,marginVertical:15},styles.bottomView]}>
                  <View style={{alignSelf:'center'}}>
                  </View>
                  {chartView}
              </ScrollView>
             </View> 
          )
    }

    renderYearTitle = () => {
        const year = moment().year();
        const avg_title = strings("ANNUAL_AVG");

        return (
            <View style={{alignSelf:'center',marginTop:10}}>
                <Text numberOfLines={2} style={{textAlign:'center',color:'black',fontSize:14,maxWidth:250}}>{avg_title + " " + year}</Text>
            </View> 
         ) 
    }

    //render charts by YEAR
    renderChartByYear = (avarageMonthsArray) => {
        const flexDirection = this.getRtl() ? {flexDirection:'row-reverse'} : {flexDirection:'row'};

        const chartView = avarageMonthsArray.map((monthObj)=> 
        <View key={monthObj.id} style={{marginHorizontal:10}}>
             <View style={{marginVertical:4}}>
                 <Text style={{color:'black',fontSize:14,textAlign:'center'}}>{monthObj.avg + " " + "kg"}</Text>
            </View>
            <View style={{height:monthObj.avg,width:6,marginHorizontal:25,backgroundColor:APP_BUTTON_BACKGROUND}}/>
            <View style={{backgroundColor:APP_BUTTON_BACKGROUND,borderRadius:15,marginVertical:4,maxWidth:110}}>
                <Text style={{color:APP_BACKGROUND_WHITE,fontSize:14,textAlign:'center',marginHorizontal:2}}>{strings(monthObj.id)}</Text>
            </View>
         </View>
          );                       

          return (
             <View style={{backgroundColor:APP_BACKGROUND_WHITE,marginTop:10,width:'95%',alignSelf:'center'}}>
                {this.renderYearTitle()}
              <ScrollView horizontal={true} contentContainerStyle={[flexDirection,{justifyContent:'center',alignSelf:'center',bottom:0,marginVertical:15},styles.bottomView]}>
                  <View style={{alignSelf:'center'}}>
                  </View>
                  {chartView}
              </ScrollView>
             </View> 
          )
    }

    getMonthDateRange = (month,year) => {
        const startDate = moment([year,month]);
        const endDate = moment(startDate).endOf('month');

        return { start: startDate, end: endDate };
    }

    // will get the dates from weightAndDateStringArray, and filter by days in the same week.
    renderByDaysInWeek = (convertStringDateArrayToDate) => {
        const {weightAndDateStringArray} = this.state;
        const filterByDaysInWeek = weightAndDateStringArray.length > 0 ? this.filterByDaysInWeek(convertStringDateArrayToDate) : [];
        return (
            filterByDaysInWeek.length > 0 ? this.renderChartByDays(filterByDaysInWeek) : null 
        ) 
    }

    avarageForWeek = (weekData) => {
        let avarageForWeek = 0;
        let sumWeightForWeek = 0;
        if(weekData.length > 0) {
            weekData.map(dateAndWeightObj => {
                sumWeightForWeek += dateAndWeightObj.weight;
            })
    
            avarageForWeek = sumWeightForWeek / weekData.length;
            console.log("4. avarageForWeek avg::::",avarageForWeek);
        }

        return avarageForWeek;

    }

    //average of weeks in month
    //get all history weight -
    //and need to filter it by month
    renderByMonthly = (dateAndWeightArray) => {
        const weeksArray = this.getWeeksArrayInMonth(dateAndWeightArray);
        const avarageForFirstWeek = this.avarageForWeek(weeksArray.first);
        const avarageForSecondWeek = this.avarageForWeek(weeksArray.second);
        const avarageForThirdWeek = this.avarageForWeek(weeksArray.third);
        const avarageForFourthWeek = this.avarageForWeek(weeksArray.fourth);
        const avarageWeeksArray = [{avg:avarageForFirstWeek,id:firstWeek},{avg:avarageForSecondWeek,id:secondWeek},{avg:avarageForThirdWeek,id:thirdWeek},{avg:avarageForFourthWeek,id:fourtWeek}];

        return (
            this.renderChartByMonth(avarageWeeksArray)
        )
    }

    avarageForMonth = (monthData) => {
        let avarageForMonth = 0;
        let sumWeightForMonth = 0;
        if(monthData.length > 0) {
            monthData.map(dateAndWeightObj => {
                sumWeightForMonth += dateAndWeightObj.weight;
            })
    
            avarageForMonth = parseInt(sumWeightForMonth / monthData.length);
        }

        return avarageForMonth;
    }

    renderByYear = (dateAndWeightArray) => {
        const janMonthAvg = this.avarageForMonth(this.getMonthArray(0,dateAndWeightArray));
        const febMonthAvg = this.avarageForMonth(this.getMonthArray(1,dateAndWeightArray));
        const marchMonthAvg = this.avarageForMonth(this.getMonthArray(2,dateAndWeightArray));
        const aprMonthAvg = this.avarageForMonth(this.getMonthArray(3,dateAndWeightArray));
        const mayMonthAvg = this.avarageForMonth(this.getMonthArray(4,dateAndWeightArray));
        const junMonthAvg = this.avarageForMonth(this.getMonthArray(5,dateAndWeightArray));
        const julMonthAvg = this.avarageForMonth(this.getMonthArray(6,dateAndWeightArray));
        const augMonthAvg = this.avarageForMonth(this.getMonthArray(7,dateAndWeightArray));
        const sepMonthAvg = this.avarageForMonth(this.getMonthArray(8,dateAndWeightArray));
        const octMonthAvg = this.avarageForMonth(this.getMonthArray(9,dateAndWeightArray));
        const novMonthAvg = this.avarageForMonth(this.getMonthArray(10,dateAndWeightArray));
        const decMonthAvg = this.avarageForMonth(this.getMonthArray(11,dateAndWeightArray));

        const avarageMonthsArray = [{avg:janMonthAvg,id:"JAN"},{avg:febMonthAvg,id:"FEB"},
            {avg:marchMonthAvg,id:"MARCH"},{avg:aprMonthAvg,id:"ARPIL"},
            {avg:mayMonthAvg,id:"MAY"},{avg:junMonthAvg,id:"JUN"},
            {avg:julMonthAvg,id:"JULY"},{avg:augMonthAvg,id:"AUG"},
            {avg:sepMonthAvg,id:"SEP"},{avg:octMonthAvg,id:"OCT"},
            {avg:novMonthAvg,id:"NOV"},{avg:decMonthAvg,id:"DEC"}];

        return this.renderChartByYear(avarageMonthsArray);

    }

    //renderChart by filterBy 
    //can be days,month,year
    renderContent = (dateAndWeightArray) => {
        const {filterBy} = this.state;
        if(filterBy === MONTHLY) {
           return this.renderByMonthly(dateAndWeightArray);
        }else if(filterBy === YEAR){
            return this.renderByYear(dateAndWeightArray);
        }

        return this.renderByDaysInWeek(dateAndWeightArray);
    }

    renderFilterByModal = () => (
        <FilterByModal
            isOpen = {this.state.isFilterByModalOpen}
            closeModal = {this.closeFilterByModal}
            setFilterBy = {this.setFilterBy}
        />
    )

    openFilterModal = () => {
        this.setState({ isFilterByModalOpen: true });
    };

    setFilterBy = (filterBy) => {
        const filterByKey = filterBy.key;
        this.setState({filterBy:filterByKey} , () => this.closeFilterByModal());
    }

    setGender = selectedGender => {
        this.setState({
            gender: selectedGender.key
        });
        this.closeGenderModal();
    };

    getTitle = () => {
        const {filterBy} = this.state;
        const filterText = filterBy === WEEK ? 'WEEK' : filterBy === MONTHLY ? 'MONTH' : 'YEAR';
        return strings(filterText);
    }

    getRtl = () => {
       return getStartDirection() === 'right' ? true : false; 
    }

    renderFilterBy = () => {
        const text = this.getTitle();
        const placholder = strings('FILTER_BY');
        const textAlign = this.getRtl() ? {textAlign:'right'} : {textAlign:'left'};
        const flexDirection = this.getRtl() ? {flexDirection:'row'} : {flexDirection:'row-reverse'};
        const marginHorizontal = this.getRtl() ? {marginHorizontal:'15%'} : {marginHorizontal:'5%'};
        return (
            <View style={{marginVertical:20}}>
                <Text style={[{marginVertical:5,fontWeight:'bold',color:'black',fontSize:16},textAlign,marginHorizontal]}>{placholder}</Text>
                <TouchableOpacity
                    style={[styles.textBox]}
                    onPress={this.openFilterModal}
                >
                    <View style={[flexDirection,{justifyContent: 'space-between' }]}>
                        <Icon name={'ios-arrow-down'} style={{ fontSize: 20,margin:'4%' }} />
                        <Text style={[styles.textStyleForModal]}>{text}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    goback = () => {
        sceneManager.goBack();
    }

    renderBackButton = () => {
        const buttonTitle = strings("BACK");
        return (
            <View style={[styles.registerActionContainer, { alignItems: 'center', justifyContent: 'center',marginVertical:15 }]}>
               <HermonManButton text={buttonTitle} 
                    textColor={APP_TEXT_WHITE}
                    backgroundColor={APP_BUTTON_BACKGROUND}
                    buttonStyle={{ width: 150, height: 50, borderRadius: 100 / 2 }} onPress={this.goback} />
            </View>
        )
    }


    closeFilterByModal = () => {
        this.setState({ isFilterByModalOpen: false });
    };


    render() {
        const {weightAndDateStringArray} = this.state;
        const convertStringDateArrayToDate  = weightAndDateStringArray.length > 0 ? this.convertDateStringToDate(weightAndDateStringArray) : [];
        console.log("11. renderByMonthly convertStringDateArrayToDate ",convertStringDateArrayToDate);
        const staticsTitle = strings('STATISTIC');
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.headerStyle}>{staticsTitle}</Text>
                {convertStringDateArrayToDate.length > 0 ? this.renderContent(convertStringDateArrayToDate) : null}
                <View style={{marginVertical:10}}>
                    {this.renderFilterBy()}
                    {this.renderBackButton()}
                </View>
                {this.renderFilterByModal()}
            </View>
        );
    }
}

const
    styles = {
        registerActionContainer: {
            paddingBottom: 10,
        },
        textForgotPassword: {
            textDecorationLine: 'underline',
            alignSelf: 'flex-end',
            color: 'red',
            marginBottom: 20,
            fontSize: 18
        },
        bottomView: {
            //width: '100%',
            maxHeight: 350,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'flex-end',
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
            color: 'red'
        },
        bottomLink: {
            color: 'blue',
            textDecorationLine: 'underline',
            padding: 3
        },
        containerStyle: {
            flex: 1,
            backgroundColor:APP_BACKGROUND_CREAM_COLOR,
            height:'100%',
            justifyContent: 'flex-start',
        },
        headerStyle: {
            fontSize: 18,
            color: 'black',
            fontWeight: 'bold',
            textAlignVertical: 'top',
            alignSelf: 'center',
            paddingTop: 20
        },
        keyStyle: {
            fontSize: 20,
            fontWeight: 'bold'
        },
        valueStyle: {
            fontSize: 18,
            fontWeight: '300'
        },
        textStyleForModal: {
            alignSelf: 'flex-end',
            color: 'black',
            fontSize: 15,
            margin: '4%'
        },
        textBox: {
            borderColor: APP_GRAY_BACKGROUND,
            borderWidth: 2,
            width: 300,
            height: 50,
            borderRadius: 200 / 2,
            marginRight: '5%',
            marginLeft: '5%',
            backgroundColor: APP_BACKGROUND_WHITE
        },
    
    };