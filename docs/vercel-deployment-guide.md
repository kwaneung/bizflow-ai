# Vercel 배포 가이드

## 브랜치별 배포 동작

### Production 배포
- **브랜치**: `main` (또는 설정한 Production 브랜치)
- **동작**: 자동으로 Production 환경에 배포
- **URL**: `https://bizflow-ai.vercel.app` (또는 설정한 도메인)

### Preview 배포
- **브랜치**: `main` 이외의 모든 브랜치
- **동작**: 각 브랜치/PR마다 Preview 배포 생성
- **URL**: `https://bizflow-ai-git-{branch-name}.vercel.app`
- **현재 브랜치**: `001-core-infrastructure` → Preview 배포

## 로컬 실행

### 개발 서버 실행
```bash
pnpm nx dev web
```

서버가 시작되면 `http://localhost:3000`에서 접속 가능합니다.

### 빌드 테스트
```bash
pnpm nx build web
```

## Vercel 설정 확인

### vercel.json
현재 설정:
- `buildCommand`: `nx build web`
- `devCommand`: `nx dev web`
- `outputDirectory`: `apps/web/.next`
- `rootDirectory`: `apps/web`

### 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

**Production & Preview 모두:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## 배포 확인

### Preview 배포 확인
1. 브랜치를 푸시하면 자동으로 Preview 배포 생성
2. Vercel 대시보드에서 Preview URL 확인
3. GitHub PR에 Preview 배포 링크 자동 추가

### Production 배포
1. `main` 브랜치에 머지하면 자동 배포
2. 또는 Vercel 대시보드에서 수동 배포

## 문제 해결

### "Next.js version not detected" 오류
- `vercel.json`의 `buildCommand`가 올바른지 확인
- `rootDirectory`가 `apps/web`로 설정되어 있는지 확인

### 빌드 실패
- 로컬에서 `pnpm nx build web` 실행하여 오류 확인
- 환경 변수가 설정되어 있는지 확인

