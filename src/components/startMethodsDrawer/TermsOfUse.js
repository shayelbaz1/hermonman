import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, Text, View} from 'react-native';
import BaseLightbox from '../../scenes/dialogs/BaseLightbox';
import sceneManager from '../../scenes/sceneManager';
import { APP_BACKGROUND_CREAM_COLOR, APP_BUTTON_BACKGROUND, APP_TEXT_WHITE, APP_GRAY_TEXT, APP_TEXT_COLOR, APP_BACKGROUND_WHITE } from '../../assets/colors';
import { getStartDirection, strings } from '../../utils/lang/I18n';


const terms = {
    heb: 'הסכם שימוש באתר זה - \nהכניסה לאתר והשימוש בתכנים ובמידע המצויים בו, כפופים לקריאתכם ולהסכמתכם להסכם השימוש המפורט להלן, על כל פרטיו וחלקיו. \n התכנים הכלולים באתר זה, נועדו לספק מידע כללי בלבד, ואין לראות בהם תחליף להיוועצות באנשי מקצוע. אין לראות בהם המלצה או חוות דעת ואין לעשות בהם כל שימוש קודם שנועצתם ברופא, דיאטטיקן או מומחה אחר, לפי העניין. \n התכנים הכלולים באתר עשויים לשקף את דעתו הפרטית של כותבם. \n בעלי האתר, מפעיליו, הכותבים בו וכל אדם אחר הקשור באתר, לא ישאו באחריות מסוג כל שהוא לגבי המידע והתכנים הכלולים באתר או תוצאות השימוש בהם. המידע והתכנים באתר ניתנים כמות שהם, ואינם יכולים להוות תחליף להיוועצות ולקבלת חוות-דעת המתאימה לכל מקרה פרטי מאת הרופא, דיאטטיקן או מומחה אחר. אין לעשות שימוש ואין להסתמך על האמור באתר מבלי שנועצתם ראשית במומחה כאמור וכל שימוש או הסתמכות כאמור תעשה על אחריותו המלאה של המשתמש במידע האמור. \n כניסתכם לאתר מהווה ומייצגת את הסכמתכם המלאה, לפיה לא תהא לכם כל תביעה, דרישה, או טענה מכל סוג כלפי בעלי האתר, מפעיליו, הכותבים בו וכל אדם אחר הקשור באתר. \n כל זכויות הקניין הרוחני הקשורות באתר, לרבות העיצוב הגראפי, התכנים המקצועיים, בקוד המחשב המפעיל את האתר וכל מידע או תוכן אחר הכלולים בו, שייכות לחרמון מן בע"מ בלבד, ואין לעשות בהם כל שימוש, לרבות העתקתם, הפצתם, הצגתם בפומבי או מסירתם לצד שלישי כל שהוא, מבלי שניתנה הסכמת חרמון-מן בע"מ לכך, מראש ובכתב.',
    eng: "By entering this website you hereby agree to the following restrictions and covenants. To its entire contents and to all the paragraphs together and one by one please carefully review the entire restrictions and covenants including the following warnings before using the site. \n The contents of this website is meant to provide general information only and cannot replace a professional opinion. It is prohibited to accept the information on this website as a recommendation or as a medical opinion without a consultation with a physician or a specialist. \n \n The content of this website might reflect private opinions which haven't been tested with appropriate examinations and research. The website's management, operators, reporters and/or any person connected to or with the operation of this website is not in any way responsible for the accuracy of the information and contents of the website or the consequences of any usage. \n \n It is forbidden to make any use of the information without the personal advice of a physician or medical specialist. By entering the web site you agree to absolutely waive any demand, claim or complaint against the owners, the operators, the reporters or any person connected with this website. \n \n All rights of spiritual asset, property including graphic designs, professional contents, computer codes and any materials that are part of this website is owned by HERMON-MAN Ltd. only, and any use including copying, distribution, presentation \n usage, transferring or sending it to a third party without a written authorization from the owners is prohibited."
}


export default class TermsOfUser extends Component {
    constructor() {
        super();
    }


    getTermsByLanauage = () => {
       if(getStartDirection() === 'right')  {
           return terms.heb;
       } 

       return terms.eng;
    }

    onContinuePressed = () => {
        sceneManager.goToHomePageByUserStatus();
    };

     render() {
        const finishTitle=  strings('FINISH');
        const title = strings('TERMS');
        const bodyTerms = this.getTermsByLanauage();

        return (
            <BaseLightbox ref={ref => this.baseLightBox = ref} verticalPercent={0.7} horizontalPercent={0.9}>
            <View style={{ backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%', width: '100%',alignItems: 'center' }}>
                <View style={{ backgroundColor: APP_BACKGROUND_CREAM_COLOR }}>
                    <ScrollView style={{height:'80%'}}>
                    <View>
                        <Text style={[styles.titleStyle, { fontSize:30,marginBottom: 20, color: APP_TEXT_COLOR }]}>{title}</Text>
                        <Text style={{textAlign:'center',marginHorizontal:5}}>{bodyTerms}</Text>
                    </View>

                    </ScrollView>
                     
                     <View style={{height:'20%',alignSelf:'center',justifyContent:'center'}}>
                        <TouchableOpacity onPress={this.onContinuePressed} style={{ justifyContent:'center',alignItems: 'center',marginTop:30,backgroundColor:APP_BUTTON_BACKGROUND,width: 200, height: 40, borderRadius: 100 / 2 }}>
                            <Text style={{textAlign:'center',alignSelf:'center',color:APP_TEXT_WHITE,fontSize:20}}>{finishTitle}</Text>
                        </TouchableOpacity>
                     </View>
                </View>

            </View>
            </BaseLightbox>
        )
    }
}

const styles = {
    titleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign:'center'
    },
    containerStyle: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    viewStyle:{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
    numberViewBox : { alignItems: 'center', justifyContent: 'center', borderRadius: 12, height: 100, width: 100, borderWidth: 1, borderColor: APP_TEXT_COLOR, backgroundColor: APP_BACKGROUND_WHITE },
};