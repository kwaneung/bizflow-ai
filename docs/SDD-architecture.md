# Software Design Document (SDD): BizFlow AI 아키텍처

**버전**: 1.1.0  
**최종 업데이트**: 2025-12-11  
**작성자**: BizFlow AI Team

## 목차

1. [개요](#개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [모듈 구조](#모듈-구조)
4. [의존성 관리](#의존성-관리)
5. [데이터 흐름](#데이터-흐름)
6. [기술 스택](#기술-스택)
7. [배포 아키텍처](#배포-아키텍처)

---

## 개요

### 프로젝트 목적

BizFlow AI는 다양한 비즈니스 도메인을 위한 AI 기반 마케팅 콘텐츠 생성 SaaS 플랫폼입니다. 각 도메인 모듈은 공통 인프라를 활용하여 독립적으로 개발되고 운영됩니다.

### 핵심 원칙

1. **Module-First Architecture**: 각 도메인은 독립적인 모듈로 구현
2. **Shared Component Reusability**: 공통 기능은 shared 라이브러리로 추출
3. **Type Safety**: TypeScript strict mode로 타입 안정성 보장
4. **Test-First Development**: TDD 방식으로 개발
5. **Progressive Module Development**: 우선순위에 따라 모듈 순차 개발

---

## 시스템 아키텍처

### 전체 구조

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App (apps/web)                              │   │
│  │  - /ecommerce                                         │   │
│  │  - /realestate                                        │   │
│  │  - /api/*                                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Modules Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Ecommerce   │  │  RealEstate  │  │  PT (예정)   │        │
│  │   Module     │  │   Module     │  │   Module     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Shared Infrastructure Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Shared LLM  │  │ Shared Types │  │  Shared UI   │        │
│  │   Service    │  │   System     │  │ Components  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   OpenAI     │  │  Supabase    │  │   Vercel     │        │
│  │     API      │  │  (PostgreSQL)│  │  (Hosting)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 레이어 설명

#### 1. Frontend Layer
- **Next.js 16 App Router** 기반 웹 애플리케이션
- 각 도메인 모듈별 페이지 라우팅
- API Routes를 통한 백엔드 통신
- React 19 + TypeScript

#### 2. Domain Modules Layer
- 독립적인 도메인 모듈들
- 각 모듈은 자체 타입, 서비스, 비즈니스 로직 포함
- Shared Infrastructure에 의존

#### 3. Shared Infrastructure Layer
- 모든 도메인 모듈이 공유하는 인프라
- LLM 서비스, 타입 시스템, UI 컴포넌트
- 모듈 간 의존성 없음 (단방향 의존성)

#### 4. External Services Layer
- OpenAI API: LLM 콘텐츠 생성
- Supabase: 데이터베이스 및 인증
- Vercel: 호스팅 및 배포

---

## 모듈 구조

### Nx Monorepo 구조

```
bizflow-ai/
├── apps/
│   └── web/                    # Next.js 애플리케이션
│       └── src/app/
│           ├── api/            # API Routes
│           │   ├── llm/        # 공통 LLM API
│           │   ├── ecommerce/ # 이커머스 API
│           │   └── realestate/ # 부동산 API
│           ├── ecommerce/     # 이커머스 페이지
│           └── realestate/    # 부동산 페이지
│
├── libs/shared/                # 공유 라이브러리
│   ├── types/                  # 공통 타입 시스템
│   ├── llm/                    # LLM 서비스
│   └── ui/                     # UI 컴포넌트
│
├── modules/                    # 도메인 모듈
│   ├── ecommerce/              # 이커머스 모듈
│   │   ├── src/
│   │   │   ├── types/          # 모듈별 타입
│   │   │   └── services/       # 모듈별 서비스
│   │   └── project.json        # Nx 프로젝트 설정
│   │
│   └── realestate/             # 부동산 모듈
│       ├── src/
│       │   ├── types/          # 모듈별 타입
│       │   └── services/       # 모듈별 서비스
│       └── project.json        # Nx 프로젝트 설정
│
└── specs/                      # 기능 명세서
    ├── 001-core-infrastructure/
    ├── 002-ecommerce/
    └── 003-realestate/
```

### 모듈별 책임

#### Core Infrastructure (`libs/shared/*`)

**types**
- `Input<T>`, `Output<T>` 제네릭 인터페이스
- 공통 타입 (`LLMRequest`, `LLMResponse`, `ErrorContext`)
- 타입 가드 함수

**llm**
- `LLMService`: LLM 요청 처리
- `PromptBuilder`: 프롬프트 템플릿 빌더
- `ResponseParser`: LLM 응답 파서
- `RateLimiter`: 요청 제한 및 큐잉
- `ErrorHandler`: 에러 처리

**ui**
- shadcn/ui 기반 공통 컴포넌트
- Button, Card, Input, Label, Textarea 등
- 재사용 가능한 UI 패턴

#### Ecommerce Module (`modules/ecommerce`)

**타입**
- `EcommerceProductInput`: 상품 입력 데이터
- `EcommerceGeneratedContent`: 생성된 콘텐츠

**서비스**
- `EcommerceContentService`: 이커머스 콘텐츠 생성 로직
- LLM 통합 및 프롬프트 관리

#### Real Estate Module (`modules/realestate`)

**타입**
- `RealEstatePropertyInput`: 매물 입력 데이터
- `RealEstateGeneratedContent`: 생성된 콘텐츠

**서비스**
- `RealEstateContentService`: 부동산 콘텐츠 생성 로직
- LLM 통합 및 프롬프트 관리

---

## 의존성 관리

### 의존성 방향

```
Domain Modules (ecommerce, realestate)
    ↓ (의존)
Shared Libraries (types, llm, ui)
    ↓ (의존)
External Services (OpenAI, Supabase)
```

### 규칙

1. **단방향 의존성**: Domain Modules → Shared Libraries → External Services
2. **모듈 간 독립성**: Domain Modules는 서로 의존하지 않음
3. **Shared Libraries 독립성**: Shared Libraries는 Domain Modules에 의존하지 않음

### TypeScript Path Mapping

```json
{
  "@bizflow/shared/types": ["libs/shared/types/src/index.ts"],
  "@bizflow/shared/llm": ["libs/shared/llm/src/index.ts"],
  "@bizflow/shared/ui": ["libs/shared/ui/src/index.ts"],
  "@bizflow/modules/ecommerce": ["modules/ecommerce/src/index.ts"],
  "@bizflow/modules/realestate": ["modules/realestate/src/index.ts"]
}
```

---

## 데이터 흐름

### 콘텐츠 생성 플로우

```
1. 사용자 입력
   ↓
2. Frontend (Next.js Page)
   ↓
3. API Route (/api/{module}/generate)
   ↓
4. Domain Module Service
   ├─ 입력 검증
   ├─ 프롬프트 템플릿 선택
   └─ Shared LLM Service 호출
   ↓
5. Shared LLM Service
   ├─ Rate Limiting 체크
   ├─ Prompt Builder (템플릿 + 데이터)
   ├─ OpenAI API 호출
   ├─ Response Parser
   └─ Output Validation
   ↓
6. Domain Module Service
   ├─ 출력 포맷팅
   └─ 결과 반환
   ↓
7. API Route
   ↓
8. Frontend (Result Page)
   ↓
9. 사용자에게 표시
```

### 데이터베이스 스키마

**Supabase Tables**:
- `prompt_templates`: 프롬프트 템플릿 저장
- `llm_requests`: LLM 요청 로깅
- `llm_responses`: LLM 응답 로깅
- `formatted_outputs`: 포맷팅된 출력 저장
- `error_contexts`: 에러 컨텍스트 저장

---

## 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Language**: TypeScript (strict mode)

### Backend
- **Runtime**: Node.js 24
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes

### AI/ML
- **LLM Provider**: OpenAI API
- **Model**: GPT-4 (기본)

### Infrastructure
- **Monorepo**: Nx
- **Package Manager**: pnpm 10+
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

### Development Tools
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

---

## 배포 아키텍처

### 배포 환경

```
GitHub Repository
    ↓
GitHub Actions (CI/CD)
    ↓
Vercel (자동 배포)
    ├─ Production (main 브랜치)
    └─ Preview (feature 브랜치)
```

### 환경 변수

**필수 환경 변수**:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `OPENAI_API_KEY`: OpenAI API 키

**Supabase 환경 변수** (서버 사이드):
- `SUPABASE_SERVICE_ROLE_KEY`: 서비스 역할 키 (선택적)

### 배포 프로세스

1. **코드 푸시**: GitHub에 코드 푸시
2. **자동 빌드**: Vercel이 변경사항 감지
3. **빌드 실행**: Nx를 통한 모노레포 빌드
4. **배포**: Vercel에 자동 배포
5. **프리뷰**: Feature 브랜치는 프리뷰 URL 생성

---

## 보안 고려사항

### 인증 및 권한
- Supabase Auth를 통한 사용자 인증 (향후 구현)
- API Routes에서 인증 토큰 검증

### 데이터 보안
- 환경 변수를 통한 민감 정보 관리
- Supabase RLS (Row Level Security) 정책 (향후 구현)

### API 보안
- Rate Limiting을 통한 API 남용 방지
- 입력 검증 및 Sanitization

---

## 확장성 고려사항

### 모듈 추가
새로운 도메인 모듈 추가 시:
1. `modules/{module-name}` 디렉토리 생성
2. 타입 및 서비스 구현
3. API Route 추가 (`apps/web/src/app/api/{module-name}/generate`)
4. 페이지 추가 (`apps/web/src/app/{module-name}`)

### Shared Library 확장
새로운 공유 라이브러리 추가 시:
1. `libs/shared/{library-name}` 디렉토리 생성
2. TypeScript path mapping 추가
3. 모든 모듈에서 사용 가능

---

## 모니터링 및 로깅

### 현재 구현
- LLM 요청/응답 로깅 (Supabase)
- 에러 컨텍스트 저장 (Supabase)

### 향후 개선
- 실시간 모니터링 대시보드
- 성능 메트릭 수집
- 사용자 행동 분석

---

## 참고 문서

- [Core Infrastructure Spec](./specs/001-core-infrastructure/spec.md)
- [Ecommerce Module Spec](./specs/002-ecommerce/spec.md)
- [Real Estate Module Spec](./specs/003-realestate/spec.md)
- [Data Model](./specs/001-core-infrastructure/data-model.md)
- [LLM Service API Contract](./specs/001-core-infrastructure/contracts/llm-service-api.md)

---

**문서 버전 히스토리**:
- v1.1.0 (2025-12-11): 부동산 모듈 추가 반영
- v1.0.0 (2025-12-10): 초기 문서 작성

