# CRM System (MERN)

Modern CRM with JWT auth, products (sales) management, contacts module, KPI dashboard, charts, and CSV export.

## Key features
- Secure authentication (register/login with JWT)
- Products: create, update, list, delete; CSV export
- Visualizations: revenue and profit charts
- Contacts: manage leads/prospects/customers
- Dashboard KPIs: total products, contacts, revenue, profit
- Env-driven config; deployable on Render (backend + frontend)

## Tech stack
- Frontend: React 18, React Router, Bootstrap, Chart.js (react-chartjs-2), Axios
- Backend: Node.js, Express, Mongoose (MongoDB), JSON Web Tokens, bcryptjs

## Run locally
Run backend first, then frontend.

### 1) Backend
```bash
cd Backend
npm install
npm install bcryptjs jsonwebtoken
```
Create `Backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/products
JWT_SECRET=change_this_secret
PORT=5000
```
Start:
```bash
node server.js
```

### 2) Frontend
```bash
cd Frontend
npm install
```
Create `Frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```
Start:
```bash
npm start
```

## API endpoints

Auth
- POST `/api/auth/register` { email, password }
- POST `/api/auth/login` { email, password } → { token }

Products (Header: Authorization: Bearer <token>)
- GET `/api/products`
- POST `/api/products`
- GET `/api/products/:id`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`
- DELETE `/api/products` (delete all)

Contacts (Header: Authorization: Bearer <token>)
- GET `/api/contacts`
- POST `/api/contacts`
- GET `/api/contacts/:id`
- PUT `/api/contacts/:id`
- DELETE `/api/contacts/:id`

Dashboard (Header: Authorization: Bearer <token>)
- GET `/api/dashboard/summary` → { totalProducts, totalContacts, totalRevenue, totalProfit }

## Demo flow
1) Register → Login (JWT stored in localStorage)
2) Products: add entries; view table; export CSV; edit entries
3) Visualization: charts for sales and profit
4) Contacts: add/edit/delete leads and customers
5) Dashboard: totals (products, contacts, revenue, profit)

## Deployment (Render)

Backend (Web Service)
- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment:
  - `MONGO_URI` = your MongoDB Atlas SRV URI (include DB name, e.g. `/products`)
  - `JWT_SECRET` = strong random string

Frontend (Static Site)
- Root Directory: `Frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `build`
- Environment:
  - `REACT_APP_API_URL` = your backend URL (e.g., `https://<your-backend>.onrender.com`)
- SPA rewrites: add `/* -> /index.html` (or include `Frontend/static.json` with that rule)

Atlas notes
- Network Access: allow `0.0.0.0/0` (or appropriate IPs)
- Database Access: create a DB user; ensure credentials match the URI

## Design decisions & trade‑offs
- Replaced Firebase with custom JWT auth to remove external dependency and unblock setup.
- Client computes per-item metrics; server aggregates for dashboard KPIs.
- Single user role to keep scope tight; can extend to RBAC later.
- Env-based URLs/secrets for dev/prod flexibility.

### Future improvements
- Pagination and search on tables
- Validation and inline errors
- Loading states/skeletons
- Role-based access control (RBAC)
- CI/CD and production deployments (Render/Vercel + MongoDB Atlas)


