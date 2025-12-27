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
import type { PTGeneratedContent } from '@bizflow/modules/pt';
import {
  Copy,
  Download,
  ArrowLeft,
  Check,
  Hash,
  FileText,
  Instagram,
  Facebook,
  Megaphone,
  Target,
  Dumbbell,
  Users,
} from 'lucide-react';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [content, setContent] = useState<PTGeneratedContent | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        setContent(decoded);
      } catch (error) {
        console.error('Failed to parse content data:', error);
        router.push('/pt');
      }
    } else {
      router.push('/pt');
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
프로그램 소개:
${content.programIntroduction}

=== 운동 효과 ===
${content.exerciseEffects}

=== SNS 게시물 ===
인스타그램:
${content.snsPosts.instagram}

페이스북:
${content.snsPosts.facebook}

=== 회원 모집 광고 문구 ===
${content.recruitmentAdCopy}

=== 타겟 고객별 마케팅 문구 ===
일반:
${content.targetCustomerCopy.general}
${content.targetCustomerCopy.beginners ? `\n초보자:\n${content.targetCustomerCopy.beginners}` : ''}
${content.targetCustomerCopy.intermediate ? `\n중급자:\n${content.targetCustomerCopy.intermediate}` : ''}
${content.targetCustomerCopy.advanced ? `\n고급자:\n${content.targetCustomerCopy.advanced}` : ''}
${content.targetCustomerCopy.female ? `\n여성:\n${content.targetCustomerCopy.female}` : ''}
${content.targetCustomerCopy.male ? `\n남성:\n${content.targetCustomerCopy.male}` : ''}
${content.targetCustomerCopy.seniors ? `\n시니어:\n${content.targetCustomerCopy.seniors}` : ''}
${content.targetCustomerCopy.officeWorkers ? `\n직장인:\n${content.targetCustomerCopy.officeWorkers}` : ''}

=== 해시태그 ===
${content.hashtags.join(' ')}
${content.priceInsight ? `\n\n=== 가격 의견 ===\n${content.priceInsight}` : ''}
${content.durationInsight ? `\n\n=== 기간 의견 ===\n${content.durationInsight}` : ''}
    `.trim();

    downloadAsFile(allContent, `pt-content-${Date.now()}.txt`);
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
            onClick={() => router.push('/pt')}
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

        {/* 가격 및 기간 인사이트 섹션 */}
        {(content.priceInsight || content.durationInsight) && (
          <div className="mb-6 space-y-4">
            {content.priceInsight && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">가격 의견</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        입력한 가격이 있다면 적절성 평가를, 없다면 시장성을
                        기준으로 추천을 제공합니다.
                      </p>
                    </div>
                    <CopyButton
                      text={content.priceInsight}
                      id="price-insight"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {content.priceInsight}
                  </p>
                </CardContent>
              </Card>
            )}

            {content.durationInsight && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">기간 의견</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        입력한 기간이 있다면 적절성 평가를, 없다면 목표 달성을
                        기준으로 추천을 제공합니다.
                      </p>
                    </div>
                    <CopyButton
                      text={content.durationInsight}
                      id="duration-insight"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {content.durationInsight}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 탭 컨텐츠 */}
        <Tabs defaultValue="introduction" className="space-y-4">
          <TabsList className="grid grid-cols-6 h-auto p-1 bg-slate-100/80 dark:bg-slate-800/80">
            <TabsTrigger
              value="introduction"
              className="text-xs sm:text-sm py-2"
            >
              <FileText className="w-4 h-4 mr-1.5 hidden sm:block" />
              프로그램 소개
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs sm:text-sm py-2">
              <Dumbbell className="w-4 h-4 mr-1.5 hidden sm:block" />
              운동 효과
            </TabsTrigger>
            <TabsTrigger value="sns" className="text-xs sm:text-sm py-2">
              <Megaphone className="w-4 h-4 mr-1.5 hidden sm:block" />
              SNS 게시물
            </TabsTrigger>
            <TabsTrigger
              value="recruitment"
              className="text-xs sm:text-sm py-2"
            >
              회원 모집
            </TabsTrigger>
            <TabsTrigger value="target" className="text-xs sm:text-sm py-2">
              <Target className="w-4 h-4 mr-1.5 hidden sm:block" />
              타겟 고객
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="text-xs sm:text-sm py-2">
              <Hash className="w-4 h-4 mr-1.5 hidden sm:block" />
              해시태그
            </TabsTrigger>
          </TabsList>

          {/* 프로그램 소개 */}
          <TabsContent value="introduction">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">프로그램 소개</CardTitle>
                  <CopyButton
                    text={content.programIntroduction}
                    id="introduction"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="whitespace-pre-line leading-relaxed">
                    {content.programIntroduction}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 운동 효과 */}
          <TabsContent value="effects">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">운동 효과</CardTitle>
                  <CopyButton text={content.exerciseEffects} id="effects" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                  <p className="whitespace-pre-line leading-relaxed">
                    {content.exerciseEffects}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SNS 게시물 */}
          <TabsContent value="sns">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <CardTitle className="text-lg">
                        인스타그램 게시물
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
                      <CardTitle className="text-lg">페이스북 게시물</CardTitle>
                    </div>
                    <CopyButton
                      text={content.snsPosts.facebook}
                      id="facebook"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-4">
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.snsPosts.facebook}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 회원 모집 */}
          <TabsContent value="recruitment">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">회원 모집 광고 문구</CardTitle>
                  <CopyButton
                    text={content.recruitmentAdCopy}
                    id="recruitment"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg p-4">
                  <p className="whitespace-pre-line leading-relaxed">
                    {content.recruitmentAdCopy}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 타겟 고객 */}
          <TabsContent value="target">
            <div className="space-y-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-500" />
                      <CardTitle className="text-lg">
                        일반 마케팅 문구
                      </CardTitle>
                    </div>
                    <CopyButton
                      text={content.targetCustomerCopy.general}
                      id="targetGeneral"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line leading-relaxed">
                    {content.targetCustomerCopy.general}
                  </p>
                </CardContent>
              </Card>

              {content.targetCustomerCopy.beginners && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          초보자
                        </Badge>
                        <CardTitle className="text-lg">
                          초보자용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.beginners}
                        id="targetBeginners"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.beginners}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.targetCustomerCopy.intermediate && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          중급자
                        </Badge>
                        <CardTitle className="text-lg">
                          중급자용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.intermediate}
                        id="targetIntermediate"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.intermediate}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.targetCustomerCopy.advanced && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          고급자
                        </Badge>
                        <CardTitle className="text-lg">
                          고급자용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.advanced}
                        id="targetAdvanced"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.advanced}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.targetCustomerCopy.female && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          여성
                        </Badge>
                        <CardTitle className="text-lg">
                          여성용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.female}
                        id="targetFemale"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.female}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.targetCustomerCopy.male && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          남성
                        </Badge>
                        <CardTitle className="text-lg">
                          남성용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.male}
                        id="targetMale"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.male}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.targetCustomerCopy.seniors && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          시니어
                        </Badge>
                        <CardTitle className="text-lg">
                          시니어용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.seniors}
                        id="targetSeniors"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.seniors}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.targetCustomerCopy.officeWorkers && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          직장인
                        </Badge>
                        <CardTitle className="text-lg">
                          직장인용 마케팅 문구
                        </CardTitle>
                      </div>
                      <CopyButton
                        text={content.targetCustomerCopy.officeWorkers}
                        id="targetOfficeWorkers"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {content.targetCustomerCopy.officeWorkers}
                    </p>
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

export default function PTResultPage() {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultContent />
    </Suspense>
  );
}
