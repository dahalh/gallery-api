import Joi from "joi";

export const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    fName: Joi.string().alphanum().required().max(25),
    lName: Joi.string().alphanum().required().max(60),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().required().max(15).min(10),
    dob: Joi.date().allow(null),
    address: Joi.string().allow(null).allow(""),
    password: Joi.string().required(),
  });

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

export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    emailValidationCode: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.json({
      status: "error",
      message: error.message,
    });
  }
  next();
};
