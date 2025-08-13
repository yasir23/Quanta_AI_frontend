'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User, Settings, LogOut } from 'lucide-react';

export function Header() {
  const { user, profile, loading, signOut } = useAuth();

  // Base navigation links (always visible)
  const baseNavLinks = [
    { href: '#features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
  ];

  // Add dashboard link only for authenticated users
  const navLinks = user 
    ? [...baseNavLinks, { href: '/dashboard', label: 'Dashboard' }]
    : baseNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile nav could go here */}
          </div>
          <nav className="flex items-center">
            <Button asChild variant="ghost">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/sign-in">Start for Free</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

