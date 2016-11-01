'use strict';

export default class BaseController {

  log(text=String) {
    return console.log(text);
  }

  error(error=Object) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(`error-${errorCode}::${errorMessage}`);
  }
}
