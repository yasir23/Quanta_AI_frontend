'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Shield, Rocket } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, formatPrice, getYearlySavingsPercentage } from '@/lib/stripe';
import CheckoutButton from '@/components/stripe/checkout-button';
import { useAuth } from '@/lib/auth';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return Shield;
      case 'pro':
        return Zap;
      case 'enterprise':
        return Rocket;
      default:
        return Shield;
    }
  };

  const getPriceId = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.tier === 'free') return null;
    return isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;
  };

  const getDisplayPrice = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.monthlyPrice === 0) return 'Free';
    if (plan.tier === 'enterprise' && plan.monthlyPrice === null) return 'Custom';
    
    const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
    return formatPrice(price);
  };

  const getCtaText = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.tier === 'free') return 'Get Started';
    if (plan.tier === 'enterprise') return 'Contact Sales';
    return 'Start Free Trial';
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 fade-in">
        <section className="container mx-auto max-w-6xl px-4 py-20 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Powerful AI Research
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that fits your research needs. From individual researchers to enterprise teams.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-10 flex items-center justify-center space-x-2">
            <Label htmlFor="billing-cycle" className={cn(!isYearly && "font-semibold")}>
              Monthly
            </Label>
            <Switch
              id="billing-cycle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-cycle" className={cn(isYearly && "font-semibold")}>
              Yearly
              <Badge variant="secondary" className="ml-2">
                Save {getYearlySavingsPercentage(SUBSCRIPTION_PLANS[1].monthlyPrice, SUBSCRIPTION_PLANS[1].yearlyPrice)}%
              </Badge>
            </Label>
          </div>

          {/* Pricing Cards */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const Icon = getPlanIcon(plan.id);
              const priceId = getPriceId(plan);
              const displayPrice = getDisplayPrice(plan);
              const ctaText = getCtaText(plan);
              
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    'flex flex-col rounded-2xl transition-all relative',
                    plan.isPopular ? 'border-2 border-primary shadow-2xl shadow-primary/10 scale-105' : 'border'
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8 pt-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 px-6">
                    {/* Pricing */}
                    <div className="mb-8 text-center">
                      <div className="mb-2">
                        <span className="text-4xl font-bold">{displayPrice}</span>
                        {plan.monthlyPrice > 0 && <span className="text-muted-foreground">/month</span>}
                      </div>
                      {isYearly && plan.yearlyPrice > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Billed as {formatPrice(plan.yearlyPrice)}/year
                        </p>
                      )}
                      {isYearly && plan.monthlyPrice > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          Save {formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)} per year
                        </p>
                      )}
                    </div>

                    {/* Usage Limits */}
                    <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold text-sm mb-3">Usage Limits</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Requests:</span>
                          <span className="font-medium">
                            {plan.limits.monthlyRequests === -1 ? 'Unlimited' : plan.limits.monthlyRequests.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Concurrent Units:</span>
                          <span className="font-medium">{plan.limits.concurrentUnits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Tokens:</span>
                          <span className="font-medium">
                            {plan.limits.tokensPerMonth === -1 ? 'Unlimited' : plan.limits.tokensPerMonth.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-sm">
                          <Check className="mr-3 h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="px-6 pb-8">
                    {plan.tier === 'free' ? (
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/sign-in">{ctaText}</Link>
                      </Button>
                    ) : plan.tier === 'enterprise' ? (
                      <Button asChild className="w-full" variant="outline">
                        <Link href="mailto:sales@quantaai.com">{ctaText}</Link>
                      </Button>
                    ) : priceId ? (
                      <CheckoutButton
                        priceId={priceId}
                        planName={plan.name}
                        className={cn(
                          "w-full",
                          plan.isPopular ? "bg-primary hover:bg-primary/90" : ""
                        )}
                      >
                        {ctaText}
                      </CheckoutButton>
                    ) : (
                      <Button disabled className="w-full">
                        Price ID Not Configured
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold mb-2">What happens when I reach my limits?</h3>
                <p className="text-muted-foreground text-sm">
                  When you reach your monthly request or token limits, you'll need to wait until the next billing cycle or upgrade your plan to continue using the service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards, debit cards, and other payment methods supported by Stripe.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, all paid plans come with a free trial period. You can cancel anytime during the trial without being charged.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
