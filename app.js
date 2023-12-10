const express = require('express');
const mongoose = require('mongoose');
const { createProxyMiddleware } = require('http-proxy-middleware');

const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const siteRoutes = require('./routes/siteRoutes');
const recordRoutes = require('./routes/recordRoutes');
const openaiProxy = require('./routes/openaiProxy');
const { isAuthenticated } = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

app.get('/', (req, res) => {
    res.send('Backend is work!');
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.log('Error connecting to MongoDB', err);
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
        .then((user) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            bcrypt.compare(password, user.password)
                .then((res) => {
                    if (res) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                })
                .catch((err) => {
                    console.error('Error comparing passwords:', err);
                    return done(err);
                });
        })
        .catch((err) => {
            console.error('Error finding user:', err);
            return done(err);
        });
}));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/site', siteRoutes);
app.use('/record', recordRoutes);
app.use('/openai', openaiProxy);

app.use('/waterpub', createProxyMiddleware({
    target: 'http://waterpub.cnemc.cn:10001',
    changeOrigin: true,
    pathRewrite: {
        '^/waterpub': '',
    },
}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
