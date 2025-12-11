# 환경 설정 가이드

## 개발 환경 전략

이 프로젝트는 **로컬 개발**과 **Vercel 프로덕션 배포**를 모두 지원합니다.

## 로컬 개발 환경

### 1. 로컬 Supabase 시작

```bash
# Docker가 실행 중이어야 합니다
supabase start
```

시작 후 출력되는 정보를 확인하세요:
- API URL: `http://127.0.0.1:54321`
- anon key: `eyJ...`
- service_role key: `eyJ...`

### 2. 로컬 환경 변수 설정

`.env.local` 파일을 생성하세요 (Git에 커밋하지 않음):

```bash
# 로컬 Supabase (supabase start 후 출력된 값 사용)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<로컬 anon key>
SUPABASE_SERVICE_ROLE_KEY=<로컬 service_role key>

# LLM API Configuration
OPENAI_API_KEY=your_openai_api_key
# or
ANTHROPIC_API_KEY=your_anthropic_api_key

# Rate Limiting Configuration
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_QUEUE_ENABLED=true
RATE_LIMIT_QUEUE_MAX_SIZE=100

# Environment
NODE_ENV=development
```

### 3. 로컬 마이그레이션 적용

```bash
# 로컬 데이터베이스에 마이그레이션 적용
supabase db reset
```

### 4. 로컬 개발 서버 실행

```bash
# Next.js 개발 서버 시작
pnpm nx serve web
# 또는
pnpm dev
```

---

## Vercel 프로덕션 환경

### 1. Supabase 프로젝트 생성 및 연결

1. [Supabase Dashboard](https://app.supabase.com)에서 프로젝트 생성
2. 프로젝트 연결:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
3. 원격 프로젝트에 마이그레이션 적용:
   ```bash
   supabase db push
   ```

### 2. Vercel 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정하세요:

**Vercel Dashboard → Project Settings → Environment Variables**

필수 환경 변수:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
OPENAI_API_KEY=<your-openai-api-key>
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_QUEUE_ENABLED=true
RATE_LIMIT_QUEUE_MAX_SIZE=100
NODE_ENV=production
```

**⚠️ 중요**: 
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용되므로 Vercel 환경 변수에만 설정
- `NEXT_PUBLIC_*` 변수는 클라이언트에 노출되므로 주의

### 3. Vercel 배포

```bash
# GitHub에 푸시하면 자동 배포
git push origin main

# 또는 Vercel CLI 사용
vercel --prod
```

---

## 환경 변수 관리 전략

### 로컬 개발
- `.env.local` 파일 사용 (Git에 커밋하지 않음)
- `.gitignore`에 이미 포함됨
- 로컬 Supabase 사용

### 프로덕션
- Vercel 환경 변수 사용
- 원격 Supabase 프로젝트 사용
- 환경별로 다른 값 설정 가능 (Production, Preview, Development)

### 환경 변수 우선순위
1. Vercel 환경 변수 (프로덕션)
2. `.env.local` (로컬 개발)
3. `.env.example` (템플릿, 커밋됨)

---

## 개발 워크플로우

### 일상적인 개발

```bash
# 1. 로컬 Supabase 시작
supabase start

# 2. 환경 변수 확인 (.env.local)
cat .env.local

# 3. 개발 서버 시작
pnpm nx serve web

# 4. 브라우저에서 http://localhost:3000 접속
```

### 마이그레이션 변경 시

```bash
# 1. 마이그레이션 파일 수정
# supabase/migrations/XXX_*.sql

# 2. 로컬에 적용
supabase db reset

# 3. 테스트

# 4. 원격 프로젝트에 적용 (프로덕션)
supabase db push
```

### 배포 전 체크리스트

- [ ] 로컬에서 모든 테스트 통과
- [ ] 마이그레이션이 원격 프로젝트에 적용됨
- [ ] Vercel 환경 변수가 올바르게 설정됨
- [ ] 프로덕션 Supabase 프로젝트가 활성화됨
- [ ] API 키가 유효함

---

## 문제 해결

### 로컬 Supabase가 시작되지 않음

```bash
# Docker 상태 확인
docker ps

# Supabase 상태 확인
supabase status

# 재시작
supabase stop
supabase start
```

### 환경 변수가 로드되지 않음

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- Next.js는 `.env.local`을 자동으로 로드합니다
- 서버 재시작 필요할 수 있음

### Vercel 배포 실패

- 환경 변수가 올바르게 설정되었는지 확인
- 빌드 로그 확인
- Supabase 연결이 정상인지 확인

