import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import firebase from '../../../utils/firebase/Firebase';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BUTTON_BACKGROUND,
	ROW_EVEN_COLOR,
	ROW_ODD_COLOR,
	APP_BLACK,
	APP_BACKGROUND_WHITE,
} from '../../../assets/colors';
import {strings, getStartDirection} from '../../../utils/lang/I18n';
import Language from '../../../utils/lang/Language';
import {getImage} from '../../../img/images';

const MINUS = 'minus';
const PLUS = 'plus';

export default class FoodCalorieRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			countProd: 0,
			countCalories: 0,
			caloriesForProd: this.props.foodObject.calories,
		};
	}

	calcProductCalories = (calcType) => {
		const {foodObject} = this.props;
		const {countProd, countCalories, caloriesForProd} = this.state;
		let countProdNewValue = 0;
		let countCaloriesNewValue = countCalories;
		if (calcType === MINUS && countProd !== 0) {
			countProdNewValue = countProd - 1;
			countCaloriesNewValue = countCalories - caloriesForProd;
		} else if (calcType === PLUS) {
			countProdNewValue = countProd + 1;
			countCaloriesNewValue = countCalories + caloriesForProd;
		} else if (countProd === 0) {
			countCaloriesNewValue = 0;
		}

		let foodObjectForMenu = {
			prodId: foodObject.id,
			prodName: foodObject.foodName,
			countProd: countProdNewValue,
			countCaloriesForProd: countCaloriesNewValue,
		};
		this.setState({countProd: countProdNewValue, countCalories: countCaloriesNewValue}, () =>
			this.props.setCalcCaloriesByProducts(foodObjectForMenu)
		);
	};

	backgroundColorByIndex = () => {
		const {index} = this.props;
		if (index % 2 === 0) {
			return {backgroundColor: ROW_EVEN_COLOR};
		}

		return {backgroundColor: ROW_ODD_COLOR};
	};

	renderCaloriesDietCollection = () => {
		const unitMeasure = strings('100_GRAM');
		const {foodObject, flexDirection} = this.props;
		const {countProd, countCalories, caloriesForProd} = this.state;
		const backgroundColor = this.backgroundColorByIndex();
		const disabledMinusIcon = countProd === 0 ? true : false;
		return (
			<View
				style={[
					flexDirection,
					backgroundColor,
					{marginHorizontal: 5, borderColor: APP_BACKGROUND_WHITE, borderWidth: 2},
				]}>
				<View style={[styles.viewCol, {width: '20%'}]}>
					<Text style={styles.colText}>{foodObject.foodName}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '12%'}]}>
					<Text style={styles.colText}>{unitMeasure}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '15%'}]}>
					<Text style={styles.colText}>{caloriesForProd}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, flexDirection, {width: '20%', maxWidth: '20%', justifyContent: 'space-between'}]}>
					<Icon
						type={'AntDesign'}
						name={'pluscircleo'}
						style={styles.iconStyle}
						onPress={() => this.calcProductCalories(PLUS)}
					/>
					<Text style={styles.colText}>{countProd}</Text>
					<Icon
						disabled={disabledMinusIcon}
						type={'AntDesign'}
						name={'minuscircleo'}
						style={styles.iconStyle}
						onPress={() => this.calcProductCalories(MINUS)}
					/>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '15%'}]}>
					<Text style={styles.colText}>{countCalories}</Text>
				</View>
			</View>
		);
	};

	renderProgressView = () => {
		const {foodObject, flexDirection} = this.props;
		console.log('prog!!! foodObject:::::::::::', foodObject);
		const backgroundColor = this.backgroundColorByIndex();

		return (
			<View
				style={[
					flexDirection,
					backgroundColor,
					{marginHorizontal: 5, borderColor: APP_BACKGROUND_WHITE, borderWidth: 2},
				]}>
				<View style={[styles.viewCol, {width: '30%'}]}>
					<Text numberOfLines={2} style={[styles.colText, {maxWidth: 300}]}>
						{foodObject.prodName}
					</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, flexDirection, {width: '30%', justifyContent: 'center'}]}>
					<Text style={styles.colText}>{foodObject.countProd}</Text>
				</View>

				<View style={styles.border} />
				<View style={[styles.viewCol, {width: '30%'}]}>
					<Text style={styles.colText}>{foodObject.countCaloriesForProd}</Text>
				</View>
			</View>
		);
	};

	renderContent = () => {
		const {progress} = this.props;
		if (progress) {
			return this.renderProgressView();
		}

		return this.renderCaloriesDietCollection();
	};

	render() {
		return this.renderContent();
	}
}

const styles = StyleSheet.create({
	border: {
		width: 1,
		height: 50,
		borderWidth: 1,
		borderColor: APP_BACKGROUND_WHITE,
		marginHorizontal: '2%',
	},
	viewCol: {
		justifyContent: 'center',
		alignSelf: 'center',
	},
	colText: {
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		alignSelf: 'center',
	},
	iconStyle: {
		color: '#8c8c8c',
		fontSize: 20,
		margin: 2,
		textAlign: 'center',
		alignSelf: 'center',
	},
});
