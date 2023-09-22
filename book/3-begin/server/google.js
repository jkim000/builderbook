import passport from 'passport';
import { OAuth2Strategy as Strategy } from 'passport-google-oauth';
import User from './models/User';

import dotenv from 'dotenv';
dotenv.config();

const setupGoogle = ({ ROOT_URL, server }) => {
    // 1. define `verify` method: get profile and googleToken from Google
    const verify = async (accessToken, refreshToken, profile, verified) => {
        let email;
        let avatarUrl;

        if (profile.emails) {
            email = profile.emails[0].value;
        }

        if (profile.photos && profile.photos.length > 0) {
            avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
        }

        // 2. call and wait for static method `User.signInOrSignUp` to return created or existing user
        try {
            const user = await User.signInOrSignUp({
                googleId: profile.id,
                googleToken: { accessToken, refreshToken },
                email,
                displayName: profile.displayName,
                avatarUrl,
            });

            verified(null, user);
        } catch (err) {
            verified(err);
            console.log(`Whoops, there was an error: ${err}`);
        }
    };

    passport.use(
        new Strategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${ROOT_URL}/auth/google/callback`,
            },
            verify,
        ),
    );

    // 3. serialize user AND deserialize user;
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, User.publicFields(), (err, user) => {
            done(err, user);
        });
    });

    // 4. initialize passport AND passport's session
    server.use(passport.initialize());
    server.use(passport.session());

    // 5. Define Express routes (/auth/google, /oauth2callback, /logout)
    server.get(
        '/auth/google',
        passport.authenticate('google', {
            // 1. pass options to passport authenticate
            scope: ['profile', 'email'],
            prompt: 'select_account',
        }),
    );

    server.get(
        '/oauth2callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res) => {
            // 2. if successful, redirect user to Index page ('/')
            res.redirect('/');
        },
    );

    server.get('/logout', (req, res, next) => {
        // 3. clear req.user property and user id from session, redirect to Login page ('/login')
        req.logout((err) => {
            if (err) next(err);
            res.redirect('/login');
        });
    });
};

export default setupGoogle;
