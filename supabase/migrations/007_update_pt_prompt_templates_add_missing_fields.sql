-- 007 - Update PT/Fitness prompt templates to include all input fields
-- This migration adds missing input fields to PT prompt templates

-- Template 2: Exercise Effects - Add price, location, trainerInfo, targetCustomers
UPDATE public.prompt_templates
SET
  template = '당신은 피트니스 전문가입니다. 다음 프로그램의 운동 효과를 과학적 근거와 함께 설명해주세요.

프로그램 정보:
- 프로그램명: {{name}}
- 프로그램 유형: {{programType}}
- 목표: {{goals}}
{{#if duration}}
- 기간: {{duration}}
{{/if}}
{{#if price}}
- 가격: {{price}}원
{{/if}}
{{#if features}}
- 특징: {{features}}
{{/if}}
{{#if location}}
- 장소: {{location}}
{{/if}}
{{#if trainerInfo}}
- 트레이너 정보:
{{#if trainerInfo.experience}}
  - 경력: {{trainerInfo.experience}}
{{/if}}
{{#if trainerInfo.certifications}}
  - 자격증: {{trainerInfo.certifications}}
{{/if}}
{{#if trainerInfo.specialty}}
  - 전문 분야: {{trainerInfo.specialty}}
{{/if}}
{{/if}}
{{#if targetCustomers}}
- 타겟 고객: {{targetCustomers}}
{{/if}}
{{#if description}}
- 상세 설명: {{description}}
{{/if}}

요구사항:
1. 프로그램 유형에 맞는 구체적인 운동 효과 설명
2. 과학적 근거 포함 (가능한 경우)
3. 목표 달성과의 연관성 명확히 제시
4. 건강 개선, 체력 향상, 신체 변화 등 다양한 효과 포함
5. 300-400자 내외로 작성
6. 한국어로 작성

운동 효과 설명만 작성해주세요. 다른 설명이나 형식 없이 순수한 효과 설명만 반환해주세요.',
  variables = '[{"name": "name", "type": "string", "required": true}, {"name": "programType", "type": "string", "required": true}, {"name": "goals", "type": "string", "required": true}, {"name": "duration", "type": "string", "required": false}, {"name": "price", "type": "number", "required": false}, {"name": "features", "type": "array", "required": false}, {"name": "location", "type": "string", "required": false}, {"name": "trainerInfo", "type": "object", "required": false}, {"name": "targetCustomers", "type": "array", "required": false}, {"name": "description", "type": "string", "required": false}]'::jsonb
WHERE id = 'pt-exercise-effects-v1';

-- Template 3: SNS Posts - Add location, trainerInfo, targetCustomers
UPDATE public.prompt_templates
SET
  template = '당신은 소셜미디어 마케팅 전문가입니다. 다음 피트니스 프로그램에 대한 SNS 게시물을 작성해주세요.

프로그램 정보:
- 프로그램명: {{name}}
- 프로그램 유형: {{programType}}
- 목표: {{goals}}
{{#if duration}}
- 기간: {{duration}}
{{/if}}
{{#if price}}
- 가격: {{price}}원
{{/if}}
{{#if features}}
- 특징: {{features}}
{{/if}}
{{#if location}}
- 장소: {{location}}
{{/if}}
{{#if trainerInfo}}
- 트레이너 정보:
{{#if trainerInfo.experience}}
  - 경력: {{trainerInfo.experience}}
{{/if}}
{{#if trainerInfo.certifications}}
  - 자격증: {{trainerInfo.certifications}}
{{/if}}
{{#if trainerInfo.specialty}}
  - 전문 분야: {{trainerInfo.specialty}}
{{/if}}
{{/if}}
{{#if targetCustomers}}
- 타겟 고객: {{targetCustomers}}
{{/if}}
{{#if description}}
- 상세 설명: {{description}}
{{/if}}

요구사항:
1. Instagram용 게시물: 시각적이고 매력적인 톤, 이모지 활용, 150-200자
2. Facebook용 게시물: 상세하고 정보 전달 중심, 200-300자
3. 각 플랫폼의 특성에 맞는 톤과 형식 사용
4. 참여를 유도하는 문구 포함
5. 한국어로 작성

JSON 형식으로 반환해주세요:
{
  "instagram": "Instagram 게시물 내용",
  "facebook": "Facebook 게시물 내용"
}',
  variables = '[{"name": "name", "type": "string", "required": true}, {"name": "programType", "type": "string", "required": true}, {"name": "goals", "type": "string", "required": true}, {"name": "duration", "type": "string", "required": false}, {"name": "price", "type": "number", "required": false}, {"name": "features", "type": "array", "required": false}, {"name": "location", "type": "string", "required": false}, {"name": "trainerInfo", "type": "object", "required": false}, {"name": "targetCustomers", "type": "array", "required": false}, {"name": "description", "type": "string", "required": false}]'::jsonb
WHERE id = 'pt-sns-posts-v1';

-- Template 4: Recruitment Ad Copy - Add trainerInfo, targetCustomers
UPDATE public.prompt_templates
SET
  template = '당신은 광고 카피라이터입니다. 다음 피트니스 프로그램의 회원 모집 광고 문구를 작성해주세요.

프로그램 정보:
- 프로그램명: {{name}}
- 프로그램 유형: {{programType}}
- 목표: {{goals}}
{{#if duration}}
- 기간: {{duration}}
{{/if}}
{{#if price}}
- 가격: {{price}}원
{{/if}}
{{#if features}}
- 특징: {{features}}
{{/if}}
{{#if location}}
- 장소: {{location}}
{{/if}}
{{#if trainerInfo}}
- 트레이너 정보:
{{#if trainerInfo.experience}}
  - 경력: {{trainerInfo.experience}}
{{/if}}
{{#if trainerInfo.certifications}}
  - 자격증: {{trainerInfo.certifications}}
{{/if}}
{{#if trainerInfo.specialty}}
  - 전문 분야: {{trainerInfo.specialty}}
{{/if}}
{{/if}}
{{#if targetCustomers}}
- 타겟 고객: {{targetCustomers}}
{{/if}}
{{#if description}}
- 상세 설명: {{description}}
{{/if}}

요구사항:
1. 긴급성과 행동 유도를 강조
2. 프로그램의 핵심 가치와 혜택 명확히 제시
3. 명확한 CTA (Call-to-Action) 포함
4. 제한된 시간/인원 등 긴급성 요소 활용
5. 200-300자 내외로 작성
6. 한국어로 작성

회원 모집 광고 문구만 작성해주세요. 다른 설명이나 형식 없이 순수한 광고 문구만 반환해주세요.',
  variables = '[{"name": "name", "type": "string", "required": true}, {"name": "programType", "type": "string", "required": true}, {"name": "goals", "type": "string", "required": true}, {"name": "duration", "type": "string", "required": false}, {"name": "price", "type": "number", "required": false}, {"name": "features", "type": "array", "required": false}, {"name": "location", "type": "string", "required": false}, {"name": "trainerInfo", "type": "object", "required": false}, {"name": "targetCustomers", "type": "array", "required": false}, {"name": "description", "type": "string", "required": false}]'::jsonb
WHERE id = 'pt-recruitment-ad-v1';

-- Template 5: Target Customer Copy - Add location, trainerInfo
UPDATE public.prompt_templates
SET
  template = '당신은 타겟 마케팅 전문가입니다. 다음 피트니스 프로그램에 대한 타겟 고객별 마케팅 문구를 작성해주세요.

프로그램 정보:
- 프로그램명: {{name}}
- 프로그램 유형: {{programType}}
- 목표: {{goals}}
{{#if duration}}
- 기간: {{duration}}
{{/if}}
{{#if price}}
- 가격: {{price}}원
{{/if}}
{{#if features}}
- 특징: {{features}}
{{/if}}
{{#if location}}
- 장소: {{location}}
{{/if}}
{{#if trainerInfo}}
- 트레이너 정보:
{{#if trainerInfo.experience}}
  - 경력: {{trainerInfo.experience}}
{{/if}}
{{#if trainerInfo.certifications}}
  - 자격증: {{trainerInfo.certifications}}
{{/if}}
{{#if trainerInfo.specialty}}
  - 전문 분야: {{trainerInfo.specialty}}
{{/if}}
{{/if}}
{{#if targetCustomers}}
- 타겟 고객: {{targetCustomers}}
{{/if}}
{{#if description}}
- 상세 설명: {{description}}
{{/if}}

요구사항:
1. 일반적인 마케팅 문구 작성
2. 타겟 고객이 제공된 경우, 각 세그먼트별 맞춤 문구 작성:
   - 초보자: 격려와 안전성 강조
   - 중급자: 도전과 성장 강조
   - 고급자: 전문성과 목표 달성 강조
   - 여성: 여성 특화 혜택 강조
   - 남성: 근력과 체력 강조
   - 시니어: 건강과 안전 강조
   - 직장인: 시간 효율성과 스트레스 해소 강조
3. 각 세그먼트의 니즈와 관심사에 맞는 메시지
4. 150-250자 내외로 작성
5. 한국어로 작성

JSON 형식으로 반환해주세요:
{
  "general": "일반 마케팅 문구",
  "beginners": "초보자용 문구 (타겟 고객에 포함된 경우만)",
  "intermediate": "중급자용 문구 (타겟 고객에 포함된 경우만)",
  "advanced": "고급자용 문구 (타겟 고객에 포함된 경우만)",
  "female": "여성용 문구 (타겟 고객에 포함된 경우만)",
  "male": "남성용 문구 (타겟 고객에 포함된 경우만)",
  "seniors": "시니어용 문구 (타겟 고객에 포함된 경우만)",
  "officeWorkers": "직장인용 문구 (타겟 고객에 포함된 경우만)"
}',
  variables = '[{"name": "name", "type": "string", "required": true}, {"name": "programType", "type": "string", "required": true}, {"name": "goals", "type": "string", "required": true}, {"name": "duration", "type": "string", "required": false}, {"name": "price", "type": "number", "required": false}, {"name": "features", "type": "array", "required": false}, {"name": "location", "type": "string", "required": false}, {"name": "trainerInfo", "type": "object", "required": false}, {"name": "targetCustomers", "type": "array", "required": false}, {"name": "description", "type": "string", "required": false}]'::jsonb
WHERE id = 'pt-target-customer-copy-v1';

-- Template 6: Hashtags - Add duration, price, features, trainerInfo, description
UPDATE public.prompt_templates
SET
  template = '당신은 소셜미디어 해시태그 전문가입니다. 다음 피트니스 프로그램에 적합한 해시태그를 추천해주세요.

프로그램 정보:
- 프로그램명: {{name}}
- 프로그램 유형: {{programType}}
- 목표: {{goals}}
{{#if duration}}
- 기간: {{duration}}
{{/if}}
{{#if price}}
- 가격: {{price}}원
{{/if}}
{{#if features}}
- 특징: {{features}}
{{/if}}
{{#if location}}
- 장소: {{location}}
{{/if}}
{{#if trainerInfo}}
- 트레이너 정보:
{{#if trainerInfo.experience}}
  - 경력: {{trainerInfo.experience}}
{{/if}}
{{#if trainerInfo.certifications}}
  - 자격증: {{trainerInfo.certifications}}
{{/if}}
{{#if trainerInfo.specialty}}
  - 전문 분야: {{trainerInfo.specialty}}
{{/if}}
{{/if}}
{{#if targetCustomers}}
- 타겟 고객: {{targetCustomers}}
{{/if}}
{{#if description}}
- 상세 설명: {{description}}
{{/if}}

요구사항:
1. 프로그램 유형과 관련된 해시태그
2. 목표와 관련된 해시태그
3. 특징과 관련된 해시태그 (제공된 경우)
4. 타겟 고객과 관련된 해시태그 (제공된 경우)
5. 인기 있는 피트니스 해시태그 포함
6. 한국어 및 영어 해시태그 혼합
7. 10-15개 해시태그 추천

JSON 배열 형식으로 반환해주세요:
["#해시태그1", "#해시태그2", ...]',
  variables = '[{"name": "name", "type": "string", "required": true}, {"name": "programType", "type": "string", "required": true}, {"name": "goals", "type": "string", "required": true}, {"name": "duration", "type": "string", "required": false}, {"name": "price", "type": "number", "required": false}, {"name": "features", "type": "array", "required": false}, {"name": "location", "type": "string", "required": false}, {"name": "trainerInfo", "type": "object", "required": false}, {"name": "targetCustomers", "type": "array", "required": false}, {"name": "description", "type": "string", "required": false}]'::jsonb
WHERE id = 'pt-hashtags-v1';

-- Template 7: Price & Duration Insight - Add trainerInfo, targetCustomers, description, and duration evaluation/recommendation
UPDATE public.prompt_templates
SET
  template = '당신은 피트니스 시장 분석 전문가입니다. 다음 프로그램의 가격과 기간에 대한 인사이트를 제공해주세요.

프로그램 정보:
- 프로그램명: {{name}}
- 프로그램 유형: {{programType}}
- 목표: {{goals}}
{{#if duration}}
- 제공된 기간: {{duration}}
{{/if}}
{{#if price}}
- 제공된 가격: {{price}}원
{{/if}}
{{#if features}}
- 특징: {{features}}
{{/if}}
{{#if location}}
- 장소: {{location}}
{{/if}}
{{#if trainerInfo}}
- 트레이너 정보:
{{#if trainerInfo.experience}}
  - 경력: {{trainerInfo.experience}}
{{/if}}
{{#if trainerInfo.certifications}}
  - 자격증: {{trainerInfo.certifications}}
{{/if}}
{{#if trainerInfo.specialty}}
  - 전문 분야: {{trainerInfo.specialty}}
{{/if}}
{{/if}}
{{#if targetCustomers}}
- 타겟 고객: {{targetCustomers}}
{{/if}}
{{#if description}}
- 상세 설명: {{description}}
{{/if}}

요구사항:
{{#if price}}
**가격 평가 (제공된 경우):**
1. 제공된 가격의 시장 적정성 평가
2. 프로그램 유형과 특징을 고려한 가격 분석
3. 트레이너 정보를 고려한 가격 평가 (제공된 경우)
4. 경쟁 프로그램 대비 가격 경쟁력 평가
5. 가격 대비 가치 제안 분석
{{else}}
**가격 추천 (제공되지 않은 경우):**
1. 프로그램 유형과 특징을 고려한 시장 적정 가격 추천
2. 트레이너 정보를 고려한 가격 추천 (제공된 경우)
3. 경쟁 프로그램 가격 범위 참고
4. 프로그램 가치에 맞는 가격대 제안
5. 가격 설정 근거 설명
{{/if}}

{{#if duration}}
**기간 평가 (제공된 경우):**
1. 제공된 기간의 목표 달성 적합성 평가
2. 프로그램 유형과 목표를 고려한 기간 적정성 분석
3. 일반적인 피트니스 프로그램 기간과 비교
4. 목표 달성을 위한 최적 기간 여부 평가
5. 기간 대비 효과성 분석
{{else}}
**기간 추천 (제공되지 않은 경우):**
1. 프로그램 유형과 목표를 고려한 추천 기간 제안
2. 목표 달성에 필요한 최소/최적 기간 추천
3. 일반적인 피트니스 프로그램 기간 범위 참고
4. 단계별 진행 계획을 고려한 기간 제안
5. 기간 설정 근거 설명
{{/if}}

6. 가격과 기간 모두 포함하여 각각 150-200자 내외로 작성
7. 한국어로 작성

JSON 형식으로 반환해주세요:
{
  "priceInsight": "가격 평가/추천 내용",
  "durationInsight": "기간 평가/추천 내용"
}',
  variables = '[{"name": "name", "type": "string", "required": true}, {"name": "programType", "type": "string", "required": true}, {"name": "goals", "type": "string", "required": true}, {"name": "duration", "type": "string", "required": false}, {"name": "price", "type": "number", "required": false}, {"name": "features", "type": "array", "required": false}, {"name": "location", "type": "string", "required": false}, {"name": "trainerInfo", "type": "object", "required": false}, {"name": "targetCustomers", "type": "array", "required": false}, {"name": "description", "type": "string", "required": false}]'::jsonb
WHERE id = 'pt-price-insight-v1';

