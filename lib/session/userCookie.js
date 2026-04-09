const crypto = require("crypto");

const COOKIE_NAME = "otherhalf_uid";

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [rawKey, ...rest] = part.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");

  return parts.join("; ");
}

function getUserIdFromReq(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  return cookies[COOKIE_NAME] || null;
}

function ensureUserId(req, res) {
  let userId = getUserIdFromReq(req);

  if (!userId) {
    userId = crypto.randomUUID();
    const cookie = serializeCookie(COOKIE_NAME, userId, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    res.setHeader("Set-Cookie", cookie);
  }

  return userId;
}

module.exports = {
  COOKIE_NAME,
  parseCookies,
  getUserIdFromReq,
  ensureUserId,
};
