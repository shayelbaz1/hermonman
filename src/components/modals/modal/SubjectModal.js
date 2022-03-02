import React, {Component} from 'react';
import ListModal from '../listModal/ListModal';
import localized from '../../../utils/lang/localized';
import {getStartDirection, strings} from '../../../utils/lang/I18n';

export default class SubjectModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [
				{key: 'personal', name: strings('PERSONAL')},
				{key: 'food', name: strings('FOOD')},
				{key: 'joinUs', name: strings('JOIN_US')},
				{key: 'payment', name: strings('PAYMENTS')},
				{key: 'other', name: strings('OTHER')},
			],
		};
	}

	render() {
		const titleText = 'נושא הפניה';
		const subText = 'אנא בחר את נושא הפנייה שלך';
		return (
			<ListModal
				isOpen={this.props.isOpen}
				closeModal={this.props.closeModal}
				setOption={this.props.setOption}
				dataArray={this.state.data}
				title={titleText}
				subTitle={subText}
				selectedOption={this.props.selectedOption}
			/>
		);
	}
}
