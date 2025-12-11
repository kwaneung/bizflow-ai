'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Skeleton,
} from '@bizflow/shared/ui';
import type { EcommerceGeneratedContent } from '@bizflow/modules/ecommerce';
import {
  Copy,
  Download,
  ArrowLeft,
  Check,
  Hash,
  FileText,
  Instagram,
  Megaphone,
} from 'lucide-react';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<EcommerceGeneratedContent | null>(
    null,
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
        router.push('/ecommerce');
      }
    } else {
      router.push('/ecommerce');
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

    downloadAsFile(allContent, `ecommerce-content-${Date.now()}.txt`);
  };

  const CopyButton = ({
    text,
    id,
    label,
  }: {
    text: string;
    id: string;
    label?: string;
  }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, id)}
      className="shrink-0 transition-all"
    >
      {copied === id ? (
        <>
          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
          <span className="text-emerald-500">복사됨</span>
        </>
      ) : (
        <>
          <Copy className="mr-1.5 h-3.5 w-3.5" />
          {label || '복사'}
        </>
      )}
    </Button>
  );

  if (!content) {
    return <ResultSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* 헤더 */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/ecommerce')}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            새로운 콘텐츠 생성
          </Button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                생성된 콘텐츠
              </h1>
              <p className="text-muted-foreground">
                생성된 콘텐츠를 확인하고 복사하거나 다운로드하세요
              </p>
            </div>
            <Button
              onClick={downloadAll}
              className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600"
            >
              <Download className="mr-2 h-4 w-4" />
              전체 다운로드
            </Button>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <Tabs defaultValue="seo" className="space-y-4">
          <TabsList className="grid grid-cols-5 h-auto p-1 bg-slate-100/80 dark:bg-slate-800/80">
            <TabsTrigger value="seo" className="text-xs sm:text-sm py-2">
              <FileText className="w-4 h-4 mr-1.5 hidden sm:block" />
              SEO 상품명
            </TabsTrigger>
            <TabsTrigger value="summaries" className="text-xs sm:text-sm py-2">
              요약
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="text-xs sm:text-sm py-2"
            >
              상세 설명
            </TabsTrigger>
            <TabsTrigger value="promo" className="text-xs sm:text-sm py-2">
              <Megaphone className="w-4 h-4 mr-1.5 hidden sm:block" />
              홍보글
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="text-xs sm:text-sm py-2">
              <Hash className="w-4 h-4 mr-1.5 hidden sm:block" />
              해시태그
            </TabsTrigger>
          </TabsList>

          {/* SEO 상품명 */}
          <TabsContent value="seo">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">SEO 최적화 상품명</CardTitle>
                  <CopyButton text={content.seoProductName} id="seo" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
                  {content.seoProductName}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 요약 */}
          <TabsContent value="summaries">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">1줄 요약</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        간단
                      </Badge>
                    </div>
                    <CopyButton text={content.summaries.oneLine} id="oneLine" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{content.summaries.oneLine}</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">3줄 요약</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        중간
                      </Badge>
                    </div>
                    <CopyButton
                      text={content.summaries.threeLine}
                      id="threeLine"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {content.summaries.threeLine}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">블로그 요약</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        상세
                      </Badge>
                    </div>
                    <CopyButton text={content.summaries.blog} id="blog" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">
                    {content.summaries.blog}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 상세 설명 */}
          <TabsContent value="description">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">상세 페이지 설명</CardTitle>
                  <CopyButton
                    text={content.detailedDescription}
                    id="description"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                  <p className="whitespace-pre-line leading-relaxed">
                    {content.detailedDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 홍보글 */}
          <TabsContent value="promo">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <CardTitle className="text-lg">
                        인스타그램 홍보글
                      </CardTitle>
                    </div>
                    <CopyButton
                      text={content.promotionalPosts.instagram}
                      id="instagram"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 rounded-lg p-4">
                    <p className="whitespace-pre-line">
                      {content.promotionalPosts.instagram}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      <CardTitle className="text-lg">블로그 홍보글</CardTitle>
                    </div>
                    <CopyButton
                      text={content.promotionalPosts.blog}
                      id="blogPost"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.promotionalPosts.blog}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 해시태그 */}
          <TabsContent value="hashtags">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">해시태그 추천</CardTitle>
                    <Badge variant="outline">{content.hashtags.length}개</Badge>
                  </div>
                  <CopyButton
                    text={content.hashtags.join(' ')}
                    id="hashtags"
                    label="전체 복사"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {content.hashtags.map((tag: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => copyToClipboard(tag, `tag-${index}`)}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
                    >
                      {copied === `tag-${index}` ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ✓ 복사됨
                        </span>
                      ) : (
                        tag
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function EcommerceResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent />
    </Suspense>
  );
}
