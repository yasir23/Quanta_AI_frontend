'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    description: 'For individuals starting to explore trends.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['1 dashboard', '1 AI report/month', 'Community support'],
    cta: 'Start for Free',
    href: '/sign-in',
  },
  {
    name: 'Pro',
    description: 'For professionals who need to stay ahead.',
    monthlyPrice: 39,
    yearlyPrice: 390,
    features: [
      'Unlimited dashboards',
      '10 reports/mo',
      'Export data',
      'Email support',
    ],
    cta: 'Start Free Trial',
    href: '/sign-in',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    description: 'For organizations that need advanced insights.',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Everything in Pro',
      'Dedicated infra',
      'Custom prompts',
      'Private model fine-tuning',
      'Analyst onboarding',
    ],
    cta: 'Contact Sales',
    href: '#',
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 fade-in">
        <section className="container mx-auto max-w-5xl px-4 py-20 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Pricing that scales with you
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that's right for your needs. Simple, transparent, and powerful.
          </p>
          <div className="mt-10 flex items-center justify-center space-x-2">
            <Label htmlFor="billing-cycle">Monthly</Label>
            <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label htmlFor="billing-cycle">Yearly (2 months free)</Label>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 pb-20 sm:pb-32">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'flex flex-col rounded-2xl transition-all',
                  plan.isPopular ? 'border-2 border-primary shadow-2xl shadow-primary/10' : 'border'
                )}
              >
                {plan.isPopular && (
                  <div className="py-1.5 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-xl -mt-px flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    {plan.monthlyPrice !== null ? (
                      <>
                        <span className="text-4xl font-bold">
                          ${isYearly && plan.yearlyPrice > 0 ? plan.yearlyPrice / 12 : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        {isYearly && plan.yearlyPrice > 0 && <p className="text-sm text-muted-foreground">Billed as ${plan.yearlyPrice}/year</p>}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Custom</span>
                    )}
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="mr-3 h-5 w-5 flex-shrink-0 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
