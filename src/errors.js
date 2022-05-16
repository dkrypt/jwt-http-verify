// JWT Verifier configuration error

class JWTVerifierConfigError extends Error {
  constructor(message) {
    super();
    this.name = 'JWTVerifierConfigError';
    this.message = message;
  }
}
module.exports = {
  JWTVerifierConfigError
}