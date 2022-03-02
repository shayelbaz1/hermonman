import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, Text, View} from 'react-native';
import {Icon} from 'native-base';
import BaseLightbox from '../dialogs/BaseLightbox';
import HermonManButton from '../../components/common/hermonManButton/HermonManButton';
import sceneManager from '../sceneManager';
import localized from '../../utils/lang/localized';
import firebase from '../../utils/firebase/Firebase';
import {
	APP_BACKGROUND_CREAM_COLOR,
	APP_BUTTON_BACKGROUND,
	APP_TEXT_WHITE,
	APP_GRAY_TEXT,
	APP_TEXT_COLOR,
	APP_BACKGROUND_WHITE,
} from '../../assets/colors';
import {getStartDirection, strings} from '../../utils/lang/I18n';

const dietExplination = {
	heb:
		'תוכנה ייחודית אינטראקטיבית היודעת לבחור למטופל את התפריט הנכון בזמן אמת.\nהאפליקציה מאפשרת לבחור מה רוצים לאכול ובאיזה שיטת דיאטה.\nתוכנה המדמה ביקור במרפאה כולל צ׳אט עם הרופא ופיקוח רפואי מלא.\nתוכנית ״הדיאטה המנצחת״ מאפשרת ירידה במשקל עד 20 ק״ג בשלושה חודשים, \nבחמש שיטות דיאטה לירידה במשקל ושתי שיטות דיאטה לשמירה על המשקל. \nתצוגה גרפית של כל שלבי התוכנית, הסטוריה ובחינת קצב הירידה במשקל כנגד התפריט דיאטתי עשיר. ניתן לעבור בין שיטות הדיאטה השונות.\nשבוע ניסיון חינם',
	eng:
		'Unique interactive app that knows how to choose the right menu at the right time for the user of this app. This app allows you to choose what you want to eat from a Varied and rich menu. and gives you options to choose from 5 methods of diet and 2 methods of keeping you from gaining weight. You can switch the method of diet when you feel like it, The "Doctors Diet" allows you to lose up to 20 kilos (45 pounds) in 3 month. You will have Graphic display through all stages of the program of your history and rate of weight loss.',
};

const methodTypes = {
	heb:
		'לבחירה אחת מהתוכניות לירידה במשקל\nשיטת הדיאטה של חרמון מן ״הדיאטה המנצחת״\nשיטת הדיאטה של ספירת קלוריות\nשיטת הדיאטה המהירה ״ספידי״\nשיטת הדיאטה בדרך הקלה\nשיטת הדיאטה הצימחונית\n\nלבחירה שתי תוכניות לשמירה על המשקל\nשיטת השמירה לפי חרמון מן ״הדיאטה המנצחת״\nשיטת השמירה לפי ספירת קלוריות\n',
	eng:
		'You can choose one of these diet methods: \nThe "hermon man" method\nCalorie method\nSpeedy diet method\nThe easy way method\nVegetarian method\nYou can choose one of these weight maintain method:\nHermon man maintain method\nCalories maintain method',
};

const hermonManExplnation = {
	heb:
		'שיטת חרמון משלבת ידע סיני עתיק עם טכנולוגיה וידע מודרני. השיטה ייחודית ומצריכה דיוק רב בביצוע. מטרתה בשלב הראשוני להוריד במשקל בקצב מהיר ובריא, ובשלב השני לשמור לאורך זמן על המשקל. ביצוע נכון והתמדה יאפשרו הצלחה בשני השלבים. תפקידי הדיאטה המיוחדת הם: להוריד במשקל בשלב הראשון ולשמור לעומת זאת על המשקל בשלב השני. משך הטיפול של השלב הראשון כשלושה חודשים. ניתן לחזור על שלב זה מספר פעמים עד להשגת המשקל האופטימלי (אותו נחשב לכל אחד בנפרד). אנו נשתדל להוריד ממשקלכם עד כעשרים ק"ג במשך שלושה חודשים או 10% מעודף המשקל. לאלה מכם שצריכים להוריד יותר מ- -20 ק"ג או לא הצליחו להוריד ממשקלם מספיק ולהגיע למשקלם האופטימלי ניתן לחזור שוב על שלב זה ולעשות מחזור טיפול נוסף. \nהדיאטה הינה ייחודית. לא מדובר בדיאטה קלורית אלה בניסיון להפריד עד מידת האפשר את אבות המזון וליצור צירופי מזון נכונים שיאפשרו לכם לאכול ללא הגבלה כמותית ולהמשיך לרדת במשקל. צירופי המזון יבחרו על ידכם. יש לזכור שבכל תוצר מזון שתבחרו תמיד יש את כל אבות המזון.\n\tתפקידנו במסגרת השיטה ליצור צירופי מזון מאלה האהובים עליכם. הדיאטה הינה אישית ומותאמת לכל אחד בהתאם לרצונו, גילו, ומצב בריאותו. השיטה שלנו מותנית ומחייבת דיוק רב והתמדה. אין לחרוג מהצרופים הנתונים אף לא בפרור אחד, אולם ניתן לאכול מאותם צרופים ללא הגבלה של כמות או זמן הארוחה.\nלהבדיל מדיאטה קלורית אשר בא ניתן לאזן ולווסת את כמות הקלוריות בשיטה שלנו כל קלקול או חריגה יגרום לפגיעה בקצב הירידה במשקל.\n',
	eng:
		'Your goals during this Hermonman diet method will be: 1) To lose as much weight as required to reach your optimal weight. If you are overweight by more than 45 pound, you may continue the treatment immediately following the completion of the first one. Average weight loss will be 10% of the overweight weekly, up to the total of 45 pound. 2) To try getting your body used to three nutritious meals a day, with no between-meal snacks. 3) To try to establish such eating habits which will suit and satisfy you as well as help you maintain your optimal weight. You may be able to perform any physical activity with no limitations whatsoever, including swimming. Before you may start diet, report to your doctor of any health‎ problem you may have!!!‎ For the treatment to be successful, and for a satisfied feeling after a very small meal, Diet must be followed for the first 7 days. The diet prescribed is normally a weekly diet based on isolation of nutrients. Throughout the dieting period, no sugar is allowed. The sweeteners‎ allowed are saccharine and aspartame. The hermonman method will give you the best results bat you can chose all the other methods of our program. We wish you the best of luck!!‎',
};

const firstDisplay = 'learningApp';
const secondDisplay = 'learningDiets';
const thirdDisplay = 'learningHermonManMethod';
const fourthDisplay = 'goToAllDiets';

export default class AppExplantion extends Component {
	constructor() {
		super();
		this.state = {
			display: firstDisplay,
			user: '',
		};
	}

	componentDidMount() {
		firebase.getCurrentUser().then((user) => {
			console.log('0. fourth user:::::: ', user);
			this.setState({user}, console.log('0. fourth user state', this.state.user));
		});
	}

	getExplinationByLanauage = (data) => {
		if (getStartDirection() === 'right') {
			return data.heb;
		}

		return data.eng;
	};

	onContinuePressed = () => {
		const {display} = this.state;
		let displayNew = '';
		if (display === firstDisplay) {
			displayNew = secondDisplay;
		} else if (display === secondDisplay) {
			displayNew = thirdDisplay;
		} else if (display === thirdDisplay) {
			displayNew = fourthDisplay;
		}

		this.setState({display: displayNew}, () => console.log('3. fourth?', this.state.display));
	};

	renderBody = () => {
		const {display} = this.state;
		const learnTheAppTitle = strings('LEARN_THE_APP');
		const learnTheDietsTtitle = strings('LEARN_THE_DIETS');
		const learningHermonMan = strings('LEARN_THE_HERMONMAN');

		const explinationBody = this.getExplinationByLanauage(dietExplination);
		const methodTypesBody = this.getExplinationByLanauage(methodTypes);
		const hermonmanBody = this.getExplinationByLanauage(hermonManExplnation);

		switch (display) {
			case firstDisplay:
				return (
					<View>
						<Text style={[styles.titleStyle, {fontSize: 30, marginBottom: 20, color: APP_TEXT_COLOR}]}>
							{learnTheAppTitle}
						</Text>
						<Text style={{textAlign: 'center', marginHorizontal: 5}}>{explinationBody}</Text>
					</View>
				);
			case secondDisplay:
				return (
					<View>
						<Text style={[styles.titleStyle, {fontSize: 30, marginBottom: 20, color: APP_TEXT_COLOR}]}>
							{learnTheDietsTtitle}
						</Text>
						<Text style={{textAlign: 'center', marginHorizontal: 5, fontSize: 16}}>{methodTypesBody}</Text>
					</View>
				);
			case thirdDisplay:
				return (
					<View>
						<Text style={[styles.titleStyle, {fontSize: 30, marginBottom: 20, color: APP_TEXT_COLOR}]}>
							{learningHermonMan}
						</Text>
						<Text style={{textAlign: 'center', marginHorizontal: 5}}>{hermonmanBody}</Text>
					</View>
				);
			case fourthDisplay:
				break;
		}
	};

	goToDietsRender = () => {
		const {user} = this.state;
		if (this.baseLightBox) {
			sceneManager.goToHome(user);
		}
	};

	render() {
		const {display} = this.state;
		const continueTitle = strings('CONTINUE');
		const buttonTitle = display === thirdDisplay ? strings('FINISH') : continueTitle;
		const onPressButton = display === thirdDisplay ? this.goToDietsRender : this.onContinuePressed;

		return (
			<BaseLightbox ref={(ref) => (this.baseLightBox = ref)} verticalPercent={0.7} horizontalPercent={0.9}>
				<View
					style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR, height: '100%', width: '100%', alignItems: 'center'}}>
					<View style={{backgroundColor: APP_BACKGROUND_CREAM_COLOR}}>
						<ScrollView style={{height: '80%'}}>{this.renderBody()}</ScrollView>

						<View style={{height: '20%', alignSelf: 'center', justifyContent: 'center'}}>
							<TouchableOpacity
								onPress={onPressButton}
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: 30,
									backgroundColor: APP_BUTTON_BACKGROUND,
									width: 200,
									height: 40,
									borderRadius: 100 / 2,
								}}>
								<Text style={{textAlign: 'center', alignSelf: 'center', color: APP_TEXT_WHITE, fontSize: 20}}>
									{buttonTitle}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</BaseLightbox>
		);
	}
}

const styles = {
	titleStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	viewStyle: {justifyContent: 'center', alignItems: 'center', flexDirection: 'row'},
	numberViewBox: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 12,
		height: 100,
		width: 100,
		borderWidth: 1,
		borderColor: APP_TEXT_COLOR,
		backgroundColor: APP_BACKGROUND_WHITE,
	},
};
