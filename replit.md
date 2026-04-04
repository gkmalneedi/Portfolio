# Digital Marketing Portfolio — GK Malneedi

A professional personal website and portfolio for GK Malneedi, a digital marketing strategist. Includes a dynamic blog, service showcase, portfolio gallery, tools directory, and a comprehensive admin dashboard for managing all website content.

## Architecture

- **Backend:** Node.js + Express (serves both static files and REST API routes)
- **Frontend:** Vanilla HTML/CSS/JavaScript (no build step needed)
- **Data Storage:** Local JSON files in `data/` directory
- **File Uploads:** Multer handles image uploads and PDF uploads to `uploads/`
- **Auth:** Simple session-based admin auth (hardcoded credentials)

## Project Structure

```
├── server.js              # Express server with full REST API
├── content-loader.js      # Frontend script: fetches API and hydrates index.html
├── index.html             # Main landing page (hero, about, services, portfolio, tools, blog preview, contact)
├── blog.html              # Blog listing page (loads from /api/blogs)
├── article.html           # Individual article page (loads by ?id= from /api/blogs)
├── admin.html             # Full admin dashboard
├── script.js              # Frontend JS (animations, theme toggle, etc.)
├── style.css              # All styles (dark glassmorphism design)
├── favicon.svg
├── data/
│   ├── hero.json          # Hero section content
│   ├── about.json         # About section + feature cards
│   ├── services.json      # Services/skills cards
│   ├── portfolio.json     # Portfolio projects
│   ├── tools.json         # Marketing tools directory (categorised)
│   ├── testimonials.json  # Client testimonials
│   ├── blogs.json         # Blog posts
│   ├── site.json          # Site-wide settings (tagline, footer text, social links)
│   └── contact.json       # Contact info
├── assets/                # Static assets (resume PDF stored here)
└── uploads/               # Runtime image uploads (created by server on first run)
```

## Running the App

The app runs on port 5000. Start with:

```bash
npm start
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | /api/hero | Hero section |
| GET/POST | /api/about | About section |
| POST | /api/about/image | Upload about photo |
| GET/POST | /api/services | Services (array) |
| DELETE | /api/services/:id | Delete service |
| GET/POST | /api/portfolio | Portfolio items |
| POST | /api/portfolio/bulk | Bulk save portfolio |
| DELETE | /api/portfolio/:id | Delete portfolio item |
| GET/POST | /api/tools | Tools (array) |
| DELETE | /api/tools/:id | Delete tool |
| GET/POST | /api/testimonials | Testimonials (array) |
| DELETE | /api/testimonials/:id | Delete testimonial |
| GET/POST | /api/blogs | Blog posts (array) |
| DELETE | /api/blogs/:id | Delete blog post |
| GET/POST | /api/contact | Contact info |
| GET/POST | /api/site | Site-wide settings |
| POST | /api/upload/resume | Upload resume PDF |
| POST | /api/auth/login | Admin login |

## Admin Panel

- URL: `/admin.html`
- Username: `admin`
- Password: `admin123`

**Sections manageable from admin:**
- Dashboard (stats overview)
- Hero (eyebrow, headline, subheadline, CTAs)
- About (bio paragraphs, photo upload, feature cards, badges, highlight text)
- Services / Skills cards (add/edit/delete)
- Portfolio projects (add/edit/delete with image)
- Tools directory (add/edit/delete with category)
- Testimonials (add/edit/delete)
- Blog (create/edit/delete posts with image, tag, date, content)
- Contact info (email, phone, location, calendar link)
- Site settings (tagline, footer text, social links)
- Resume PDF upload

## Key Features

- Dark glassmorphism design with dark/light mode toggle
- All sections on homepage dynamically loaded from API via `content-loader.js`
- Blog listing and article pages load from API (no hardcoded data)
- Admin panel with login gate for all content management
- Image uploads for portfolio items and about photo
- Resume PDF upload with download link on hero section
- Responsive design with mobile menu
- Scroll animations and reveal effects
