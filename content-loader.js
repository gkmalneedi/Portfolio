// Dynamic Content Loader - fetches all section data from API and updates the page
(async function() {
    'use strict';

    async function fetchSection(name) {
        try {
            const r = await fetch('/api/' + name);
            if (!r.ok) return null;
            return await r.json();
        } catch(e) { return null; }
    }

    function esc(str) {
        if (str == null) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ── HERO ──────────────────────────────────────────────────────────────────
    function updateHero(d) {
        const eyebrow = document.getElementById('hero-eyebrow');
        const headline = document.getElementById('hero-headline');
        const subheadline = document.getElementById('hero-subheadline');
        const cta1 = document.getElementById('hero-cta1');
        const cta2 = document.getElementById('hero-cta2');

        if (eyebrow && d.eyebrow) eyebrow.textContent = d.eyebrow;
        if (headline && d.headline) {
            const highlight = d.headlineHighlight || '';
            if (highlight && d.headline.includes(highlight)) {
                const parts = d.headline.split(highlight);
                headline.innerHTML = esc(parts[0]) + '<span class="gradient-text">' + esc(highlight) + '</span>' + esc(parts[1] || '');
            } else {
                headline.textContent = d.headline;
            }
        }
        if (subheadline && d.subheadline) subheadline.textContent = d.subheadline;
        if (cta1 && d.cta1Text) cta1.textContent = d.cta1Text;
        if (cta2 && d.cta2Text) { cta2.textContent = d.cta2Text; if(d.cta2Link) cta2.href = d.cta2Link; }
    }

    // ── ABOUT ─────────────────────────────────────────────────────────────────
    function updateAbout(d) {
        const img = document.getElementById('about-image');
        const badge1 = document.getElementById('about-badge1');
        const badge2 = document.getElementById('about-badge2');
        const heading = document.getElementById('about-heading');
        const paragraphsEl = document.getElementById('about-paragraphs');
        const featuresEl = document.getElementById('about-features');
        const highlight = document.getElementById('about-highlight');

        if (img && d.imageUrl) img.src = d.imageUrl;
        if (badge1 && d.badge1) badge1.textContent = d.badge1;
        if (badge2 && d.badge2) badge2.textContent = d.badge2;
        if (heading) {
            heading.innerHTML = esc(d.heading || '') + ' <span class="accent-text">' + esc(d.headingAccent || '') + '</span>';
        }
        if (paragraphsEl && d.paragraphs && d.paragraphs.length) {
            paragraphsEl.innerHTML = d.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('');
        }
        if (featuresEl && d.featureCards && d.featureCards.length) {
            featuresEl.innerHTML = d.featureCards.map(card => `
                <div class="feature-card glass-card reveal active">
                    <h3 class="about-subhead mt-0">${esc(card.emoji)} ${esc(card.title)}</h3>
                    <p>${card.intro}</p>
                    <ul class="about-list">
                        ${(card.items||[]).map(item => `<li><i class="fa-solid ${esc(item.icon)}"></i> ${esc(item.text)}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        }
        if (highlight && d.highlightText) {
            highlight.innerHTML = '<p><strong>' + esc(d.highlightText) + '</strong></p>';
        }
    }

    // ── SERVICES ──────────────────────────────────────────────────────────────
    function renderServices(items) {
        const grid = document.getElementById('services-grid');
        if (!grid || !items.length) return;
        grid.innerHTML = items.map(s => `
            <div class="service-card glass-card reveal active">
                <div class="card-icon"><i class="fa-solid ${esc(s.icon)}"></i></div>
                <h3>${esc(s.title)}</h3>
                <div class="card-content">
                    <p><strong>Problem:</strong> ${esc(s.problem)}</p>
                    <p><strong>Solution:</strong> ${esc(s.solution)}</p>
                    <p><strong>Result:</strong> ${esc(s.result)}</p>
                </div>
            </div>
        `).join('');
    }

    // ── PORTFOLIO ─────────────────────────────────────────────────────────────
    function renderPortfolio(items) {
        const grid = document.getElementById('portfolio-grid');
        if (!grid || !items.length) return;
        grid.innerHTML = items.map(p => `
            <div class="portfolio-card glass-card reveal active">
                <div class="portfolio-img">
                    <img src="${esc(p.image)}" alt="${esc(p.overlay)}" loading="lazy">
                    <div class="portfolio-overlay"><h4>${esc(p.overlay)}</h4></div>
                </div>
                <div class="portfolio-info">
                    <p><strong>The Problem:</strong> ${esc(p.problem)}</p>
                    <p><strong>The Strategy:</strong> ${esc(p.strategy)}</p>
                    <p class="result-text"><strong>The Result:</strong> ${esc(p.result)}</p>
                </div>
            </div>
        `).join('');
    }

    // ── TESTIMONIALS ──────────────────────────────────────────────────────────
    function renderTestimonials(items) {
        const carousel = document.getElementById('testimonials-carousel');
        if (!carousel || !items.length) return;
        carousel.innerHTML = items.map(t => `
            <div class="testimonial-card glass-card">
                <div class="stars">
                    ${'<i class="fa-solid fa-star"></i>'.repeat(Math.min(5, t.stars || 5))}
                </div>
                <p class="quote">"${esc(t.quote)}"</p>
                <div class="client-info">
                    <div class="client-avatar">${esc(t.initials)}</div>
                    <div class="client-details">
                        <h4>${esc(t.name)}</h4>
                        <p>${esc(t.role)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ── TOOLS ─────────────────────────────────────────────────────────────────
    function updateTools(items) {
        if (!items || !items.length) return;
        window._toolsDataAPI = items;

        const pills = document.getElementById('tools-pills-container');
        const displayArea = document.getElementById('tools-display');
        if (!pills || !displayArea) return;

        const categories = [...new Set(items.map(t => t.category))];
        pills.innerHTML = categories.map((cat, i) => {
            const count = items.filter(t => t.category === cat).length;
            return `<button class="tool-pill${i===0?' active':''}" data-category="${esc(cat)}">${esc(cat)} <span>(${count})</span></button>`;
        }).join('');

        const renderTools = (cat) => {
            const filtered = items.filter(t => t.category === cat);
            displayArea.innerHTML = filtered.map(t => {
                const initial = (t.name||'').substring(0,2).toUpperCase();
                return `<div class="tool-card animate-fade-in">
                    <img src="${esc(t.logo)}" alt="${esc(t.name)}" onerror="this.outerHTML='<div class=\\'tool-fallback-icon\\'>${esc(initial)}</div>'">
                    <span>${esc(t.name)}</span>
                    <div class="tool-tooltip">${esc(t.description)}</div>
                </div>`;
            }).join('');
        };

        pills.querySelectorAll('.tool-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                pills.querySelectorAll('.tool-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                renderTools(pill.getAttribute('data-category'));
            });
        });

        if (categories.length) renderTools(categories[0]);
    }

    // ── BLOG (homepage preview) ───────────────────────────────────────────────
    function renderBlogPreview(items) {
        const grid = document.getElementById('blog-preview-grid');
        if (!grid) return;
        const preview = items.slice(0, 3);
        if (!preview.length) return;
        grid.innerHTML = preview.map(b => `
            <a href="article.html?id=${esc(b.id)}" class="blog-card glass-card">
                ${b.image ? `<div class="blog-card-img"><img src="${esc(b.image)}" alt="${esc(b.title)}" loading="lazy"></div>` : ''}
                <div class="blog-content">
                    <span class="blog-tag">${esc(b.tag||'General')}</span>
                    <h3>${esc(b.title)}</h3>
                    <p>${esc(b.excerpt)}</p>
                    <span class="read-more">Read Article <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </a>
        `).join('');
    }

    // ── CONTACT ───────────────────────────────────────────────────────────────
    function updateContact(d) {
        const email = document.getElementById('dyn-email');
        const address = document.getElementById('dyn-address');
        if (email && d.email) email.textContent = d.email;
        if (address && d.address) address.textContent = d.address;
    }

    // ── SITE ──────────────────────────────────────────────────────────────────
    function updateSite(d) {
        const logoEls = document.querySelectorAll('.site-name');
        const footerTagline = document.getElementById('footer-tagline');
        const linkedinLinks = document.querySelectorAll('.social-linkedin');
        const twitterLinks = document.querySelectorAll('.social-twitter');
        const footerTextEl = document.getElementById('footer-text');

        logoEls.forEach(el => { if(d.name) el.textContent = d.name; });
        if (footerTagline && d.footerTagline) footerTagline.textContent = d.footerTagline;
        linkedinLinks.forEach(a => { if(d.linkedinUrl) a.href = d.linkedinUrl; });
        twitterLinks.forEach(a => { if(d.twitterUrl) a.href = d.twitterUrl; });
        if (footerTextEl && d.footerText) footerTextEl.textContent = '© ' + d.footerText;
    }

    // ── LOAD ALL ──────────────────────────────────────────────────────────────
    const [hero, about, services, portfolio, testimonials, tools, blogs, contact, site] = await Promise.all([
        fetchSection('hero'),
        fetchSection('about'),
        fetchSection('services'),
        fetchSection('portfolio'),
        fetchSection('testimonials'),
        fetchSection('tools'),
        fetchSection('blogs'),
        fetchSection('contact'),
        fetchSection('site')
    ]);

    if (hero) updateHero(hero);
    if (about) updateAbout(about);
    if (services && services.length) renderServices(services);
    if (portfolio && portfolio.length) renderPortfolio(portfolio);
    if (testimonials && testimonials.length) renderTestimonials(testimonials);
    if (tools && tools.length) updateTools(tools);
    if (blogs && blogs.length) renderBlogPreview(blogs);
    if (contact) updateContact(contact);
    if (site) updateSite(site);

})();
