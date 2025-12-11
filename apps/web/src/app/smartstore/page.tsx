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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@bizflow/shared/ui';
import type { SmartStoreProductInput } from '@bizflow/modules/smartstore';

export default function SmartStorePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL 입력 상태
  const [url, setUrl] = useState('');

  // 수동 입력 상태
  const [productData, setProductData] = useState<SmartStoreProductInput>({
    name: '',
    description: '',
    price: undefined,
    category: '',
    options: [],
  });

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. URL 크롤링
      const crawlResponse = await fetch('/api/smartstore/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const crawlResult = await crawlResponse.json();

      if (!crawlResult.success || !crawlResult.product) {
        throw new Error(
          crawlResult.error || '상품 정보를 가져올 수 없습니다.'
        );
      }

      // 2. 콘텐츠 생성
      const generateResponse = await fetch('/api/smartstore/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productData: crawlResult.product }),
      });

      const generateResult = await generateResponse.json();

      if (!generateResult.success) {
        throw new Error(
          generateResult.error || '콘텐츠 생성에 실패했습니다.'
        );
      }

      // 3. 결과 페이지로 이동
      router.push(
        `/smartstore/result?data=${encodeURIComponent(
          JSON.stringify(generateResult.content)
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
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
          JSON.stringify(result.content)
        )}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">스마트스토어 상품 콘텐츠 생성</h1>
        <p className="text-muted-foreground">
          네이버 스마트스토어 상품 URL 또는 수동 입력으로 SEO 최적화된 상품 콘텐츠를
          생성하세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>입력 방법 선택</CardTitle>
          <CardDescription>
            URL 크롤링 또는 수동 입력 중 하나를 선택하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v: string) => setActiveTab(v as 'url' | 'manual')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL 입력</TabsTrigger>
              <TabsTrigger value="manual">수동 입력</TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">스마트스토어 상품 URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://smartstore.naver.com/products/..."
                    value={url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUrl(e.target.value)
                    }
                    disabled={loading}
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleUrlSubmit}
                  disabled={loading || !url.trim()}
                  className="w-full"
                >
                  {loading ? '처리 중...' : '콘텐츠 생성'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">상품명 *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProductData({ ...productData, name: e.target.value })
                    }
                    disabled={loading}
                    placeholder="상품명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">상품 설명 *</Label>
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
                    placeholder="상품에 대한 자세한 설명을 입력하세요"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">가격 (선택)</Label>
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
                      placeholder="가격을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 (선택)</Label>
                  <Input
                    id="category"
                    value={productData.category || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProductData({ ...productData, category: e.target.value })
                    }
                    disabled={loading}
                    placeholder="카테고리를 입력하세요"
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button
                  onClick={handleManualSubmit}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? '처리 중...' : '콘텐츠 생성'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

