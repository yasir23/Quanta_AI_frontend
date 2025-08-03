import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Github className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  const footerLinks = {
    'Product': [
      { title: 'Pricing', href: '/pricing' },
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Features', href: '/#features' },
      { title: 'API Docs', href: '#' },
    ],
    'Company': [
      { title: 'About', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'Contact', href: '#' },
    ],
    'Legal': [
      { title: 'Privacy Policy', href: '#' },
      { title: 'Terms of Service', href: '#' },
    ]
  };

  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-muted-foreground">
              AI-powered macro trend intelligence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link.title}>
                      <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Quanta, Inc. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            {socialLinks.map((social, index) => (
              <Link key={index} href={social.href} className="text-muted-foreground hover:text-foreground">
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
