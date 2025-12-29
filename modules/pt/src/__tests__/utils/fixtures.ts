import type {
  PTInput,
  PTOutput,
  PTProgramInput,
  PTGeneratedContent,
  TrainerInfo,
} from '../../types/pt-types';

/**
 * Test fixtures for PT module.
 * 
 * Use these fixtures to create consistent test data across all PT tests.
 */

/**
 * Create a valid TrainerInfo for testing.
 */
export function createTrainerInfo(
  overrides?: Partial<TrainerInfo>
): TrainerInfo {
  return {
    experience: '10 years of professional training experience',
    certifications: ['NASM-CPT', 'ACE-CPT', 'CrossFit Level 1'],
    specialty: 'Strength Training & Weight Loss',
    ...overrides,
  };
}

/**
 * Create a valid PTProgramInput for testing.
 */
export function createPTProgramInput(
  overrides?: Partial<PTProgramInput>
): PTProgramInput {
  return {
    name: 'Premium Strength Training Program',
    programType: 'Strength Training',
    goals: 'Muscle Gain & Weight Loss',
    duration: '3개월',
    price: 300000,
    features: ['1:1 맞춤', '그룹 레슨', '홈 트레이닝'],
    targetCustomers: ['Beginners', 'Intermediate', 'Male', 'Female'],
    location: 'Center',
    trainerInfo: createTrainerInfo(),
    description: 'Comprehensive strength training program designed for muscle gain and weight loss',
    images: ['https://example.com/pt1.jpg', 'https://example.com/pt2.jpg'],
    metadata: { maxParticipants: 10, equipment: ['Dumbbells', 'Barbells', 'Kettlebells'] },
    ...overrides,
  };
}

/**
 * Create a valid PTInput for testing.
 */
export function createPTInput(
  overrides?: Partial<PTInput>
): PTInput {
  return {
    moduleId: 'pt',
    programData: createPTProgramInput(),
    ...overrides,
  };
}

/**
 * Create a valid PTGeneratedContent for testing.
 */
export function createPTGeneratedContent(
  overrides?: Partial<PTGeneratedContent>
): PTGeneratedContent {
  return {
    programIntroduction: 'Welcome to our Premium Strength Training Program! This comprehensive 3-month program is designed to help you build muscle, lose weight, and achieve your fitness goals. Our experienced trainers will guide you through personalized workouts tailored to your needs.',
    exerciseEffects: 'This program focuses on compound movements and progressive overload to maximize muscle growth and fat loss. You\'ll see improvements in strength, endurance, body composition, and overall fitness within the first month.',
    snsPosts: {
      instagram: '💪 Transform your body with our Premium Strength Training Program! 💪\n\n✅ 3-month program\n✅ 1:1 맞춤 training\n✅ Expert trainers\n\nDM for details!\n\n#PT #StrengthTraining #Fitness #Gangnam',
      facebook: 'Join our Premium Strength Training Program! Expert trainers, personalized workouts, and proven results. Limited spots available!',
    },
    recruitmentAdCopy: 'Looking for a proven strength training program? Join our 3-month Premium Strength Training Program! Expert trainers, personalized workouts, and guaranteed results. Sign up now!',
    targetCustomerCopy: {
      general: 'Perfect for anyone looking to build strength, gain muscle, and improve overall fitness.',
      beginners: 'Great starting point for fitness beginners. Our trainers will guide you step-by-step.',
      intermediate: 'Take your training to the next level with advanced techniques and personalized programming.',
      advanced: 'Elite training for experienced athletes looking to break through plateaus.',
      female: 'Female-friendly program focusing on strength and body composition goals.',
      male: 'Intensive strength training program designed for maximum muscle growth.',
      seniors: 'Safe and effective training program adapted for senior fitness needs.',
      officeWorkers: 'Convenient scheduling options for busy professionals.',
    },
    hashtags: ['#PT', '#StrengthTraining', '#Fitness', '#Gangnam', '#PersonalTraining', '#MuscleGain'],
    priceInsight: 'Competitively priced at 300,000원 for a 3-month program. Excellent value considering the 1:1 맞춤 training and expert guidance included.',
    durationInsight: '3-month duration is ideal for seeing significant results. Allows time for proper form development, progressive overload, and habit formation.',
    ...overrides,
  };
}

/**
 * Create a valid PTOutput for testing.
 */
export function createPTOutput(
  overrides?: Partial<PTOutput>
): PTOutput {
  return {
    requestId: 'test-request-id',
    moduleId: 'pt',
    outputData: createPTGeneratedContent(),
    format: 'json',
    metadata: {
      processingTime: 2000,
      model: 'gpt-4',
    },
    ...overrides,
  };
}

/**
 * Create an invalid PTInput (missing required fields).
 */
export function createInvalidPTInput(): Partial<PTInput> {
  return {
    moduleId: 'pt',
    // Missing programData
  };
}

/**
 * Create a minimal valid PTInput (only required fields).
 */
export function createMinimalPTInput(): PTInput {
  return {
    moduleId: 'pt',
    programData: {
      name: 'Minimal Program',
      programType: 'Fitness',
      goals: 'General Fitness',
    },
  };
}

