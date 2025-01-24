const { login } = require("../modules/user/user.controller");
const { find } = require("../services/mongo.service");
const { log } = require("../services/response.service");
const encryptService = require("../services/encrypt.service");
const { generateJwt } = require("../services/jwt.service");

jest.mock("../services/mongo.service");
jest.mock("../services/response.service");
jest.mock("../services/encrypt.service");
jest.mock("../services/jwt.service");

describe("User Controller Tests", () => {
  describe("login()", () => {
    it("should log in a user successfully", async () => {
      const mockReq = {
        body: { emailId: "demo@test.com", password: "check1234" },
      };
      const mockRes = { json: jest.fn() };

      find.mockResolvedValue([
        { userId: "123", password: "hashedPassword", role: "admin" },
      ]);
      encryptService.comparePassword.mockResolvedValue(true);
      generateJwt.mockResolvedValue({ token: "mockToken" });

      await login(mockReq, mockRes);
      expect(find).toHaveBeenCalledWith({
        model: "UserECOM",
        query: { emailId: "demo@test.com" },
        attributes: ["userId", "password", "role"],
      });
      expect(encryptService.comparePassword).toHaveBeenCalledWith(
        "check1234",
        "hashedPassword"
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        log(true, expect.any(String), {
          token: "mockToken",
          userId: "123",
          role: "admin",
        })
      );
    });

    it("should return error if user is not registered", async () => {
      const mockReq = {
        body: { emailId: "not@found.com", password: "wrongPassword" },
      };
      const mockRes = { json: jest.fn() };

      find.mockResolvedValue([]);

      await login(mockReq, mockRes);
      expect(find).toHaveBeenCalledWith({
        model: "UserECOM",
        query: { emailId: "not@found.com" },
        attributes: ["userId", "password", "role"],
      });
      expect(mockRes.json).toHaveBeenCalledWith(log(false, expect.any(String)));
    });

    it("should return error if password is incorrect", async () => {
      const mockReq = {
        body: { emailId: "demo@test.com", password: "wrongPassword" },
      };
      const mockRes = { json: jest.fn() };

      find.mockResolvedValue([
        { userId: "123", password: "hashedPassword", role: "admin" },
      ]);
      encryptService.comparePassword.mockResolvedValue(false);

      await login(mockReq, mockRes);
      expect(find).toHaveBeenCalledWith({
        model: "UserECOM",
        query: { emailId: "demo@test.com" },
        attributes: ["userId", "password", "role"],
      });
      expect(encryptService.comparePassword).toHaveBeenCalledWith(
        "wrongPassword",
        "hashedPassword"
      );
      expect(mockRes.json).toHaveBeenCalledWith(log(false, expect.any(String)));
    });
  });
});
