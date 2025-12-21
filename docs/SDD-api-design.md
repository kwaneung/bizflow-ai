# SDD: API 설계 문서

**버전**: 1.1.0  
**최종 업데이트**: 2025-12-11

## 개요

이 문서는 BizFlow AI 플랫폼의 모든 API 엔드포인트를 정의합니다.

## API 구조

### Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://bizflow-ai.vercel.app/api`

### 인증

현재는 인증이 구현되지 않았으나, 향후 Supabase Auth를 통한 인증이 추가될 예정입니다.

---

## 공통 LLM API

### 1. LLM 요청 처리

**Endpoint**: `POST /api/llm/process`

**설명**: 모듈별 입력 데이터를 LLM으로 처리하여 포맷팅된 출력을 반환합니다.

**Request Body**:
```typescript
{
  moduleId: string;              // 도메인 모듈 식별자 ("ecommerce", "realestate")
  inputData: object;              // 모듈별 입력 데이터
  promptTemplateId: string;       // 프롬프트 템플릿 식별자
  promptTemplateVersion?: string; // 선택: 특정 버전 (기본값: 최신 활성 버전)
  context?: object;               // 선택: 추가 컨텍스트
  priority?: number;              // 선택: 요청 우선순위 (기본값: 0)
}
```

**Response** (200 OK):
```typescript
{
  requestId: string;
  output: {
    data: object;                 // 모듈별 출력 데이터
    format: "json" | "text" | "markdown" | "html";
    metadata: {
      requestId: string;
      processingTime: number;     // 밀리초
      model: string;               // 사용된 LLM 모델
    };
  };
  status: "completed";
}
```

**Error Responses**:
- `400 Bad Request`: 잘못된 입력 데이터
- `429 Too Many Requests`: Rate limit 초과
- `500 Internal Server Error`: LLM API 오류 또는 처리 실패

---

### 2. 요청 상태 조회

**Endpoint**: `GET /api/llm/requests/[requestId]`

**설명**: LLM 요청의 상태와 상세 정보를 조회합니다.

**Response** (200 OK):
```typescript
{
  requestId: string;
  status: "pending" | "processing" | "completed" | "failed";
  moduleId: string;
  createdAt: string;              // ISO 8601 타임스탬프
  completedAt?: string;           // ISO 8601 타임스탬프
  output?: object;                // status가 "completed"인 경우
  error?: {
    code: string;
    message: string;
  };                              // status가 "failed"인 경우
}
```

**Error Responses**:
- `404 Not Found`: 요청을 찾을 수 없음

---

### 3. Rate Limit 상태 조회

**Endpoint**: `GET /api/llm/rate-limit/status?moduleId={moduleId}`

**설명**: 현재 Rate Limit 상태를 조회합니다.

**Query Parameters**:
- `moduleId` (required): 도메인 모듈 식별자

**Response** (200 OK):
```typescript
{
  provider: string;               // LLM 제공자 (예: "openai")
  limit: number;                  // 시간 윈도우당 최대 요청 수
  window: number;                 // 시간 윈도우 (초)
  used: number;                   // 현재 윈도우에서 사용된 요청 수
  remaining: number;              // 현재 윈도우에서 남은 요청 수
  resetAt: string;                // 윈도우 리셋 시간 (ISO 8601)
  queueSize?: number;             // 큐 크기 (큐가 활성화된 경우)
}
```

---

## 이커머스 모듈 API

### 1. 이커머스 콘텐츠 생성

**Endpoint**: `POST /api/ecommerce/generate`

**설명**: 이커머스 상품 정보를 기반으로 마케팅 콘텐츠를 생성합니다.

**Request Body**:
```typescript
{
  productData: {
    name: string;                  // 필수: 상품명
    description: string;           // 필수: 상품 설명
    price?: number | null;         // 선택: 가격
    category?: string | null;      // 선택: 카테고리
    options?: string[];            // 선택: 상품 옵션
    images?: string[];             // 선택: 이미지 URL 배열
    metadata?: object;             // 선택: 추가 메타데이터
  };
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  content: {
    seoProductName: string;        // SEO 최적화된 상품명
    summaries: {
      oneLine: string;             // 한 줄 요약
      threeLine: string;           // 세 줄 요약
      blog: string;                // 블로그용 요약
    };
    detailedDescription: string;   // 상세 페이지용 설명
    promotionalPosts: {
      instagram: string;           // 인스타그램 홍보글
      blog: string;                // 블로그 홍보글
    };
    hashtags: string[];            // 해시태그 배열
    priceInsight?: string;         // 가격 평가/추천
    categoryInsight?: string;      // 카테고리 평가/추천
  };
}
```

**Error Responses**:
- `400 Bad Request`: 필수 필드 누락 또는 잘못된 형식
- `500 Internal Server Error`: 콘텐츠 생성 실패

**예시 요청**:
```json
{
  "productData": {
    "name": "무선 블루투스 헤드폰",
    "description": "고품질 무선 블루투스 헤드폰 with 노이즈 캔슬링",
    "price": 99000,
    "category": "전자제품",
    "options": ["블랙", "화이트"]
  }
}
```

---

## 부동산 모듈 API

### 1. 부동산 콘텐츠 생성

**Endpoint**: `POST /api/realestate/generate`

**설명**: 부동산 매물 정보를 기반으로 마케팅 콘텐츠를 생성합니다.

**Request Body**:
```typescript
{
  propertyData: {
    location: string;              // 필수: 위치 (주소)
    propertyType: string;           // 필수: 매물 유형 (아파트, 오피스텔, 원룸 등)
    size?: number | null;           // 선택: 크기 (평수 또는 제곱미터)
    price?: number | null;          // 선택: 가격
    rooms?: number | null;          // 선택: 방 개수
    bathrooms?: number | null;      // 선택: 화장실 개수
    floor?: number | null;          // 선택: 층수
    buildingAge?: number | null;    // 선택: 건물 연식
    description?: string | null;   // 선택: 매물 설명
    features?: string[];            // 선택: 특징 배열
    images?: string[];              // 선택: 이미지 URL 배열
    targetCustomer?: string | null; // 선택: 타겟 고객 (신혼부부, 투자자, 가족 등)
    metadata?: object;              // 선택: 추가 메타데이터
  };
}
```

**Response** (200 OK):
```typescript
{
  success: true;
  content: {
    portalDescription: string;     // 부동산 포털용 설명
    snsPosts: {
      instagram: string;            // 인스타그램 홍보글
      facebook: string;            // 페이스북 홍보글
    };
    marketingCopy: {
      general: string;             // 일반 마케팅 문구
      firstTimeBuyers: string;     // 신혼부부용
      investors: string;            // 투자자용
      families: string;             // 가족용
    };
    locationHighlights: {
      general: string;             // 지역 전반적 장점
      transportation: string;       // 교통편의성
      amenities: string;           // 편의시설
      neighborhood: string;        // 지역 특성
    };
    uniqueSellingPoints: string[]; // 핵심 강점 배열
    hashtags: string[];            // 해시태그 배열
    priceInsight?: string;         // 가격 평가/추천
  };
}
```

**Error Responses**:
- `400 Bad Request`: 필수 필드 누락 또는 잘못된 형식
- `500 Internal Server Error`: 콘텐츠 생성 실패

**예시 요청**:
```json
{
  "propertyData": {
    "location": "서울시 강남구 역삼동",
    "propertyType": "아파트",
    "size": 84,
    "price": 850000000,
    "rooms": 3,
    "bathrooms": 2,
    "floor": 15,
    "buildingAge": 5,
    "description": "강남역 도보 5분 거리, 역세권 아파트",
    "targetCustomer": "신혼부부"
  }
}
```

---

## 공통 에러 응답 형식

모든 API는 일관된 에러 응답 형식을 사용합니다:

```typescript
{
  error: {
    code: string;                  // 에러 코드
    message: string;               // 사용자 친화적 에러 메시지
    details?: object;              // 추가 상세 정보 (선택적)
  };
}
```

### 에러 코드 목록

#### 공통 에러 코드
- `INVALID_INPUT`: 입력 검증 실패
- `SERVICE_UNAVAILABLE`: 서비스 사용 불가
- `INTERNAL_SERVER_ERROR`: 내부 서버 오류

#### LLM API 에러 코드
- `INVALID_MODULE`: 모듈 ID가 유효하지 않음
- `INVALID_TEMPLATE`: 프롬프트 템플릿을 찾을 수 없음
- `RATE_LIMIT_EXCEEDED`: Rate limit 초과
- `LLM_API_ERROR`: LLM API 오류
- `PROCESSING_ERROR`: 처리 중 오류
- `NETWORK_ERROR`: 네트워크 오류
- `TIMEOUT_ERROR`: 요청 타임아웃
- `REQUEST_NOT_FOUND`: 요청을 찾을 수 없음

#### 모듈별 에러 코드
- `MISSING_REQUIRED_FIELD`: 필수 필드 누락
- `INVALID_FIELD_TYPE`: 필드 타입이 유효하지 않음
- `CONTENT_GENERATION_FAILED`: 콘텐츠 생성 실패

---

## Rate Limiting

### 정책
- Rate Limiting은 LLM API 제공자 계정별로 적용됩니다.
- Rate limit 초과 시:
  - 큐가 활성화된 경우: 요청이 큐에 추가되고 순서대로 처리됩니다.
  - 큐가 비활성화된 경우: 요청이 거부되고 429 상태 코드를 반환합니다.

### Rate Limit 헤더
응답에 다음 헤더가 포함될 수 있습니다:
- `X-RateLimit-Limit`: 시간 윈도우당 최대 요청 수
- `X-RateLimit-Remaining`: 현재 윈도우에서 남은 요청 수
- `X-RateLimit-Reset`: 윈도우 리셋 시간 (Unix 타임스탬프)

---

## API 버전 관리

현재는 버전 관리가 구현되지 않았으나, 향후 다음과 같이 버전 관리가 추가될 예정입니다:

- `/api/v1/llm/...`
- `/api/v2/llm/...`

Breaking changes는 새로운 버전으로 배포됩니다.

---

## CORS 정책

현재는 모든 origin에서 접근 가능하나, 프로덕션 환경에서는 특정 origin만 허용하도록 설정해야 합니다.

---

## 요청/응답 예시

### 이커머스 콘텐츠 생성

**Request**:
```bash
curl -X POST http://localhost:3000/api/ecommerce/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productData": {
      "name": "무선 블루투스 헤드폰",
      "description": "고품질 무선 블루투스 헤드폰",
      "price": 99000
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "content": {
    "seoProductName": "무선 블루투스 헤드폰 - 노이즈 캔슬링",
    "summaries": {
      "oneLine": "고품질 무선 블루투스 헤드폰",
      "threeLine": "...",
      "blog": "..."
    },
    "detailedDescription": "...",
    "promotionalPosts": {
      "instagram": "...",
      "blog": "..."
    },
    "hashtags": ["#헤드폰", "#블루투스"]
  }
}
```

### 부동산 콘텐츠 생성

**Request**:
```bash
curl -X POST http://localhost:3000/api/realestate/generate \
  -H "Content-Type: application/json" \
  -d '{
    "propertyData": {
      "location": "서울시 강남구 역삼동",
      "propertyType": "아파트",
      "price": 850000000
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "content": {
    "portalDescription": "...",
    "snsPosts": {
      "instagram": "...",
      "facebook": "..."
    },
    "marketingCopy": {
      "general": "...",
      "firstTimeBuyers": "...",
      "investors": "...",
      "families": "..."
    },
    "locationHighlights": {
      "general": "...",
      "transportation": "...",
      "amenities": "...",
      "neighborhood": "..."
    },
    "uniqueSellingPoints": ["...", "...", "..."],
    "hashtags": ["#강남", "#아파트"]
  }
}
```

---

## 참고 문서

- [LLM Service API Contract](../specs/001-core-infrastructure/contracts/llm-service-api.md)
- [Ecommerce Module Spec](../specs/002-ecommerce/spec.md)
- [Real Estate Module Spec](../specs/003-realestate/spec.md)

---

**문서 버전 히스토리**:
- v1.1.0 (2025-12-11): 부동산 모듈 API 추가
- v1.0.0 (2025-12-10): 초기 문서 작성

