# SDD: 모듈 의존성 및 구조

**버전**: 1.1.0  
**최종 업데이트**: 2025-12-11

## 모듈 의존성 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    Domain Modules                            │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                │
│  │  Ecommerce   │         │  RealEstate  │                │
│  │   Module     │         │   Module     │                │
│  │              │         │              │                │
│  │  - Types     │         │  - Types     │                │
│  │  - Service   │         │  - Service   │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                         │                         │
│         └─────────┬───────────────┘                         │
│                   │                                         │
│                   ▼                                         │
│         ┌─────────────────────┐                             │
│         │  Shared Libraries   │                             │
│         └─────────────────────┘                             │
│                   │                                         │
│    ┌──────────────┼──────────────┐                          │
│    │              │              │                          │
│    ▼              ▼              ▼                          │
│ ┌────────┐  ┌────────┐  ┌────────┐                        │
│ │  LLM   │  │ Types  │  │   UI   │                        │
│ │Service │  │System  │  │Components│                       │
│ └────────┘  └────────┘  └────────┘                        │
│    │              │              │                          │
│    └──────────────┼──────────────┘                          │
│                   │                                         │
│                   ▼                                         │
│         ┌─────────────────────┐                             │
│         │ External Services  │                             │
│         └─────────────────────┘                             │
│                   │                                         │
│    ┌──────────────┼──────────────┐                          │
│    │              │              │                          │
│    ▼              ▼              ▼                          │
│ ┌────────┐  ┌────────┐  ┌────────┐                        │
│ │ OpenAI │  │Supabase│  │ Vercel │                        │
│ │  API   │  │   DB   │  │ Hosting│                        │
│ └────────┘  └────────┘  └────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 의존성 규칙

### 1. Domain Modules → Shared Libraries
- ✅ **허용**: Domain Modules는 Shared Libraries를 import 가능
- ❌ **금지**: Shared Libraries는 Domain Modules를 import 불가

### 2. Domain Modules → Domain Modules
- ❌ **금지**: Domain Modules는 서로 import 불가
- ✅ **대안**: 공통 기능은 Shared Libraries로 추출

### 3. Shared Libraries → External Services
- ✅ **허용**: Shared Libraries는 External Services와 통신 가능
- ⚠️ **주의**: 직접 의존성보다는 인터페이스를 통한 추상화 권장

## 실제 의존성 매핑

### Ecommerce Module

```typescript
// modules/ecommerce/src/services/ecommerce-content-service.ts
import { LLMService } from '@bizflow/shared/llm';        // ✅ 허용
import type { Input, Output } from '@bizflow/shared/types'; // ✅ 허용
// import { RealEstateContentService } from '@bizflow/modules/realestate'; // ❌ 금지
```

### Real Estate Module

```typescript
// modules/realestate/src/services/realestate-content-service.ts
import { LLMService } from '@bizflow/shared/llm';        // ✅ 허용
import type { Input, Output } from '@bizflow/shared/types'; // ✅ 허용
// import { EcommerceContentService } from '@bizflow/modules/ecommerce'; // ❌ 금지
```

### Shared LLM Service

```typescript
// libs/shared/llm/src/services/llm-service.ts
import { supabaseClient } from './utils/supabase-client'; // ✅ 허용 (External Service)
// import { EcommerceContentService } from '@bizflow/modules/ecommerce'; // ❌ 금지
```

## Nx 프로젝트 그래프

### 프로젝트 구조

```
apps/web
  ├─ depends on: @bizflow/modules/ecommerce
  ├─ depends on: @bizflow/modules/realestate
  └─ depends on: @bizflow/shared/ui

modules/ecommerce
  ├─ depends on: @bizflow/shared/llm
  ├─ depends on: @bizflow/shared/types
  └─ depends on: @bizflow/shared/ui

modules/realestate
  ├─ depends on: @bizflow/shared/llm
  ├─ depends on: @bizflow/shared/types
  └─ depends on: @bizflow/shared/ui

libs/shared/llm
  ├─ depends on: @bizflow/shared/types
  └─ no dependencies on modules

libs/shared/types
  └─ no dependencies

libs/shared/ui
  └─ no dependencies
```

## 빌드 순서

Nx는 의존성 그래프를 기반으로 자동으로 빌드 순서를 결정합니다:

1. **libs/shared/types** (의존성 없음)
2. **libs/shared/ui** (의존성 없음)
3. **libs/shared/llm** (types에 의존)
4. **modules/ecommerce** (llm, types, ui에 의존)
5. **modules/realestate** (llm, types, ui에 의존)
6. **apps/web** (모든 모듈에 의존)

## 모듈 간 통신

### 직접 통신 금지
Domain Modules는 서로 직접 통신하지 않습니다.

### 공통 기능 공유
공통 기능이 필요한 경우:
1. Shared Library로 추출
2. 모든 모듈에서 사용 가능

### 예시: 공통 유틸리티

```typescript
// ❌ 잘못된 방법: 모듈 간 직접 import
// modules/ecommerce/src/utils.ts
import { formatPrice } from '@bizflow/modules/realestate/utils'; // 금지!

// ✅ 올바른 방법: Shared Library로 추출
// libs/shared/utils/src/formatting.ts
export function formatPrice(price: number): string { ... }

// modules/ecommerce/src/services/ecommerce-content-service.ts
import { formatPrice } from '@bizflow/shared/utils'; // ✅ 허용

// modules/realestate/src/services/realestate-content-service.ts
import { formatPrice } from '@bizflow/shared/utils'; // ✅ 허용
```

## 타입 공유

### 공통 타입
- `Input<T>`, `Output<T>` 인터페이스
- `LLMRequest`, `LLMResponse` 타입
- `ErrorContext` 타입

### 모듈별 타입
각 모듈은 자체 타입을 정의하지만, 공통 인터페이스를 구현:

```typescript
// modules/ecommerce/src/types/ecommerce-types.ts
export interface EcommerceProductInput {
  name: string;
  description: string;
  // ...
}

// modules/realestate/src/types/realestate-types.ts
export interface RealEstatePropertyInput {
  location: string;
  propertyType: string;
  // ...
}
```

## API 라우팅 구조

### 모듈별 API Routes

```
apps/web/src/app/api/
├── llm/                    # 공통 LLM API
│   ├── process/route.ts
│   ├── requests/[requestId]/route.ts
│   └── rate-limit/status/route.ts
│
├── ecommerce/              # 이커머스 API
│   └── generate/route.ts
│
└── realestate/             # 부동산 API
    └── generate/route.ts
```

### API 의존성

각 모듈의 API Route는 해당 모듈의 Service를 사용:

```typescript
// apps/web/src/app/api/ecommerce/generate/route.ts
import { EcommerceContentService } from '@bizflow/modules/ecommerce';

// apps/web/src/app/api/realestate/generate/route.ts
import { RealEstateContentService } from '@bizflow/modules/realestate';
```

## 테스트 의존성

### 단위 테스트
- 각 모듈은 독립적으로 테스트 가능
- Shared Libraries는 Mock을 통해 테스트

### 통합 테스트
- 모듈 + Shared Libraries 조합 테스트
- External Services는 Mock 또는 Test Double 사용

## 확장 시나리오

### 새로운 모듈 추가

1. **모듈 생성**
   ```bash
   nx generate @nx/js:library modules/pt
   ```

2. **의존성 추가**
   - `@bizflow/shared/llm`
   - `@bizflow/shared/types`
   - `@bizflow/shared/ui`

3. **API Route 추가**
   ```
   apps/web/src/app/api/pt/generate/route.ts
   ```

4. **페이지 추가**
   ```
   apps/web/src/app/pt/page.tsx
   apps/web/src/app/pt/result/page.tsx
   ```

### 새로운 Shared Library 추가

1. **라이브러리 생성**
   ```bash
   nx generate @nx/js:library libs/shared/forms
   ```

2. **Path Mapping 추가**
   ```json
   // tsconfig.base.json
   {
     "@bizflow/shared/forms": ["libs/shared/forms/src/index.ts"]
   }
   ```

3. **모듈에서 사용**
   ```typescript
   import { BaseForm } from '@bizflow/shared/forms';
   ```

## 의존성 검증

### Nx 태그 규칙 (향후 구현)

```json
{
  "implicitDependencies": {
    "apps/web": ["modules/*", "libs/shared/*"],
    "modules/*": ["libs/shared/*"],
    "libs/shared/*": []
  }
}
```

### TypeScript 컴파일 검증
- TypeScript 컴파일러가 의존성 규칙을 자동 검증
- 잘못된 import는 컴파일 오류 발생

---

**문서 버전 히스토리**:
- v1.1.0 (2025-12-11): 부동산 모듈 추가 반영
- v1.0.0 (2025-12-10): 초기 문서 작성

