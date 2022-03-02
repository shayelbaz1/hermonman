import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import sceneManager from '../sceneManager';
import {Icon} from 'native-base';
import { APP_BUTTON_BACKGROUND } from '../../assets/colors';

const {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');

export default class BaseLightbox extends Component {
    static propTypes = {
        children: PropTypes.any,
        horizontalPercent: PropTypes.number,
        verticalPercent: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.state = {
            opacity: new Animated.Value(0),
        };
    }

    componentDidMount() {
        Animated.timing(this.state.opacity, {
            duration: 1000,
            toValue: 1,
        }).start();
    }

    closeModal = () => {
        const {onCloseModal} = this.props;
        const closeModal = onCloseModal ? onCloseModal : sceneManager.goToHomePageByUserStatus;
        Animated.timing(this.state.opacity, {
            duration: 100,
            toValue: 0,
        }).start(closeModal);
    };

    _renderLightBox = () => {
        const {children, horizontalPercent = 1, verticalPercent = 1} = this.props;
        const height = verticalPercent ? deviceHeight * verticalPercent : deviceHeight;
        const width = horizontalPercent ? deviceWidth * horizontalPercent : deviceWidth;

        return (
            <View style={[styles.renderBox, {width, height}]}>
                {children}
            </View>
        );
    };

    render() {
        return (
            <Animated.View style={[styles.container, {opacity: this.state.opacity}]} >
                {this._renderLightBox()}
                <TouchableOpacity onPress={this.closeModal} style={styles.imageStyle}>
                    <Icon type={"Ionicons"} name={"ios-close-circle"} style={{color:APP_BUTTON_BACKGROUND,fontSize:40}}/>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}


const styles = StyleSheet.create({
        container: {
            backgroundColor: 'rgba(52,52,52,0.5)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageStyle: {
            height: 40,
            width: 40,
            marginTop: -(0.7 * deviceHeight),
            marginRight: -(0.8 * deviceWidth)
        },
        renderBox: {
            // justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            position: 'absolute',
            borderColor: 'white',
            borderWidth: 10,
            borderRadius: 10
        }
    }
);





