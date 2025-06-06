* Prepare .env

```bash
SUPERBASE_URL=supabase_url
SUPERBASE_KEY=supabase_key
REDIS_URL=redis_url
SECRET=jwt_secret_key

```
### Start application

```bash
./venv/venv/Scripts activate
pip install -r requirements.txt (optional: 1st installation)
python start.py
```

### Swagger-UI doccuments

```bash
eg: http://localhost:8000/api-docs
```

### Seeds database (optional: sample data)

```bash
python seeds/create_admin.py
python seeds/create_info.py
python seeds/upload_picture.py
```
