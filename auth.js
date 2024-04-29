const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
require('dotenv').config();
passport.use(new LocalStrategy(
  {
    usernameField: 'email', 
    passwordField: 'password'
  },
  (email, password, done) => {
  }
));
passport.use(new JWTstrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  },
  (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
});
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
};
const loginUser = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token });
    });
  })(req, res);
};
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
};
module.exports = {
  registerUser,
  loginUser,
  authenticateJWT
};