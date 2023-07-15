export var JsonWebTokenError = function (message, error) {
  Error.call(this, message);
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = 'JsonWebTokenError';
  this.message = message;
  if (error) this.inner = error;
};

JsonWebTokenError.prototype = Object.create(Error.prototype);
JsonWebTokenError.prototype.constructor = JsonWebTokenError;


export var TokenExpiredError = function (message, expiredAt) {
  JsonWebTokenError.call(this, message);
  this.name = 'TokenExpiredError';
  this.expiredAt = expiredAt;
};

TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
TokenExpiredError.prototype.constructor = TokenExpiredError;


export var NotBeforeError = function (message, date) {
  JsonWebTokenError.call(this, message);
  this.name = 'NotBeforeError';
  this.date = date;
};

NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
NotBeforeError.prototype.constructor = NotBeforeError;