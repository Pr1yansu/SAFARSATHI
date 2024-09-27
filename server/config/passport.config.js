const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const User = require("../models/user.model");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    if (!username || !password) {
      return done(null, false, {
        message: "Username and password are required",
      });
    }

    const user = await User.findByEmail(username);

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    if (user.provider || user.googleId || user.githubId) {
      return done(null, false, {
        message: "Please use your provider to log in",
      });
    }

    if (!user) {
      return done(null, false, { message: "User not found" });
    }

    const isPasswordValid = await user.comparePasswords(password);

    if (!isPasswordValid) {
      return done(null, false, { message: "Invalid credentials" });
    }

    return done(null, user);
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/users/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await User.findByGoogleId(profile.id);

      if (user) {
        return done(null, user);
      }

      const existingUser = await User.findByEmail(profile.emails[0].value);

      let newUser = null;

      if (existingUser) {
        newUser = existingUser;
      } else {
        newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: "google",
          googleId: profile.id,
          avatar: profile.photos[0].value,
        });
      }

      return done(null, newUser);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/users/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await User.findByGithubId(profile.id);

      if (user) {
        return done(null, user);
      }

      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const emails = await emailResponse.json();
      const primaryEmail = emails.find(
        (email) => email.primary && email.verified
      );

      const existingUser = await User.findByEmail(primaryEmail.email);

      let newUser = null;
      if (existingUser) {
        newUser = existingUser;
      } else {
        newUser = await User.create({
          name: profile.displayName || profile.username,
          email: primaryEmail ? primaryEmail.email : null,
          provider: "github",
          githubId: profile.id,
          avatar: profile.photos[0].value,
        });
      }

      return done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
