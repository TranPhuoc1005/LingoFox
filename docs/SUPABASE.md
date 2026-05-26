# Kết nối LingoFox với Supabase

Supabase **là PostgreSQL**. Bạn **không cần đổi schema** — chỉ cần đúng connection string và chạy Prisma migrate.

## 1. Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → **New project**
2. Chọn region gần bạn (ví dụ: `ap-southeast-1`)
3. Lưu **database password** (chỉ hiện một lần)

## 2. Lấy connection string

**Project Settings → Database → Connection string**

Chọn tab **URI** và mode **Transaction** (pooler):

| Biến | Mục đích | Port |
|------|----------|------|
| `DATABASE_URL` | App Next.js (pooling) | **6543** + `?pgbouncer=true` |
| `DIRECT_URL` | `prisma db push` / migrate | **5432 Session pooler** (`postgres.[REF]@...pooler...`) — tránh `db.xxx.supabase.co` nếu lỗi P1001 trên Windows |

Copy vào file `.env` (tạo từ `.env.example`).

## 3. Tạo bảng trong Supabase

Trong thư mục project:

```bash
npm run db:migrate
```

Prisma sẽ tạo toàn bộ bảng trong schema `public` trên Supabase, ví dụ:

- `User`, `Account`, `Session` — auth & profile
- `Lesson`, `LessonStep`, `UserProgress` — học tập
- `Exam`, `ExamQuestion`, `ExamSubmission` — thi
- `Note` — ghi chú
- `Post`, `Comment`, `PostReaction` — cộng đồng
- `Achievement`, `UserAchievement`, `WeeklyChallenge`
- `ListeningExercise`, `CommunicationScenario`, `CommunicationDialogue`
- `AIConversation`, `StudyPlan`, `VoiceStudyRoom`
- … (xem `prisma/schema.prisma`)

Sau migrate, mở **Supabase → Table Editor** để xem bảng.

## 4. Kiểm tra

```bash
npm run db:studio
```

Hoặc dùng **SQL Editor** trên Supabase:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

## 5. Lưu ý quan trọng

### Connection pooling
Next.js (serverless) nên dùng **pooler port 6543**, không dùng direct 5432 cho runtime — tránh hết connection.

### Migrate vs runtime
- `prisma migrate dev` → cần `DIRECT_URL`
- `npm run dev` / API routes → dùng `DATABASE_URL` (pooler)

### Supabase Auth (đăng nhập)
Khi đặt `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong `.env.local`:

1. **Authentication → Providers**: bật Email (và Google nếu dùng nút Google).
2. **Authentication → URL Configuration → Redirect URLs** thêm:
   - `http://localhost:3000/auth/callback`
   - URL production: `https://your-domain.com/auth/callback`
3. **Site URL** trong Dashboard nên khớp `NEXT_PUBLIC_SITE_URL` hoặc `http://localhost:3000`.

Luồng: `/auth/login` → Supabase `signInWithPassword` / OAuth → `/auth/callback` → đồng bộ user vào bảng Prisma `User` → `/dashboard`.

Nếu **không** đặt hai biến Supabase Auth, app dùng **NextAuth** (demo credentials hoặc Prisma `passwordHash`).

### NextAuth + Supabase DB
Prisma vẫn lưu profile/XP trên PostgreSQL Supabase. Supabase Auth chỉ xác thực; `getApiUser()` tự `upsert` bản ghi `User` theo email đăng nhập.

### Row Level Security (RLS)
Supabase bật RLS mặc định cho bảng tạo qua Dashboard. Bảng do **Prisma migrate** tạo thường **RLS tắt** — app truy cập qua `DATABASE_URL` (service role connection string hoặc postgres user).

Nếu sau này gọi Supabase client từ browser, cần bật RLS + policies.

## 6. File `.env` mẫu (Supabase)

```env
DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

AUTH_SECRET="your-random-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Sinh `AUTH_SECRET` (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

## Sơ đồ

```mermaid
flowchart LR
  NextApp[Next.js App] -->|DATABASE_URL pooler| Supabase[(Supabase PostgreSQL)]
  PrismaCLI[prisma migrate] -->|DIRECT_URL| Supabase
  PrismaCLI --> Tables[Bảng LingoFox]
```

Database **logic** giống hệt file `prisma/schema.prisma` — Supabase chỉ là nơi **host** PostgreSQL.
