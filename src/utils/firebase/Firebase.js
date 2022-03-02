//import firebase from 'firebase'
// import * as firebase from 'firebase';

// import '@firebase/messaging';
import config from './config.json';
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
import localStorage from '../localStorage/localStorage';
import moment from 'moment';
// import firebase from 'react-native-firebase';

class Firebase {
	static instance = null;

	static getInstance() {
		if (Firebase.instance === null) {
			Firebase.instance = new Firebase();
			Firebase.instance.init();
		}

		return Firebase.instance;
	}

	constructor() {
		this._firebaseApp = null;
	}

	init() {
		// this._firebaseApp = firebase.initializeApp(config);
		// this.messaging = this._firebaseApp.messaging();
	}

	// Get current user

	getCurrentUser() {
		// return this.onAuthStateChangedPromise()
		// 	.then((user) => {
		// 		return this.getUserById(user.uid);
		// 	})
		// 	.catch((error) => {
		// 		throw error;
		// 	});
	}

	onAuthStateChangedPromise() {
		// return new Promise(function(resolve, reject) {
		// 	firebase.auth().onAuthStateChanged(function(user) {
		// 		if (user) {
		// 			resolve(user);
		// 		} else {
		// 			reject(new Error('user not logged in'));
		// 		}
		// 	});
		// });
	}

	// Registration

	registerNewHermonManUser(newHermonManUser) {
		console.log('2. registerNewHermonManUser newHermonManUser', newHermonManUser);
		const {email, password} = newHermonManUser;
		return this._firebaseApp
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((firebaseUser) => {
				return localStorage.setCurrentUserMail(email).then(() => {
					return firebaseUser;
				});
			})
			.then((firebaseUser) => {
				console.log('3. registerNewHermonManUser firebaseUser', firebaseUser);
				return this.writeNewHermonManUserToDB(newHermonManUser, firebaseUser);
			})
			.catch((error) => {
				console.log(
					'2. error in this._firebaseApp.auth().createUserWithEmailAndPassword registerNewHermonManUser, with hermonmanUser:',
					newHermonManUser
				);
				console.log(
					'3. error in this._firebaseApp.auth().createUserWithEmailAndPassword registerNewHermonManUser',
					error
				);
				throw error;
			});
	}

	writeNewMessageToDB(userId, message) {
		const {subject, content, email, date, read} = message;

		let newMessage = {
			[WRITE_US.SUBJECT]: subject,
			[WRITE_US.CONTENT]: content,
			[WRITE_US.EMAIL]: email,
			[WRITE_US.DATE]: date,
			[WRITE_US.READ]: read,
		};

		let newMessageRef = this._firebaseApp
			.database()
			.ref(WRITE_US.REF)
			.push();
		return newMessageRef
			.set(newMessage)
			.then((error) => {
				console.log('3. writeNewMessageToDB error?', error);
				if (error) {
					console.log('4. writeNewMessageToDB error!!');
					console.log('error in set to ref:', newMessageRef);
					throw new Error('error in set new message in writeNewMessageToDB');
				} else {
					console.log('4. writeNewMessageToDB not error!');
					console.log('wrote new message to database:', newMessage);
					return newMessage;
				}
			})
			.catch((error) => {
				console.log('error at set message in database', error, newMessageRef);
				throw error;
			});
	}

	writeNewHermonManUserToDB(hermonmanUser, firebaseUser) {
		const {
			email,
			firstName,
			lastName,
			birthDate,
			expireDate,
			gender,
			language,
			registerDate,
			weight,
			height,
		} = hermonmanUser;
		console.log('registerNewHermonManUser hermonmanUser', hermonmanUser);
		const id = firebaseUser.user.uid;
		const dateForWeight = moment()
			.format('DD/MM/YYYY')
			.toString();
		// init the user object
		let newUser = {
			[USER.FIRST_NAME]: firstName,
			[USER.LAST_NAME]: lastName,
			[USER.BIRTH_DATE]: birthDate,
			[USER.EXPIRE_DATE]: expireDate,
			[USER.GENDER]: gender,
			[USER.LANGUAGE]: language,
			[USER.REGISTER_DATE]: registerDate,
			[USER.TYPE]: 'client',
			[USER.STATUS]: '1',
			[USER.METHOD]: 0,
			[USER.EMAIL]: email,
			[USER.DATA]: {
				weight: [{weight: weight, date: dateForWeight}],
				height: height,
			},
		};

		console.log('write newUser to database:', newUser);

		// init the ref and write to the DB
		let newUserRef = this._firebaseApp
			.database()
			.ref(USER.REF)
			.child(id);
		return newUserRef
			.set(newUser)
			.then((error) => {
				console.log('4.registerNewHermonManUser insertToDB error?', error);
				if (error) {
					console.log('5. registerNewHermonManUser insertToDB error!', error);
					console.log('error in set to ref:', newUserRef);
					throw new Error('error in set new user in writeNewHermonManUserToDB');
				} else {
					console.log('5. registerNewHermonManUser wrote new user to database', newUser);
					newUser[USER.ID] = id;
					console.log('wrote new user to database:', newUser);
					return newUser;
				}
			})
			.catch((error) => {
				console.log('error at set user in database', error, newUserRef);
				throw error;
			});
	}

	// Login

	signInHermonManUser(email, password) {
		if (email === '' || password === '') {
			return new Promise((resolve, reject) => {
				return resolve(null);
			});
		}
		return this._firebaseApp
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then((firebaseUser) => {
				return localStorage.setCurrentUserMail(email).then(() => {
					return firebaseUser;
				});
			})
			.then((firebaseUser) => {
				console.log('firebaseuser !!!!!!:   ', firebaseUser);
				const userId = firebaseUser.uid || firebaseUser.user.uid;
				console.log('firebaseuser USER ID!!!!!!:   ', userId);
				return this.getUserById(userId);
			})
			.catch((error) => {
				console.log('error in this._firebaseApp.auth().signInWithEmailAndPassword', error);
				throw error;
			});
	}

	// Purchase and update user

	updateHermonManUserStatus(user, status) {
		let newUserRef = this._firebaseApp.database().ref(`${USER.REF}/${user._id}`);
		return newUserRef
			.update({status: status})
			.then((res) => {
				console.log('The updated user is: ', res);
				return user;
			})
			.catch((err) => {
				console.log('Error in updating user: ', err);
				return false;
			});
	}

	updateUserExpirationRegistrationDate(user, expireDate, registerDate) {
		let newUserRef = this._firebaseApp.database().ref(`${USER.REF}/${user._id}`);
		return newUserRef
			.update({expireDate, registerDate})
			.then((res) => {
				console.log('The updated user is: ', res);
				return user;
			})
			.catch((err) => {
				console.log('Error in updating user: ', err);
				return false;
			});
	}

	updateHermonManUserLanguage(user, language) {
		let newUserRef = this._firebaseApp.database().ref(`${USER.REF}/${user._id}`);
		return newUserRef
			.update({language: language})
			.then((res) => {
				console.log('The updated user is: ', res);
				return user;
			})
			.catch((err) => {
				console.log('Error in updating user: ', err);
				return false;
			});
	}

	updateHermonManUserWeight(user, weight) {
		let newUserRef = this._firebaseApp.database().ref(`${USER.REF}/${user._id}/data/weight`);
		return newUserRef
			.push(weight)
			.then((res) => {
				console.log('The updated user is: ', res);
				return user;
			})
			.catch((err) => {
				console.log('Error in updating user: ', err);
				return false;
			});
	}

	updateHermonManUserHeight(user, height) {
		let newUserRef = this._firebaseApp.database().ref(`${USER.REF}/${user._id}`);
		console.log('update height: ', user, height);
		const {data} = user;
		return newUserRef
			.update({data: {...data, height: +height}})
			.then((res) => {
				console.log('The updated user is: ', res);
				return user;
			})
			.catch((err) => {
				console.log('Error in updating user: ', err);
				return false;
			});
	}

	updateHermonManUserDiet(user, diet) {
		let newUserRef = this._firebaseApp.database().ref(`${USER.REF}/${user._id}/diets`);
		console.log('0. dietPressed updateHermonManUserDiet diet', diet);
		return newUserRef
			.push(diet)
			.then((res) => {
				console.log('The updated user is: ', res);
				this.updateHermonManUserStatus(user, '2').then((userUpdated) => {
					console.log('0. dietPressed update?!!', userUpdated);
					console.log('0. dietPressed diet?!!', diet);
					return diet;
				});
			})
			.catch((err) => {
				console.log('Error in updating user: ', err);
				return false;
			});
	}

	getUserById(userId) {
		let userRef = this._firebaseApp
			.database()
			.ref(USER.REF)
			.child(userId);

		console.log('USER REF:  ', userRef);
		return userRef
			.once('value')
			.then((snapshot) => {
				if (snapshot.exists()) {
					let userVal = snapshot.val();
					userVal[USER.ID] = userId;
					return userVal;
				} else {
					const error = new Error('user not found');
					error.userNotFound = true;
					throw error;
				}
			})
			.catch((error) => {
				console.log('failed to get user from ref', userRef.toString(), error);
				throw error;
			});
	}

	// Forgot Password

	sendPasswordResetEmail(email) {
		return this._firebaseApp
			.auth()
			.sendPasswordResetEmail(email)
			.catch((error) => {
				console.log('error in sendPasswordResetEmail', error);
			});
	}

	logoutFromFirebase() {
		return this._firebaseApp.auth().signOut();
	}

	getWeightHistory(user) {
		return this._firebaseApp
			.database()
			.ref(`${USER.REF}/${user._id}/data/weight`)
			.once('value')
			.then((snapshot) => {
				const weightArray = [];
				console.log('snapshotvalaaa is ', snapshot);
				if (snapshot == null || snapshot == undefined) {
					return weightArray;
				}
				snapshot.forEach((child) => {
					const t = child.val();
					weightArray.push(t);
				});
				console.log('The array that we got is: ', weightArray);
				return weightArray;
			})
			.catch((error) => {
				console.log('There are no diets: ', error);
				return false;
			});
	}

	getHistoryDiets(user) {
		return this._firebaseApp
			.database()
			.ref(`${USER.REF}/${user._id}/diets`)
			.once('value')
			.then((snapshot) => {
				const hermonManDiets = [];
				console.log('snapshotvalaaa is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					hermonManDiets.push(t);
				});
				console.log('The array that we got is: ', hermonManDiets);
				return hermonManDiets;
			})
			.catch((error) => {
				console.log('There are no diets: ', error);
				return false;
			});
	}

	//can insert only one time in day
	insertAlreadyWeightOnDay(user, date) {
		let weightRef = this._firebaseApp
			.database()
			.ref(`${USER.REF}/${user._id}/data/weight`)
			.orderByChild('date')
			.equalTo(date);
		let alreadyInsertWeight = false;

		return weightRef
			.once('value')
			.then((snapshot) => {
				if (snapshot.exists()) {
					let weightVal = snapshot.val();
					weightVal['date'] = date;
					alreadyInsertWeight = true;
					return alreadyInsertWeight;
				} else {
					return alreadyInsertWeight;
				}
			})
			.catch((error) => {
				return false;
			});
	}

	getLastDiet(user) {
		return this._firebaseApp
			.database()
			.ref(`${USER.REF}/${user._id}/diets`)
			.once('value')
			.then((snapshot) => {
				const hermonManDiets = [];
				console.log('snapshotvalaaa is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					hermonManDiets.push(t);
				});
				console.log('The array that we got is getLastDiet: ', hermonManDiets);
				return hermonManDiets;
			})
			.catch((error) => {
				console.log('There are no diets: ', error);
				return false;
			});
	}

	getNeutralAndOtherDiets() {
		return this._firebaseApp
			.database()
			.ref(STATIC_DIETS.REF)
			.once('value')
			.then((snapshot) => {
				const hermonManDiets = [];
				console.log('snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					if (t.methodType == 'hermonman' && (t.dietType == 'other' || t.dietType == 'neutral')) {
						hermonManDiets.push(t);
					}
				});

				return hermonManDiets;
			})
			.catch((error) => {
				console.log('error in getting static diets from firebase', error);
				throw error;
			});
	}

	getStaticDiets() {
		return this._firebaseApp
			.database()
			.ref(STATIC_DIETS.REF)
			.once('value')
			.then((snapshot) => {
				const diets = [];
				console.log('snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					diets.push(t);
				});

				return diets;
			})
			.catch((error) => {
				console.log('error in getting static diets from firebase', error);
				throw error;
			});
	}

	getDietByDietId(dietId) {
		// let dietRef = this._firebaseApp
		// 	.database()
		// 	.ref(`${STATIC_DIETS.REF}`)
		// 	.orderByChild('dietId')
		// 	.equalTo(dietId);
		// console.log('dietRef::::::::', dietRef);

		// return dietRef
		// 	.once('value')
		// 	.then((snapshot) => {
		// 		if (snapshot.exists()) {
		// 			let dietVal = snapshot.val();
		// 			console.log('dietRef dietVal::::::::', dietVal);

		// 			dietVal[STATIC_DIETS.ID] = dietId;
		// 			return dietVal;
		// 		} else {
		// 			const error = new Error('diet not found');
		// 			error.dietNotFound = true;
		// 			throw error;
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log('failed to get diet from ref', dietRef.toString(), dietId, error);
		// 		throw error;
		// 	});
	}

	getRelevantDiets(method) {
		return this._firebaseApp
			.database()
			.ref(STATIC_DIETS.REF)
			.once('value')
			.then((snapshot) => {
				const hermonManDiets = [];
				console.log('getRelevantDiets snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					if (t.methodType == method) {
						hermonManDiets.push(t);
					}
				});
				return hermonManDiets;
			})
			.catch((error) => {
				console.log('error in getting static diets from firebase', error);
				throw error;
			});
	}

	getStartMethods() {
		return this._firebaseApp
			.database()
			.ref(START_METHODS.REF)
			.once('value')
			.then((snapshot) => {
				const startMethods = [];
				console.log('snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					startMethods.push(t);
				});

				return startMethods;
			})
			.catch((error) => {
				console.log('error in getting startMethods from firebase', error);
				throw error;
			});
	}

	getFreeStaticDiets() {
		return this._firebaseApp
			.database()
			.ref(FREE_STATIC_DIETS.REF)
			.once('value')
			.then((snapshot) => {
				const freeDiets = [];
				console.log('snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					freeDiets.push(t);
				});

				return freeDiets;
			})
			.catch((error) => {
				console.log('error in getting startMethods from firebase', error);
				throw error;
			});
	}

	getStartMethodsMaintain() {
		return this._firebaseApp
			.database()
			.ref(START_METHODS_MAINTAIN.REF)
			.once('value')
			.then((snapshot) => {
				console.log('second snapshot: ', snapshot);
				const startMethods = [];
				snapshot.forEach((child) => {
					const t = child.val();
					startMethods.push(t);
				});
				return startMethods;
			})
			.catch((error) => {
				console.log('error in getting startMethods from firebase', error);
				throw error;
			});
	}

	getFoodTypes() {
		return this._firebaseApp
			.database()
			.ref(FOOD_TYPES.REF)
			.once('value')
			.then((snapshot) => {
				const startMethods = [];
				console.log('snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					startMethods.push(t);
				});

				return startMethods;
			})
			.catch((error) => {
				console.log('error in getting FoodTypes from firebase', error);
				throw error;
			});
	}

	getFoodTypesHermon() {
		return this._firebaseApp
			.database()
			.ref(FOOD_TYPE_HERMON.REF)
			.once('value')
			.then((snapshot) => {
				const foodTypesHermon = [];
				console.log('snapshotval is ', snapshot);
				snapshot.forEach((child) => {
					const t = child.val();
					foodTypesHermon.push(t);
				});

				return foodTypesHermon;
			})
			.catch((error) => {
				console.log('error in getting FoodTypesHermon from firebase', error);
				throw error;
			});
	}

	getAllProducts() {
		return this._firebaseApp
			.database()
			.ref(PRODUCTS.REF)
			.once('value')
			.then((snapshot) => {
				let products = [];
				snapshot.forEach((child) => {
					const t = child.val();
					products.push(t);
				});

				return products;
			})
			.catch((error) => {
				console.log('error in getting products from firebase', error);
				throw error;
			});
	}

	getSubscriptionPrices() {
		return this._firebaseApp
			.database()
			.ref(SUBSCRIPTIONS.REF)
			.once('value')
			.then((snapshot) => {
				let prices = [];
				snapshot.forEach((child) => {
					const t = child.val();
					prices.push(t);
				});

				return prices.sort((a, b) => (a.en > b.en ? 1 : -1));
			})
			.catch((error) => {
				console.log('error in getting subscription prices from firebase', error);
				throw error;
			});
	}

	subscribeToTopic = async (topicName) => {
		// const enabled = await firebase.messaging().hasPermission();
		// if (enabled) {
		// 	console.log('enabled', enabled);
		// } else {
		// 	console.log('enabled - not');
		// }

		// firebase
		// 	.messaging()
		// 	.requestPermission()
		// 	.then(() => {
		// 		console.log(' User has authorised  ');
		// 	})
		// 	.catch((error) => {
		// 		console.log(' User has rejected permissions   ', error);
		// 	});

		// firebase
		// 	.messaging()
		// 	.subscribeToTopic(topicName)
		// 	.then((res) => {
		// 		return res;
		// 	})
		// 	.catch((err) => {
		// 		return err;
		// 	});
	};

	writeNewPaymentToDB(amount, date, email) {
		let newPayment = {
			[PAYMENT.AMOUNT]: amount,
			[PAYMENT.CREATED_BY]: 'Application',
			[PAYMENT.DATE]: date,
			[PAYMENT.EMAIL]: email,
			[PAYMENT.NUM_OF_PAYMENTS]: 1,
			[PAYMENT.PAYMENT_OPTION]: 'Credit Card',
		};

		let newPaymentRef = this._firebaseApp
			.database()
			.ref(PAYMENT.REF)
			.push();
		return newPaymentRef
			.set(newPayment)
			.then((error) => {
				console.log('3. writeNewPaymentToDB error?', error);
				if (error) {
					console.log('4. writeNewPaymentToDB error!!');
					console.log('error in set to ref:', newPaymentRef);
					throw new Error('error in set new payment in writeNewPaymentToDB');
				} else {
					console.log('4. writeNewPaymentToDB not error!');
					console.log('wrote new payment to database:', newPayment);
					return {newPayment, newPaymentRef};
				}
			})
			.catch((error) => {
				console.log('error at set payment in database', error, newPaymentRef);
				throw error;
			});
	}

	writeNewOrderToDB(amount, date, email, paymentId, productName) {
		let newOrder = {
			[ORDER.AMOUNT]: amount,
			[ORDER.DATE]: date,
			[ORDER.EMAIL]: email,
			[ORDER.PAYMENT_ID]: paymentId,
			[ORDER.PRODUCT_NAME]: productName,
			[ORDER.READ]: false,
		};

		let newOrderRef = this._firebaseApp
			.database()
			.ref(ORDER.REF)
			.push();
		return newOrderRef
			.set(newOrder)
			.then((error) => {
				console.log('3. writeNewOrderToDB error?', error);
				if (error) {
					console.log('4. writeNewOrderToDB error!!');
					console.log('error in set to ref:', newOrderRef);
					throw new Error('error in set new order in writeNewOrderToDB');
				} else {
					console.log('4. writeNewOrderToDB not error!');
					console.log('wrote new order to database:', newOrderRef);
					return newOrder;
				}
			})
			.catch((error) => {
				console.log('error at set order in database', error, newOrderRef);
				throw error;
			});
	}

	checkPurchaseEnabled = () => {
		return this._firebaseApp
			.database()
			.ref(PURCHASE_ENABLED.REF)
			.once('value')
			.then((snapshot) => {
				return snapshot.val();
			})
			.catch((error) => {
				console.log('error in getting purchase enabled from firebase', error);
				throw error;
			});
	};
}

export default Firebase.getInstance();
