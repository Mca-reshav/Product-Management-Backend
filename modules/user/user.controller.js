const {
  find,
  create,
  findOne,
  updateOne,
} = require("../../services/mongo.service");
const { error, log, tokenLog } = require("../../services/response.service");
const encryptService = require("../../services/encrypt.service");
const { user } = require("../../utils/messages.utils");
const { generateJwt } = require("../../services/jwt.service");
const { generateID } = require("../../services/common.service");
const { roleType } = require("../../utils/constants.utils");
const moment = require("moment");

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const getData = await find({
      model: "UserECOM",
      query: { emailId: emailId },
      attributes: ["userId", "password", "role"],
    });
    const userId = getData[0]?.userId;
    if (!userId) return res.json(log(false, user.NOT_REG));

    const checkPwd = await encryptService.comparePassword(
      password,
      getData[0].password
    );
    if (!checkPwd) return res.json(log(false, user.WRONG_PASSWORD));

    const getToken = await generateJwt({ userId, role: getData[0]?.role });
    tokenLog(getToken.token);
    return res.json(
      log(true, user.LOGGED_IN, {
        token: getToken.token,
        userId,
        role: getData[0].role,
      })
    );
  } catch (err) {
    error(err);
  }
};

exports.register = async (req, res) => {
  try {
    const { emailId, contactNo, name, password } = req.body;

    const userId = generateID(contactNo);
    const isExist = await find({
      model: "UserECOM",
      query: {
        $or: [{ contactNo: contactNo }, { emailId: emailId }],
      },
      attributes: ["userId"],
    });

    const newUser = isExist.length == 0;
    if (!newUser) return res.json(log(false, user.ALREADY_EXIST, {}));
    else {
      const encPwd = await encryptService.hashPassword(password);
      const userEntry = await create({
        model: "UserECOM",
        data: {
          userId: userId,
          name: name,
          emailId: emailId,
          contactNo: contactNo,
          password: encPwd,
        },
      });

      if (!userEntry) return res.json(log(userEntry, user.FAILED));
      return res.json(log(true, user.REGISTER_DONE));
    }
  } catch (err) {
    error(err);
  }
};

exports.profile = async (req, res) => {
  try {
    const getData = await findOne({
      model: "UserECOM",
      query: { userId: req.user.userId },
      attributes: ["name", "emailId", "contactNo", "createdAt", "role"],
    });
    if (!getData) return res.json(log(false, user.FAILED));
    getData.role = roleType[getData.role];
    delete getData._id;
    return res.json(log(true, user.SUCCESS, getData));
  } catch (err) {
    error(err);
  }
};

exports.toggleRole = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const { userId, password } = req.body;
    console.log({userId, "trimmed": String(userId).trim()})
    if (adminId == userId) return res.json(log(false, user.TOGGLE_OWN));

    const isExist = await findOne({
      model: "UserECOM",
      query: { userId: adminId },
      attributes: ["password"],
    });

    if (!isExist?.password) return res.json(log(false, user.FAILED));
    const checkPwd = await encryptService.comparePassword(
      password,
      isExist.password
    );
    if (!checkPwd) return res.json(log(false, user.WRONG_PASSWORD));
    const current = moment().format("YYYY-MM-DD HH:mm:ss");
    const getRole = await findOne({
      model: "UserECOM",
      query: { userId: String(userId).trim() },
      attributes: ["role"],
    });
    console.log(getRole)
    if (!getRole?.role) return res.json(log(false, user.NOT_REG));
    const checkUserRole = getRole?.role == Object.keys(roleType)[0];

    const toggleData = await updateOne({
      model: "UserECOM",
      query: { userId: String(userId).trim() },
      data: {
        updatedAt: current,
        role: checkUserRole
          ? Object.keys(roleType)[1]
          : Object.keys(roleType)[0],
      },
    });

    if (toggleData) return res.json(log(true, user.TOGGLE_ROLE));
    return res.json(log(false, user.FAILED));
  } catch (err) {
    error(err);
  }
};

exports.list = async (req, res) => {
  try {
    const getData = await find({
      model: "UserECOM",
      query: {},
      attributes: ["userId", "name", "role", "updatedAt"],
    });
    if (getData) return res.json(log(true, user.SUCCESS, getData));
    return res.json(log(false, user.FAILED));
  } catch (err) {
    error(err);
  }
};
