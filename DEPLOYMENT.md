# Live Deployment Quick Guide

Use this after pushing code to GitHub.

## 1) Backend (Render)

Service type: Web Service  
Root directory: `backend`  
Build command: `npm install`  
Start command: `npm start`

Set these env vars in Render:

- `PORT=10000` (Render manages port; value can be any placeholder)
- `MONGO_URI=<your_mongodb_atlas_uri>`
- `JWT_SECRET=<strong_random_secret>`
- `CLIENT_URLS=https://<your-frontend-domain>`

Health checks:

- Root: `https://lovepreet-sir.onrender.com/`
- API health: `https://lovepreet-sir.onrender.com/api/health`

## 2) Frontend (Vercel/Netlify)

Root directory: `frontend`  
Build command: `npm run build`  
Output directory: `dist`

Set env var:

- `VITE_API_BASE_URL=https://lovepreet-sir.onrender.com/api`

## 3) Local vs Production env files

- Local frontend: `frontend/.env`
  - `VITE_API_BASE_URL=http://localhost:5000/api`
- Production example: `frontend/.env.production.example`
- Backend local template: `backend/.env.example`
- Backend production template: `backend/.env.production.example`

## 4) Push steps

```bash
git add .
git commit -m "prepare production env and CORS for live deployment"
git push
```

## 5) Final sanity checks

1. Open frontend deployed URL.
2. Test signup/login.
3. Verify products load.
4. Place test order.
5. Confirm backend logs show no CORS errors.
