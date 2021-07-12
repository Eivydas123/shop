"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const objectID = mongoose_1.default.Schema.Types.ObjectId;
const userShema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "{PATH} is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "{PATH} is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [
            {
                validator: function (email) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.isModified("email" || this.isNew)) {
                            const doc = yield this.constructor.findOne({ email });
                            if (doc) {
                                return false;
                            }
                        }
                        return true;
                    });
                },
                message: (props) => `The specified ${props.path} is already in use.`,
            },
            {
                validator: validator_1.default.isEmail,
                message: (props) => `${props.path} is not valid`,
            },
        ],
    },
    password: {
        type: String,
        required: [true, "{PATH} is required"],
        select: false,
        validate: [
            {
                validator: (val) => validator_1.default.isStrongPassword(val, { minSymbols: 0 }),
                message: (props) => `${props.path} must contain atleast one upperCase, one lowerCase, one number and total lenght must be 8 characters long`,
            },
        ],
    },
    passwordConfirmation: {
        type: String,
        required: [true, "{PATH} is required"],
        validate: {
            validator: function (passwordConfirmation) {
                console.log("running");
                return passwordConfirmation === this.password;
            },
            message: (props) => `passwords must match`,
        },
    },
    role: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "{PATH} is required"],
        default: "user",
    },
    avatar: String,
    deletedAt: Date,
    passwordResetToken: { type: String, index: true },
    passwordResetTokenExpiresAt: Date,
}, { timestamps: true });
userShema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.passwordConfirmation = undefined;
        next();
    });
});
userShema.pre(["find", "findOne"], function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.find({ deletedAt: { $exists: false } });
        next();
    });
});
userShema.methods.comparePasswords = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
userShema.methods.createPasswordResetToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const token = crypto_1.default.randomBytes(64).toString("hex");
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        this.passwordResetToken = hashedToken;
        this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
        return token;
    });
};
exports.default = mongoose_1.default.model("User", userShema);
