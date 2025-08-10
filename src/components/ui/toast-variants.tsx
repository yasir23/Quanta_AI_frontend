import { toast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, Info, XCircle, Zap } from 'lucide-react';

// Enhanced toast variants for better UX
export const toastVariants = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
      className: 'border-green-200 bg-green-50 text-green-900',
    });
  },

  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      className: 'border-orange-200 bg-orange-50 text-orange-900',
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      className: 'border-blue-200 bg-blue-50 text-blue-900',
    });
  },

  research: {
    started: (query: string) => {
      toast({
        title: 'Research Started',
        description: `Analyzing: "${query}"`,
        className: 'border-blue-200 bg-blue-50 text-blue-900',
      });
    },

    completed: (query: string) => {
      toast({
        title: 'Research Complete',
        description: `Your research on "${query}" is ready to view`,
        className: 'border-green-200 bg-green-50 text-green-900',
      });
    },

    failed: (query: string, error?: string) => {
      toast({
        title: 'Research Failed',
        description: error || `Failed to complete research on "${query}"`,
        variant: 'destructive',
      });
    },

    progress: (query: string, progress: number) => {
      toast({
        title: 'Research Progress',
        description: `"${query}" - ${progress}% complete`,
        className: 'border-blue-200 bg-blue-50 text-blue-900',
      });
    },
  },

  subscription: {
    upgraded: (tier: string) => {
      toast({
        title: 'Subscription Upgraded',
        description: `Welcome to ${tier} plan! Your new features are now active.`,
        className: 'border-green-200 bg-green-50 text-green-900',
      });
    },

    limitWarning: (type: 'requests' | 'tokens', percentage: number) => {
      toast({
        title: 'Usage Warning',
        description: `You've used ${percentage}% of your monthly ${type}. Consider upgrading your plan.`,
        className: 'border-orange-200 bg-orange-50 text-orange-900',
      });
    },

    limitReached: (type: 'requests' | 'tokens') => {
      toast({
        title: 'Limit Reached',
        description: `You've reached your monthly ${type} limit. Upgrade to continue.`,
        variant: 'destructive',
      });
    },
  },

  system: {
    maintenance: () => {
      toast({
        title: 'System Maintenance',
        description: 'Some features may be temporarily unavailable.',
        className: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      });
    },

    update: (feature: string) => {
      toast({
        title: 'New Feature Available',
        description: `${feature} has been updated with new capabilities.`,
        className: 'border-blue-200 bg-blue-50 text-blue-900',
      });
    },
  },
};

// Accessibility-enhanced toast with screen reader support
export const accessibleToast = {
  announce: (message: string, type: 'polite' | 'assertive' = 'polite') => {
    // Create a live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', type);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    
    document.body.appendChild(liveRegion);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  },

  researchUpdate: (status: string, query: string) => {
    accessibleToast.announce(`Research ${status}: ${query}`, 'polite');
  },

  error: (message: string) => {
    accessibleToast.announce(`Error: ${message}`, 'assertive');
  },
};
