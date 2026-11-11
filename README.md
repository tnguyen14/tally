# tally

Simple counters, published with GitHub Pages at
[tridnguyen.com/tally](https://tridnguyen.com/tally/).

Starts with one counter. Tap **+** / **−** to change it, click a name to rename
it, and use **Add counter** for more. Counters are stored in the browser's
`localStorage` (key `tally:counters`), so they stay on that device and browser
only.

## Development

```sh
npm install
npm run dev     # local dev server on port 4007
npm run build   # static output in dist/
```

Pushes to `main` build and deploy via GitHub Actions
(`.github/workflows/deploy.yml`). GitHub Pages must be set to deploy from
GitHub Actions (Settings → Pages → Source).
