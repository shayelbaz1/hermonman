import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Icon} from 'native-base';
import Modal from 'react-native-modalbox';

export default class HermonManModal extends Component {
	render() {
		return (
			<View>
				<Modal
					coverScreen
					style={[styles.modal, this.props.height, this.props.width]}
					isOpen={this.props.isOpen}
					backdropPressToClose={false}
					swipeToClose={false}
					swipeArea={0}>
					<View style={styles.modalContentContainer}>
						<TouchableOpacity style={styles.iconContainer} onPress={this.props.closeModal}>
							<Icon type='EvilIcons' name='close' style={styles.iconStyle} />
						</TouchableOpacity>
						<View style={styles.bodyContainerStyle}>
							<View>
								<Text style={styles.titleTextStyle}>{this.props.titleText}</Text>
							</View>
							{this.props.children}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	modal: {
		width: 296,
		padding: 8,
	},
	iconContainer: {
		position: 'absolute',
		left: 0,
		top: 0,
		paddingTop: 4,
		paddingLeft: 4,
	},
	iconStyle: {
		fontSize: 30,
	},
	titleTextStyle: {
		marginTop: 16,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		color: 'black',
	},
	bodyContainerStyle: {
		marginTop: 8,
		marginHorizontal: 8,
	},
});
