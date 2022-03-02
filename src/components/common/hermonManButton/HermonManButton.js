import FontAwesome from 'react-native-fontawesome';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fourthColor, primaryColor, secondaryColor, thirdColor, fifthColor} from './colors';

export default class HermonManButton extends Component {

    constructor(props) {
        super(props);
        this.state = {text: '', backgroundColor: '#CD97D0',textColor:'black'};

        this.state.enabled = (this.props.enabled !== false);

        // Set text
        let text = this.props.text;
        if (text) {
            this.state.text = text;
        }

        // Set primary or secondary color
        if(this.props.backgroundColor) {
            this.state.backgroundColor = this.props.backgroundColor;
        }

        if(this.props.textColor) {
            this.state.textColor = this.props.textColor;
        }


        // Set icon
        let icon = this.props.icon;
        if (icon) {
            this.state.icon = icon;
        }
    }

    renderOnlyView = () => {
        const {backgroundColor,textColor,icon,text} = this.state;
        const {buttonStyle,textStyle} = this.props;
        return (
            <View style={[styles.view, {backgroundColor: backgroundColor}, buttonStyle]}>
                <Text style={[styles.text,{color:textColor},textStyle]}>{text}</Text>
                <FontAwesome style={styles.icon}>{icon}</FontAwesome>
            </View>
        )
    };

    render() {
        if (this.state.enabled) {
            return (
                <TouchableOpacity onPress={this.props.onPress}>
                    {this.renderOnlyView()}
                </TouchableOpacity>
            );
        } else {
            return this.renderOnlyView();
        }
    }
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        height: 45,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'center'
    },
    icon: {
        fontSize: 16,
        color: '#3b5998',
        marginLeft: 4,
        alignSelf: 'center',
        marginTop: 2
    }
});