import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'native-base';
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import { APP_GRAY_TEXT } from '../../assets/colors';

export default class DateInput extends Component {

    constructor(props) {
        super(props);

        const { onDatePicked, placeholder } = this.props;
        this.state = {
            color: notChosenColor,
            dateText: placeholder,
        };

        if (onDatePicked) {
            this.state.onDatePickedCallback = onDatePicked;
        }

        this.onDatePicked = this.onDatePicked.bind(this);
        this.onDatePickerPress = this.onDatePickerPress.bind(this);
    }

    renderContent = () => {
        console.log("imageSource");
        if (this.props.imageSource) {
            return this.renderDatePickerWithImage()
        }

        return this.renderDatePicker()

    };

    renderDatePickerWithImage = () => {
        console.log("renderDatePickerWithImage", this.props.imageSource);
        const {flexDirection} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this.onDatePickerPress} style={[{ justifyContent: 'space-between' },flexDirection]}>
                    <Icon name={this.props.imageSource} style={{ fontSize: 25, color: APP_GRAY_TEXT, margin: '4%' }} />
                    <Text style={[styles.textInput, this.props.textInput, { color: this.state.color }]}>{this.state.dateText}</Text>
                </TouchableOpacity>
                <DatePickerDialog ref='dpDialog' onDatePicked={this.onDatePicked} />
            </View>
        )
    }

    renderDatePicker = () => {
        return (
            <View>
                <TouchableOpacity onPress={this.onDatePickerPress}>
                    <Text style={[styles.textInput, this.props.textInput, { color: this.state.color }]}>{this.state.dateText}</Text>
                </TouchableOpacity>
                <DatePickerDialog ref='dpDialog' onDatePicked={this.onDatePicked} />
            </View>
        )
    }

    render() {
        return (
            <View style={[styles.view, this.props.dateInputStyle]}>
                {this.renderContent()}
            </View>
        );
    }

    onDatePickerPress() {
        let dateToOpen = new Date();
        if (this.props.openDateForRegistration) {
            const currentDate = new Date();
            const year = currentDate.getFullYear() - 30;
            dateToOpen = new Date(year, 0, 1);
        }
        this.refs.dpDialog.open({
            date: dateToOpen
        });

    };

    onDatePicked(date) {
        const dateFormat = 'DD/MM/YYYY';
        this.setState({
            dateText: moment(date).format(dateFormat),
            color: chosenColor
        });
        if (this.state.onDatePickedCallback) {
            this.state.onDatePickedCallback(date);
        }
    }
}

const chosenColor = 'black';
const notChosenColor = Platform.OS === 'ios' ? '#A0B5C8' : '#7E93A0';
const fontSize = Platform.OS === 'ios' ? 16 : 14;
const styles = {
    view: {
        marginBottom: 15,
        borderColor: 'lightgray',
        borderBottomWidth: 2,
        paddingHorizontal: 10,
    },
    textInput: {
        textAlign: 'right',
        marginBottom: 10,
        fontSize: fontSize
    }
};