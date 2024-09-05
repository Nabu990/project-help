const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Storage setup for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const users = [];
const projects = [];
const activities = []; 

// Routes
app.get('/', (req, res) => {
    res.render('index', { testimonials: [
        { user: 'Charlstain', message: 'This system is amazing! It made managing my projects so much easier.' },
        { user: 'Light Williams', message: 'I love the user-friendly interface and seamless authentication process.' },
        { user: 'Alvin Dogba', message: 'A fantastic platform for showcasing and tracking projects.' }
    ] });
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/dashboard', (req, res) => {
    const user = users[0];
    res.render('dashboard', { user, projects, activities }); 
});

app.post('/signup', upload.single('profilePhoto'), (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        photo: req.file.filename
    };
    users.push(newUser);
    res.redirect('/login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    res.redirect('/');
});

app.post('/submit-project', upload.single('projectImage'), (req, res) => {
    const newProject = {
        title: req.body.projectTitle,
        description: req.body.projectDescription,
        image: req.file.filename,
        date: new Date()
    };
    projects.push(newProject);
    activities.push({ user: req.body.username, action: 'Submitted a new project', date: new Date() });
    res.redirect('/dashboard');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
