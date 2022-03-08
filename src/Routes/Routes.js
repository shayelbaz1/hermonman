import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Keyboard } from 'react-native';
import { Drawer, Lightbox, Modal, Overlay, Router, Scene, Stack } from 'react-native-router-flux';
import { APP_TEXT_COLOR } from '../assets/colors';
import History from '../components/startMethodsDrawer/History';
import MenuIcon from '../components/startMethodsDrawer/MenuIcon';
import Profile from '../components/startMethodsDrawer/Profile';
import StartMethodsDrawer from '../components/startMethodsDrawer/StartMethodsDrawer';
import Statistics from '../components/startMethodsDrawer/Statistics';
import TermsOfUser from '../components/startMethodsDrawer/TermsOfUse';
import AppExplantion from '../scenes/afterRegister/AppExplantion';
import ContactUs from '../scenes/dialogs/ContactUs';
import FoodChoice from '../scenes/dialogs/FoodChoice';
import HermonManDialog from '../scenes/dialogs/HermonManDialog';
import InsertWeightDialog from '../scenes/dialogs/InsertWeightDialog';
import Settings from '../scenes/dialogs/Settings';
import TermsDialog from '../scenes/dialogs/TermsDialog';
import WriteUs from '../scenes/dialogs/WriteUs';
import HermonHeader from '../scenes/hermonHeader/HermonHeader';
import Home from '../scenes/homeScreens/Home';
import ForgotPassword from '../scenes/login/ForgotPassword';
import Login from '../scenes/login/Login';
import RegisterScreen from '../scenes/login/Registration';
import RedirectByUserStatus from '../scenes/login/Splash';
import Progress from '../scenes/progress/Progress';
import Purchase from '../scenes/purchase/Purchase';
import CalorieMethod from '../scenes/startMethods/calorieMethod/CalorieMethod';
import CaloriesDiet from '../scenes/startMethods/caloriesDiet/CaloriesDiet';
import DietsRenderer from '../scenes/startMethods/commonScreens/DietsRenderer';
import InsertWeight from '../scenes/startMethods/commonScreens/InsertWeight';
import ChooseFoodType from '../scenes/startMethods/hermonManMethod/ChooseFoodType';
import Payment from '../scenes/purchase/Payment';
import { initLocale, strings } from '../utils/lang/I18n';
import localized from '../utils/lang/localized';
import Products from '../scenes/products/Products';
import Regulations from '../scenes/purchase/Regulations';
import { NativeBaseProvider } from 'native-base';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import localStorage from '../utils/localStorage/localStorage';
import firebase from '../utils/firebase/Firebase';
import moment from 'moment';
import sceneManager from '../scenes/sceneManager';
import {
    FOOD_TYPES,
    START_METHODS,
    START_METHODS_MAINTAIN,
    STATIC_DIETS,
    USER,
    WRITE_US,
    FOOD_TYPE_HERMON,
    FREE_STATIC_DIETS,
    PRODUCTS,
    PAYMENT,
    ORDER,
    SUBSCRIPTIONS,
    PURCHASE_ENABLED,
} from '../utils/firebase/firebaseModels';

const Routes = () => {
    const [loading, setLoading] = React.useState(true)
    const Stack = createNativeStackNavigator();
    const StackHome = createNativeStackNavigator();
    const Drawer = createDrawerNavigator();
    const screenOptions = { headerShown: false }
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const navigation = useNavigation()
    console.log("\x1b[33m ~ file: App.js ~ line 62 ~ App ~ navigation", navigation)

    convertDateStringToDate = (dateString) => {
        const parts = dateString.split('/');
        const convertStringToDate = moment([parts[2], parts[1] - 1, parts[0]]);

        return convertStringToDate;
    };
    // Handle user state changes
    function onAuthStateChanged(user) {
        console.log("\x1b[33m ~ file: Routes.js ~ line 65 ~ onAuthStateChanged ~ user", user)
        if (!user) {
            if (initializing) setInitializing(false);
            return;
        }
        const firebaseUser = user._user
        const userId = firebaseUser.uid || firebaseUser.user.uid;
        let currentUser;

        database().ref(`${USER.REF}/${userId}`).on('value', snapshot => {
            const userRef = snapshot.val()
            currentUser = userRef
            console.log("\x1b[33m ~ file: Routes.js ~ line 92 ~ database ~ currentUser", currentUser)

            const { expireDate } = currentUser;
            const expireDateConverted = expireDate ? convertDateStringToDate(expireDate) : undefined;
            const today = moment(new Date());
            Keyboard.dismiss();
            // setUser(currentUser);

            if (currentUser.status === '0' || expireDateConverted.isBefore(today)) {
                sceneManager.goToPurchase(currentUser);
            } else if (currentUser.status === '1') {
                setUser(currentUser);

                // navigation.navigate('ForgotPassword',{ user: currentUser })
                // navigation.navigate('DrawerNavigator', { screen: 'Home', user: currentUser })
                // navigation.navigate('TermsDialog')

            } else {
                sceneManager.goToProgress(currentUser);
            }


            if (initializing) setInitializing(false);
        });
    }

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        database().ref('/users/aMEdcP536oMoBLTuVmHACFTvuf52').on('value', snapshot => {
            console.log("\x1b[33m ~ file: Routes.js ~ line 97 ~ database ~ snapshot.val()", snapshot.val())
        });

        return subscriber; // unsubscribe on unmount
    }, []);

    const sceneProps = () => {
        let header = renderHermonImage();

        return {
            header,
        };
    };

    const renderHermonImage = () => {
        return (
            <View style={{ alignSelf: 'center' }}>
                <HermonHeader />
            </View>
        );
    };

    function renderApp() {
        const hermonmanTitle = strings('HERMONMAN_TITLE');
        return (
            <Drawer.Navigator
                initialRouteName="Home"
                screenOptions={screenOptions}
            // key='StartMethodsDrawer'
            // title={localized.home.title}
            // drawerPosition='right'
            // drawerWidth={250}
            // contentComponent={StartMethodsDrawer}
            // drawerIcon={<MenuIcon />}
            >

                <Drawer.Screen name='Home' component={Home} option={{ ...sceneProps }} initialParams={{ user }} />
                {/* <Drawer.Screen name='CalorieMethod' component={CalorieMethod} />
                <Drawer.Screen name='Purchase' component={Purchase} option={{...sceneProps()}} />
                <Drawer.Screen name='Profile' component={Profile} option={{...sceneProps}} />
                <Drawer.Screen name='Statistics' component={Statistics} options={{...sceneProps}} />
                <Drawer.Screen name='History' component={History} options={{...sceneProps}} />
                <Drawer.Screen name='InsertWeight' component={InsertWeight} options={{...sceneProps}} />
                <Drawer.Screen name='DietsRenderer' component={DietsRenderer} options={{...sceneProps}} />
                <Drawer.Screen name='ChooseFoodType' component={ChooseFoodType} options={{...sceneProps}} />
                <Drawer.Screen name='FoodChoice' component={FoodChoice} options={{...sceneProps}} />
                <Drawer.Screen name='Progress' component={Progress} options={{...sceneProps}} />
                <Drawer.Screen name='Settings' component={Settings} options={{...sceneProps}} />
                <Drawer.Screen name='AppExplantion' component={AppExplantion} options={{...sceneProps}} />
                <Drawer.Screen name='TermsOfUse' component={TermsOfUser} options={{...sceneProps}} />
                <Drawer.Screen name='CaloriesDietRender' component={CaloriesDiet} options={{...sceneProps}} />
                <Drawer.Screen name='ContactUs' component={ContactUs} options={{...sceneProps}} />
                <Drawer.Screen name='WriteUs' component={WriteUs} options={{...sceneProps}} />
                <Drawer.Screen name='Payment' component={Payment} options={{...sceneProps}} />
                <Drawer.Screen name='Products' component={Products} options={{...sceneProps}} />
                <Drawer.Screen name='Regulations' component={Regulations} options={{...sceneProps}} /> */}
            </Drawer.Navigator>
        );
    }

    function renderLogin() {
        console.log("\x1b[33m ~ file: Routes.js ~ line 118 ~ renderLogin ~ renderLogin!")
        const hermonmanTitle = strings('HERMONMAN_TITLE');
        return (
            <Stack.Navigator
                // initialRouteName="Login"
                screenOptions={screenOptions}
            >
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='RedirectByUserStatus' component={RedirectByUserStatus} />
                <Stack.Screen name='RegisterScreen' component={RegisterScreen} option={{ ...sceneProps }} />
                <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
                <Stack.Screen name='Terms' component={TermsDialog} />
                <Stack.Screen name='HermonManDialog' component={HermonManDialog} />
                <Stack.Screen name='InsertWeightDialog' component={InsertWeightDialog} />
                {/* <Stack.Screen name='Home' component={Home} option={{ ...sceneProps }} /> */}
                {/* <Stack.Screen name='DrawerNavigator' component={RenderApp} /> */}
            </Stack.Navigator>
        );
    }

    if (initializing) return null;
    // return renderLogin()
    console.log("\x1b[33m ~ file: Routes.js ~ line 204 ~ Routes ~ user", user)
    if (!user) {
        return (
            renderLogin()
        )
    }
    return (
        renderApp()
        // renderLogin()
    )
}

export default Routes


// 									<Drawer
// 										>