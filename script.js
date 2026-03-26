document.addEventListener('DOMContentLoaded', () => {

    // Reveal Animation on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Dark/Light Mode Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootEl = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = rootEl.getAttribute('data-theme');
        if (currentTheme === 'light') {
            rootEl.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            rootEl.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // Popup Logic (Exit Intent & Time Delay)
    const popupModal = document.getElementById('lead-popup');
    const closePopupBtn = document.getElementById('close-popup');
    let popupShown = false;

    const showPopup = () => {
        if (!popupShown) {
            popupModal.classList.add('active');
            popupShown = true;
        }
    };

    closePopupBtn.addEventListener('click', () => {
        popupModal.classList.remove('active');
    });

    // Close when clicking outside content
    popupModal.addEventListener('click', (e) => {
        if (e.target === popupModal) {
            popupModal.classList.remove('active');
        }
    });

    // Show popup after 15 seconds
    setTimeout(showPopup, 15000);

    // Show popup on exit intent (mouse leaves top of window)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) {
            showPopup();
        }
    });

    // Mobile Menu Toggle (Basic implementation)
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', () => {
        // Toggle basic inline display for simplicity
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'var(--nav-bg)';
            navLinks.style.padding = '20px';
            navLinks.style.backdropFilter = 'blur(10px)';
        }
    });

    // Form Submit Preventive default
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will reply shortly.');
    });

    document.getElementById('popup-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Audit requested! Check your email in 24 hours.');
        popupModal.classList.remove('active');
    });

});

// Tools Data
const toolsData = [
    {name:"ChatGPT",category:"AI Tools",logo:"https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",description:"AI conversational assistant"},
    {name:"Gemini",category:"AI Tools",logo:"https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",description:"Google's AI assistant"},
    {name:"Claude",category:"AI Tools",logo:"https://claude.ai/favicon.ico",description:"Anthropic's AI assistant"},
    {name:"Genspark",category:"AI Tools",logo:"https://www.genspark.ai/favicon.ico",description:"AI content generation"},
    {name:"Relevance AI",category:"AI Tools",logo:"https://relevanceai.com/favicon.ico",description:"AI automation platform"},
    {name:"Kimi K2",category:"AI Tools",logo:"https://kimi.ai/favicon.ico",description:"Advanced AI reasoning model"},
    {name:"Antigravity",category:"AI Tools",logo:"https://antigravity.ai/favicon.ico",description:"AI-powered automation"},
    {name:"ElevenLabs",category:"AI Tools",logo:"https://elevenlabs.io/favicon.ico",description:"AI voice & speech synthesis"},
    {name:"Replit",category:"Development",logo:"https://replit.com/public/images/logo-small.png",description:"Cloud development platform"},
    {name:"GitHub Copilot",category:"Development",logo:"https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png",description:"AI code assistant"},
    {name:"Lovable",category:"Development",logo:"https://lovable.dev/favicon.ico",description:"AI development platform"},
    {name:"Cursor",category:"Development",logo:"https://cursor.sh/favicon.ico",description:"AI-powered code editor"},
    {name:"GitHub",category:"Development",logo:"https://github.githubassets.com/favicons/favicon.svg",description:"Code repository"},
    {name:"Firebase",category:"Development",logo:"https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png",description:"Backend as a service"},
    {name:"Google Analytics",category:"Analytics",logo:"https://www.google.com/analytics/static/img/favicon.ico",description:"Web analytics platform"},
    {name:"Search Console",category:"Analytics",logo:"https://www.gstatic.com/devrel-devsite/prod/vbd4700a5d5876e528faa4e0f3eb83427b68b38b40d2bf06b2c2aa5b1eaa2ad7c51/search/images/favicons/oneproduct/favicon.ico",description:"Search performance"},
    {name:"GTM",category:"Analytics",logo:"https://www.gstatic.com/tagmanager/favicon.ico",description:"Tag management system"},
    {name:"Clarity",category:"Analytics",logo:"https://clarity.microsoft.com/favicon.ico",description:"User behavior analytics"},
    {name:"Tableau",category:"Analytics",logo:"https://cdns.tblsft.com/sites/default/files/favicon_1.ico",description:"Data visualization"},
    {name:"Google Ads",category:"Advertising",logo:"https://www.google.com/ads/images/favicon.ico",description:"Search & display ads"},
    {name:"Meta Ads",category:"Advertising",logo:"https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico",description:"Facebook & Instagram ads"},
    {name:"LinkedIn Ads",category:"Advertising",logo:"https://static.licdn.com/aero-v1/sc/h/8s162nmbcnfkg7a0k8nq9wwqo",description:"LinkedIn advertising"},
    {name:"X Ads",category:"Advertising",logo:"https://abs.twimg.com/favicons/twitter.3.ico",description:"X (Twitter) advertising"},
    {name:"LinkedIn",category:"Social Media",logo:"https://static.licdn.com/aero-v1/sc/h/8s162nmbcnfkg7a0k8nq9wwqo",description:"Professional networking"},
    {name:"Facebook",category:"Social Media",logo:"https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico",description:"Social networking"},
    {name:"Instagram",category:"Social Media",logo:"https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png",description:"Photo & video sharing"},
    {name:"X (Twitter)",category:"Social Media",logo:"https://abs.twimg.com/favicons/twitter.3.ico",description:"Microblogging platform"},
    {name:"Pinterest",category:"Social Media",logo:"https://s.pinimg.com/webapp/favicon-77e601fa.png",description:"Visual discovery platform"},
    {name:"Ocoya",category:"Social Media",logo:"https://www.ocoya.com/favicon.ico",description:"AI social management"},
    {name:"Buffer",category:"Social Media",logo:"https://buffer.com/static/icons/favicon.ico",description:"Social media scheduling"},
    {name:"Hootsuite",category:"Social Media",logo:"https://hootsuite.com/dist/assets/images/icons/icon-76x76.png",description:"Social media management"},
    {name:"Sprout Social",category:"Social Media",logo:"https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",description:"Social analytics"},
    {name:"Canva",category:"Design",logo:"https://static.canva.com/web/images/favicon.ico",description:"Graphic design platform"},
    {name:"Adobe CC",category:"Design",logo:"https://www.adobe.com/favicon.ico",description:"Creative software suite"},
    {name:"Figma",category:"Design",logo:"https://static.figma.com/app/icon/1/favicon.ico",description:"UI/UX design tool"},
    {name:"Microsoft Designer",category:"Design",logo:"https://designer.microsoft.com/favicon.ico",description:"AI-powered design tool"},
    {name:"Lovart AI",category:"Design",logo:"https://www.lovart.ai/favicon.ico",description:"AI art generation"},
    {name:"Motiff",category:"Design",logo:"https://motiff.com/favicon.ico",description:"Design collaboration tool"},
    {name:"MagicBrief",category:"Marketing",logo:"https://magicbrief.com/favicon.ico",description:"Ad creative library"},
    {name:"Foreplay",category:"Marketing",logo:"https://www.foreplay.co/favicon.ico",description:"Ad inspiration platform"},
    {name:"SEMrush",category:"Marketing",logo:"https://static.semrush.com/ui-kit/favicon/favicon-32x32.png",description:"SEO & competitive analysis"},
    {name:"SendGrid",category:"Email & Communication",logo:"https://sendgrid.com/favicon.ico",description:"Email delivery platform"},
    {name:"Brevo",category:"Email & Communication",logo:"https://www.brevo.com/favicon.ico",description:"Email marketing platform"},
    {name:"Gmail",category:"Email & Communication",logo:"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",description:"Email platform"},
    {name:"GetResponse",category:"Email & Communication",logo:"https://www.getresponse.com/favicon.ico",description:"Email automation"},
    {name:"Resend",category:"Email & Communication",logo:"https://resend.com/favicon.ico",description:"Developer email API"},
    {name:"Pipedream",category:"Automation",logo:"https://pipedream.com/favicon.ico",description:"Workflow automation"},
    {name:"Zapier",category:"Automation",logo:"https://cdn.zapier.com/zapier/images/favicon.ico",description:"Workflow automation"},
    {name:"N8N",category:"Automation",logo:"https://n8n.io/favicon.svg",description:"Workflow automation tool"},
    {name:"Apollo",category:"CRM & Sales",logo:"https://www.apollo.io/favicon.ico",description:"Sales intelligence platform"},
    {name:"ZoomInfo",category:"CRM & Sales",logo:"https://www.zoominfo.com/favicon.ico",description:"B2B contact database"},
    {name:"LinkedIn Sales Nav",category:"CRM & Sales",logo:"https://static.licdn.com/aero-v1/sc/h/8s162nmbcnfkg7a0k8nq9wwqo",description:"LinkedIn sales tool"},
    {name:"PowerLead",category:"CRM & Sales",logo:"https://www.powerlead.com/favicon.ico",description:"Lead generation platform"},
    {name:"HubSpot",category:"CRM & Sales",logo:"https://static.hsappstatic.net/favicon.ico",description:"CRM & marketing automation"},
    {name:"Salesforce",category:"CRM & Sales",logo:"https://c1.sfdcstatic.com/etc/clientlibs/sfdc-aem-master/clientlibs_base/img/favicon.ico",description:"Customer relationship management"},
    {name:"TeleCMI",category:"CRM & Sales",logo:"https://www.telecmi.com/favicon.ico",description:"Cloud telephony"},
    {name:"Microsoft 365",category:"Productivity",logo:"https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/office_24x.svg",description:"Office productivity suite"},
    {name:"JIRA",category:"Productivity",logo:"https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon-32x32.png",description:"Project management and tracking"},
    {name:"SAP",category:"Productivity",logo:"https://www.sap.com/dam/application/shared/logos/sap-logo-svg.svg",description:"Enterprise software"},
    {name:"Zoho",category:"Productivity",logo:"https://www.zoho.com/favicon.ico",description:"Business software suite"},
    {name:"WordPress",category:"Content & CMS",logo:"https://s1.wp.com/i/favicon.ico",description:"Content management system"},
    {name:"Medium",category:"Content & CMS",logo:"https://miro.medium.com/1*m-R_BkNf1Qjr1YbyOIJY2w.png",description:"Publishing platform"},
    {name:"YouTube",category:"Content & CMS",logo:"https://www.youtube.com/s/desktop/f506bd45/img/favicon_32x32.png",description:"Video sharing platform"},
    {name:"Supademo",category:"Content & CMS",logo:"https://app.supademo.com/favicon.ico",description:"Interactive demo platform"},
    {name:"GoDaddy",category:"Hosting & E-commerce",logo:"https://img1.wsimg.com/ux/favicon/favicon-32x32.png",description:"Domain & hosting provider"},
    {name:"Amazon Seller",category:"Hosting & E-commerce",logo:"https://images-na.ssl-images-amazon.com/images/G/01/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png",description:"Amazon marketplace"},
    {name:"Flipkart Hub",category:"Hosting & E-commerce",logo:"https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/favicon-62d31a.png",description:"Flipkart marketplace"},
    {name:"Cloudflare",category:"Hosting & E-commerce",logo:"https://www.cloudflare.com/favicon.ico",description:"CDN, DNS & web security"}
];

// Setup Tools Interactivity
document.addEventListener('DOMContentLoaded', () => {
    const pills = document.querySelectorAll('.tool-pill');
    const displayArea = document.getElementById('tools-display');
    
    if (pills.length > 0 && displayArea) {
        function renderTools(category) {
            const filteredTools = toolsData.filter(t => t.category === category);
            let html = '';
            filteredTools.forEach(t => {
                // Ensure generic fallback if logo fails
                const initial = t.name.substring(0, 2).toUpperCase();
                html += `
                    <div class="tool-card animate-fade-in">
                        <img src="${t.logo}" alt="${t.name}" onerror="this.outerHTML='<div class=\\'tool-fallback-icon\\'>${initial}</div>'">
                        <span>${t.name}</span>
                        <div class="tool-tooltip">${t.description}</div>
                    </div>
                `;
            });
            displayArea.innerHTML = html;
        }

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const cat = pill.getAttribute('data-category');
                renderTools(cat);
            });
        });

        // Initialize with AI Tools showing
        renderTools('AI Tools');
    }
});

