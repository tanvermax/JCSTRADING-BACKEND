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
exports.AuthRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthController.credentialsLogin);
router.post("/logout", auth_controller_1.AuthController.logout);
router.post("/refresh-token", auth_controller_1.AuthController.getNewAccessToken);
router.get("/googl", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rediret = req.query.redirect || "/";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: rediret })(req, res, next);
}));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${env_1.envVarse.FRONT_END_URL}/login?error=There is some
     issues with your account. Please contact with out support team!` }), auth_controller_1.AuthController.googlCallbackConmtroll);
exports.AuthRoute = router;
