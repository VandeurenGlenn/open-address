'use strict';
import http from 'http';
import express from 'express';
import FirebaseController from './controllers/firebase-controller';
import Config from './open-address-config';
const config = new Config();

// TODO: connectoect using the user its username
export default class OpenAddress extends FirebaseController {
  constructor() {
    super();
    this.api = express();
    this.server = http.Server(this.api);

    this.api.get('/', (req, res) => {
      res.send('welcome to open-address');
    });

    this.api.get('/:uid', (req, res) => {
      // TODO: handle connection request
      res.send('welcome to open-address');
    });

    this.api.get('/create/:port', (req, res) => {
      let ip = req.ip;
      let port = req.params.port;
      let uid = Math.random().toString(36).slice(-8);
      let url = this._computeUrl(uid);
      let item = {
        uid: uid,
        ip: ip,
        port: port,
        url: url
      }

      if (this.checkIfLocalhost(ip)) {
        item.ip = req.params.ip || '0.0.0.0';
        this.log('running on local network');
      }
      // authenticate
      if (!this.user && !req.auth) {
        this.authenticate().then(() => {
          this.writeUserAddress(this.user.uid, item);
        });
      } else {
        this.writeUserAddress(this.user.uid, item);
      }
        // if (req.auth || this.user) {
        //   this.log('user authenticated');
        //   this.writeUserAddress('user1', item);
        // } else {
        //   this.writeTemporaryAddress(item);
        // }
      // this.authenticate();
      res.send(JSON.stringify(item));

    });

    this.api.get('/addresses', (req, res) => {
      if (this.user === null && req.auth === undefined) {
        var message = '';
        let num = Math.random() * (15 - 1) + 1;
        if (num > 5) {
          message = `Sorry, I don't talk to strangers...`;
        } else if (num > 10) {
          message = 'Please identify yourself...';
        } else if (num > 15 || num === 15) {
          mesage = `Hmm, I don't seem to know you...`;
        }
        this.log('Not authorized');
        return res.send(message);
      } else if (req.auth !== undefined && this.user === null) {
        if (req.auth['password'] && req.auth['username']) {
          this.authenticate('password', req.auth).then(() => {
            this.getUserAddresses(this.user).then(addresses => {
              return res.send(JSON.stringify(addresses));
            });
          });
        } else if (req.auth === 'google') {
          this.authenticate('google').then(() => {
            this.getUserAddresses(this.user).then(addresses => {
              return res.send(JSON.stringify(addresses));
            });
          });
        }
      } else if (this.user !== null) {
        this.getUserAddresses(this.user).then(addresses => {
          return res.send(JSON.stringify(addresses));
        });
      }
    });

    this.server.listen(8080);
  }

  checkIfLocalhost(ip) {
    if (ip.length > 8 || ip === '0.0.0.0') {
      this.log('localhost detected');
      return true;
    }
  }

  _computeUrl(uid) {
    return 'https://open-address.herokuapp.com/' + uid;
  }
}
