"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMongooseValidationError = (err) => {
    const errorSource = Object.values(err.errors).map((value) => {
        return {
            path: value.path,
            message: value.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error!",
        errorSource,
    };
};
exports.default = handleMongooseValidationError;
