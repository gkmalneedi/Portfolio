# Digital Marketing Portfolio

A professional personal website and portfolio for GK Malneedi, a digital marketing strategist. Includes a blog, service showcase, and an admin dashboard for managing content.

## Architecture

- **Backend:** Node.js + Express (serves both static files and API routes)
- **Frontend:** Vanilla HTML/CSS/JavaScript (no build step needed)
- **Data Storage:** Local JSON files in `data/` directory (`blogs.json`, `contact.json`)
- **Auth:** JWT-based admin authentication

## Project Structure

```
├── server.js         # Express server (entry point)
├── index.html        # Main landing page
├── blog.html         # Blog listing page
├── article.html      # Individual article page
├── admin.html        # Admin dashboard
├── script.js         # Frontend JavaScript
├── style.css         # All styles
├── data/
│   ├── blogs.json    # Blog posts storage
│   └── contact.json  # Contact info storage
├── assets/           # Static assets (resume PDF, etc.)
└── uploads/          # Runtime image uploads (created by server)
```

## Running the App

The app runs on port 5000. Start with:

```bash
npm start
```

## Admin Panel

- URL: `/admin.html`
- Username: `admin`
- Password: `admin123`

## Key Features

- Dark/light mode toggle
- Interactive marketing tools directory (80+ tools)
- Blog system with image uploads
- Contact info management via admin
- Exit intent popup for lead generation
- JWT-protected admin routes

## Notes

- All API calls use relative URLs (`/api/...`) so they work in both dev and production
- No build step required — Express serves static files directly
