import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import BaseLightbox from './BaseLightbox';
import localized from '../../utils/lang/localized';


const TermsDialog = ({children}) => (
    <BaseLightbox verticalPercent={0.7} horizontalPercent={0.9}>
        <Text style={styles.textHeader}>
            <Text style={{paddingTop: 10}}> תנאי שימוש{'\n'}</Text>
            <Text style={{paddingBottom: 20}}>ומדיניות פרטיות</Text>
        </Text>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={{fontSize: 14}}>
                {localized.terms.text}
            </Text>
        </ScrollView>
    </BaseLightbox>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 32,
        color: '#29a4dc',
        fontWeight: 'bold',
        textShadowColor: '#066793',
        textShadowOffset: {width: 0, height: 1},
        textAlignVertical: 'top'
    },
    contentContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20
    }
});
export default TermsDialog;