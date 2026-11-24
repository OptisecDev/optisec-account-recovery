from fastapi import FastAPI, Header, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client
from dotenv import load_dotenv
from groq import AsyncGroq
import httpx
import os

load_dotenv()

PORT = int(os.environ.get("PORT", 8000))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
if not ADMIN_PASSWORD:
    raise RuntimeError(
        "ADMIN_PASSWORD environment variable is not set; refusing to start. "
        "Set ADMIN_PASSWORD in the deployment environment (e.g. Railway) or backend/.env."
    )
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HIBP_API_KEY = os.getenv("HIBP_API_KEY")

supabase: Optional[Client] = None
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    pass

app = FastAPI(title="OPTISEC Account Recovery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecoveryRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    platform: str
    problem_type: str
    service: str
    description: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str


class AppealRequest(BaseModel):
    platform: str
    ban_type: str
    ban_reason: str
    account_age: Optional[str] = None
    followers: Optional[str] = None
    verified: Optional[bool] = False
    language: str = "Arabic"


def verify_admin(admin_password: Optional[str] = Header(None)):
    if admin_password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


@app.post("/api/requests")
async def create_request(request: RecoveryRequest):
    data = request.model_dump()
    result = supabase.table("recovery_requests").insert(data).execute()
    return {"success": True, "data": result.data[0] if result.data else None}


@app.get("/api/requests")
async def get_requests(_: bool = Depends(verify_admin)):
    result = supabase.table("recovery_requests").select("*").order("created_at", desc=True).execute()
    return {"data": result.data}


@app.put("/api/requests/{request_id}/status")
async def update_status(request_id: str, update: StatusUpdate, _: bool = Depends(verify_admin)):
    valid_statuses = ["pending", "in_progress", "resolved"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = supabase.table("recovery_requests").update({"status": update.status}).eq("id", request_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"success": True, "data": result.data[0]}


@app.get("/api/stats")
async def get_stats(_: bool = Depends(verify_admin)):
    result = supabase.table("recovery_requests").select("status, service").execute()
    rows = result.data or []

    service_prices = {
        "تشخيص الحساب": 5,
        "خطة الاسترجاع": 15,
        "حماية الحساب": 10,
        "باقة VIP": 45,
    }

    total = len(rows)
    pending = sum(1 for r in rows if r["status"] == "pending")
    in_progress = sum(1 for r in rows if r["status"] == "in_progress")
    resolved = sum(1 for r in rows if r["status"] == "resolved")
    revenue = sum(service_prices.get(r["service"], 0) for r in rows if r["status"] == "resolved")

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "revenue": revenue,
    }


@app.get("/api/requests/track/{email}")
async def track_requests(email: str):
    result = supabase.table("recovery_requests").select("*").eq("email", email).order("created_at", desc=True).execute()
    return {"data": result.data}


@app.post("/api/generate-appeal")
async def generate_appeal(req: AppealRequest):
    if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key":
        raise HTTPException(status_code=503, detail="GROQ_API_KEY غير مُضبوط في الخادم — أضف مفتاحك في backend/.env")

    lang_map = {"English": "الإنجليزية", "Arabic": "العربية", "Both": "العربية والإنجليزية معاً"}
    lang_text = lang_map.get(req.language, req.language)

    user_content = f"""المنصة: {req.platform}
نوع الحظر: {req.ban_type}
سبب الحظر المذكور من المنصة: {req.ban_reason}
عمر الحساب: {req.account_age or 'غير محدد'}
عدد المتابعين: {req.followers or 'غير محدد'}
حساب مُعتمد: {'نعم' if req.verified else 'لا'}
لغة الرسالة المطلوبة: {lang_text}

اكتب رسالة استئناف احترافية ومقنعة لاسترجاع هذا الحساب المحظور."""

    try:
        client = AsyncGroq(api_key=GROQ_API_KEY)
        completion = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "أنت خبير في سياسات منصات التواصل الاجتماعي. اكتب رسالة استئناف احترافية ومقنعة لاسترجاع الحساب المحظور. الرسالة يجب أن تكون رسمية، تحترم سياسات المنصة، وتذكر الأسباب المنطقية لرفع الحظر."
                },
                {"role": "user", "content": user_content}
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        return {"appeal": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"خطأ من Groq API: {str(e)}")


SECURITY_TIPS = [
    "استخدم كلمة مرور فريدة لكل حساب",
    "فعّل المصادقة الثنائية (2FA) على جميع حساباتك",
    "لا تشارك بيانات تسجيل الدخول مع أي شخص",
    "راجع الأجهزة المتصلة بحساباتك بانتظام",
    "استخدم مدير كلمات مرور موثوقاً",
]


@app.get("/api/check-breach")
async def check_breach(email: str = Query(...)):
    url = f"https://leakcheck.io/api/public?check={email}"
    headers = {"User-Agent": "OPTISEC-Account-Recovery/1.0"}

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, headers=headers)
        except httpx.RequestError:
            return {
                "breached": None,
                "available": False,
                "message": "الفحص غير متاح حالياً، يرجى المحاولة لاحقاً",
                "security_tips": SECURITY_TIPS,
            }

    if response.status_code == 429:
        return {
            "breached": None,
            "available": False,
            "message": "تم تجاوز حد الطلبات، يرجى المحاولة بعد قليل",
            "security_tips": SECURITY_TIPS,
        }

    if response.status_code != 200:
        return {
            "breached": None,
            "available": False,
            "message": "الفحص غير متاح حالياً، يرجى المحاولة لاحقاً",
            "security_tips": SECURITY_TIPS,
        }

    try:
        data = response.json()
    except Exception:
        return {
            "breached": None,
            "available": False,
            "message": "الفحص غير متاح حالياً، يرجى المحاولة لاحقاً",
            "security_tips": SECURITY_TIPS,
        }

    if not data.get("success"):
        return {
            "breached": None,
            "available": False,
            "message": "الفحص غير متاح حالياً، يرجى المحاولة لاحقاً",
            "security_tips": SECURITY_TIPS,
        }

    sources = data.get("sources", [])
    if not sources:
        return {"breached": False, "available": True, "count": 0, "breaches": []}

    breaches = [
        {
            "name": s.get("name", ""),
            "title": s.get("name", ""),
            "date": s.get("date", ""),
            "count": 0,
            "domain": "",
        }
        for s in sources
    ]
    return {"breached": True, "available": True, "count": len(breaches), "breaches": breaches}
