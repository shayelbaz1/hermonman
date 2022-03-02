import {Icon, Input} from 'native-base';
import React, {Component} from 'react';
import {View} from 'react-native';
import {APP_GRAY_BACKGROUND} from '../../../assets/colors';

export default class SearchBox extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View
				style={{
					width: 250,
					height: 50,
					borderColor: APP_GRAY_BACKGROUND,
					borderWidth: 1,
					borderRadius: 250 / 5,
					justifyContent: 'space-between',
					flexDirection: 'row',
					backgroundColor: 'white',
				}}>
				<Icon name='ios-search' style={{marginLeft: '5%', marginTop: '4%', fontSize: 25, color: 'black'}} />
				<Input
					placeholder={this.props.placeholder}
					onChangeText={this.props.searchQueryChangedHandler}
					value={this.props.value}
					style={[{fontSize: 18, marginRight: '5%'}, this.props.textAlign]}
				/>
			</View>
		);
	}
}
