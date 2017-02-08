'use strict';
import {
  AUTHENTICATE,
  TAB_ALIAS_LOGIN
} from '../constants';

const auth = require('../controllers/Auth')
// const auth = new Auth();

export const tabAuthenticate = () => ({
  type: TAB_ALIAS_LOGIN
});

export const login = () => dispatch => {
  auth.authenticate(true)
}

export const authenticate = user => ({ type: AUTHENTICATE, user });
