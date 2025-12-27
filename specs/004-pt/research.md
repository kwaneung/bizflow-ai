# Research: PT / Fitness Module

**Date**: 2025-12-11  
**Feature**: PT / Fitness Module  
**Phase**: 0 - Outline & Research

## Overview

This document consolidates research findings for the PT/Fitness module implementation. Since this module follows the established patterns from ecommerce and realestate modules and reuses existing shared infrastructure, the research focuses on PT/fitness domain-specific considerations and content generation patterns.

## Technology Choices

### 1. Reuse Existing Shared Infrastructure

**Decision**: Use existing shared libraries (LLM service, types, UI components) without modification

**Rationale**:

- Core infrastructure is already built and tested
- Consistent patterns across all modules (ecommerce, realestate, pt)
- No need to reinvent shared functionality
- Faster development time
- Maintains consistency in user experience

**Integration Pattern**:

- Import `LLMService` from `@bizflow/shared/llm`
- Import `Input`, `Output` types from `@bizflow/shared/types`
- Use shared UI components from `@bizflow/shared/ui`
- Follow same API route pattern as ecommerce/realestate modules

---

### 2. PT/Fitness Domain-Specific Considerations

**Decision**: Support program type-specific content generation and target customer segmentation

**Rationale**:

- Different program types (diet, strength training, yoga, etc.) require different content approaches
- Target customers (beginners, intermediate, advanced, female, male, seniors, office workers) have different needs and concerns
- Price evaluation/recommendation helps trainers set competitive pricing
- Exercise effect descriptions should include scientific basis when appropriate

**Best Practices**:

- Program type-specific prompt templates in Supabase
- Target customer copy generated only when target customers are provided
- Price evaluation when price is provided, recommendation when not
- Exercise effects should be motivating and scientifically grounded

**Content Patterns**:

- **Program Introduction**: Comprehensive overview highlighting unique features
- **Exercise Effects**: Detailed benefits with scientific basis
- **SNS Posts**: Platform-appropriate (Instagram: visual/engaging, Facebook: detailed)
- **Recruitment Ad Copy**: Urgency and call-to-action focused
- **Target Customer Copy**: Segment-specific messaging (beginners: encouragement, advanced: challenge, etc.)
- **Hashtags**: Program type and target customer relevant

---

### 3. Prompt Template Design

**Decision**: Create PT-specific prompt template stored in Supabase

**Rationale**:

- Consistent with ecommerce and realestate modules
- Version-controlled prompt templates
- Easy to update without code changes
- Supports A/B testing of prompts

**Template Structure**:

- Template ID: `pt-program-content-v1`
- Module ID: `pt`
- Version: `1.0.0`
- Variables: name, programType, goals, duration, price, features, targetCustomers, location, trainerInfo, description
- Output format: JSON with all required fields

**Key Prompt Requirements**:

- Generate all 7 content formats (program introduction, exercise effects, SNS posts, recruitment ad copy, target customer copy, hashtags, price insight)
- Handle optional fields gracefully (duration, price, target customers, etc.)
- Program type-specific content generation
- Target customer copy only when target customers provided
- Price evaluation if price provided, recommendation if not
- Korean language optimized for Korean fitness market

---

### 4. Module Structure Pattern

**Decision**: Follow exact same structure as ecommerce and realestate modules

**Rationale**:

- Consistency across all modules
- Easier maintenance and onboarding
- Predictable code organization
- Reuses proven patterns

**Structure**:

```
modules/pt/
├── src/
│   ├── types/pt-types.ts        # PTProgramInput, PTGeneratedContent
│   ├── services/
│   │   ├── pt-content-service.ts
│   │   └── index.ts
│   └── index.ts
├── __tests__/                    # Unit tests
├── project.json                  # Nx configuration
└── package.json                  # Dependencies
```

**API Route Pattern**:

```
apps/web/src/app/api/pt/generate/route.ts
```

**Page Pattern**:

```
apps/web/src/app/pt/page.tsx              # Input form
apps/web/src/app/pt/result/page.tsx       # Result display
```

---

### 5. Target Customer Segmentation

**Decision**: Generate target customer-focused copy for multiple segments

**Rationale**:

- Different customer segments have different motivations and concerns
- Beginners need encouragement and low-barrier messaging
- Advanced users need challenge and progression messaging
- Female/male customers may have different fitness goals
- Seniors need safety and health-focused messaging
- Office workers need time-efficient and stress-relief messaging

**Segmentation Strategy**:

- Generate general copy always (required)
- Generate segment-specific copy only when target customers are provided
- Each segment gets tailored messaging addressing their specific needs
- Copy should be motivating and appropriate for the segment

**Alternatives Considered**:

- **Single generic copy**: Less effective, doesn't address segment-specific needs
- **Manual selection**: Too complex for users, reduces automation value

---

### 6. Price Evaluation/Recommendation

**Decision**: Evaluate price if provided, recommend if not (similar to ecommerce module)

**Rationale**:

- Helps trainers set competitive pricing
- Market-based recommendations when price not provided
- Value proposition evaluation when price provided
- Consistent with ecommerce module pattern

**Evaluation Criteria**:

- Market standards for program type and duration
- Value proposition alignment
- Competitive positioning
- Regional market considerations (Korean market)

---

## Integration Patterns

### LLM Service Integration

- Use `LLMService.process()` method from `@bizflow/shared/llm`
- Pass `PTProgramInput` as input data
- Use prompt template ID: `pt-program-content-v1`
- Handle `PTGeneratedContent` as output
- Error handling via shared `ErrorHandler`

### Type System Integration

- `PTProgramInput` extends domain-specific input
- `PTGeneratedContent` extends domain-specific output
- Use shared `Input<T>` and `Output<T>` interfaces
- Type guards for validation

### UI Component Integration

- Use shared form components for input
- Use shared result display components
- Customize for PT-specific fields (program type selector, target customer badges, etc.)
- Follow existing UI patterns from ecommerce/realestate

---

## Best Practices

### Content Generation

- Always generate general target customer copy (required)
- Generate segment-specific copy only when target customers provided
- Include price insight when price provided or not (evaluation vs recommendation)
- Program type should influence content tone and focus
- Exercise effects should be motivating and scientifically grounded

### Error Handling

- Use shared error handling from `@bizflow/shared/llm`
- Provide user-friendly error messages
- Handle missing optional fields gracefully
- Validate required fields before LLM processing

### Testing

- Unit tests for `PTContentService`
- Component tests for input form and result display
- Integration tests for LLM service interaction
- Test all output formats are generated correctly
- Test optional field handling

---

## Decisions Summary

| Decision | Rationale | Alternative Rejected |
|----------|-----------|---------------------|
| Reuse shared infrastructure | Consistency, faster development | Build custom infrastructure |
| Program type-specific content | Better content quality | Generic content for all types |
| Target customer segmentation | More effective marketing | Single generic copy |
| Price evaluation/recommendation | Helps with pricing decisions | No price guidance |
| Follow existing module patterns | Consistency, maintainability | Custom structure |

---

## Next Steps

- Create data model for PT entities
- Design API contract for PT module
- Create prompt template in Supabase
- Implement PTContentService
- Build UI components
- Write tests

