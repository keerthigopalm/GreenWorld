// backend/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js"; // ✅ fixed path

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Try existing Google user
        let user = await User.findOne({ oauthProvider: "google", email: profile.emails?.[0]?.value });

        if (!user) {
          // If an account exists with same email from local signup, link it
          user = await User.findOne({ email: profile.emails?.[0]?.value });
          if (user) {
            user.oauthProvider = "google";
            await user.save();
          } else {
            // Create a new user
            user = await User.create({
              fullName: profile.displayName || "Google User",
              email: profile.emails?.[0]?.value,
              password: null, // no local password
              role: "customer",
              oauthProvider: "google",
              profilePicture: profile.photos?.[0]?.value,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// If you use sessions, keep these. If you use stateless JWT only, these don't hurt.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (e) {
    done(e);
  }
});

export default passport;
