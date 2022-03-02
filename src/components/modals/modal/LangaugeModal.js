import React, { Component } from 'react';
import ListModal from '../listModal/ListModal';
import localized from '../../../utils/lang/localized';
import { strings } from '../../../utils/lang/I18n';


export default class LanguageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ key: 'English', name: strings('ENGLISH') }, { key: 'Hebrew', name: strings('HEBREW') }]
        };
    }

    render() {
        const titleText = strings('LANG');
        const subText = strings("SELECT_LANG");
        return (
            <ListModal
                isOpen={this.props.isOpen}
                closeModal={this.props.closeModal}
                setOption={this.props.setOption}
                dataArray={this.state.data}
                title={titleText}
                subTitle={subText}
                selectedOption = {this.props.selectedLanguage}
            />
        );
    }
}