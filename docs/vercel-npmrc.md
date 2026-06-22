Vercel: private package install instructions

1) Add the `NPM_TOKEN` environment variable to your Vercel project:
   - In the Vercel dashboard, open your project → Settings → Environment Variables.
   - Add `NPM_TOKEN` with a read-only npm token (create one at https://www.npmjs.com/settings/tokens).
   - Set it for the relevant environments (Preview/Production).

2) The repository includes a `.npmrc` that references `${NPM_TOKEN}` for auth.
   This file is safe to commit because it does not contain secrets — the token
   is provided at build-time via the environment variable.

3) Trigger a new deployment; Vercel will use the token to install private
   packages (e.g., `@lovable.dev/*`).

4) (Optional) GitHub Actions CI — add `NPM_TOKEN` as a repository secret:
   - In the GitHub repository → Settings → Secrets → Actions, add `NPM_TOKEN`.
   - The included workflow `.github/workflows/ci.yml` will use this secret to
     authenticate with npm and run `npm ci`, `npm run lint` and `npm run build`
     for every push and pull request.

Notes:
- If Lovable packages are hosted in a private registry other than npmjs.org,
  update the `.npmrc` to point to that registry and set the appropriate token.
- Alternatively, add a `.npmrc` file to your project via Vercel's UI or use a
  private install script, but the environment-variable approach is recommended.
