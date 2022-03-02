import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity,Text } from 'react-native';
import HermonManModal from '../HermonManModal';
import {APP_BUTTON_BACKGROUND} from '../../../assets/colors';
import { strings } from '../../../utils/lang/I18n';

export default class ListPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: this.props.selectedOption,
            dataArray: this.props.dataArray,
            refresh: false
        };
    }

    setSelectedOption(selectedOption) {
        this.setState({
            selectedOption,
            refresh: !this.state.refresh
        });
    }

    // option.key for exprience option for duration
    getOptionViewStyle = option => {
        if (option.key === this.state.selectedOption || option === this.state.selectedOption || option.name == this.state.selectedOption) {
            return {
                backgroundColor: APP_BUTTON_BACKGROUND
            };
        }
    };

    getOptionTextStyle = option => {
        if (option.key === this.state.selectedOption || option === this.state.selectedOption || option.name == this.state.selectedOption) {
            return {
                color: 'white'
            };
        }
    };

    renderOption = (option) => {
        const name =  option.name ? option.name : option;
        return (
            <TouchableOpacity
                style={[styles.optionItemStyle, this.getOptionViewStyle(option)]}
                onPress={() => this.setSelectedOption(option)}  >
                <Text style={[styles.optionTextStyle, this.getOptionTextStyle(option)]}>
                    {name}
                </Text>
            </TouchableOpacity>
        
        )
    }

    getUpdateButtonColorStyle = () => {
        if (this.state.selectedOption) {
            return { backgroundColor: APP_BUTTON_BACKGROUND };
        }
        return { backgroundColor: 'gray' };
    };

    setOption = () => {
        if (this.state.selectedOption) {
            return this.props.setOption(this.state.selectedOption);
        }
    };

    render() {
        const selectButton = strings('SELECT');
        return (
            <HermonManModal
                isOpen={this.props.isOpen}
                closeModal={this.props.closeModal}
                titleText={this.props.title}
                height={{ height: 340 }}
            >
                <View style={styles.subTitleStyle}>
                    <Text>{this.props.subTitle}</Text>
                </View>
                <View style={{ height: 200 }}>
                    <FlatList
                        data={this.state.dataArray}
                        extraData={this.state.refresh}
                        keyExtractor={(item, index) => item.key}
                        renderItem={flatItem => this.renderOption(flatItem.item)}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.buttonStyle, this.getUpdateButtonColorStyle()]}
                    onPress={this.setOption}
                >
                    <Text style={styles.buttonsTextStyle}>{selectButton}</Text>
                </TouchableOpacity>
            </HermonManModal>
        );
    }
}

const styles = StyleSheet.create({
    subTitleStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionItemStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        marginBottom: 8
    },
    optionTextStyle: {
        fontSize: 20
    },
    buttonStyle: {
        paddingVertical: 8,
        marginTop: 8,
        marginHorizontal: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsTextStyle: {
        color: 'white'
    }
});