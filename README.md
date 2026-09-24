# Dr. Sasmita Padhy — Academic Website

A responsive, dynamic academic portfolio built with **vanilla HTML, CSS and JavaScript** from the supplied CV. It is ready to publish with GitHub Pages and uses no build tools or third-party frameworks.

## Features

- Responsive academic homepage with the CV profile photograph
- Light/dark theme toggle with local preference storage
- Sticky navigation and mobile menu
- Education and Ph.D. supervision tables
- Academic experience timeline
- Professional contributions, research interests, teaching portfolio and software skills
- Full journal publication list and full conference/book-chapter list
- Dynamic publication search, type filter and year filter
- Patent cards with role, application number and status
- Full workshop/seminar/FDP/STTP list with live search
- Memberships and personal details
- Signature and declaration from the source CV
- Downloadable original CV
- Print / Save as PDF mode
- Accessibility features, semantic HTML and reduced-motion support

## Files

```text
.
├── index.html
├── styles.css
├── script.js
├── data.js
├── assets/
│   ├── docs/Sasmita-CV.docx
│   └── images/
│       ├── profile.png
│       ├── signature.jpeg
│       └── favicon.svg
└── .github/workflows/pages.yml
```

## Run locally

You can open `index.html` directly, or run a small local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. The included workflow will deploy the site automatically after a push to the `main` branch.

## Content note

The site intentionally reproduces the information contained in the supplied CV, including contact and personal details, because the requested build was to avoid omitting CV information. Before making the repository public, review whether you want your home address, date of birth, phone/WhatsApp numbers, marital status and signature publicly visible.

## Editing

The content is centralized in `data.js`. Most text updates can be made there without changing the HTML layout. Styling is in `styles.css`, while filters, theme switching and navigation behavior are in `script.js`.
