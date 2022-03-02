// Libraries //

import moment from "moment";
import { Icon } from "native-base";
import React, { Component } from "react";
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { APP_BACKGROUND_CREAM_COLOR, APP_BUTTON_BACKGROUND, APP_TEXT_COLOR, APP_TEXT_WHITE } from "../../assets/colors";
import { CALORIES, CALORIES_MATINATIN, HERMONMAN_MAINTAIN } from "../../utils/data/DietTypes";
import firebase from "../../utils/firebase/Firebase";
import { getStartDirection, strings } from "../../utils/lang/I18n";
import Language from "../../utils/lang/Language";
import sceneManager from "../sceneManager";
import SelectedMenuForCalories from "../startMethods/caloriesDiet/SelectedMenuForCalories";

const HERMON_KEY = "hermonman";
const SPEEDY_KEY = "speedy";
const VEGETRIAN_KEY = "vegetarian";
const EASY_WAY_KEY = "easyway";
const HERMON_MANTIANE_KEY = "hermonmanMaintain";
const CALORIES_KEY = CALORIES;
const CALORIES_MATINAIN_KEY = CALORIES_MATINATIN;

export default class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            diet: {},
            parsedDiet: {},
            userLoaded: false,
            staticDietsArray: [],
            hermonManValidation: false,
            methodValidation: false,
            displaySwitchDiets: true,
            staticDietLoaded: false,
            stepNumber: NaN,
        };
    }

    componentWillMount() {
        console.log("dietChange componentWillMount");
        firebase
            .getCurrentUser()
            .then(user => {
                this.setState({ user: user, userLoaded: true });
                firebase.getLastDiet(user).then(diets => {
                    const diet = diets[diets.length - 1];
                    console.log("\x1b[33m ~ file: Progress.js ~ line 48 ~ firebase.getLastDiet ~ diets", diets)
                    console.log("diet1 diet::::::::::::::: ", diet);
                    this.setState({ diet });
                    if (
                        diet.methodType !== CALORIES ||
                        diet.methodType !== CALORIES_MATINAIN_KEY
                    ) {
                        firebase
                            .getStaticDiets()
                            .then(staticDiets => {
                                console.log(
                                    "0. dietChange id staticDiets::::::::::::::: ",
                                    staticDiets
                                );
                                console.log(
                                    "1. dietChange id staticDiets lastdiet::::::::::::::: ",
                                    diet
                                );

                                const dietFound = staticDiets.find(dietObject => {
                                    return (
                                        diet.methodType.toString() === dietObject.methodType.toString() &&
                                        diet.dietId.toString() === dietObject.dietId.toString()
                                    );
                                });
                                console.log(
                                    "2. dietChange id dietFound::::::::::::::: ",
                                    dietFound
                                );
                                this.setState(
                                    { parsedDiet: dietFound, staticDietLoaded: true },
                                    () =>
                                        console.log(
                                            "getDietName diet::::::::::: ",
                                            this.state.parsedDiet
                                        )
                                );
                            })
                            .catch(err => {
                                console.log("error with getStaticDiets", err);
                            });
                    }
                });
            })
            .catch(err => {
                console.log(
                    "There was an error getting one of the diets in progress page: ",
                    err
                );
            });
    }

    renderDiet = () => {
        const displayTip = this.state.parsedDiet.tip && this.state.parsedDiet.tip.eng != "" && this.state.parsedDiet.tip.heb != "";
        const { methodType } = this.state.diet;
        if (
            methodType !== HERMONMAN_MAINTAIN &&
            this.state.parsedDiet &&
            this.state.parsedDiet.text
        ) {
            console.log("diet1 diet renderDiet"); 
            return (
                <View>
                    <Text style={{ marginHorizontal: 20, textAlign: "center" }}>
                        {Language.getDataByLanguage(
                            this.state.parsedDiet.text,
                            this.state.user.language
                        )}
                    </Text>
                    {displayTip && (
                        <Text style={{ marginHorizontal: 20, textAlign: "center" }}>
                            {"\n"}
                            {this.state.user.language === "English" ? "Tip:" : "טיפ:"}

                            {"\n"}
                            {Language.getDataByLanguage(
                                this.state.parsedDiet.tip,
                                this.state.user.language
                            )}
                        </Text>
                    )}
                </View>
            );
        } else if (this.state.parsedDiet && this.state.parsedDiet.text) {
            return (
                <View>
                    <Text style={{ marginHorizontal: 20, textAlign: "center" }}>
                        {Language.getDataByLanguage(
                            this.state.parsedDiet.text,
                            this.state.user.language
                        )}
                    </Text>
                    {displayTip && (
                        <Text style={{ marginHorizontal: 20, textAlign: "center" }}>
                            {"\n"}
                            {this.state.user.language === "English" ? "Tip:" : "טיפ:"}

                            {"\n"}
                            {Language.getDataByLanguage(
                                this.state.parsedDiet.tip,
                                this.state.user.language
                            )}
                        </Text>
                    )}
                </View>
            );
        }
    };

    checkIfInsertAlreadyWeightOnDay = async () => {
        const { user } = this.state;
        const todayDate = moment()
            .format("DD/MM/YYYY")
            .toString();
        return firebase
            .insertAlreadyWeightOnDay(user, todayDate)
            .then(res => {
                return res;
            })
            .catch(() => {
                return false;
            });
    };

    checkDateDifference() {
        let currentDate = moment();
        let dietDate = moment(this.state.diet.date, "DD/MM/YYYY");
        let duration = moment.duration(currentDate.diff(dietDate));
        console.log("1. checkDateDifference duration::::::::", duration);
        var days = duration.asDays();
        console.log("1. checkDateDifference days::::::::", days);
        console.log(
            "1. checkDateDifference this.state.parsedDiet::::::::",
            this.state.diet
        );
        let daysRound = parseFloat(days.toString()).toFixed();
        if (
            this.state.diet.methodType === HERMONMAN_MAINTAIN ||
            this.state.parsedDiet.days >= daysRound
        ) {
            return false;
        } else {
            return true;
        }
    }

    goToCorrectScreen() {
        const { methodType } = this.state.diet;
        switch (methodType) {
            case HERMON_KEY:
                sceneManager.goToFoodChoose();
                break;
            case SPEEDY_KEY:
                sceneManager.goToDietsRenderer([], SPEEDY_KEY);
                break;
            case VEGETRIAN_KEY:
                sceneManager.goToDietsRenderer([], VEGETRIAN_KEY);
                break;
            case EASY_WAY_KEY:
                sceneManager.goToDietsRenderer([], EASY_WAY_KEY);
                break;
            case CALORIES_KEY:
                sceneManager.goToCaloriesDiet([], CALORIES_KEY);
                break;
            case CALORIES_MATINAIN_KEY:
                console.log("goToCorrectScreen go to calories diet:::::");
                sceneManager.goToCaloriesDiet(CALORIES_MATINAIN_KEY);
                break;
        }
    }

    switchScreenDiet = () => {
        const dietAdvice = strings("ADVICE_WHILE_CHANGING_DIET");
        const alert = strings("ALERT");
        if (this.checkDateDifference() || this.state.hermonManValidation) {
            console.log("goToCorrectScreen switchScreenDiet:::::");
            this.goToCorrectScreen();
        } else {
            Alert.alert(alert, dietAdvice);
            this.setState({ hermonManValidation: true });
        }
    };

    getDietName = () => {
        const { diet } = this.state;
        const { methodType } = diet;
        const myMenu = strings("MY_MENU");
        const hermonmanMaintainName = strings("HERMON_MAINTAIN_NAME");
        if (methodType === CALORIES || methodType === CALORIES_MATINATIN) {
            console.log("3. dietdiet CALORIES || CALORIES_MATINATIN");
            return myMenu;
        } else if (methodType !== HERMONMAN_MAINTAIN) {
            console.log("3. dietdiet not HERMONMAN_MAINTAIN");
            let { dietDescription } = this.state.parsedDiet || {};
            dietDescription = {
                heb: "",
                eng: "",
                ...dietDescription
            };
            console.log(
                "4. dietdiet this.state.parsedDiet::::",
                this.state.parsedDiet
            );
            console.log("5. dietdiet dietDescription ::::", dietDescription);
            return Language.getDataByLanguage(dietDescription);
        } else if (methodType === HERMONMAN_MAINTAIN) {
            console.log("3. dietdiet HERMONMAN_MAINTAIN");
            return hermonmanMaintainName;
        }
    };

    convertDateStringToDate = dateString => {
        const parts = dateString.split("/");
        const convertStringToDate = moment([parts[2], parts[1] - 1, parts[0]]);

        return convertStringToDate;
    };

    checkDateIsSame = (date, expireSubscriptionFree) => {
        const mDate = moment(date);
        return (
            mDate.isSame(expireSubscriptionFree, "day") &&
            mDate.isSame(expireSubscriptionFree, "year") &&
            mDate.isSame(expireSubscriptionFree, "month")
        );
    };

    displaySwitchDietsInMethod = () => {
        const { user } = this.state;
        const { registerDate } = user;
        const registerDateConverted = registerDate
            ? this.convertDateStringToDate(registerDate)
            : undefined;
        const freeSubscriptionUntil = registerDate
            ? moment(registerDateConverted).add(7, "days")
            : undefined;
        const today = moment(new Date());
        let displaySwitchDiets = true;
        if (
            freeSubscriptionUntil &&
            (today.isBefore(freeSubscriptionUntil) ||
                this.checkDateIsSame(today, freeSubscriptionUntil))
        ) {
            displaySwitchDiets = false;
        }

        console.log(
            "1 .displaySwitchDietsInMethod displaySwitchDiets:::::",
            displaySwitchDiets
        );

        return displaySwitchDiets;
    };

    exitToHomeScreen = () => {
        firebase
            .getCurrentUser()
            .then(user => {
                firebase.updateHermonManUserStatus(user, "1").then(() => {
                    sceneManager.goToHome(user);
                });
            })
            .catch(err => {
                console.log("There was an error with getting user: ", err);
            });
    };

    switchDiet = () => {
        const noteTitle = strings("NOTE");
        const changeMethodQuest = strings("CHANGE_METHOD_QUEST");
        const alertButton = [
            { text: strings("OK"), onPress: this.exitToHomeScreen },
            {
                text: strings("CANCEL"),
                onPress: () => sceneManager.goBack
            }
        ];

        Alert.alert(noteTitle, changeMethodQuest, alertButton);
    };

    updateMaintainDiet(id) {
        console.log("1. dietChange updateMaintainDiet id", id);
        firebase
            .getCurrentUser()
            .then(user => {
                var currentDate = moment().format("DD/MM/YYYY");
                var diet = {
                    dietId: id,
                    dietType: "maintain",
                    methodType: "hermonmanMaintain",
                    date: currentDate.toString()
                };
                firebase.updateHermonManUserDiet(user, diet).then(res => {
                    console.log("1. dietChange updateMaintainDiet res", res);
                    sceneManager.refresh(0);
                });
            })
            .catch(err => {
                console.log("There was a problem getting the user: ", err);
            });
    }

    getIdStep = id => {
        if (id === 0) {
            return "שלב א שמירה";
        } else if (id === 1) {
            return "שלב ב שמירה";
        } else if (id === 2) {
            return "שלב ג שמירה";
        } else if (id === 3) {
            return "שלב ד שמירה";
        }
    };

    getNextStep = id => {
        switch (id) {
            case "שלב א שמירה":
                return "שלב ב שמירה";
            case "שלב ב שמירה":
                return "שלב ג שמירה";
            case "שלב ג שמירה":
                return "שלב ד שמירה";
            default:
                return "";
        }
    };

    getPerviosStep = id => {
        switch (id) {
            case "שלב ב שמירה":
                return "שלב א שמירה";
            case "שלב ג שמירה":
                return "שלב ב שמירה";
            case "שלב ד שמירה":
                return "שלב ג שמירה";
            default:
                return "";
        }
    };

    goToCorrectMaintainScreen(direction, stepId) {
        let currentIdDiet = this.getIdStep(stepId);
        let id;
        console.log("2. dietChange id::::::", currentIdDiet);
        switch (direction) {
            case "forward":
                id = this.getNextStep(currentIdDiet);
                this.updateMaintainDiet(id);
                break;
            case "backwards":
                id = this.getPerviosStep(currentIdDiet);
                this.updateMaintainDiet(id);
                break;
        }
    }

    switchHermonManMaintain = (direction, id) => {
        const noteTitle = strings("NOTE");
        const changeDietQuest = strings("MIN_TIME_FOR_DIET");
        const alertButton = [
            { text: strings("OK"), onPress: () => sceneManager.goBack }
        ];
        console.log("0. dietChange switchHermonManMaintain");

        if (this.checkDateDifference() || this.state.hermonManValidation) {
            console.log("1. dietChange gotocorrect maintain");
            this.goToCorrectMaintainScreen(direction, id);
        } else {
            Alert.alert(noteTitle, changeDietQuest, alertButton);
            this.setState({ hermonManValidation: true });
        }
    };

    getRtl = () => {
        return getStartDirection() === "right" ? true : false;
    };

    getFlexDirection = () => {
        return this.getRtl()
            ? { flexDirection: "row-reverse" }
            : { flexDirection: "row" };
    };

    getStepNumber = () => {
        const { dietId } = this.state.diet;
        if (dietId === "שלב א שמירה") {
            return 0;
        } else if (dietId === "שלב ב שמירה") {
            return 1;
        } else if (dietId === "שלב ג שמירה") {
            return 2;
        } else if (dietId === "שלב ד שמירה") {
            return 3;
        }
    };

    switchHermonManMaintainByID = () => {
        const forwordNextLevel = strings("NEXT_STEP");
        const gainWeight = strings("GAIN_WEIGHT_STEP");
        const flexDirection = this.getFlexDirection();

        const dietId = this.getStepNumber();
        const nextStep = dietId + 2;
        const prevStep = dietId;
        if (isNaN(this.state.stepNumber)) {
            this.setState({stepNumber: dietId + 1});
        }

        const happyIcon = "emoji-happy";
        const sadIcon = "emoji-sad";

        const sadIconType = "Entypo";
        const happyIconType = "Entypo";

        switch (dietId) {
            case 0:
                return (
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => this.switchHermonManMaintain("forward", 0)}
                    >
                        <Text style={styles.textButton}>
                            {forwordNextLevel + " " + nextStep}
                        </Text>
                    </TouchableOpacity>
                );
            case 1:
                return (
                    <View>
                        <TouchableOpacity
                            style={[styles.buttonStyle, flexDirection]}
                            onPress={() => this.switchHermonManMaintain("backwards", 1)}
                        >
                            <Text style={styles.textButton}>
                                {gainWeight + " " + prevStep}
                            </Text>
                            <Icon
                                name={sadIcon}
                                style={styles.iconStyle}
                                type={sadIconType}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.buttonStyle, flexDirection]}
                            onPress={() => this.switchHermonManMaintain("forward", 1)}
                        >
                            <Text style={styles.textButton}>
                                {forwordNextLevel + " " + nextStep}
                            </Text>
                            <Icon
                                name={happyIcon}
                                style={styles.iconStyle}
                                type={happyIconType}
                            />
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <View>
                        <TouchableOpacity
                            style={[styles.buttonStyle, flexDirection]}
                            onPress={() => this.switchHermonManMaintain("backwards", 2)}
                        >
                            <Text style={styles.textButton}>
                                {gainWeight + " " + prevStep}
                            </Text>
                            <Icon
                                name={sadIcon}
                                style={styles.iconStyle}
                                type={sadIconType}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.buttonStyle, flexDirection]}
                            onPress={() => this.switchHermonManMaintain("forward", 2)}
                        >
                            <Text style={styles.textButton}>
                                {forwordNextLevel + " " + nextStep}
                            </Text>
                            <Icon
                                name={happyIcon}
                                style={styles.iconStyle}
                                type={happyIconType}
                            />
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                return (
                    <TouchableOpacity
                        style={[styles.buttonStyle, flexDirection]}
                        onPress={() => this.switchHermonManMaintain("backwards", 3)}
                    >
                        <Text style={styles.textButton}>{gainWeight + " " + prevStep}</Text>
                        <Icon name={sadIcon} style={styles.iconStyle} type={sadIconType} />
                    </TouchableOpacity>
                );
        }
    };

    goToInsertWeight = () => {
        const insertAlreadyMsg = strings("INSERT_WEIGHT_ERR");
        const alertButton = [
            { text: strings("OK"), onPress: () => sceneManager.goBack }
        ];
        return this.checkIfInsertAlreadyWeightOnDay().then(alreadyInsertWeight => {
            if (!alreadyInsertWeight) {
                sceneManager.goToInsertWeightDialog();
            } else {
                Alert.alert("", insertAlreadyMsg, alertButton);
            }
        });
    };

    renderButtonByDietType = () => {
        const displaySwitchDiets = this.displaySwitchDietsInMethod();
        const { methodType } = this.state.diet;
        const dietTypeText = this.getTextDietType();
        const changeMethodText = strings("CHANGE_METHODֿ_ID_DIET");
        console.log("dietTypeButton methodType", methodType);
        console.log("dietTypeButton HERMON_MANTIANE_KEY", HERMON_MANTIANE_KEY);
        console.log("dietTypeButton ?", HERMON_MANTIANE_KEY === methodType);
        console.log("dietTypeButton displaySwitchDiets", displaySwitchDiets);

        const buttonText = changeMethodText + " " + dietTypeText;
        if (
            (methodType === CALORIES || methodType === CALORIES_MATINATIN) &&
            displaySwitchDiets
        ) {
            console.log("dietTypeButton calories");
            return null;
        }
        if (methodType !== HERMON_MANTIANE_KEY && displaySwitchDiets) {
            console.log("dietTypeButton !== HERMON_MANTIANE_KEY");
            return (
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={this.switchScreenDiet}
                >
                    <Text style={styles.textButton}>{buttonText}</Text>
                </TouchableOpacity>
            );
        } else if (methodType === HERMON_MANTIANE_KEY && displaySwitchDiets) {
            console.log("dietTypeButton HERMON_MANTIANE_KEY");
            return this.switchHermonManMaintainByID();
        }
        if (!displaySwitchDiets) {
            console.log("dietTypeButton !displaySwitchDiets");
            return null;
        }
    };

    getTextDietType = () => {
        const { methodType } = this.state.diet;

        switch (methodType) {
            case HERMON_KEY:
                return strings("HERMON_NAME");
            case SPEEDY_KEY:
                return strings("SPEEDY_NAME");
            case VEGETRIAN_KEY:
                return strings("VEG_NAME");
            case EASY_WAY_KEY:
                return strings("EASYWAY_NAME");
            case HERMON_MANTIANE_KEY:
                return strings("HERMONMAN_MANTAINE_NAME");
            case CALORIES_KEY:
                return strings("CALORIT_NAME");
            case CALORIES_MATINAIN_KEY:
                return strings("CALORIES_MATINATIN");
            default:
                return "";
        }
    };

    getHeightForScrollViewByPlatform = methodType => {
        return Platform.OS === "ios"
            ? { height: "45%" }
            : methodType === CALORIES_MATINATIN || methodType === CALORIES_KEY
            ? { height: "50%" }
            : { height: "35%" };
    };

    getHeightForViewByPlatform = methodType => {
        return Platform.OS === "ios"
            ? { height: "50%" }
            : methodType === CALORIES_MATINATIN || methodType === CALORIES_KEY
            ? { height: "60%" }
            : { height: "40%" };
    };

    renderContent = () => {
        const { methodType } = this.state.diet;
        const { staticDietLoaded } = this.state;
        const heightForView = this.getHeightForViewByPlatform(methodType);
        const heightForScrollView = this.getHeightForScrollViewByPlatform(
            methodType
        );

        if (methodType === CALORIES || methodType === CALORIES_MATINATIN) {
            return <View style={heightForView}>{this.renderCalories()}</View>;
        }

        return (
            <View>
                <ScrollView style={{...heightForScrollView, backgroundColor: 'white'}} persistentScrollBar>
                    {this.renderDiet()}
                </ScrollView>
            </View>
        );
    };

    getTextButton = () => {
        const { methodType } = this.state.diet;
        if (
            methodType === CALORIES_MATINATIN ||
            methodType === HERMONMAN_MAINTAIN
        ) {
            return strings("CHANGE_DIET_MAINTAIN");
        }

        return strings("CHANGE_DIET");
    };

    renderCalories = () => {
        const { diet } = this.state;
        console.log("dietdietdiet diet", diet);
        return (
            <SelectedMenuForCalories
                methodType={diet.methodType}
                selectedMenu={diet.menu}
            />
        );
    };

    render() {
        const { staticDietLoaded } = this.state;
        const insertWeightText = strings("ENTER_WEIGHT");
        const changeDietText = this.getTextButton();
        let dietName = staticDietLoaded ? this.getDietName() : "";

        if (!isNaN(this.state.stepNumber)) {
            dietName = `${dietName}: ${strings('STEP')} ${this.state.stepNumber}`
        }
        // const title =
        //         diet && diet.methodType
        //                 ? diet.methodType === CALORIES_MATINATIN ||
        //                         diet.methodType == HERMONMAN_MAINTAIN
        //                         ? maintainProgress
        //                         : dietProgress
        //                 : "";
        const { userLoaded } = this.state;

        return (
            <View style={styles.containerStyle}>
                <View style={{ marginVertical: 10 }}>
                    <Text
                        style={{
                            alignSelf: "center",
                            fontSize: 20,
                            color: APP_TEXT_COLOR,
                            fontWeight: "bold"
                        }}
                    >
                        {dietName}
                    </Text>
                </View>

                {this.renderContent()}

                <View style={{ marginTop: "10%" }}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={this.goToInsertWeight}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 22,
                                color: APP_TEXT_WHITE
                            }}
                        >
                            {insertWeightText}
                        </Text>
                    </TouchableOpacity>

                    {userLoaded && this.renderButtonByDietType()}

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={this.switchDiet}
                    >
                        <Text style={styles.textButton}>{changeDietText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = {
    titleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "center"
    },
    buttonStyle: {
        width: 280,
        marginVertical: 10,
        backgroundColor: APP_BUTTON_BACKGROUND,
        height: 40,
        borderRadius: 40,
        justifyContent: "center",
        alignSelf: "center"
    },
    containerStyle: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: APP_BACKGROUND_CREAM_COLOR
    },
    textButton: {
        textAlign: "center",
        fontSize: 18,
        color: APP_TEXT_WHITE
    },
    iconStyle: {
        fontSize: 22,
        color: "white",
        marginHorizontal: 5,
        marginVertical: 4
    }
};
