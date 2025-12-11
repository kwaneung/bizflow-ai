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
import { AlertCircle, Sparkles, Package } from 'lucide-react';
import type { SmartStoreProductInput } from '@bizflow/modules/smartstore';

export default function SmartStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상품 입력 상태
  const [productData, setProductData] = useState<SmartStoreProductInput>({
    name: '',
    description: '',
    price: undefined,
    category: '',
    options: [],
  });

  const handleSubmit = async () => {
    if (!productData.name.trim() || !productData.description.trim()) {
      setError('상품명과 설명을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smartstore/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productData }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '콘텐츠 생성에 실패했습니다.');
      }

      router.push(
        `/smartstore/result?data=${encodeURIComponent(
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

  const isFormValid = productData.name.trim() && productData.description.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="container mx-auto max-w-2xl py-12 px-4">
        {/* 헤더 섹션 */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-6">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            스마트스토어 콘텐츠 생성
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            상품 정보를 입력하면 AI가 SEO 최적화된 마케팅 콘텐츠를 생성합니다
          </p>
        </div>

        {/* 메인 카드 */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  상품 정보 입력
                </CardTitle>
                <CardDescription className="mt-1">
                  상품에 대한 정보를 자세히 입력할수록 더 좋은 콘텐츠가
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
            {/* 상품명 */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                상품명
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1.5 py-0"
                >
                  필수
                </Badge>
              </Label>
              <Input
                id="name"
                value={productData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProductData({ ...productData, name: e.target.value })
                }
                disabled={loading}
                placeholder="예: 프리미엄 오가닉 코튼 티셔츠"
                className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>

            {/* 상품 설명 */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium flex items-center gap-2"
              >
                상품 설명
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1.5 py-0"
                >
                  필수
                </Badge>
              </Label>
              <Textarea
                id="description"
                value={productData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
                disabled={loading}
                placeholder="상품의 특징, 소재, 사이즈, 용도 등을 자세히 입력해주세요..."
                rows={5}
                className="resize-none bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              <p className="text-xs text-muted-foreground">
                💡 상세한 설명을 입력하면 더 정확한 콘텐츠가 생성됩니다
              </p>
            </div>

            {/* 가격 & 카테고리 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  가격
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    선택
                  </Badge>
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    value={productData.price || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProductData({
                        ...productData,
                        price: e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined,
                      })
                    }
                    disabled={loading}
                    placeholder="29900"
                    className="h-11 pr-10 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    원
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  카테고리
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    선택
                  </Badge>
                </Label>
                <Input
                  id="category"
                  value={productData.category || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProductData({ ...productData, category: e.target.value })
                  }
                  disabled={loading}
                  placeholder="예: 패션/의류"
                  className="h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>
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
