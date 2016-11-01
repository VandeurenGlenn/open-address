'use strict';
import BaseController from './base-controller';
const firebase = require('firebase');

import { readFileSync } from 'fs';

export default class FirebaseController extends BaseController {
  constructor() {
    super();
    // Initialize Firebase
    firebase.initializeApp(this.config);
    // Bind methods
    this._onAuthStateChanged = this._onAuthStateChanged.bind(this);
    // Setup listeners
    firebase.auth().onAuthStateChanged(this._onAuthStateChanged);
  }

  get config() {
    return JSON.parse(readFileSync('./open-address.json')).firebase;
  }

  authenticate(provider=null, options=Object) {
    return new Promise((resolve, reject) => {
      if (provider !== null) {
        if (provider === 'password') {
          firebase.auth().signInWithEmailAndPassword(options.email, options.password).then(() => {
            resolve();
          }).catch(error => {
            this.error(error);
            reject(error);
          });
        } else if (provider === 'google') {
          let provider = new firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({
            'login_hint': 'user@example.com'
          });
          // authenticate
          firebase.auth().signInWithPopup(provider).then(result => {
            resolve(result.user);
          }).catch(function(error) {
            this.error(error);
            reject(error);
          });
        }
      } else {
        firebase.auth().signInAnonymously().then(() => {
          resolve();
        }).catch(error => {
          this.error(error);
          reject(error);
        });
      }
    });
  }

  getUserAddresses(user) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`users/${user.uid}`).once('value', snapshot => {
        let data = snapshot.val();
        resolve(data);
      }).catch(error => {
        this.error(error);
        reject(error);
      });
    });
  }

  getOpenAddress(uid) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(`OpenAddresses/${uid}`).once('value', snapshot => {
        let data = snapshot.val();
        resolve(data);
      }).catch(error => {
        this.error(error);
        reject(error);
      });
    });
  }

  writeUserAddress(uid, address) {
    firebase.database().ref(`users/${uid}/${address.uid}`).set(address);
  }

  writeTemporaryAddress(address) {
    firebase.database().ref(`temporary/${address.uid}`).set(address);
  }

  _onAuthStateChanged(user) {
    this.user = user;
  }
}
