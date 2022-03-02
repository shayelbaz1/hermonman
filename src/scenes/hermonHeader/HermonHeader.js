import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Platform} from 'react-native';
import sceneManager from '../../scenes/sceneManager';
import {getImage} from '../../img/images';

const hermonHeader = getImage('hermonHeader');

export default class HermonHeader extends React.Component {
	goToHomePage = () => {
		sceneManager.goToHomePageByUserStatus();
	};

	render() {
		return (
			<TouchableOpacity
				onPress={this.goToHomePage}
				style={{
					width: 140,
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'center',
					...Platform.select({
						ios: {
							marginHorizontal: 20,
						},
						android: {
							marginLeft: 50,
						},
					}),
				}}>
				<Image style={styles.image} source={hermonHeader} resizeMode={'contain'} />
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	image: {
		width: '100%',
		height: '100%',
		alignSelf: 'center',
	},
});
