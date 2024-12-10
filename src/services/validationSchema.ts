import Joi from "joi";



export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
  });

  export const registerValidation = Joi.object({
    name:Joi.string().required(),
    mobile: Joi.number().integer().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
    role: Joi.string()


  });