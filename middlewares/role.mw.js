const { rolesPermission } = require("../utils/constants.utils");
const { msg } = require("../utils/messages.utils");
const { findOne } = require("../services/mongo.service");
const { log } = require("../services/response.service");

module.exports = (role) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(400).json(log(false, msg.USERID_REQ));
      const checkRole = await findOne({
        model: "UserECOM",
        query: { userId: userId },
        attributes: ["role"],
      });
      if (!checkRole?.role)
        return res.status(400).json(log(false, msg.ROLE_NOT_FOUND));

      const allowedRoles = rolesPermission[role];
      if (!allowedRoles || !Array.isArray(allowedRoles)) {
        return res.status(500).json(log(false, msg.INVALID_ROLE_CONFIG));
      }

      if (allowedRoles.includes(checkRole.role)) return next();
      else return res.status(403).json(log(false, msg.UNAUTH));
    } catch (error) {
      return res.status(500).json(log(false, msg.INTERNAL_ERROR));
    }
  };
};
