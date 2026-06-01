import { throwError } from "../utils/errorHandler.js";

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return throwError(error.details[0].message, 400);
    }
    next();
  };
};
export default validate;
