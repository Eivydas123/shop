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
const objectID = mongoose_1.default.Schema.Types.ObjectId;
const roleShema = new mongoose_1.default.Schema({
    role: {
        type: String,
        required: [true, "{PATH} is required"],
        lowercase: true,
        unique: true,
        trim: true,
        validate: [
            {
                validator: function (role) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.isModified("role" || this.isNew)) {
                            const doc = yield this.constructor.findOne({ role });
                            if (doc) {
                                return false;
                            }
                        }
                        return true;
                    });
                },
                message: (props) => `The specified ${props.path} is already in use.`,
            },
        ],
    },
    createdBy: { type: objectID, ref: "User", required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Role", roleShema);
