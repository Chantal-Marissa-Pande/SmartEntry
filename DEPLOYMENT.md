# Deploy SmartEntry with Render and Supabase

The Render Blueprint creates a Django API (`smartentry-api`) and a Vite static
frontend (`smartentry-web`). Supabase provides PostgreSQL; authentication and all
application behavior remain in Django.

## Setup

1. In Supabase, open **Connect** and copy the **Session pooler** connection string
   (port `5432`). Replace its password placeholder with your database password.
2. Connect this repository to Render and create a Blueprint from `render.yaml`.
3. Enter the prompted environment values:
   - `DATABASE_URL`: the Supabase Session pooler connection string
   - `CORS_ALLOWED_ORIGINS`: the frontend URL, such as
     `https://smartentry-web.onrender.com`
   - `CSRF_TRUSTED_ORIGINS`: the same frontend URL
   - `VITE_API_BASE_URL`: the API URL ending in `/api`, such as
     `https://smartentry-api.onrender.com/api`

Use the exact URLs Render assigns and omit trailing slashes. Migrations run
automatically before each API deployment.

After the first deployment, open the API service's Render Shell and create the
platform administrator:

```sh
python manage.py createsuperuser
```

Optionally load the existing demo data with `python manage.py seed_demo_data`.
Redeploy the frontend if `VITE_API_BASE_URL` changes because Vite embeds it during
the build.
