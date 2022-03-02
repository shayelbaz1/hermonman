import React, {Component} from 'react';
import {Text, View} from 'react-native';


export default class HistoryDietComponent extends Component {

    constructor() {
        super();
        this.state = {
            id: '',
            type: '',
            date: ''
        };
    }

    decideTypeText(typeID) {
        switch (typeID) {
            case 'hermonman':
                this.setState({type: 'שיטת חרמון מן'});
                break;
            case 'speedy':
                this.setState({type: 'שיטת ספידי'});
                break;
            case 'vegetarian':
                this.setState({type: 'שיטה צמחונית'});
                break;
            case 'easyway':
                this.setState({type: 'שיטת הדרך הקלה'});
                break;
        }
    }

    componentWillMount() {
        let id = this.props.id;
        let type = this.props.type;
        let date = this.props.date;
        this.decideTypeText(type);
        this.setState({id: id, date: date});
    }

    renderComponent = () => {
        if (this.state.type.length > 0) {
            return (
                <View style={{width: 300}}>
                    <Text style={styles.textStyle}>{this.state.type}</Text>
                    <Text style={styles.textStyle}>{this.state.id}</Text>
                    <Text style={styles.textStyle}>{this.state.date}</Text>
                </View>
            )
        }
    };

    render() {
        return (
            <View style={styles.containerStyle}>
                {this.renderComponent()}
            </View>
        );
    }
}

const
    styles = {
        containerStyle: {
            backgroundColor: 'white',
            borderRadius: 10,
            borderColor: 'white',
            borderWidth: 2
        },
        textStyle: {
            fontSize: 14,
            fontWeight: 'bold'
        }
    };