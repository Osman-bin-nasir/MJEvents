const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require('multer');
const methodOverride = require('method-override');
const User = require('./models/user');
const Events = require('./models/events');

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/Project1')
    .then(() => console.log('Connected to Database!'))
    .catch(err => console.log(err));

// Express settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Middleware to pass Dark Mode preference to views
app.use((req, res, next) => {
    res.locals.darkMode = req.session.darkMode || false;
    next();
});

// Route to toggle Dark Mode
app.get("/toggle-dark-mode", (req, res) => {
    req.session.darkMode = !req.session.darkMode;
    res.json({ darkMode: req.session.darkMode });
});

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Multer configuration
const upload = multer({ dest: 'uploads/' });

// ======================
//      Routes
// ======================

// Home route
app.get("/", async (req, res) => {
    const allEvents = await Events.find({});
    res.render("events/events.ejs", { allEvents, user: req.user, darkMode: req.session.darkMode });
});

// Search route
app.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.redirect("/");
    }

    const searchResults = await Events.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { organizer: { $regex: query, $options: "i" } }
        ]
    });
    res.render("events/events.ejs", { allEvents: searchResults, user: req.user, darkMode: req.session.darkMode });
});

// Add event routes
app.get('/events/add', isAuthenticated, (req, res) => {
    res.render('events/addevent.ejs', { darkMode: req.session.darkMode });
});

app.post('/events/add', isAuthenticated, upload.none(), async (req, res) => {
    const { name, description, date, time, category, organizer, location, capacity, registrationLink } = req.body;
    const event = new Events({ name, description, date, time, category, organizer, location, capacity, registrationLink });
    await event.save();
    res.redirect('/');
});

// Event details route
app.get("/details/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Events.findById(id);
    res.render("events/details.ejs", { event, user: req.user, darkMode: req.session.darkMode });
});

// DELETE event route with authentication and authorization
app.delete("/details/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).send("You must be logged in to delete events.");
    }

    try {
        const { id } = req.params;
        const event = await Events.findById(id);

        if (!event) {
            return res.status(404).send("Event not found.");
        }

        const userEmail = req.user.email.toLowerCase();
        const userName = req.user.username.toLowerCase();
        const organizerName = event.organizer.toLowerCase();

        if (!userEmail.includes(organizerName) && !userName.includes(organizerName)) {
            return res.status(403).send("You are not authorized to delete this event.");
        }

        await Events.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Error deleting event: " + error.message);
    }
});

// Redirect to event's Google Form
app.post("/register/:id", async (req, res) => {
    const { id } = req.params;
    const event = await Events.findById(id);
    if (!event) {
        return res.send("Event not found.");
    }
    res.redirect(event.registrationLink);
});

// Authentication routes
app.get("/users/login", (req, res) => {
    res.render("users/login.ejs", { darkMode: req.session.darkMode });
});

app.get("/users/signup", (req, res) => {
    res.render("users/signup.ejs", { darkMode: req.session.darkMode });
});

// Signup route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!email.endsWith("@mjcollege.ac.in")) {
        return res.send("Signup allowed only for @mjcollege.ac.in emails.");
    }
    try {
        const user = new User({ username: email, email });
        await User.register(user, password);
        res.send("User registered successfully!");
    } catch (error) {
        res.send("Error registering user: " + error.message);
    }
});

// Login route
app.post("/login", async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.send("Invalid email or password.");
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
});

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/users/login");
}

// Start server
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});
