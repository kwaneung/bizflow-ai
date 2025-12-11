# Supabase API 키 가져오기 가이드

## 필요한 키 2개

1. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (anon/public key)
2. **`SUPABASE_SERVICE_ROLE_KEY`** (service_role key)

---

## 단계별 가이드

### Step 1: Supabase Dashboard 접속

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 로그인 (이미 로그인되어 있다면 생략)

### Step 2: 프로젝트 선택

1. 대시보드에서 **`bizflow-ai`** 프로젝트를 찾아 클릭
2. 프로젝트 페이지로 이동

### Step 3: Project Settings로 이동

1. 왼쪽 사이드바에서 **⚙️ Settings** (톱니바퀴 아이콘) 클릭
2. 또는 프로젝트 페이지 상단의 **"Settings"** 메뉴 클릭

### Step 4: API 메뉴 선택

1. Settings 페이지에서 왼쪽 사이드바의 **"API"** 클릭
2. API 설정 페이지로 이동

### Step 5: API 키 확인

API 페이지에서 다음 정보를 확인할 수 있습니다:

#### 5-1. Project URL (이미 알고 있음)

```
Project URL: https://gekgskyqdufwxdcmdtcx.supabase.co
```

이것이 `NEXT_PUBLIC_SUPABASE_URL` 값입니다.

#### 5-2. anon/public key (첫 번째 키)

**위치**: "Project API keys" 섹션

```
anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**사용처**: 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경 변수
- 클라이언트 사이드에서 사용 (브라우저에 노출됨)

**특징**:
- ✅ 공개되어도 안전함 (Row Level Security로 보호됨)
- ✅ 클라이언트에서 사용 가능
- ✅ `NEXT_PUBLIC_` 접두사 사용

#### 5-3. service_role key (두 번째 키)

**위치**: "Project API keys" 섹션 (anon key 아래)

```
service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**사용처**:
- `SUPABASE_SERVICE_ROLE_KEY` 환경 변수
- 서버 사이드에서만 사용 (Vercel 환경 변수에만 설정)

**특징**:
- ⚠️ **절대 클라이언트에 노출되면 안 됨**
- ⚠️ Row Level Security를 우회함
- ⚠️ 서버 사이드에서만 사용
- ⚠️ `.env.local`에는 포함하지 않음 (Vercel 환경 변수에만)

---

## 키 복사 방법

### 방법 1: 클릭하여 복사

1. 각 키 옆에 있는 **복사 아이콘** (📋) 클릭
2. 자동으로 클립보드에 복사됨

### 방법 2: 직접 복사

1. 키 텍스트를 드래그하여 선택
2. `Cmd+C` (Mac) 또는 `Ctrl+C` (Windows)로 복사

---

## 키 확인 체크리스트

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://gekgskyqdufwxdcmdtcx.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJ...` (anon/public key)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJ...` (service_role key)

---

## 보안 주의사항

### ✅ 안전한 사용

- **anon key**: 클라이언트에서 사용 가능, 공개되어도 안전
- **service_role key**: 서버 사이드에서만 사용, Vercel 환경 변수에만 저장

### ⚠️ 주의사항

1. **service_role key는 절대**:
   - ❌ Git에 커밋하지 않음
   - ❌ 클라이언트 코드에 포함하지 않음
   - ❌ `.env.local`에 포함하지 않음 (로컬 개발 시에도 주의)
   - ❌ 공개 저장소에 업로드하지 않음

2. **anon key는**:
   - ✅ 클라이언트에서 사용 가능
   - ✅ 공개되어도 안전 (RLS로 보호됨)
   - ✅ `.env.local`에 포함 가능

---

## Vercel 환경 변수에 설정

키를 복사한 후:

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `bizflow-ai` 프로젝트 선택
3. Settings → Environment Variables
4. 다음 변수들을 추가:

```
NEXT_PUBLIC_SUPABASE_URL = https://gekgskyqdufwxdcmdtcx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [복사한 anon key]
SUPABASE_SERVICE_ROLE_KEY = [복사한 service_role key]
```

각 변수는 **Production**과 **Preview** 환경에 추가하세요.

---

## 스크린샷 가이드

API 키 페이지 경로:
```
Supabase Dashboard
  → bizflow-ai 프로젝트 클릭
  → Settings (왼쪽 사이드바)
  → API (왼쪽 사이드바)
  → Project API keys 섹션
```

화면 구성:
```
┌─────────────────────────────────────┐
│ Project API keys                    │
├─────────────────────────────────────┤
│ Project URL                          │
│ https://...supabase.co              │
├─────────────────────────────────────┤
│ anon public                          │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │
│ [📋 복사]                            │
├─────────────────────────────────────┤
│ service_role secret                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │
│ [📋 복사]                            │
└─────────────────────────────────────┘
```

---

## 문제 해결

### 키를 찾을 수 없음

- Settings → API 경로 확인
- 프로젝트가 올바르게 선택되었는지 확인
- 페이지 새로고침

### 키가 표시되지 않음

- 프로젝트 소유자 권한이 있는지 확인
- 프로젝트가 완전히 생성되었는지 확인 (생성 중일 수 있음)

