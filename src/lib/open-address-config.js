'use strict';
import { writeFile, writeFileSync, readFile, readFileSync } from 'fs';
export default class OpenAddressConfig {
  constructor(opts=Object) {
    this.config = Object;

    try {
      readFileSync('open-address.json');
    } catch (e) {
      writeFileSync('open-address.json', JSON.stringify({
        firebase: {
          apiKey: "AIzaSyCkHMUiHZMQWO49cuVDHbqy-ztQ_ExBFRc",
          authDomain: "open-address.firebaseapp.com",
          databaseURL: "https://open-address.firebaseio.com",
          storageBucket: "open-address.appspot.com",
          messagingSenderId: "400686583584"
        }
      }, null, 2));
    }
  }

  set firebase(val) {
    this.config.firebase = val;
  }

  set(opt=String, val=Object) {
    this[opt] = val;

    readFile('open-address.json', content => {
      let key = opt;
      let value = val;
      let json = JSON.parse(content.toString());
      json[key] = value;
      writeFile('open-address.json', json);
    });
  }
}
