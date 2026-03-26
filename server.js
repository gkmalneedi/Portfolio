const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3500;
const SECRET_KEY = 'super_secret_replit_key'; // Hardcoded for simplicity in Replit demo

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve HTML/CSS/JS exactly as is
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure data and upload directories exist
fs.ensureDirSync(path.join(__dirname, 'data'));
fs.ensureDirSync(path.join(__dirname, 'uploads'));

// Ensure JSON files exist with defaults
const blogsFile = path.join(__dirname, 'data', 'blogs.json');
const contactFile = path.join(__dirname, 'data', 'contact.json');

if (!fs.existsSync(blogsFile)) {
    fs.writeJsonSync(blogsFile, []);
}

if (!fs.existsSync(contactFile)) {
    fs.writeJsonSync(contactFile, {
        email: "hello@gkmalneedi.com",
        phone: "+91 98765 43210",
        address: "Hyderabad, India"
    });
}

// Multer Config for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// === MIDDLEWARE ===
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// === AUTH ROUTES ===
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Simple basic auth for admin
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials. Password is admin123' });
    }
});

// === CONTACT ROUTES ===
app.get('/api/contact', (req, res) => {
    res.json(fs.readJsonSync(contactFile));
});

app.post('/api/contact', authenticate, (req, res) => {
    fs.writeJsonSync(contactFile, req.body);
    res.json({ success: true, message: 'Contact info updated!' });
});

// === BLOG ROUTES ===
app.get('/api/blogs', (req, res) => {
    res.json(fs.readJsonSync(blogsFile));
});

app.post('/api/blogs', authenticate, upload.single('image'), (req, res) => {
    const blogs = fs.readJsonSync(blogsFile);
    const newBlog = {
        id: Date.now().toString(),
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        // Save the uploaded image path, or default generic image if none
        image: req.file ? '/uploads/' + req.file.filename : 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    blogs.unshift(newBlog); // add to top
    fs.writeJsonSync(blogsFile, blogs);
    res.json({ success: true, blog: newBlog });
});

app.delete('/api/blogs/:id', authenticate, (req, res) => {
    const blogs = fs.readJsonSync(blogsFile);
    const newBlogs = blogs.filter(b => b.id !== req.params.id);
    fs.writeJsonSync(blogsFile, newBlogs);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
