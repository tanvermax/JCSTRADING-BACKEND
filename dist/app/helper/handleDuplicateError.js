"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    const matchedArray = err.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArray[1]} already exit`,
    };
};
exports.handleDuplicateError = handleDuplicateError;
