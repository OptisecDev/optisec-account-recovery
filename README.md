# OPTISEC Account Recovery

منصة متخصصة في استرجاع وحماية حسابات التواصل الاجتماعي المحظورة.

## هيكل المشروع

```
optisec-account-recovery/
├── frontend/   (React + Vite)
├── backend/    (FastAPI + Supabase)
└── README.md
```

## تشغيل المشروع

### الباكند (Backend):

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# عدّل .env وأضف بيانات Supabase الخاصة بك
uvicorn main:app --reload
```

### الفرونت (Frontend):

```bash
cd frontend
npm install
npm run dev
```

## إعداد قاعدة البيانات

افتح Supabase SQL Editor وشغّل محتوى الملف:
```
backend/create_table.sql
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/requests` | إرسال طلب جديد |
| GET | `/api/requests` | جلب كل الطلبات (Admin) |
| PUT | `/api/requests/{id}/status` | تحديث حالة طلب (Admin) |
| GET | `/api/stats` | إحصائيات لوحة التحكم (Admin) |
| GET | `/api/requests/track/{email}` | تتبع طلبات العميل |

## الصفحات

- `/` — الصفحة الرئيسية + نموذج الطلب
- `/track` — تتبع طلبك بالإيميل
- `/admin` — لوحة تحكم الأدمن (كلمة المرور: `the value of ADMIN_PASSWORD (set in Railway)`)

## المتغيرات البيئية

### Backend (.env)
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
ADMIN_PASSWORD=the value of ADMIN_PASSWORD (set in Railway)
```

### Frontend (.env.local) — اختياري
```
VITE_API_URL=http://localhost:8000
VITE_ADMIN_PASSWORD=the value of ADMIN_PASSWORD (set in Railway)
```
