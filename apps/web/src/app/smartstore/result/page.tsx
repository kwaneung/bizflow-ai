'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@bizflow/shared/ui';
import type { SmartStoreGeneratedContent } from '@bizflow/modules/smartstore';
import { Copy, Download, ArrowLeft } from 'lucide-react';

export default function SmartStoreResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<SmartStoreGeneratedContent | null>(
    null
  );
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setContent(decoded);
      } catch (error) {
        console.error('Failed to parse content data:', error);
        router.push('/smartstore');
      }
    } else {
      router.push('/smartstore');
    }
  }, [searchParams, router]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (!content) return;

    const allContent = `
SEO 최적화 상품명:
${content.seoProductName}

=== 요약 ===
1줄 요약:
${content.summaries.oneLine}

3줄 요약:
${content.summaries.threeLine}

블로그 요약:
${content.summaries.blog}

=== 상세 설명 ===
${content.detailedDescription}

=== 홍보글 ===
인스타그램:
${content.promotionalPosts.instagram}

블로그:
${content.promotionalPosts.blog}

=== 해시태그 ===
${content.hashtags.join(' ')}
    `.trim();

    downloadAsFile(allContent, `smartstore-content-${Date.now()}.txt`);
  };

  if (!content) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/smartstore')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          다시 생성하기
        </Button>
        <h1 className="text-4xl font-bold mb-2">생성된 콘텐츠</h1>
        <p className="text-muted-foreground">
          생성된 콘텐츠를 확인하고 복사하거나 다운로드하세요.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button onClick={downloadAll} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          전체 다운로드
        </Button>
      </div>

      <Tabs defaultValue="seo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="seo">SEO 상품명</TabsTrigger>
          <TabsTrigger value="summaries">요약</TabsTrigger>
          <TabsTrigger value="description">상세 설명</TabsTrigger>
          <TabsTrigger value="promo">홍보글</TabsTrigger>
          <TabsTrigger value="hashtags">해시태그</TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SEO 최적화 상품명</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(content.seoProductName, 'seo')}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied === 'seo' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{content.seoProductName}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>1줄 요약</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(content.summaries.oneLine, 'oneLine')
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === 'oneLine' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p>{content.summaries.oneLine}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>3줄 요약</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(content.summaries.threeLine, 'threeLine')
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === 'threeLine' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">
                  {content.summaries.threeLine}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>블로그 요약</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(content.summaries.blog, 'blog')
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === 'blog' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{content.summaries.blog}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="description">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>상세 페이지 설명</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(content.detailedDescription, 'description')
                  }
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied === 'description' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">
                {content.detailedDescription}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promo">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>인스타그램 홍보글</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        content.promotionalPosts.instagram,
                        'instagram'
                      )
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === 'instagram' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">
                  {content.promotionalPosts.instagram}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>블로그 홍보글</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        content.promotionalPosts.blog,
                        'blogPost'
                      )
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied === 'blogPost' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">
                  {content.promotionalPosts.blog}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hashtags">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>해시태그 추천</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(content.hashtags.join(' '), 'hashtags')
                  }
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied === 'hashtags' ? '복사됨!' : '복사'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

