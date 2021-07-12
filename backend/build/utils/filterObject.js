"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterObject = (obj, ...allowedFields) => {
    const newObject = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el))
            newObject[el] = obj[el];
    });
    return newObject;
};
exports.default = filterObject;
