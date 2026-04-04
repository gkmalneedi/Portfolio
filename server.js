const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'super_secret_replit_key';

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

fs.ensureDirSync(path.join(__dirname, 'data'));
fs.ensureDirSync(path.join(__dirname, 'uploads'));
fs.ensureDirSync(path.join(__dirname, 'assets'));

const dataFile = (name) => path.join(__dirname, 'data', `${name}.json`);

const defaults = {
    blogs: [],
    contact: { email: "hello@gkmalneedi.com", phone: "+91 8886816282", address: "Hyderabad, India" },
    hero: {
        eyebrow: "EXPERT DIGITAL MARKETING STRATEGIST",
        headline: "Driving Growth for Brands and IT Companies Through Data-Led Marketing.",
        headlineHighlight: "Data-Led",
        subheadline: "From SEO to performance marketing and analytics, I build growth systems that deliver measurable results.",
        cta1Text: "Download Resume",
        cta2Text: "Get a Free Site Audit",
        cta2Link: "#contact"
    },
    site: {
        name: "GK Malneedi",
        footerTagline: "Data-Driven Marketing & Full-Stack Development.",
        linkedinUrl: "https://www.linkedin.com/in/gopikrishna-malneedi/",
        twitterUrl: "#",
        footerText: "2026 and developed by Gopikrishna Malneedi.",
        bookCallLink: "#contact"
    },
    about: { imageUrl: "", badge1: "📈 9+ Years", badge2: "🎯 3x ROI Avg", heading: "Turning Data into", headingAccent: "Revenue.", paragraphs: [], featureCards: [], highlightText: "" },
    services: [],
    portfolio: [],
    tools: [],
    testimonials: []
};

Object.keys(defaults).forEach(key => {
    const file = dataFile(key);
    if (!fs.existsSync(file)) {
        fs.writeJsonSync(file, defaults[key], { spaces: 2 });
    }
});

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const imageUpload = multer({ storage: imageStorage });

const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'assets/'),
    filename: (req, file, cb) => cb(null, 'resume.pdf')
});
const resumeUpload = multer({ storage: resumeStorage });

const portfolioImageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'portfolio-' + Date.now() + '-' + file.originalname)
});
const portfolioImageUpload = multer({ storage: portfolioImageStorage });

const aboutImageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'about-' + Date.now() + '-' + file.originalname)
});
const aboutImageUpload = multer({ storage: aboutImageStorage });

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

// === AUTH ===
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '8h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// === GENERIC CRUD HELPERS ===
function makeSimpleRoutes(section) {
    app.get(`/api/${section}`, (req, res) => {
        res.json(fs.readJsonSync(dataFile(section)));
    });
    app.post(`/api/${section}`, authenticate, (req, res) => {
        fs.writeJsonSync(dataFile(section), req.body, { spaces: 2 });
        res.json({ success: true });
    });
}

function makeArrayRoutes(section) {
    app.get(`/api/${section}`, (req, res) => {
        res.json(fs.readJsonSync(dataFile(section)));
    });
    app.post(`/api/${section}`, authenticate, (req, res) => {
        fs.writeJsonSync(dataFile(section), req.body, { spaces: 2 });
        res.json({ success: true });
    });
    app.delete(`/api/${section}/:id`, authenticate, (req, res) => {
        const items = fs.readJsonSync(dataFile(section));
        fs.writeJsonSync(dataFile(section), items.filter(i => i.id !== req.params.id), { spaces: 2 });
        res.json({ success: true });
    });
}

makeSimpleRoutes('hero');
makeSimpleRoutes('about');
makeSimpleRoutes('contact');
makeSimpleRoutes('site');
makeArrayRoutes('services');
makeArrayRoutes('testimonials');
makeArrayRoutes('tools');

// === PORTFOLIO (with image upload) ===
app.get('/api/portfolio', (req, res) => {
    res.json(fs.readJsonSync(dataFile('portfolio')));
});
app.post('/api/portfolio', authenticate, portfolioImageUpload.single('image'), (req, res) => {
    const items = fs.readJsonSync(dataFile('portfolio'));
    let body = req.body;
    if (typeof body.data === 'string') {
        try { body = JSON.parse(body.data); } catch(e) {}
    }
    if (req.file) {
        body.image = '/uploads/' + req.file.filename;
    }
    if (!body.id) body.id = Date.now().toString();
    const idx = items.findIndex(i => i.id === body.id);
    if (idx >= 0) { items[idx] = body; } else { items.push(body); }
    fs.writeJsonSync(dataFile('portfolio'), items, { spaces: 2 });
    res.json({ success: true, item: body });
});
app.post('/api/portfolio/bulk', authenticate, (req, res) => {
    fs.writeJsonSync(dataFile('portfolio'), req.body, { spaces: 2 });
    res.json({ success: true });
});
app.delete('/api/portfolio/:id', authenticate, (req, res) => {
    const items = fs.readJsonSync(dataFile('portfolio'));
    fs.writeJsonSync(dataFile('portfolio'), items.filter(i => i.id !== req.params.id), { spaces: 2 });
    res.json({ success: true });
});

// === ABOUT IMAGE UPLOAD ===
app.post('/api/about/image', authenticate, aboutImageUpload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ success: true, url: '/uploads/' + req.file.filename });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

// === RESUME UPLOAD ===
app.post('/api/upload/resume', authenticate, resumeUpload.single('resume'), (req, res) => {
    if (req.file) {
        res.json({ success: true, path: '/assets/resume.pdf' });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

// === BLOGS ===
app.get('/api/blogs', (req, res) => {
    res.json(fs.readJsonSync(dataFile('blogs')));
});
app.post('/api/blogs', authenticate, imageUpload.single('image'), (req, res) => {
    const blogs = fs.readJsonSync(dataFile('blogs'));
    const newBlog = {
        id: Date.now().toString(),
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        tag: req.body.tag || 'General',
        image: req.file ? '/uploads/' + req.file.filename : 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    blogs.unshift(newBlog);
    fs.writeJsonSync(dataFile('blogs'), blogs, { spaces: 2 });
    res.json({ success: true, blog: newBlog });
});
app.put('/api/blogs/:id', authenticate, imageUpload.single('image'), (req, res) => {
    const blogs = fs.readJsonSync(dataFile('blogs'));
    const idx = blogs.findIndex(b => b.id === req.params.id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });
    blogs[idx] = {
        ...blogs[idx],
        title: req.body.title || blogs[idx].title,
        excerpt: req.body.excerpt || blogs[idx].excerpt,
        content: req.body.content || blogs[idx].content,
        tag: req.body.tag || blogs[idx].tag,
        image: req.file ? '/uploads/' + req.file.filename : blogs[idx].image
    };
    fs.writeJsonSync(dataFile('blogs'), blogs, { spaces: 2 });
    res.json({ success: true, blog: blogs[idx] });
});
app.delete('/api/blogs/:id', authenticate, (req, res) => {
    const blogs = fs.readJsonSync(dataFile('blogs'));
    fs.writeJsonSync(dataFile('blogs'), blogs.filter(b => b.id !== req.params.id), { spaces: 2 });
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
