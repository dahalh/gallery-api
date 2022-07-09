import express from "express";
import { encryptPassword, verifyPassword } from "../../helpers/bcrypthelper.js";
import {
  emailVerificationValidation,
  loginValidation,
  newUserValidation,
} from "../middlewares/joi-validation/userValidation.js";
import { insertUser, updateUser, getUser } from "../models/user/User.model.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helpers/emailHelper.js";

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET got hit to user router",
  });
});

// new user registration
router.post("/", newUserValidation, async (req, res, next) => {
  try {
    const hashPassword = encryptPassword(req.body.password);
    req.body.password = hashPassword;

    // create unique email validation code
    req.body.emailValidationCode = uuidv4();

    const result = await insertUser(req.body);

    console.log(result);

    if (result?._id) {
      // create unique url and send it to the user email

      const url = `${process.env.ROOT_URL}/user/verify-email/?c=${result.emailValidationCode}&e=${result.email}`;

      //   send email to the user
      sendMail({ fName: result.fName, url });

      res.json({
        status: "success",
        message: "New user created successfully",
      });
    } else {
      res.json({
        status: "error",
        message: "Unable to create new user. Please try again later.",
      });
    }
  } catch (error) {
    error.status = 500;
    if (error.message.includes("E11000 duplicate key error")) {
      error.message = "Account already exists using this email.";
      error.status = 200;
    }
    next(error);
  }
});

// email verification router
router.post(
  "/email-verification",
  emailVerificationValidation,
  async (req, res) => {
    console.log(req.body);
    const filter = req.body;
    const update = { status: "active", emailValidationCode: "" };

    const result = await updateUser(filter, update);

    if (result?._id) {
      return res.json({
        status: "success",
        message:
          "Your email has been verified successfully. You may login now.",
      });

      // await updateUser(filter, { emailValidationCode: "" });
      // send email to the user
    }

    res.json({
      status: "error",
      message: "Invalid or expired verification link.",
    });
  }
);

// login user with email and password
// this feature is not completed yet
router.post("/login", loginValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // query get user by email
    const user = await getUser({ email });

    if (user.status === "inactive")
      return res.json({
        status: "error",
        message:
          "Your account is not active yet, Please check your email and follow instructions to activate your account",
      });

    console.log(user);
    if (user?._id) {
      // if user exists, compare password
      const isMatched = verifyPassword(password, user.password);
      console.log(isMatched);

      if (isMatched) {
        user.password = undefined;
        // for now
        res.json({
          status: "success",
          message: "User logged in succesfully",
          user,
        });

        return;
      }

      // if passwords match, process for creating JWT and etc... for future
      // for now, send login success message
    }

    res.status(401).json({
      status: "error",
      message: "Invalid login credentials",
    });
    // check for authentication
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
