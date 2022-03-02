import React, { Component } from 'react';
import ListModal from '../listModal/ListModal';
import localized from '../../../utils/lang/localized';
import { strings } from '../../../utils/lang/I18n';

const WEEK = 'Week';
const MONTHLY = 'Monthly';
const YEAR = 'Year';


export default class FilterByModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ key: WEEK, name: strings('WEEK') }, { key: MONTHLY, name: strings('MONTH') },{ key: YEAR, name: strings('YEAR') }]
        };
    }

    render() {
        const titleText = strings('DISPLAY_STAT_BY');
        return (
            <ListModal
                isOpen={this.props.isOpen}
                closeModal={this.props.closeModal}
                setOption={this.props.setFilterBy}
                dataArray={this.state.data}
                title={titleText}
            />
        );
    }
}
