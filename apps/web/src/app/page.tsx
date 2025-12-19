'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@bizflow/shared/ui';
import {
  Sparkles,
  Package,
  Building2,
  Dumbbell,
  ArrowRight,
  Zap,
  Brain,
  Target,
} from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  href?: string;
  features: string[];
}

function ModuleCard({
  title,
  description,
  icon,
  status,
  href,
  features,
}: ModuleCardProps) {
  const isAvailable = status === 'available';

  const cardContent = (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 ${
        isAvailable
          ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer border-emerald-200 dark:border-emerald-800'
          : 'opacity-75 border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* 상태 배지 */}
      <div className="absolute top-4 right-4">
        {isAvailable ? (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <Sparkles className="w-3 h-3 mr-1" />
            사용 가능
          </Badge>
        ) : (
          <Badge variant="secondary">Coming Soon</Badge>
        )}
      </div>

      <CardHeader className="pb-4">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
            isAvailable
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <div className={isAvailable ? 'text-white' : 'text-slate-500'}>
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
              {feature}
            </li>
          ))}
        </ul>

        {isAvailable && (
          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 group-hover:shadow-lg transition-all">
            시작하기
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {!isAvailable && (
          <Button variant="secondary" className="w-full" disabled>
            준비 중
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (isAvailable && href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

export default function HomePage() {
  const modules: ModuleCardProps[] = [
    {
      title: '이커머스',
      description:
        '온라인 쇼핑몰 상품 마케팅 콘텐츠를 AI가 자동으로 생성합니다.',
      icon: <Package className="w-7 h-7" />,
      status: 'available',
      href: '/ecommerce',
      features: [
        'SEO 최적화 상품명 생성',
        '한 줄/세 줄/블로그용 요약',
        '상세 페이지 설명 작성',
        '인스타그램/블로그 홍보글',
        '해시태그 자동 추천',
      ],
    },
    {
      title: '부동산',
      description:
        '부동산 매물 홍보를 위한 전문적인 마케팅 콘텐츠를 생성합니다.',
      icon: <Building2 className="w-7 h-7" />,
      status: 'available',
      href: '/realestate',
      features: [
        '매물 특징 강조 설명',
        '부동산 포털용 설명',
        'SNS 홍보 콘텐츠',
        '지역 특성 반영',
        '타겟 고객 맞춤 문구',
      ],
    },
    {
      title: 'PT / 피트니스',
      description:
        '개인 트레이너와 피트니스 센터를 위한 마케팅 콘텐츠를 생성합니다.',
      icon: <Dumbbell className="w-7 h-7" />,
      status: 'coming-soon',
      features: [
        '프로그램 소개 콘텐츠',
        'PT 상담 유도 문구',
        '운동 효과 설명',
        'SNS 홍보 포스트',
        '회원 모집 광고 문구',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      {/* 히어로 섹션 */}
      <section className="container mx-auto max-w-6xl px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          {/* 로고/아이콘 */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 mb-8">
            <Brain className="w-10 h-10 text-white" />
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 dark:from-white dark:via-emerald-200 dark:to-teal-300 bg-clip-text text-transparent">
            BizFlow AI
          </h1>

          {/* 서브타이틀 */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            AI 기반 멀티 도메인 콘텐츠 생성 플랫폼
          </p>

          {/* 설명 */}
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8">
            상품 정보만 입력하면 SEO 최적화된 마케팅 콘텐츠를
            <br />
            AI가 자동으로 생성해 드립니다.
          </p>

          {/* 특징 배지들 */}
          <div className="flex flex-wrap justify-center gap-3">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-emerald-300 dark:border-emerald-700"
            >
              <Zap className="w-4 h-4 mr-2 text-emerald-500" />
              빠른 콘텐츠 생성
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-emerald-300 dark:border-emerald-700"
            >
              <Target className="w-4 h-4 mr-2 text-emerald-500" />
              SEO 최적화
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-emerald-300 dark:border-emerald-700"
            >
              <Sparkles className="w-4 h-4 mr-2 text-emerald-500" />
              GPT-4 기반
            </Badge>
          </div>
        </div>
      </section>

      {/* 모듈 섹션 */}
      <section className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">서비스 모듈</h2>
          <p className="text-muted-foreground">
            다양한 비즈니스 도메인에 최적화된 콘텐츠 생성 서비스
          </p>
        </div>

        {/* 모듈 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleCard key={index} {...module} />
          ))}
        </div>

        {/* 추가 안내 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            💡 새로운 도메인 모듈이 계속 추가될 예정입니다
          </p>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 BizFlow AI. AI 기반 콘텐츠 생성 플랫폼
          </p>
        </div>
      </footer>
    </div>
  );
}
