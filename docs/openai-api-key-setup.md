# OpenAI API 키 발급 및 권한 설정 가이드

## API 키 발급 시 권한 설정

### 기본 권한 (권장)

**OpenAI API 키는 기본적으로 모든 권한이 포함되어 있습니다.**

발급 시 특별한 권한 설정 없이 **기본 설정 그대로** 사용하면 됩니다.

---

## 권한 설정 옵션

### 옵션 1: 기본 권한 (모든 권한) - 권장 ✅

**설정**: 권한 설정 없이 기본값 사용

**포함되는 권한**:
- ✅ Chat Completions (GPT 모델 사용)
- ✅ Text Completions (Legacy)
- ✅ Embeddings (임베딩 생성)
- ✅ Image Generation (DALL·E)
- ✅ Audio (Whisper, TTS)
- ✅ Fine-tuning (모델 파인튜닝)

**사용 케이스**: 
- BizFlow AI 프로젝트에서 LLM API 호출
- 다양한 모델 사용 가능
- 유연한 확장성

**권장 이유**:
- 프로젝트 초기 단계에서는 모든 기능 사용 가능
- 나중에 필요할 수 있는 기능들도 사용 가능
- 권한 제한으로 인한 오류 방지

---

### 옵션 2: 최소 권한 (보안 강화)

**설정**: 필요한 권한만 선택

**BizFlow AI에 필요한 최소 권한**:
- ✅ Chat Completions (필수)
- ✅ Text Completions (선택사항, Legacy)
- ✅ Embeddings (선택사항, 향후 확장 가능)

**제외 가능한 권한**:
- ❌ Image Generation (DALL·E) - 사용하지 않으면 제외
- ❌ Audio (Whisper, TTS) - 사용하지 않으면 제외
- ❌ Fine-tuning - 사용하지 않으면 제외

**사용 케이스**:
- 보안이 중요한 프로덕션 환경
- 비용 최적화 (불필요한 권한 제한)

**주의사항**:
- 나중에 기능 추가 시 권한 재설정 필요
- 권한 부족으로 인한 오류 가능성

---

## BizFlow AI 프로젝트 권장 설정

### ✅ 권장: 기본 권한 (모든 권한)

**이유**:
1. **유연성**: 향후 다양한 기능 추가 가능
   - 이미지 생성 (상품 이미지 분석 등)
   - 음성 처리 (향후 확장)
   - 임베딩 (검색 기능 등)

2. **간편성**: 권한 설정 없이 바로 사용 가능

3. **오류 방지**: 권한 부족으로 인한 API 호출 실패 방지

4. **MVP 단계**: 초기 개발 단계에서는 모든 기능 사용 가능하도록

---

## API 키 발급 단계별 가이드

### Step 1: OpenAI Platform 접속

1. [OpenAI Platform](https://platform.openai.com/api-keys) 접속
2. 로그인

### Step 2: API 키 생성

1. "Create new secret key" 클릭
2. **Name** 입력: `bizflow-ai` (또는 원하는 이름)
3. **Permissions**: 기본값 그대로 (모든 권한) ✅
4. "Create secret key" 클릭

### Step 3: 키 복사 및 저장

1. 생성된 키 복사 (⚠️ 한 번만 표시됨)
2. 안전한 곳에 저장 (비밀번호 관리자 등)
3. Vercel 환경 변수에 추가

---

## 권한 확인 방법

### API 키 권한 확인

1. OpenAI Platform → API Keys
2. 생성한 키 클릭
3. "Permissions" 섹션에서 확인

### 사용 중인 권한 확인

API 호출 시 사용하는 엔드포인트:
- `/v1/chat/completions` → Chat Completions 권한 필요
- `/v1/completions` → Text Completions 권한 필요
- `/v1/embeddings` → Embeddings 권한 필요

---

## 보안 모범 사례

### ✅ 권장 사항

1. **환경 변수 사용**
   - API 키를 코드에 하드코딩하지 않음
   - Vercel 환경 변수에만 저장

2. **키 이름 명확히**
   - 프로젝트명 포함 (`bizflow-ai`)
   - 용도 명시

3. **정기적 키 로테이션**
   - 주기적으로 키 재생성
   - 오래된 키 삭제

4. **사용량 모니터링**
   - OpenAI Dashboard에서 사용량 확인
   - 비정상적인 사용 감지

### ⚠️ 주의사항

1. **키 노출 방지**
   - Git에 커밋하지 않음
   - 클라이언트 코드에 포함하지 않음
   - 공개 저장소에 업로드하지 않음

2. **키 관리**
   - 여러 프로젝트에서 동일한 키 사용 지양
   - 프로젝트별로 별도 키 사용 권장

---

## 비용 관리

### 사용량 제한 설정

1. OpenAI Platform → Settings → Limits
2. 사용량 제한 설정:
   - **Hard limit**: 월 최대 사용량
   - **Soft limit**: 경고 알림 기준

### 권장 설정 (MVP 단계)

- **Hard limit**: $50-100/월 (프로젝트 규모에 따라 조정)
- **Soft limit**: $30-50/월 (경고 알림)

---

## 문제 해결

### 권한 부족 오류

**증상**:
```
Error: You do not have permission to use this endpoint
```

**해결**:
1. API 키 권한 확인
2. 필요한 권한 추가
3. 또는 기본 권한(모든 권한)으로 재생성

### API 키가 작동하지 않음

1. 키가 올바르게 복사되었는지 확인
2. Vercel 환경 변수가 올바르게 설정되었는지 확인
3. 환경 변수가 올바른 환경(Production/Preview)에 설정되었는지 확인

---

## 요약

**BizFlow AI 프로젝트 권장 설정**:

✅ **Permissions**: 기본값 (모든 권한)
- 이유: 유연성, 확장성, 오류 방지
- MVP 단계에서는 모든 기능 사용 가능하도록

✅ **Key Name**: `bizflow-ai`

✅ **저장 위치**: Vercel 환경 변수만 (코드에 포함하지 않음)

