Local development notes

1) If you need to install private packages locally (e.g., `@lovable.dev/*`),
   create an npm token and set it as an environment variable:

   - macOS / Linux:
     ```bash
     export NPM_TOKEN=your_token_here
     ```

   - Windows (PowerShell):
     ```powershell
     setx NPM_TOKEN "your_token_here"
     ```

2) The repository contains a `.npmrc` that references `${NPM_TOKEN}`. After
   setting the environment variable, run:

   ```bash
   npm ci
   npm run dev
   ```

3) To ensure CI parity, add `NPM_TOKEN` as a secret in GitHub and as an
   environment variable in Vercel (see `docs/vercel-npmrc.md`).
