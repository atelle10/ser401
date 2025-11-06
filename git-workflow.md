# Git Workflow

## Branch Strategy

- **`main`** — Production branch (restricted, Git Master only)
- **`staging`** — Working branch during sprints
- **Feature branches** — One branch per user story (e.g., `feature/user-login`, `bugfix/api-timeout`)

## Rules

### Branching
- Create as many branches as needed with clear, descriptive names
- Each user story gets its own branch
- Branch from `staging` for new work

### Commits
- Use clear, concise commit messages
- Format: `type: brief description` (e.g., `feat: add user authentication`, `fix: resolve API timeout`)

### Rebasing
- **Always rebase** to keep linear history
- Rebase frequently to avoid conflicts
- No merge commits allowed

### Pull Requests
- All PRs go to `staging`
- Include a brief description of what the PR does
- Direct push to `staging` is allowed
- Only Git Master merges to `main`

### Restrictions
- ❌ No direct push to `main`
- ❌ No force push anywhere
- ❌ No merge commits (rebase only)

## Workflow Example

```bash
# Start new feature
git checkout staging
git pull origin staging
git checkout -b feature/new-feature

# Work and commit
git add .
git commit -m "feat: add new feature"

# Keep up to date
git fetch origin
git rebase origin/staging

# Push and create PR to staging
git push origin feature/new-feature
```
