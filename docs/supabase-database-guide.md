# Supabase 데이터베이스 관리 가이드

## 개요

이 프로젝트는 Supabase PostgreSQL을 사용하여 LLM 요청/응답 로깅 및 프롬프트 템플릿 관리를 합니다.

## 데이터베이스 스키마 관리

### 마이그레이션 파일 생성

새 테이블이나 컬럼을 추가할 때는 마이그레이션 파일을 생성합니다:

```bash
# 새 마이그레이션 파일 생성
supabase migration new your_migration_name

# 생성된 파일을 편집하여 SQL 작성
# supabase/migrations/YYYYMMDDHHMMSS_your_migration_name.sql
```

### 마이그레이션 적용

로컬에서 마이그레이션을 원격 DB에 적용:

```bash
supabase db push
```

### 마이그레이션 상태 확인

```bash
supabase migration list
```

## TypeScript 타입 동기화

**중요**: DB 스키마를 변경한 후에는 반드시 TypeScript 타입을 동기화해야 합니다.

### 타입 자동 생성

Supabase CLI를 사용하여 실제 DB 스키마 기준으로 타입을 자동 생성:

```bash
# 1. Supabase 로그인 (최초 1회만)
supabase login

# 2. 타입 생성
supabase gen types typescript \
  --project-id gekgskyqdufwxdcmdtcx \
  --schema public \
  > supabase/types.ts
```

### 타입 동기화 워크플로우

DB 스키마 변경 시 다음 순서를 따르세요:

1. **마이그레이션 파일 작성**
   ```bash
   supabase migration new add_new_table
   # supabase/migrations/XXX_add_new_table.sql 편집
   ```

2. **마이그레이션 적용**
   ```bash
   supabase db push
   ```

3. **타입 동기화** ⚠️ **필수**
   ```bash
   supabase gen types typescript \
     --project-id gekgskyqdufwxdcmdtcx \
     --schema public \
     > supabase/types.ts
   ```

4. **타입 체크**
   ```bash
   pnpm nx build
   # 또는
   pnpm tsc --noEmit
   ```

## 현재 데이터베이스 스키마

### 테이블 목록

1. **`prompt_templates`** - 프롬프트 템플릿 관리
2. **`llm_requests`** - LLM 요청 로그
3. **`llm_responses`** - LLM 원본 응답
4. **`formatted_outputs`** - 파싱된 출력 결과
5. **`error_contexts`** - 에러 정보

### 스키마 구조

자세한 스키마 구조는 `supabase/migrations/` 폴더의 마이그레이션 파일을 참고하세요.

## 프롬프트 템플릿 관리

### 템플릿 추가

Supabase SQL Editor에서 직접 INSERT:

```sql
INSERT INTO public.prompt_templates (
  id,
  module_id,
  version,
  name,
  template,
  variables,
  description,
  is_active
) VALUES (
  'template-id',
  'ecommerce',
  '1.0.0',
  'Template Name',
  'Template content with {{variables}}',
  '[{"name": "variable1", "type": "string", "required": true}]'::jsonb,
  'Template description',
  true
);
```

### 템플릿 조회

```sql
SELECT * FROM public.prompt_templates 
WHERE module_id = 'ecommerce' 
  AND is_active = true;
```

## 문제 해결

### 타입 에러가 발생하는 경우

1. DB 스키마와 타입 파일이 불일치할 수 있습니다
2. `supabase gen types` 명령을 다시 실행하세요
3. TypeScript 서버를 재시작하세요 (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")

### 마이그레이션 충돌

원격 DB와 로컬 마이그레이션 히스토리가 불일치할 때:

```bash
# 마이그레이션 히스토리 수리
supabase migration repair --status reverted <migration_id>

# 또는 원격에서 로컬로 동기화
supabase db pull
```

## 참고 자료

- [Supabase CLI 문서](https://supabase.com/docs/reference/cli)
- [Supabase 마이그레이션 가이드](https://supabase.com/docs/guides/cli/local-development#database-migrations)

