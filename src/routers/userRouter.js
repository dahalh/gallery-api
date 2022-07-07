import express from "express";
import { encryptPassword } from "../../helpers/bcrypthelper.js";
import {
  emailVerificationValidation,
  newUserValidation,
} from "../middlewares/joi-validation/userValidation.js";
import { insertUser, updateUser } from "../models/user/User.model.js";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../helpers/emailHelper.js";

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "GET got hit to user router",
  });
});

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
    const update = { status: "active" };

    const result = await updateUser(filter, update);

    if (result?._id) {
      res.json({
        status: "success",
        message:
          "Your email has been verified successfully. You may login now.",
      });

      await updateUser(filter, { emailValidationCode: "" });
      return;
    }

    res.json({
      status: "error",
      message: "Invalid or expired verification link.",
    });
  }
);

router.patch("/", (req, res) => {
  res.json({
    status: "success",
    message: "PATCH got hit to user router",
  });
});

export default router;
