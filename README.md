# Farm portfolio

A static, dependency-free portfolio: plain HTML, CSS and JavaScript. No build step, no framework, about 40 KB before fonts.

## Files

```
index.html      Home: intro, project farm, about + contact
project.html    One project page (project.html?id=<project id>)
404.html        Not-found page (GitHub Pages / Netlify pick it up automatically)
css/styles.css  All styles, including the four season themes
js/data.js      YOUR CONTENT: profile, skills, books, music, projects  <- edit this
js/app.js       Rendering, season toggle, music player, pixel-art sprites
audio/          Your music files (optional)
favicon.svg
```

## Editing content

Everything is in `js/data.js`. Each project has a `status` (`complete` or `in-progress`) and, once complete, a `quality` (`iridium`, `gold`, `silver`, `none`). In-progress projects also have a `stage` (0 seed, 1 sprout, 2 growing, 3 budding) and no star until complete. The order on the page is automatic: complete first, sorted by quality, then in progress, most advanced first.

To use a real photo, put it in an `img/` folder and set `photo: 'img/me.jpg'` (a square image around 320×320, under 60 KB). Your CV sits next to `index.html` (`cv: 'CV_HOLEIHEL_Eng.pdf'`) and opens in a new tab. File names are case-sensitive once online.

The goodbye sign at the bottom of each page is `profile.farewell`, one line per season. The quote under your intro is `profile.quote` in `js/data.js`: one default quote, plus optional per-season quotes that swap in with the season. The pixel avatar changes outfit with the season (flower crown, straw hat, scarf, beanie); set `seasonalOutfits: false` for one plain outfit. Outfits only apply to the pixel avatar, not to a photo.

Also update the `<title>`, `description` and `og:` tags at the top of `index.html` and `project.html` with your name and final URL.

## Background music

The Music button in the header is opt-in: nothing plays, and nothing is downloaded, until a visitor presses it. Once on, it carries over between pages during the visit and pauses when the tab is hidden.

1. Put a track in `audio/`, e.g. `audio/theme.mp3`.
2. Set the paths in `js/data.js` under `music.tracks`. `default` plays everywhere; add `spring`, `summer`, `fall`, `winter` tracks to crossfade with the season.
3. Set `music.enabled: false` to hide the button.

Keep files small: a 1 to 2 minute loop exported as MP3, mono, 96 kbps is around 1 MB. Only use music you have the rights to (your own, CC0/public domain, or a royalty-free license that allows use on a website), and keep any required attribution in the footer.

## Run it locally

Opening `index.html` directly works. For a setup closer to production:

```
cd portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy for free: GitHub Pages (recommended)

1. Create a GitHub account if you don't have one.
2. Create a new public repository named exactly `<your-username>.github.io`.
3. Upload the contents of this folder (not the folder itself) so `index.html` is at the root of the repo.
   - In the browser: "Add file" > "Upload files", drag everything in, commit.
   - Or with git:
     ```
     cd portfolio
     git init
     git add .
     git commit -m "First version of my portfolio"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
     git push -u origin main
     ```
4. In the repo go to Settings > Pages. Under "Build and deployment", set Source to "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
5. After a minute or two the site is live at `https://<your-username>.github.io`.

Every later push to `main` redeploys automatically.

## Alternatives (also free)

- **Cloudflare Pages**: Workers & Pages > Create > Pages > connect your GitHub repo. Framework preset "None", build command empty, output directory `/`. Fast global CDN.
- **Netlify**: "Add new site" > "Deploy manually" and drag the folder onto the page, or connect the GitHub repo with no build command.

## Custom domain (optional, not free)

A domain costs roughly 10 EUR/year. Once you have one, add it under Settings > Pages > Custom domain (GitHub) and follow the DNS instructions shown there. HTTPS is free on all three hosts.

## Performance notes

- No images are requested: plants, stars, avatar and icons are drawn as tiny inline SVGs.
- Fonts load with `display=swap`, so text shows instantly in a fallback font.
- To remove the Google Fonts request entirely, download Pixelify Sans and Atkinson Hyperlegible as `.woff2` (e.g. from google-webfonts-helper), put them in `fonts/`, and replace the Google `<link>` tags with `@font-face` rules in `styles.css`.
- Motion respects the visitor's "reduce motion" setting.
# Portfolio
