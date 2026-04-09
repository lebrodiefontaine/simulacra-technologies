const { ensureUserId } = require("../lib/session/userCookie");
const { sendJson } = require("../lib/api/utils");

module.exports = (req, res) => {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const userId = ensureUserId(req, res);
  return sendJson(res, 200, { user_id: userId });
};
