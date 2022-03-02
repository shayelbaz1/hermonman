import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {APP_GRAY_TEXT, APP_BACKGROUND_WHITE, APP_BLACK, APP_TEXT_COLOR} from '../../../assets/colors';
import {Icon} from 'native-base';
import {getStartDirection} from '../../../utils/lang/I18n';

const selectedCheckBox = 'check-box';
const unselectedCheckBox = 'check-box-outline-blank';

export default class Selection extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {}; // must init empty state
	}

	componentDidMount() {
		this.isChecked();
	}

	isChecked = () => {
		// is role checked by the user
		const {optionSelected, option} = this.props;
		const selected = optionSelected(option);
		this.setState({selected});
	};

	selectedCheckBox = (option) => {
		if (this.state.selected) {
			this.setState({selected: false}, () => this.props.onRemoveOption(option));
		} else {
			this.setState({selected: true}, () => this.props.onSelectOption(option));
		}
	};

	getIconName = () => {
		const {selected} = this.state;
		if (selected) {
			return selectedCheckBox;
		}
		return unselectedCheckBox;
	};

	getTextContainerStyle() {
		/*const direction = getStartDirection();
        switch (direction) {
            case ALIGN_LEFT:
                return {
                    marginLeft: 16
                };

            case ALIGN_RIGHT:
            default:
                return {
                    paddingRight: 4
                };
        }*/
	}

	getRtl = () => {
		return getStartDirection() === 'right' ? true : false;
	};

	getFlexDirection = () => {
		if (this.getRtl()) {
			return {flexDirection: 'row-reverse'};
		}

		return {flexDirection: 'row'};
	};

	render() {
		const {optionName, optionIndex, option} = this.props;
		const flexDirection = this.getFlexDirection();
		const styleForIcon =
			this.getIconName() === 'check-box' ? {fontSize: 30, color: APP_TEXT_COLOR} : {fontSize: 30, color: APP_GRAY_TEXT};
		return (
			<TouchableOpacity key={optionIndex} style={styles.margin} onPress={() => this.selectedCheckBox(option)}>
				{optionName === '' ? (
					<View style={{height: 10}} />
				) : (
					<View style={[flexDirection]}>
						<View>
							<Icon name={this.getIconName()} type='MaterialIcons' style={styleForIcon} />
						</View>

						<View style={styles.margin}>
							<Text style={styles.optionStyle}>{optionName}</Text>
						</View>
					</View>
				)}
			</TouchableOpacity>
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
