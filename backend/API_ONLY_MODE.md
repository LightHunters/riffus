# API-Only Mode Documentation

این پروژه دو نسخه دارد:
1. **نسخه با دیتابیس** (پیش‌فرض): `songController.js` - از MongoDB استفاده می‌کند
2. **نسخه API-only**: `songController.apiOnly.js` - فقط از iTunes API استفاده می‌کند

## نحوه استفاده از نسخه API-Only

### روش 1: تغییر Routes

در فایل `backend/src/routes/songRoutes.js`، import را تغییر دهید:

```javascript
// قبل (با دیتابیس):
const {
    getSongs,
    getSongById,
    getRecentlyPlayed,
    getRecommended,
    searchSongs,
    playSong,
    orderSong,
} = require('../controllers/songController');

// بعد (API-only):
const {
    getSongs,
    getSongById,
    getRecentlyPlayed,
    getRecommended,
    searchSongs,
    playSong,
    orderSong,
} = require('../controllers/songController.apiOnly');
```

### روش 2: استفاده از Environment Variable

می‌توانید یک environment variable اضافه کنید و در routes چک کنید:

```javascript
// در songRoutes.js
const USE_API_ONLY = process.env.USE_API_ONLY === 'true';

const controllers = USE_API_ONLY
    ? require('../controllers/songController.apiOnly')
    : require('../controllers/songController');

const {
    getSongs,
    getSongById,
    getRecentlyPlayed,
    getRecommended,
    searchSongs,
    playSong,
    orderSong,
} = controllers;
```

سپس در `.env`:
```
USE_API_ONLY=true
```

## تفاوت‌های نسخه API-Only

### ✅ مزایا:
- نیاز به MongoDB ندارد
- راه‌اندازی سریع‌تر
- مناسب برای پروژه‌های کوچک یا demo

### ❌ محدودیت‌ها:
- ذخیره‌سازی داده‌ها وجود ندارد
- تاریخچه پخش ذخیره نمی‌شود
- تعداد پخش (playCount) ذخیره نمی‌شود
- سفارش‌ها (orders) ذخیره نمی‌شوند

## API Endpoints

تمام endpoint‌ها مشابه نسخه با دیتابیس هستند، اما:

### GET /api/songs
- بدون دیتابیس: نتایج trending از iTunes برمی‌گرداند
- Query params: `genre`, `limit`

### GET /api/songs/recent
- بدون دیتابیس: نتایج popular از iTunes برمی‌گرداند
- Query params: `limit`

### GET /api/songs/recommended
- بدون دیتابیس: نتایج top charts از iTunes برمی‌گرداند
- Query params: `limit`

### GET /api/songs/search?q=...
- بدون دیتابیس: فقط از iTunes API جستجو می‌کند
- Query params: `q`, `limit`, `country`

### GET /api/songs/:id
- نیاز به `trackId` (iTunes track ID) دارد
- Query params: `trackId`, `country`

### POST /api/songs/:id/play
- فقط تایید می‌کند، چیزی ذخیره نمی‌کند
- Query params: `trackId`, `country`

### POST /api/songs/order
- فقط تایید می‌کند، چیزی ذخیره نمی‌کند
- Body: `trackId` یا `songId` (iTunes track ID), `userId` (اختیاری)

## نکات مهم

1. در نسخه API-only، باید از `trackId` (iTunes track ID) استفاده کنید
2. داده‌ها cache نمی‌شوند - هر درخواست مستقیماً به iTunes API می‌رود
3. برای production، بهتر است از نسخه با دیتابیس استفاده کنید

