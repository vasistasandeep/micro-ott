# 🔐 Security Setup Guide

## ⚠️ IMPORTANT: Never Commit Credentials to Git!

Your database credentials should **NEVER** be committed to GitHub or any version control system.

---

## 🛡️ Secure Credential Management

### Step 1: Create Your Local .env.production File

Copy the example file and add your actual credentials:

```bash
# Copy the template
cp .env.production.example .env.production

# Edit with your actual credentials
# Windows: notepad .env.production
# Linux/Mac: nano .env.production
```

### Step 2: Add Your Database Credentials

Edit `.env.production` with your actual values:

```env
# Neon PostgreSQL
POSTGRES_HOST=[your-neon-host].neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=[your-database-name]
POSTGRES_USER=[your-database-user]
POSTGRES_PASSWORD=[your-secure-password]
POSTGRES_SSL=true

# MongoDB Atlas
MONGODB_URI=mongodb+srv://[your-user]:[your-password]@[your-cluster].mongodb.net/ott_activity?retryWrites=true&w=majority&appName=Cluster0

# Upstash Redis
REDIS_URL=redis://default:[your-redis-password]@[your-redis-host].upstash.io:6379
REDIS_TLS=true
```

### Step 3: Verify .gitignore

Ensure `.env.production` is in `.gitignore`:

```bash
# Check if it's ignored
git check-ignore .env.production

# Should output: .env.production
```

---

## 🚀 For Railway Deployment

Set environment variables in Railway dashboard (NOT in code):

```bash
# Using Railway CLI
railway variables set POSTGRES_HOST=your-host
railway variables set POSTGRES_PASSWORD=your-password
# ... etc
```

Or use Railway dashboard:
1. Go to your project
2. Click "Variables"
3. Add each variable individually

---

## 🌐 For Vercel Deployment

Set environment variables in Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable
4. Select environments (Production, Preview, Development)

---

## 🔒 Security Best Practices

### ✅ DO:
- Use `.env` files locally (they're in `.gitignore`)
- Use environment variables in production
- Rotate passwords regularly (every 90 days)
- Use different credentials for dev/staging/production
- Enable 2FA on all database accounts
- Use IP allowlists when possible

### ❌ DON'T:
- Commit `.env` files to git
- Share credentials in chat/email
- Use the same password everywhere
- Hardcode credentials in source code
- Push credentials to public repositories
- Share your `.env` files

---

## 🔄 If Credentials Were Exposed

If you accidentally committed credentials:

### Immediate Actions:

1. **Rotate All Passwords Immediately**
   - Neon: Change password in console
   - MongoDB: Rotate user password
   - Redis: Regenerate credentials

2. **Remove from Git History**
   ```bash
   # Remove sensitive file from history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.production" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (if already pushed)
   git push origin --force --all
   ```

3. **Verify Removal**
   ```bash
   # Check git history
   git log --all --full-history -- .env.production
   ```

4. **Update All Deployments**
   - Update Railway variables
   - Update Vercel variables
   - Restart all services

---

## 📋 Credential Checklist

Before committing to git:

- [ ] `.env.production` is in `.gitignore`
- [ ] No passwords in source code
- [ ] No credentials in scripts
- [ ] Only `.env.production.example` is committed
- [ ] All sensitive files are ignored
- [ ] Verified with `git status`

---

## 🔐 Secure Credential Storage Options

### For Team Collaboration:

1. **1Password** / **LastPass** - Share credentials securely
2. **AWS Secrets Manager** - For production secrets
3. **HashiCorp Vault** - Enterprise secret management
4. **Doppler** - Environment variable management
5. **Railway/Vercel** - Built-in secret management

---

## 📝 Environment Variable Management

### Local Development
```bash
# Use .env file (gitignored)
cp .env.production.example .env
# Edit .env with your credentials
```

### Staging/Production
```bash
# Use platform-specific secret management
# Railway: railway variables set KEY=value
# Vercel: Set in dashboard
# AWS: Use Secrets Manager
```

---

## ⚡ Quick Setup (Secure Way)

1. **Copy template**:
   ```bash
   cp .env.production.example .env.production
   ```

2. **Add your credentials** (locally only)

3. **Verify it's ignored**:
   ```bash
   git status
   # Should NOT show .env.production
   ```

4. **For deployment**, use platform secret management

---

## 🎯 Summary

✅ **Safe to commit**:
- `.env.production.example` (template with no real credentials)
- Source code
- Documentation
- Configuration files (without secrets)

❌ **NEVER commit**:
- `.env.production` (actual credentials)
- `.env` (local credentials)
- Any file with passwords/tokens
- Database connection strings with credentials

---

**Remember**: If you're unsure, DON'T commit it! You can always add it later, but removing it from git history is difficult.

---

**Last Updated**: February 20, 2026  
**Security Level**: 🔒 High Priority
