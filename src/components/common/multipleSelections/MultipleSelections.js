import _ from 'lodash';
import React, {Component} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {APP_BACKGROUND_WHITE, APP_BLACK, APP_GRAY_TEXT} from '../../../assets/colors';
import Selection from './Selection';

export default class MultipleSelections extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOptions: [],
			refresh: true,
		};
	}

	optionSelected = (option) => {
		const selectedOptions = this.props.chosen;
		const result = selectedOptions.find((obj) => {
			return obj.item === option.item;
		});

		if (result) {
			return true;
		}
		return false;
	};

	renderItem = (FlatListRole) => (
		<Selection
			option={FlatListRole}
			optionName={FlatListRole.item}
			optionIndex={FlatListRole.index}
			optionSelected={this.optionSelected}
			onSelectOption={this.props.addFoodType}
			onRemoveOption={this.props.removeFoodType}
		/>
	);

	keyExtractor = (item, index) => item.toString();

	render() {
		return (
			<FlatList
				initialNumToRender={this.props.options.length}
				extraData={this.state.refresh}
				data={[...this.props.options, '']}
				keyExtractor={this.keyExtractor}
				renderItem={this.renderItem}
			/>
		);
	}
}

const styles = StyleSheet.create({
	checkbox: {
		marginTop: 5,
		backgroundColor: APP_BACKGROUND_WHITE,
		borderWidth: 1,
		width: 20,
		height: 20,
		borderColor: APP_GRAY_TEXT,
	},
	optionStyle: {
		color: APP_BLACK,
		fontSize: 18,
	},
	margin: {
		margin: 4,
	},
});
