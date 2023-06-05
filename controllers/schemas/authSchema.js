import Joi from "joi";

export default {
  signup: {
    body: Joi.object()
      .keys({
        username: Joi.string().min(2).required(),
        password: Joi.string().min(5).required(),
      })
      .required(),
  },
  validatorCompiler:
    ({ schema, method, url, httpPaer }) =>
    (data) =>
      schema.validate(data),
};
