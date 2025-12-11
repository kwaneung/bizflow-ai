# Supabase Setup Guide

## 프로젝트 연결 방법

### 1. Supabase 프로젝트 생성 (대시보드)

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `bizflow-ai`
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요)
   - **Region**: 가장 가까운 리전 선택
4. 프로젝트 생성 완료 대기 (약 2분)

### 2. 프로젝트 연결 (CLI)

프로젝트가 생성되면 다음 명령어로 연결:

```bash
supabase link --project-ref <your-project-ref>
```

프로젝트 참조 ID는 Supabase 대시보드의 프로젝트 설정에서 확인할 수 있습니다.

또는 대화형 모드로:

```bash
supabase link
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# LLM API Configuration
OPENAI_API_KEY=your_openai_api_key
# or
ANTHROPIC_API_KEY=your_anthropic_api_key

# Rate Limiting Configuration
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_QUEUE_ENABLED=true
RATE_LIMIT_QUEUE_MAX_SIZE=100
```

**변수 값 찾는 방법**:
- Supabase 대시보드 → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (⚠️ 서버 사이드에서만 사용)

### 4. 마이그레이션 적용

로컬 개발 환경:

```bash
# 로컬 Supabase 시작
supabase start

# 마이그레이션 적용
supabase db reset
```

원격 프로젝트에 적용:

```bash
# 마이그레이션 푸시
supabase db push
```

### 5. 로컬 개발 환경 사용

로컬 Supabase를 사용하려면:

```bash
# 로컬 Supabase 시작
supabase start

# 로컬 환경 변수 설정 (.env.local)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<로컬 anon key>
SUPABASE_SERVICE_ROLE_KEY=<로컬 service_role key>
```

로컬 Supabase 시작 후 출력되는 정보를 확인하세요.

## 마이그레이션 파일

다음 마이그레이션 파일들이 준비되어 있습니다:

1. `001_prompt_templates.sql` - 프롬프트 템플릿 테이블
2. `002_rate_limit_configs.sql` - Rate Limiting 설정 테이블
3. `003_llm_requests.sql` - LLM 요청 테이블
4. `004_llm_responses.sql` - LLM 응답 테이블
5. `005_formatted_outputs.sql` - 포맷된 출력 테이블
6. `006_error_contexts.sql` - 에러 컨텍스트 테이블
7. `007_input_schemas.sql` - 입력 스키마 테이블
8. `008_output_schemas.sql` - 출력 스키마 테이블

## 다음 단계

Supabase 프로젝트 연결이 완료되면:
1. 마이그레이션 적용
2. 환경 변수 설정
3. Phase 2 (Common Type System) 구현 시작

