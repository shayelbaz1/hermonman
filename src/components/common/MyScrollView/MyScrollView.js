import React, {Component} from 'react';
import {Platform, ScrollView, View} from 'react-native';

class MyScrollView extends Component {
	constructor(props) {
		super(props);
		this.state = {hScroll: 0, showScrollBar: false};
	}

	componentWillMount() {
		if (this.props.persistentScrollbar) {
			this.setState({showScrollBar: true});
		}
	}

	render() {
		const {children, persistentScrollbar, ...attributes} = this.props;

		if (Platform.OS == 'android' || !persistentScrollbar) {
			console.log('entered a');
			// Abdroid supports the persistentScrollbar
			return (
				<ScrollView persistentScrollbar={persistentScrollbar} {...attributes}>
					{children}
				</ScrollView>
			);
		}
		console.log('entered b');
		const {hScroll, showScrollBar} = this.state;

		// iOS does not support persistentScrollbar, so
		// lets simulate it with a view.
		return (
			<ScrollView
				ref='scrollview'
				showsVerticalScrollIndicator={false}
				onScroll={(event) => {
					const ratio = event.nativeEvent.contentSize.height / event.nativeEvent.layoutMeasurement.height;
					if (ratio <= 1) {
						this.setState({showScrollBar: false});
					} else {
						const hScroll = event.nativeEvent.contentOffset.y * ratio;
						this.setState({hScroll, showScrollBar: true});
					}
				}}
				{...attributes}>
				{children}
				{showScrollBar && (
					<View
						style={{
							position: 'absolute',
							top: hScroll,
							right: 3,
							backgroundColor: '#a6a6a6',
							height: '55%',
							width: 2,
						}}></View>
				)}
			</ScrollView>
		);
	}
}

export default MyScrollView;
