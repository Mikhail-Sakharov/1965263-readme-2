import * as Joi from 'joi';

const DEFAULT_HOST = 'localhost';

export default Joi.object({
  RABBIT_HOST: Joi
    .string()
    .hostname()
    .default(DEFAULT_HOST)
    .required(),
  RABBIT_USER: Joi
    .string()
    .required(),
  RABBIT_PASSWORD: Joi
    .string()
    .required(),
  RABBIT_BLOG_SERVICE_QUEUE: Joi
    .string()
    .required()
});
