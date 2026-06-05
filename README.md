# EST Natation — Angular

## Setup

```bash
ng new est-natation --standalone --style=css --routing=false
cd est-natation
```

Then copy the contents of this `angular-export/` folder over the generated project (overwrite `package.json`, `angular.json`, `tailwind.config.js`, `src/`).

```bash
npm install
npm start
```

Open http://localhost:4200.

## Notes

- Angular 17+ standalone components, signals, control flow (`@if`, `@for`)
- Tailwind v3 (Angular ecosystem)
- Scroll-reveal via a custom `appReveal` directive (IntersectionObserver)
- Parallax via `appParallax` directive
- Logo at `src/assets/logo.png` — replace with your real EST logo
