import Joi from "joi";

const fName = Joi.string().alphanum().required().max(25);
const lName = Joi.string().alphanum().required().max(60);
const email = Joi.string().email({ minDomainSegments: 2 }).required();
const phone = Joi.string().required().max(15).min(10);
const dob = Joi.date().allow(null);
const address = Joi.string().allow(null).allow("");
const password = Joi.string().required();
const requiredStr = Joi.string().required();

const validator = (schema, req, res, next) => {
  const { value, error } = schema.validate(req.body);
  console.log(error?.message);

  if (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }

  next();
};

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fName,
    lName,
    email,
    phone,
    dob,
    address,
    password,
  });

  validator(schema, req, res, next);
};

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email,
    emailValidationCode: requiredStr,
  });

  validator(schema, req, res, next);
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email,
    password,
  });

  validator(schema, req, res, next);
};
