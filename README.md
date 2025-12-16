# BizFlow AI

AI 기반 멀티 도메인 콘텐츠 생성 SaaS 플랫폼

## 🎯 프로젝트 소개

BizFlow AI는 다양한 비즈니스 도메인을 위한 AI 콘텐츠 생성 플랫폼입니다.

### 지원 도메인

- **이커머스** - 온라인 쇼핑몰 상품 마케팅 콘텐츠 생성
- **부동산** (예정) - 부동산 매물 설명 생성
- **PT 트레이너** (예정) - 운동 프로그램 콘텐츠 생성

## 🛠️ 기술 스택

| 분류         | 기술                             |
| ------------ | -------------------------------- |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling**  | Tailwind CSS, shadcn-ui          |
| **Backend**  | Supabase (PostgreSQL)            |
| **AI**       | OpenAI API                       |
| **Infra**    | Vercel, Nx Monorepo              |

## 📁 프로젝트 구조

```
bizflow-ai/
├── apps/
│   └── web/              # Next.js 웹 애플리케이션
├── libs/
│   └── shared/
│       ├── types/        # 공통 타입 정의
│       ├── llm/          # LLM 서비스
│       └── ui/           # shadcn-ui 디자인 시스템
├── modules/
│   └── ecommerce/        # 이커머스 도메인 모듈
├── supabase/             # DB 마이그레이션
├── specs/                # 기술 명세
└── docs/                 # 문서
```

## 🚀 시작하기

### 요구사항

- Node.js 24+
- pnpm 10+

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm nx dev web
```

### 환경 변수

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

자세한 설정은 [docs/environment-setup.md](./docs/environment-setup.md) 참고

## 📖 문서

- [환경 설정 가이드](./docs/environment-setup.md)
- [Supabase API 키 가이드](./docs/supabase-api-keys-guide.md)
- [Supabase 데이터베이스 관리 가이드](./docs/supabase-database-guide.md)
- [OpenAI API 키 설정](./docs/openai-api-key-setup.md)

## 📝 라이선스

Private
