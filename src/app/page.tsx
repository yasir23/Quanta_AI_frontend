import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Bot, BarChart, Search } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: 'Real-Time Monitoring',
      description: 'Quanta scans millions of data points from sources like Reddit, X, and YouTube.',
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Insights',
      description: 'Our AI analyzes signals to identify emerging trends and shifts in sentiment.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Visual Dashboards',
      description: 'Explore trends with interactive charts, graphs, and geospatial maps.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center sm:py-32">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              See what the world is thinking — in real time.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              AI-curated trends from Reddit, X, YouTube & more. Quanta reveals patterns, not noise.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/sign-in">Start for Free</Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <Image
            src="https://placehold.co/1200x600/0B0B0B/3EF0C6.png"
            alt="Quanta Dashboard Screenshot"
            width={1200}
            height={600}
            className="rounded-xl shadow-2xl ring-1 ring-white/10"
            data-ai-hint="dashboard ui"
          />
        </section>

        <section id="features" className="container mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover macro trends in three simple steps.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing-preview" className="bg-secondary/50 py-20 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Find the perfect plan</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start for free, then upgrade as you grow.
            </p>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="transform border-2 border-primary/50 shadow-lg transition-transform hover:scale-105 hover:shadow-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-4xl font-bold">
                    $49<span className="text-lg font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="space-y-3 text-left">
                    {[
                      'Real-time trend dashboard',
                      '5 trend explanations per day',
                      'Standard data sources',
                      'Email support',
                    ].map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                    <Link href="/sign-in">Start Free Trial</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="mt-8 text-muted-foreground">
              Need more? Check out our full pricing details.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-4">
                <Link href="/pricing">Full Pricing Details</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
