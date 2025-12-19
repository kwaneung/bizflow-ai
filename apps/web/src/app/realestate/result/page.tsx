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
import type { RealEstateGeneratedContent } from '@bizflow/modules/realestate';
import {
  Copy,
  Download,
  ArrowLeft,
  Check,
  Hash,
  FileText,
  Instagram,
  Facebook,
  MapPin,
  Target,
  Sparkles,
} from 'lucide-react';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<RealEstateGeneratedContent | null>(
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
        router.push('/realestate');
      }
    } else {
      router.push('/realestate');
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
부동산 포털용 설명:
${content.portalDescription}

=== SNS 홍보글 ===
인스타그램:
${content.snsPosts.instagram}

페이스북:
${content.snsPosts.facebook}

=== 마케팅 문구 ===
${content.marketingCopy.general}

${content.marketingCopy.firstTimeBuyers ? `신혼부부용:\n${content.marketingCopy.firstTimeBuyers}\n` : ''}
${content.marketingCopy.investors ? `투자자용:\n${content.marketingCopy.investors}\n` : ''}
${content.marketingCopy.families ? `가족용:\n${content.marketingCopy.families}\n` : ''}

=== 지역 하이라이트 ===
${content.locationHighlights.general}

${content.locationHighlights.transportation ? `교통편의:\n${content.locationHighlights.transportation}\n` : ''}
${content.locationHighlights.amenities ? `주변 편의시설:\n${content.locationHighlights.amenities}\n` : ''}
${content.locationHighlights.neighborhood ? `지역 특성:\n${content.locationHighlights.neighborhood}\n` : ''}

=== 핵심 강점 ===
${content.uniqueSellingPoints.join('\n')}

=== 해시태그 ===
${content.hashtags.join(' ')}
    `.trim();

    downloadAsFile(allContent, `realestate-content-${Date.now()}.txt`);
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
            onClick={() => router.push('/realestate')}
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
        <Tabs defaultValue="portal" className="space-y-4">
          <TabsList className="grid grid-cols-5 h-auto p-1 bg-slate-100/80 dark:bg-slate-800/80">
            <TabsTrigger value="portal" className="text-xs sm:text-sm py-2">
              <FileText className="w-4 h-4 mr-1.5 hidden sm:block" />
              포털 설명
            </TabsTrigger>
            <TabsTrigger value="sns" className="text-xs sm:text-sm py-2">
              <Instagram className="w-4 h-4 mr-1.5 hidden sm:block" />
              SNS
            </TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs sm:text-sm py-2">
              <Target className="w-4 h-4 mr-1.5 hidden sm:block" />
              마케팅
            </TabsTrigger>
            <TabsTrigger value="location" className="text-xs sm:text-sm py-2">
              <MapPin className="w-4 h-4 mr-1.5 hidden sm:block" />
              지역
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="text-xs sm:text-sm py-2">
              <Hash className="w-4 h-4 mr-1.5 hidden sm:block" />
              해시태그
            </TabsTrigger>
          </TabsList>

          {/* 포털 설명 */}
          <TabsContent value="portal">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">부동산 포털용 설명</CardTitle>
                  <CopyButton text={content.portalDescription} id="portal" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                  <p className="whitespace-pre-line leading-relaxed">
                    {content.portalDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SNS 홍보글 */}
          <TabsContent value="sns">
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
                      text={content.snsPosts.instagram}
                      id="instagram"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 rounded-lg p-4">
                    <p className="whitespace-pre-line">
                      {content.snsPosts.instagram}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-500" />
                      <CardTitle className="text-lg">페이스북 홍보글</CardTitle>
                    </div>
                    <CopyButton
                      text={content.snsPosts.facebook}
                      id="facebook"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4">
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.snsPosts.facebook}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 마케팅 문구 */}
          <TabsContent value="marketing">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-500" />
                      <CardTitle className="text-lg">
                        일반 마케팅 문구
                      </CardTitle>
                    </div>
                    <CopyButton
                      text={content.marketingCopy.general}
                      id="marketing-general"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.marketingCopy.general}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {content.marketingCopy.firstTimeBuyers && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <CardTitle className="text-lg">신혼부부용</CardTitle>
                      </div>
                      <CopyButton
                        text={content.marketingCopy.firstTimeBuyers}
                        id="marketing-first-time"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-line leading-relaxed">
                        {content.marketingCopy.firstTimeBuyers}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {content.marketingCopy.investors && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <CardTitle className="text-lg">투자자용</CardTitle>
                      </div>
                      <CopyButton
                        text={content.marketingCopy.investors}
                        id="marketing-investors"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-line leading-relaxed">
                        {content.marketingCopy.investors}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {content.marketingCopy.families && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <CardTitle className="text-lg">가족용</CardTitle>
                      </div>
                      <CopyButton
                        text={content.marketingCopy.families}
                        id="marketing-families"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-line leading-relaxed">
                        {content.marketingCopy.families}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 핵심 강점 */}
              {content.uniqueSellingPoints.length > 0 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <CardTitle className="text-lg">핵심 강점</CardTitle>
                        <Badge variant="outline">
                          {content.uniqueSellingPoints.length}개
                        </Badge>
                      </div>
                      <CopyButton
                        text={content.uniqueSellingPoints.join('\n')}
                        id="selling-points"
                        label="전체 복사"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {content.uniqueSellingPoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg"
                        >
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 지역 하이라이트 */}
          <TabsContent value="location">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-500" />
                      <CardTitle className="text-lg">지역 하이라이트</CardTitle>
                    </div>
                    <CopyButton
                      text={content.locationHighlights.general}
                      id="location-general"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.locationHighlights.general}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {content.locationHighlights.transportation && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">교통편의</CardTitle>
                      <CopyButton
                        text={content.locationHighlights.transportation}
                        id="location-transportation"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-line leading-relaxed">
                        {content.locationHighlights.transportation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {content.locationHighlights.amenities && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">주변 편의시설</CardTitle>
                      <CopyButton
                        text={content.locationHighlights.amenities}
                        id="location-amenities"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-line leading-relaxed">
                        {content.locationHighlights.amenities}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {content.locationHighlights.neighborhood && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">지역 특성</CardTitle>
                      <CopyButton
                        text={content.locationHighlights.neighborhood}
                        id="location-neighborhood"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                      <p className="whitespace-pre-line leading-relaxed">
                        {content.locationHighlights.neighborhood}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
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

export default function RealEstateResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent />
    </Suspense>
  );
}
