# Edgewood Catskills — launch notes

## What was updated
- Preserved original HTML/CSS/JS layout and trail navigation.
- Replaced all five desktop videos with the exact uploaded 4K H.264 masters (no recompression).
- Preserved the original five mobile-specific video files; the new uploads did not include mobile-specific replacements.
- Regenerated desktop poster images from the uploaded 4K videos.
- Updated FAQ, contact email, group retreat copy, and email-draft contact behavior.
- Added page metadata, social previews, canonical URLs, lodging and FAQ JSON-LD, sitemap, robots, llms.txt, favicon, privacy draft, and Vercel configuration.

## Before going live
1. Confirm actual email inbox stay@edgewoodcatskills.com is receiving mail. The contact form **opens an email draft**; it does not send messages server-side. If you need an in-page send action, integrate a form service.
2. Verify all booking buttons resolve to your live Lodgify booking service and cancellation terms agree with the FAQ.
3. Review the privacy draft against your actual analytics, cookies and processors. It is not a legal certification.
4. Review photos and videos for rights and accuracy. The desktop videos are large (approximately 230 MB total); lazy loading mitigates initial loading, but consider adaptive encodes/CDN later.
5. Confirm all property claims, including bathhouse count, open season, pet policy, and weather refund exception.
6. Check production on iPhone and desktop, including reduced motion, links, video cropping, readability, and contact email.
7. Connect domain in Vercel and preserve existing booking subdomain and email DNS records. Submit sitemap to Google Search Console.

## Hosting
This is a static site. Deploy the directory to Vercel as an Other/static project. `vercel.json` enables clean URLs; sitemap and canonicals use clean paths.
