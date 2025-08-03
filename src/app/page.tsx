import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Bot, BarChart, Search, Globe, FileText, Code, Users, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const howItWorksSteps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: '1. We Scan',
      description: 'We continuously monitor Reddit, X (Twitter), YouTube, and more — parsing millions of posts daily.',
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: '2. We Understand',
      description: 'Our models extract sentiment, detect emerging topics, and map social narratives.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: '3. You Act',
      description: 'Use real-time dashboards or generate an AI report to make smarter product, comms, and policy decisions.',
    },
  ];

  const whoItsFor = [
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        audience: 'Researchers',
        useCase: 'Analyze social narratives across time, geography, and platforms.'
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        audience: 'Brands',
        useCase: 'Detect PR risk, market shifts, or product sentiment in real time.'
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        audience: 'Agencies',
        useCase: 'Create data-driven reports and trend briefings with one click.'
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        audience: 'Governments & NGOs',
        useCase: 'Understand population discourse without invasive data collection.'
      }
  ];

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: 'Global Sentiment Timeline',
      description: 'View how public opinion changes across countries and platforms.',
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: 'Trend Explorer',
      description: 'Drill down into keywords, hashtags, or specific communities.',
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Prompt-to-Report',
      description: 'Type a question — get an analyst-grade PDF in seconds.',
    },
     {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: 'API Access',
      description: 'Power your tools or dashboards with Quanta’s intelligence layer.',
    },
  ];

  const blogPosts = [
    {
      title: "What Is Macro Trend Intelligence?",
      href: "#"
    },
    {
      title: "How Quanta Works Under the Hood",
      href: "#"
    },
     {
      title: "Reddit as a Research Tool: A New Era",
      href: "#"
    }
  ]

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
              AI-curated insights from millions of conversations across Reddit, X, YouTube & more.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/sign-in">Start for Free</Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <Link href="/#live-insights">Explore Live Trends</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="live-insights" className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Live Insight Preview</h2>
            </div>
            <div className="mt-8 flex justify-center items-center gap-4 text-sm text-muted-foreground">
                <Button variant="outline" size="sm">Platform</Button>
                <Button variant="outline" size="sm">Region</Button>
                <Button variant="outline" size="sm">Sentiment</Button>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-secondary/50">
                    <CardContent className="p-6">
                        <p className="text-lg text-foreground">“AI job disruption in the U.S. spiked 43% in the last 24 hours.”</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/50">
                    <CardContent className="p-6">
                        <p className="text-lg text-foreground">“Crypto regulation sentiment turned negative across Europe.”</p>
                    </CardContent>
                </Card>
            </div>
        </section>

        <section id="how-it-works" className="container mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover macro trends in three simple steps.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <div key={step.title} className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="who-its-for" className="bg-secondary/50 py-20 sm:py-32">
            <div className="container mx-auto px-4">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Who It’s For</h2>
                 </div>
                 <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {whoItsFor.map((item) => (
                        <Card key={item.audience}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                {item.icon}
                                <CardTitle>{item.audience}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{item.useCase}</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Quanta in Action</h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Feature Highlights
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
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

        <section id="testimonials" className="bg-secondary/50 py-20 sm:py-32">
            <div className="container mx-auto px-4">
                 <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What People Are Saying</h2>
                 </div>
                 <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                     <Card>
                        <CardContent className="p-6">
                           <p className="text-lg italic text-foreground">“Quanta lets us move from gut instinct to evidence-based storytelling.”</p>
                           <p className="mt-4 font-semibold text-right text-muted-foreground">— Head of Strategy, Communications Firm</p>
                        </CardContent>
                     </Card>
                      <Card>
                        <CardContent className="p-6">
                           <p className="text-lg italic text-foreground">“We detected a market shift before Google Trends caught up.”</p>
                           <p className="mt-4 font-semibold text-right text-muted-foreground">— Consumer Research Analyst</p>
                        </CardContent>
                     </Card>
                 </div>
            </div>
        </section>

        <section id="pricing-preview" className="py-20 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Find the perfect plan</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start for free, then upgrade as you grow.
            </p>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Free</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-4xl font-bold">
                    $0
                  </p>
                  <ul className="space-y-3 text-left">
                    {[
                      '1 dashboard',
                      '1 AI report/month',
                      'Community support',
                    ].map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href="/sign-in">Start for Free</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="transform border-2 border-primary shadow-lg transition-transform hover:scale-105 hover:shadow-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-4xl font-bold">
                    $39<span className="text-lg font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="space-y-3 text-left">
                    {[
                      'Unlimited dashboards',
                      '10 reports/mo',
                      'Export data',
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
               <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <p className="text-4xl font-bold">Custom</p>
                  <ul className="space-y-3 text-left">
                    {[
                      'Dedicated infra',
                      'Custom prompts',
                      'Private model fine-tuning',
                      'Analyst onboarding'
                    ].map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="#">Contact Sales</Link>
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

        <section id="resources" className="bg-secondary/50 py-20 sm:py-32">
            <div className="container mx-auto px-4">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Resources</h2>
                 </div>
                 <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {blogPosts.map((post) => (
                        <Card key={post.title} className="hover:shadow-lg transition-shadow">
                           <CardContent className="p-6">
                               <Link href={post.href} className="text-lg font-semibold text-foreground group">
                                {post.title}
                                <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                               </Link>
                           </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
