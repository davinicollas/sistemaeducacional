const crypto = require("crypto");

function getToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  return req.session.csrfToken;
}

function tokensMatch(expected, received) {
  if (typeof expected !== "string" || typeof received !== "string")
    return false;
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

module.exports = function csrfProtection(req, res, next) {
  const token = getToken(req);
  res.locals.csrfToken = token;

  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();

  const receivedToken = req.get("x-csrf-token") || req.body?._csrf;
  if (!tokensMatch(token, receivedToken)) {
    return res.status(403).send("Requisição inválida.");
  }

  next();
};
