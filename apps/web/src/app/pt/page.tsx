'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Alert,
  AlertDescription,
  Spinner,
  Badge,
} from '@bizflow/shared/ui';
import { AlertCircle, Sparkles, Dumbbell } from 'lucide-react';
import type { PTProgramInput } from '@bizflow/modules/pt';

export default function PTPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 프로그램 입력 상태
  const [programData, setProgramData] = useState<PTProgramInput>({
    name: '',
    programType: '',
    goals: '',
    duration: '',
    price: undefined,
    features: [],
    targetCustomers: [],
    location: '',
    trainerInfo: {
      experience: '',
      certifications: [],
      specialty: '',
    },
    description: '',
  });

  // Features 관리
  const [featureInput, setFeatureInput] = useState('');
  const addFeature = () => {
    if (featureInput.trim()) {
      setProgramData({
        ...programData,
        features: [...(programData.features || []), featureInput.trim()],
      });
      setFeatureInput('');
    }
  };
  const removeFeature = (index: number) => {
    setProgramData({
      ...programData,
      features: programData.features?.filter((_, i) => i !== index) || [],
    });
  };

  // Target Customers 관리
  const targetCustomerOptions = [
    '초보자',
    '중급자',
    '고급자',
    '여성',
    '남성',
    '시니어',
    '직장인',
  ];
  const toggleTargetCustomer = (customer: string) => {
    const current = programData.targetCustomers || [];
    if (current.includes(customer)) {
      setProgramData({
        ...programData,
        targetCustomers: current.filter((c) => c !== customer),
      });
    } else {
      setProgramData({
        ...programData,
        targetCustomers: [...current, customer],
      });
    }
  };

  const handleSubmit = async () => {
    if (!programData.name.trim() || !programData.programType.trim() || !programData.goals.trim()) {
      setError('프로그램명, 프로그램 유형, 목표를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clean up empty optional fields
      const cleanedData: PTProgramInput = {
        name: programData.name.trim(),
        programType: programData.programType.trim(),
        goals: programData.goals.trim(),
        duration: programData.duration?.trim() || undefined,
        price: programData.price,
        features: programData.features && programData.features.length > 0 ? programData.features : undefined,
        targetCustomers: programData.targetCustomers && programData.targetCustomers.length > 0 ? programData.targetCustomers : undefined,
        location: programData.location?.trim() || undefined,
        trainerInfo: programData.trainerInfo?.experience || programData.trainerInfo?.certifications?.length || programData.trainerInfo?.specialty
          ? {
              experience: programData.trainerInfo.experience?.trim() || undefined,
              certifications: programData.trainerInfo.certifications && programData.trainerInfo.certifications.length > 0
                ? programData.trainerInfo.certifications
                : undefined,
              specialty: programData.trainerInfo.specialty?.trim() || undefined,
            }
          : undefined,
        description: programData.description?.trim() || undefined,
      };

      const response = await fetch('/api/pt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programData: cleanedData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `서버 오류: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || '콘텐츠 생성에 실패했습니다.');
      }

      router.push(
        `/pt/result?data=${encodeURIComponent(
          JSON.stringify(result.content),
        )}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    programData.name.trim() &&
    programData.programType.trim() &&
    programData.goals.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="container mx-auto max-w-3xl py-12 px-4">
        {/* 헤더 섹션 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-6">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            PT/피트니스 콘텐츠 생성
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            프로그램 정보를 입력하면 AI가 마케팅 콘텐츠를 생성합니다
          </p>
        </div>

        {/* 메인 카드 */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  프로그램 정보 입력
                </CardTitle>
                <CardDescription className="mt-1">
                  프로그램에 대한 정보를 자세히 입력할수록 더 좋은 콘텐츠가
                  생성됩니다
                </CardDescription>
              </div>
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="w-3 h-3 mr-1" />
                AI 생성
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* 프로그램명 */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                프로그램명
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1.5 py-0"
                >
                  필수
                </Badge>
              </Label>
              <Input
                id="name"
                value={programData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProgramData({ ...programData, name: e.target.value })
                }
                disabled={loading}
                placeholder="예: 1:1 맞춤 다이어트 프로그램"
                className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* 프로그램 유형 & 목표 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="programType"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  프로그램 유형
                  <Badge
                    variant="destructive"
                    className="text-[10px] px-1.5 py-0"
                  >
                    필수
                  </Badge>
                </Label>
                <Input
                  id="programType"
                  value={programData.programType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProgramData({
                      ...programData,
                      programType: e.target.value,
                    })
                  }
                  disabled={loading}
                  placeholder="예: 다이어트, 근력운동, 요가"
                  className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="goals"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  목표
                  <Badge
                    variant="destructive"
                    className="text-[10px] px-1.5 py-0"
                  >
                    필수
                  </Badge>
                </Label>
                <Input
                  id="goals"
                  value={programData.goals}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProgramData({ ...programData, goals: e.target.value })
                  }
                  disabled={loading}
                  placeholder="예: 체중 감량, 근력 향상"
                  className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* 기간 & 가격 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  기간
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    선택
                  </Badge>
                </Label>
                <Input
                  id="duration"
                  value={programData.duration || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProgramData({
                      ...programData,
                      duration: e.target.value,
                    })
                  }
                  disabled={loading}
                  placeholder="예: 1개월, 3개월"
                  className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  가격
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    선택
                  </Badge>
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    value={programData.price || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProgramData({
                        ...programData,
                        price: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    disabled={loading}
                    placeholder="200000"
                    className="h-11 pr-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    원
                  </span>
                </div>
              </div>
            </div>

            {/* 특징 */}
            <div className="space-y-2">
              <Label
                htmlFor="features"
                className="text-sm font-medium flex items-center gap-2"
              >
                특징
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  선택
                </Badge>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="features"
                  value={featureInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFeatureInput(e.target.value)
                  }
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  disabled={loading}
                  placeholder="예: 1:1 맞춤, 그룹 레슨"
                  className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  disabled={loading || !featureInput.trim()}
                  variant="outline"
                  className="h-11"
                >
                  추가
                </Button>
              </div>
              {programData.features && programData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {programData.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeFeature(index)}
                    >
                      {feature} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 타겟 고객 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                타겟 고객
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  선택
                </Badge>
              </Label>
              <div className="flex flex-wrap gap-2">
                {targetCustomerOptions.map((option) => (
                  <Badge
                    key={option}
                    variant={
                      programData.targetCustomers?.includes(option)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => toggleTargetCustomer(option)}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 장소 */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium flex items-center gap-2"
              >
                장소
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  선택
                </Badge>
              </Label>
              <Input
                id="location"
                value={programData.location || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProgramData({ ...programData, location: e.target.value })
                }
                disabled={loading}
                placeholder="예: 홈 트레이닝, 센터, 온라인"
                className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* 트레이너 정보 */}
            <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
              <Label className="text-sm font-medium flex items-center gap-2">
                트레이너 정보
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  선택
                </Badge>
              </Label>
              <div className="space-y-3">
                <Input
                  placeholder="경력 (예: 10년 경력)"
                  value={programData.trainerInfo?.experience || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProgramData({
                      ...programData,
                      trainerInfo: {
                        ...programData.trainerInfo,
                        experience: e.target.value,
                      },
                    })
                  }
                  disabled={loading}
                  className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
                <Input
                  placeholder="전문 분야 (예: 다이어트, 근력운동)"
                  value={programData.trainerInfo?.specialty || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProgramData({
                      ...programData,
                      trainerInfo: {
                        ...programData.trainerInfo,
                        specialty: e.target.value,
                      },
                    })
                  }
                  disabled={loading}
                  className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* 프로그램 설명 */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium flex items-center gap-2"
              >
                프로그램 설명
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  선택
                </Badge>
              </Label>
              <Textarea
                id="description"
                value={programData.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setProgramData({
                    ...programData,
                    description: e.target.value,
                  })
                }
                disabled={loading}
                placeholder="프로그램의 상세 내용, 커리큘럼, 특징 등을 입력해주세요..."
                rows={5}
                className="resize-none bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 제출 버튼 */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-200"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  콘텐츠 생성 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  콘텐츠 생성하기
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 안내 문구 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            AI가 생성한 콘텐츠는 참고용이며, 필요에 따라 수정하여 사용하세요
          </p>
        </div>
      </div>
    </div>
  );
}

