import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import {APP_TEXT_COLOR} from '../../assets/colors'

export default class MenuIcon extends Component {
    render() {
        return (
            <View style={styles.iconContainerStyle}>
                <Icon name={'md-menu'} resizeMode={'contain'} style={{ fontSize:30, width: 35, height: 35 ,color:APP_TEXT_COLOR}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
