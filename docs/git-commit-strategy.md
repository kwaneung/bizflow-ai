# Git 커밋 전략

## 커밋 시점 가이드

### ✅ 커밋해야 할 때

1. **Phase 완료 시**
   - Phase 1 완료 → 커밋
   - Phase 2 완료 → 커밋
   - Phase 3 완료 → 커밋
   - 각 Phase는 독립적으로 작동 가능한 단위

2. **중요한 마일스톤 달성 시**
   - 테스트 통과 후
   - 빌드 성공 후
   - 기능 구현 완료 후

3. **설정 변경 완료 시**
   - 환경 변수 설정 완료
   - 인프라 설정 완료
   - CI/CD 파이프라인 설정 완료

4. **리팩토링 전후**
   - 리팩토링 전 → 커밋 (롤백 지점)
   - 리팩토링 후 → 커밋

### ❌ 커밋하지 말아야 할 때

1. **작업 중간**
   - 테스트 실패 상태
   - 빌드 실패 상태
   - 컴파일 오류 상태

2. **임시 파일/디버그 코드**
   - `console.log` 남아있음
   - 임시 주석 코드
   - 디버그용 파일

3. **환경 변수/비밀 정보**
   - `.env.local` 파일
   - API 키 하드코딩
   - 비밀번호

---

## 커밋 메시지 규칙

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 종류

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경
- `setup`: 프로젝트 설정

### 예시

```bash
feat(types): Add Input and Output interfaces for shared type system

- Implement Input<T> and Output<T> generic interfaces
- Add type guards (isInput, isOutput)
- Add common types (ErrorContext, LLMRequest, etc.)
- All tests passing (32 tests)

Phase 2: Foundational - Common Type System completed
```

```bashsetup(infra): Configure Supabase and Vercel

- Initialize Supabase project (bizflow-ai)
- Apply database migrations (8 tables)
- Link Vercel project
- Configure environment variables

Phase 1: Setup completed
```

---

## 현재 상태 커밋 제안

### 커밋 1: Phase 1 & 2 완료

```bash
git add .
git commit -m "feat(infra): Complete Phase 1 Setup and Phase 2 Type System

Phase 1: Setup
- Initialize Nx workspace with pnpm
- Configure Supabase (project linked, migrations applied)
- Configure Vercel (project linked)
- Set up CI/CD pipeline (GitHub Actions)
- Environment variables configured

Phase 2: Common Type System
- Implement Input<T> and Output<T> interfaces
- Add type guards (isInput, isOutput)
- Add common types (ErrorContext, LLMRequest, LLMResponse, etc.)
- All tests passing (32 tests, 3 test suites)
- Build successful

Files:
- libs/shared/types/ (complete implementation)
- supabase/migrations/ (8 migration files)
- Configuration files (nx.json, tsconfig.base.json, etc.)
- Documentation cleanup"
```

---

## 브랜치 전략

### 현재 브랜치: `001-core-infrastructure`

**권장 워크플로우**:

1. **Phase별 커밋**
   ```bash
   # Phase 완료 후
   git add .
   git commit -m "feat(types): Complete Phase 2 - Common Type System"
   ```

2. **주요 마일스톤에서 푸시**
   ```bash
   # 여러 Phase 완료 후
   git push origin 001-core-infrastructure
   ```

3. **Phase 완료 후 PR 생성** (선택사항)
   - Phase 1-2 완료 → PR 생성
   - 리뷰 후 main에 머지

---

## 커밋 전 체크리스트

### 필수 확인 사항

- [ ] 모든 테스트 통과 (`pnpm nx test`)
- [ ] 빌드 성공 (`pnpm nx build`)
- [ ] 린트 통과 (`pnpm nx lint`)
- [ ] 타입 체크 통과 (`pnpm nx run-many --target=typecheck`)
- [ ] 환경 변수 파일 제외 확인 (`.env.local` 등)
- [ ] 불필요한 파일 제거 (임시 파일, 로그 등)

### 코드 품질

- [ ] `console.log` 제거
- [ ] 주석 처리된 코드 제거
- [ ] TODO 주석만 남기고 실제 TODO는 이슈로 등록
- [ ] 의미 있는 커밋 메시지 작성

---

## 현재 커밋 준비 상태

### ✅ 커밋 가능한 변경사항

1. **Phase 1 완료**
   - Nx workspace 설정
   - Supabase 설정 및 마이그레이션
   - Vercel 설정
   - CI/CD 파이프라인

2. **Phase 2 완료**
   - Common Type System 구현
   - 모든 테스트 통과
   - 빌드 성공

3. **문서 정리**
   - 불필요한 임시 가이드 제거
   - 주요 문서 정리

### 커밋 명령어

```bash
# 변경사항 확인
git status

# 모든 변경사항 스테이징
git add .

# 커밋
git commit -m "feat(infra): Complete Phase 1 Setup and Phase 2 Type System

Phase 1: Setup
- Initialize Nx workspace with pnpm
- Configure Supabase (project linked, migrations applied)
- Configure Vercel (project linked)
- Set up CI/CD pipeline
- Environment variables configured

Phase 2: Common Type System
- Implement Input<T> and Output<T> interfaces
- Add type guards and common types
- All tests passing (32 tests)
- Build successful

- Clean up temporary documentation files"

# 푸시 (선택사항)
git push origin 001-core-infrastructure
```

---

## 다음 커밋 시점

**Phase 3 완료 후**:
- User Story 1 (Shared LLM Service) 구현 완료
- 테스트 통과
- 빌드 성공

또는 **중요한 마일스톤 달성 시**:
- MVP 기능 완성
- 첫 배포 성공
- 주요 버그 수정

