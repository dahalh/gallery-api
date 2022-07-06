import UserSchema from "./User.schema.js";

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};

export const getUserById = (_id) => {
  return UserSchema.findById(_id);
};

// @filter must be an obj
export const getUser = (filter) => {
  return UserSchema.findOne(filter);
};

// @filter and @obj must be an obj
export const updateUser = (filter, obj) => {
  return UserSchema.findOneAndUpdate(filter, obj, { new: true });
};
