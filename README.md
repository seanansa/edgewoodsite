# Edgewood Catskills static site

A zero-framework HTML/CSS/JS build designed to deploy directly to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host.

## Pages
- `index.html` — cinematic scrolling home page
- `about.html`
- `contact.html`
- `faq.html`

## Performance behavior
- The hero video source is attached immediately.
- Lower videos have **no `src` at initial page load**.
- `IntersectionObserver` attaches each upcoming video only when it is within roughly one viewport of the visitor.
- Videos play only while on screen and pause after leaving view.
- Mobile receives smaller 1280px encodes; desktop receives 1920px encodes.
- Audio tracks were removed from all background videos.
- Videos use `faststart` MP4 encoding so playback can begin before the entire file downloads.
- If the visitor has Data Saver or Reduced Motion enabled, the page stays on lightweight poster images instead of autoplaying video.

## Booking
All `Book your stay` links point to:
https://book.edgewoodcatskills.com/

## Contact form
This first static version opens the visitor's email app addressed to `stay@edgewoodcatskills.com`. If you want an in-page form submission instead, connect the form to Formspree, Netlify Forms, Basin, or your own endpoint.

## Run locally
From this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy
Upload the entire folder to a static host. No build command is required.

## Internal links
Internal pages link directly to `.html` files for reliable navigation on Vercel and in local previews. Deploy with the included `vercel.json` (`cleanUrls: false`).
