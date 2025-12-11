# Vercel 브랜치별 배포 설정

## Preview vs Production 구분

### 기본 동작 (브랜치 기반)

Vercel은 **브랜치 이름**으로 Preview와 Production을 구분합니다.

#### Production 배포
- **기본 브랜치**: `main` (또는 `master`)
- **설정 위치**: Vercel 대시보드 > Settings > Git > Production Branch
- **동작**: 
  - `main` 브랜치에 푸시하면 자동으로 Production 배포
  - Production URL: `https://bizflow-ai.vercel.app` (또는 설정한 도메인)
  - 환경 변수: Production 환경 변수 사용

#### Preview 배포
- **브랜치**: `main` 이외의 모든 브랜치
- **동작**:
  - 각 브랜치마다 독립적인 Preview 배포 생성
  - Preview URL: `https://bizflow-ai-git-{branch-name}.vercel.app`
  - Pull Request도 자동으로 Preview 배포 생성
  - 환경 변수: Preview 환경 변수 사용 (또는 Production과 동일)

## 현재 프로젝트 상태

### 브랜치 구조
```
main (Production)
  └─ 001-core-infrastructure (Preview)
```

### 배포 동작
- `001-core-infrastructure` 브랜치 푸시 → Preview 배포
- `main` 브랜치 머지 → Production 배포

## Vercel 대시보드에서 확인/변경

### Production 브랜치 변경
1. Vercel 대시보드 접속
2. 프로젝트 선택 (`bizflow-ai`)
3. Settings > Git
4. Production Branch 설정 변경

### 환경 변수 설정
- **Production**: Production 환경에만 적용
- **Preview**: Preview 환경에만 적용
- **Both**: 두 환경 모두에 적용

## 배포 확인

### Preview 배포 확인
```bash
# 브랜치 푸시 후
git push origin 001-core-infrastructure

# Vercel 대시보드에서 Preview URL 확인
# 또는 GitHub PR에 자동으로 Preview 링크 추가됨
```

### Production 배포 확인
```bash
# main 브랜치에 머지
git checkout main
git merge 001-core-infrastructure
git push origin main

# Vercel 대시보드에서 Production 배포 확인
```

## 주의사항

1. **환경 변수**: Preview와 Production 환경 변수를 별도로 설정해야 할 수 있습니다
2. **도메인**: Production만 커스텀 도메인 사용 가능
3. **비용**: Preview 배포도 빌드 시간을 사용합니다

