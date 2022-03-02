import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {getStartDirection} from '../../utils/lang/I18n';
import {Icon} from 'native-base';
export default class SideMenuComponent extends Component {
	constructor(props) {
		super(props);
	}

	getFlexDirectionByLanauage = () => {
		return getStartDirection() === 'right' ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'};
	};

	getJustifyContentByLanauage = () => {
		return getStartDirection() === 'right' ? {justifyContent: 'flex-end'} : {justifyContent: 'flex-end'};
	};

	renderIconOrImage = () => {
		const {displayIcon, icon, iconType} = this.props;
		if (displayIcon) {
			return <Icon style={styles.iconStyle} name={icon} type={iconType} />;
		}
		return <Image style={styles.imageStyle} source={icon} />;
	};

	render() {
		const flexDirection = this.getFlexDirectionByLanauage();
		const justifyContent = this.getJustifyContentByLanauage();

		return (
			<View style={[styles.viewStyle, flexDirection, justifyContent]}>
				<TouchableOpacity onPress={this.props.onPress}>
					<Text style={styles.textStyle}>{this.props.title}</Text>
				</TouchableOpacity>
				{this.renderIconOrImage()}
			</View>
		);
	}
}

const styles = {
	viewStyle: {
		borderColor: 'black',
		borderRadius: 2,
	},
	iconStyle: {
		marginRight: 20,
		marginLeft: 20,
		fontSize: 36,
		marginVertical: 5,
		color: 'black',
	},
	imageStyle: {
		height: 36,
		width: 36,
		resizeMode: 'contain',
		marginRight: 20,
		marginLeft: 20,
		marginVertical: 5,
	},
	textStyle: {
		fontSize: 15,
		fontWeight: 'bold',
		marginTop: 12,
	},
};
