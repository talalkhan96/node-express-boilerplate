const AuthController = require("../controllers/users/auth.controller");
const Token = require('../middleware/token');
var router = require("express").Router();

let Auth = new AuthController();

router.post("/login", Auth.Auth);

router.post("/logout", Token.isValid(), Auth.Logout);

router.post("/ForgetPassword", Auth.ForgetpasswordEmail);

// Template Generator
router.get('/dynamic_gen_token_key/template/:key', Auth.Template);

// Template Generator
router.post('/reset/:token', Auth.ResetPassword);

module.exports = router;