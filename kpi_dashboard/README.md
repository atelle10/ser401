# How to run KPI Dashboard
 ## Prerequisites
 - Latest version of Node js
 - Current "kpi_dashboard" directory from staging branch of github repository

 ## Environment
 Create a `kpi_dashboard/.env.local` file (gitignored) with:

 ```
 VITE_API_URL=http://localhost:8000
 ```

 If the backend is running on another host/port, update `VITE_API_URL` accordingly.

 ## Run backend API (FastAPI)
 In a terminal from the repo root:

 ```bash
 pip install -r backend/api/requirements.txt
 export DATABASE_URL='postgresql://<user>:<password>@localhost:5432/famar_db'
 uvicorn backend.api.main:app --reload --port 8000
 ```

 The KPI dashboard uses these endpoints:
 - `/api/incidents/kpi-data`
 - `/api/incidents/summary`
 - `/api/incidents/heatmap`
 - `/api/incidents/call-volume`

1. Navigate to the 'kpi_dashboard' in a command line terminal 
2. Run 'npm install' .This will ensure you have all dependencies needed to run the program
3. Run 'npm run dev' to start the software
4. In a web browser, enter 'http://localhost:5173' to access the software's start(login) page

 ## Smoke test checklist
 - Dashboard loads without a blank screen or console errors
 - Switching `Region` (All/South/North) updates widgets and network requests
 - Time window presets (7/14/30 days) update the date inputs and reload data
 - Custom date range updates all widgets consistently
 - Heatmap renders from API data (no local week selector shown)
 - Call volume chart renders correctly with `All` region selected



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
