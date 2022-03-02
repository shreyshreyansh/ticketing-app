"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const not_authorized_error_1 = require("../errors/not-authorized-error");
// this middleware rejects the request by client if they are not
// logged in
const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new not_authorized_error_1.NotAuthorizedError();
    }
    next();
};
exports.requireAuth = requireAuth;
