import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../services/user.service.js";
import { Strategy as GithubStrategy} from "passport-github2";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const name = profile.displayName;
      const email = profile.emails?.[0].value;
      let user = await getUserByEmail(email);
      if (!user) {
        user = await createUser({ name, email });
      }
      return done(null, user);
    }
  )
);

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const name = profile.displayName || profile.username;
      const email = profile.emails?.[0].value || `${profile.username}@users.noreply.github.com`;
      let user = await getUserByEmail(email);
      if (!user) {
        user = await createUser({ name, email });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});

export default passport;
