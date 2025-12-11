-- Insert SmartStore module prompt templates
-- Template for generating all product content formats

INSERT INTO prompt_templates (id, module_id, version, template, variables, description, is_active)
VALUES (
  'smartstore-content-generation',
  'smartstore',
  '1.0.0',
  '당신은 네이버 스마트스토어 상품 콘텐츠 전문가입니다. 주어진 상품 정보를 바탕으로 SEO 최적화된 상품명, 요약문, 상세 설명, 홍보글, 해시태그를 생성해주세요.

상품 정보:
- 상품명: {{productName}}
- 상품 설명: {{productDescription}}
{{#if productPrice}}
- 가격: {{productPrice}}원
{{/if}}
{{#if productCategory}}
- 카테고리: {{productCategory}}
{{/if}}
{{#if productOptions}}
- 옵션: {{productOptions}}
{{/if}}
{{#if productImages}}
- 이미지: {{productImages}}
{{/if}}

다음 형식의 JSON으로 응답해주세요:
{
  "seoProductName": "SEO 최적화된 상품명 (검색 최적화를 고려한 키워드 포함)",
  "summaries": {
    "oneLine": "1줄 요약 (50자 이내)",
    "threeLine": "3줄 요약 (각 줄 50자 이내, 줄바꿈 포함)",
    "blog": "블로그 형식 요약 (200-300자, 문단 형식)"
  },
  "detailedDescription": "상세 페이지 설명 (500-1000자, 상품의 특징, 장점, 사용법 등 포함)",
  "promotionalPosts": {
    "instagram": "인스타그램 홍보글 (이모지 포함, 200자 이내, 매력적인 문구)",
    "blog": "블로그 홍보글 (300-500자, SEO 최적화된 문구)"
  },
  "hashtags": ["#해시태그1", "#해시태그2", "#해시태그3", "#해시태그4", "#해시태그5"]
}

중요 사항:
- 모든 콘텐츠는 한국어로 작성
- SEO 키워드를 자연스럽게 포함
- 고객이 구매하고 싶게 만드는 문구 사용
- 정확한 JSON 형식으로 응답',
  ARRAY[
    '{"name": "productName", "required": true, "description": "상품명"}',
    '{"name": "productDescription", "required": true, "description": "상품 설명"}',
    '{"name": "productPrice", "required": false, "description": "상품 가격"}',
    '{"name": "productCategory", "required": false, "description": "상품 카테고리"}',
    '{"name": "productOptions", "required": false, "description": "상품 옵션 (JSON 문자열)"}',
    '{"name": "productImages", "required": false, "description": "상품 이미지 URL 목록"}'
  ]::jsonb[],
  'SmartStore 상품 콘텐츠 생성 템플릿 - SEO 상품명, 요약문, 상세 설명, 홍보글, 해시태그를 한 번에 생성',
  true
)
ON CONFLICT (id, module_id, version) DO NOTHING;

