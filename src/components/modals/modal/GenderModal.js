import React, { Component } from 'react';
import ListModal from '../listModal/ListModal';
import localized from '../../../utils/lang/localized';
import { strings } from '../../../utils/lang/I18n';

export default class GenderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ key: strings('FEMALE'), name: strings('FEMALE') }, { key: strings('MALE'), name: strings('MALE') }]
        };
    }

    render() {
        const titleText = strings('GENDER');
        const subText = strings('SELECT_GENDER');
        return (
            <ListModal
                isOpen={this.props.isOpen}
                closeModal={this.props.closeModal}
                setOption={this.props.setGender}
                dataArray={this.state.data}
                title={titleText}
                subTitle={subText}
                selectedOption = {this.props.selectedGender}
                gender = {true}
            />
        );
    }
}
