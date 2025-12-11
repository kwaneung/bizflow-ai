# Vercel Monorepo 설정 가이드

## 문제 해결: rootDirectory 오류

### 오류 메시지
```
The 'vercel.json' schema validation failed with the following message: 
should NOT have additional property `rootDirectory`
```

### 해결 방법

Vercel은 `vercel.json`에서 `rootDirectory` 속성을 지원하지 않습니다.

#### 방법 1: Vercel 대시보드에서 설정 (권장)

1. Vercel 대시보드 접속
2. 프로젝트 선택 (`bizflow-ai`)
3. Settings > General
4. Root Directory 설정:
   - "Root Directory" 섹션 찾기
   - `apps/web` 입력
   - Save 클릭

#### 방법 2: vercel.json 수정

`vercel.json`에서 `rootDirectory` 속성을 제거:

```json
{
  "buildCommand": "nx build web",
  "devCommand": "nx dev web",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
}
```

## 현재 설정

### vercel.json
- `buildCommand`: `nx build web` - Nx로 web 앱 빌드
- `devCommand`: `nx dev web` - 개발 서버 실행
- `outputDirectory`: `apps/web/.next` - 빌드 출력 디렉토리
- `rootDirectory`: Vercel 대시보드에서 설정 (apps/web)

### Vercel 대시보드 설정

**Settings > General:**
- Root Directory: `apps/web`
- Framework Preset: Next.js
- Build Command: (vercel.json에서 자동 감지)
- Output Directory: (vercel.json에서 자동 감지)

## 배포 확인

설정 후 다음 배포가 성공적으로 완료되어야 합니다.

### 배포 상태 확인
1. Vercel 대시보드 > Deployments
2. 최신 배포 상태 확인
3. 빌드 로그 확인

### 문제 해결

만약 여전히 오류가 발생한다면:
1. Vercel 대시보드에서 Root Directory가 올바르게 설정되었는지 확인
2. 빌드 로그에서 실제 오류 메시지 확인
3. 로컬에서 `pnpm nx build web` 실행하여 빌드가 성공하는지 확인

