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
} from './firebaseModels';
import database from '@react-native-firebase/database';

export function getStartMethods(){
    console.log("\x1b[33m ~ file: Firebase.js ~ line 557 ~ getStartMethods ~ getStartMethods")
    database().ref(START_METHODS.REF).once('value').then((snapshot) => {
        console.log("\x1b[33m ~ file: firebaseActions.js ~ line 23 ~ snapshot ~ snapshot", snapshot)
    })
    // return await database()
    //     .ref(START_METHODS.REF)
    //     .once('value')
    //     .then((snapshot) => {
    //         const startMethods = [];
    //         console.log("\x1b[33m ~ file: Firebase.js ~ line 563 ~ .then ~ snapshot", snapshot)
    //         snapshot.forEach((child) => {
    //             const t = child.val();
    //             startMethods.push(t);
    //         });

    //         console.log("\x1b[33m ~ file: Firebase.js ~ line 571 ~ .then ~ startMethods", startMethods)

    //         return startMethods;
    //     })
    //     .catch((error) => {
    //         console.log('error in getting startMethods from firebase', error);
    //         throw error;
    //     });
}