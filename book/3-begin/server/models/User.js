const mongoose = require('mongoose');
import _ from 'lodash';
const generateSlug = require('../utils/slugify');

const { Schema } = mongoose;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const mongoSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    googleToken: {
        access_token: String,
        refresh_token: String,
        token_type: String,
        expiry_date: Number,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    displayName: String,
    avatarUrl: String,
});

class UserClass {
    static publicFields() {
        return ['id', 'displayName', 'email', 'avatarUrl', 'slug', 'isAdmin'];
    }

    static async signInOrSignUp({ googleId, googleToken, email, displayName, avatarUrl }) {
        const user = await this.findOne({ googleId }).select(UserClass.publicFields().join(' '));

        if (user) {
            // 1. for existing user, update each token inside googleToken using modifier object
            const modifier = {};

            if (googleToken.accessToken) modifier.access_token = googleToken.accessToken;
            if (googleToken.refreshToken) modifier.refresh_token = googleToken.refreshToken;

            if (_.isEmpty(modifier)) return user;

            await this.updateOne({ googleId }, { $set: modifier });

            return user;
        }

        // 2. else, for new user, generate slug and create new User MongoDB document
        const slug = await generateSlug(this, displayName);
        const userCount = await this.find().countDocuments();

        const newUser = await this.create({
            createdAt: new Date(),
            googleId,
            googleToken,
            email,
            displayName,
            avatarUrl,
            slug,
            isAdmin: userCount === 0,
        });

        return _.pick(newUser, UserClass.publicFields());
    }
}

mongoSchema.loadClass(UserClass);

const User = mongoose.model('User', mongoSchema);

module.exports = User;
