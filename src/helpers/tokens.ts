import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

const generate = (payload?: any) => {
  return crypto.createHmac("sha256", payload || {}).digest("hex");
};

const sign = (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET as string, {
    expiresIn: "10800s", //3h
  });
};

const tokenService = {
  generate,
  sign,
};

export default tokenService;
