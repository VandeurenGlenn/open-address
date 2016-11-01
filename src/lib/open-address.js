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

    this.api.get('/address/:uid', (req, res) => {
      // TODO: handle connection request
      this.getOpenAddress(req.params.uid).then(response => {
        res.send(JSON.stringify(response));
      });
    });

    this.api.get('/create/:port', (req, res) => {
      let item = this._setupItem(req);

      this.writeOpenAddress(item.uid, item);

      res.send(JSON.stringify(item));
    });

    this.api.get('/@private/create/:port', (req, res) => {
      let item = this._setupItem(req);

      // authenticate
      if (!this.user && !req.auth) {
        this.authenticate().then(() => {
          this.writeUserAddress(this.user.uid, item);
        });
      } else {
        this.writeUserAddress(this.user.uid, item);
      }
      res.send(JSON.stringify(item));
    });

    this.api.get('/@private/addresses', (req, res) => {
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
        res.send(message);
      } else if (req.auth !== undefined && this.user === null) {
        if (req.auth['password'] && req.auth['username']) {
          this.authenticate('password', req.auth).then(() => {
            this.getUserAddresses(this.user).then(addresses => {
              res.send(JSON.stringify(addresses));
            });
          });
        } else if (req.auth === 'google') {
          this.authenticate('google').then(() => {
            this.getUserAddresses(this.user).then(addresses => {
              res.send(JSON.stringify(addresses));
            });
          });
        }
      } else if (this.user !== null) {
        this.getUserAddresses(this.user).then(addresses => {
          res.send(JSON.stringify(addresses));
        });
      }
    });

    this.server.listen(process.env.PORT || 8080);
  }

  _setupItem(req) {
    let ip = req.ip;
    let port = req.params.port;
    let uid = this._createUid();
    let url = this._computeUrl(uid);

    return {
      uid: uid,
      ip: ip,
      port: port,
      url: url
    };
  }

  _createUid() {
    return Math.random().toString(36).slice(-8);
  }

  _computeUrl(uid) {
    return 'https://open-address.herokuapp.com/' + uid;
  }
}
