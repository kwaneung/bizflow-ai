# BizFlow AI

> **Archived (2026-06)** — OpenAI·Supabase 연동이 만료되어 **Live 데모는 동작하지 않습니다.**  
> 코드·명세·아키텍처 문서는 포트폴리오·학습 참고용으로만 유지합니다.

AI 기반 **멀티 도메인 마케팅 콘텐츠 생성** MVP입니다. Nx 모노레포로 도메인별 모듈을 분리하고, 공통 LLM 파이프라인(Supabase 프롬프트 템플릿 + OpenAI)으로 이커머스·부동산·PT 홍보 문구를 생성합니다.

## Links

| | |
|---|---|
| **Repository** | https://github.com/kwaneung/bizflow-ai |
| **Live (종료)** | https://bizflow-ai-nu.vercel.app — 키·DB 미연동 시 오류 표시 |

## Highlights (MVP 시점)

- **Nx 22 monorepo** — `apps/web`, `libs/shared/{types,llm,ui}`, `modules/{ecommerce,realestate,pt}`
- **공통 LLM 레이어** — PromptBuilder, RateLimiter, 요청/응답 Supabase 저장
- **도메인 UI** — 입력 폼 → `/api/*/generate` → 결과·복사/다운로드
- **문서화** — `specs/`, `docs/SDD-*`, 환경 설정 가이드
- **테스트** — shared types·LLM 단위 테스트 (Jest)

## Stack

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 16, React 19, TypeScript, React Compiler |
| UI | Tailwind CSS, shadcn/ui (shared lib) |
| Data | Supabase (PostgreSQL, prompt_templates, LLM logs) |
| AI | OpenAI API |
| Tooling | Nx, pnpm, Vercel |

## Modules

| 도메인 | 경로 | MVP |
|--------|------|-----|
| 이커머스 | `/ecommerce` | 상품명·요약·상세·SNS·해시태그 생성 |
| 부동산 | `/realestate` | 매물 설명·포털/SNS 문구 |
| PT | `/pt` | 프로그램·상담 유도·홍보 문구 |

## Project structure

```
bizflow-ai/
├── apps/web/                 # Next.js App Router
├── libs/shared/
│   ├── types/                # Input/Output, LLM 공통 타입
│   ├── llm/                  # LLMService, rate limit, parser
│   └── ui/                   # shadcn 컴포넌트
├── modules/
│   ├── ecommerce/
│   ├── realestate/
│   └── pt/
├── supabase/migrations/
├── specs/                    # 기능 명세 (001–004)
└── docs/                     # SDD, 환경 설정
```

## Why archived

- OpenAI / Supabase **API 키·프로젝트 미갱신**으로 프로덕션 LLM 호출 불가
- Live에서 `Template not found` / credential 오류 등 **데모 품질 유지 불가**
- 재개 시: 환경 변수·마이그레이션·프롬프트 템플릿 재적용 후 Unarchive 검토

## Local run (참고)

키와 Supabase를 직접 연결하면 로컬에서만 동작할 수 있습니다.

```bash
pnpm install
pnpm nx dev web
```

`.env.local` 예시:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

상세: [docs/environment-setup.md](./docs/environment-setup.md)

## Documentation

- [진행 상황 (MVP 기준)](./docs/current-progress.md)
- [시스템 아키텍처](./docs/SDD-architecture.md)
- [Core spec](./specs/001-core-infrastructure/spec.md) · [Ecommerce](./specs/002-ecommerce/spec.md) · [Real estate](./specs/003-realestate/spec.md) · [PT](./specs/004-pt/spec.md)

## Status

| | |
|---|---|
| **Period** | 2025-12 (MVP) |
| **Maintenance** | Archived — 무기한 미운영 |
| **License** | 포트폴리오 참고용; 별도 LICENSE 없음 — 재사용·상업 이용 문의 필요 |
