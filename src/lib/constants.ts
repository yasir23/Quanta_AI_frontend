import { BarChart, Compass, FileText, Settings, LayoutDashboard, User } from 'lucide-react';

export const chartData = [
  { date: 'Jan 22', topicA: 2890, topicB: 1800 },
  { date: 'Feb 22', topicA: 2756, topicB: 2100 },
  { date: 'Mar 22', topicA: 3322, topicB: 2500 },
  { date: 'Apr 22', topicA: 3470, topicB: 2300 },
  { date: 'May 22', topicA: 3475, topicB: 2600 },
  { date: 'Jun 22', topicA: 3129, topicB: 2900 },
  { date: 'Jul 22', topicA: 3580, topicB: 3100 },
  { date: 'Aug 22', topicA: 3908, topicB: 3300 },
  { date: 'Sep 22', topicA: 3850, topicB: 3500 },
  { date: 'Oct 22', topicA: 4200, topicB: 3800 },
  { date: 'Nov 22', topicA: 4000, topicB: 3700 },
  { date: 'Dec 22', topicA: 4300, topicB: 4100 },
];

export const chartConfig = {
  topicA: {
    label: 'AI Agents',
    color: 'hsl(var(--chart-1))',
  },
  topicB: {
    label: 'WebAssembly',
    color: 'hsl(var(--chart-2))',
  },
};

export const trends = [
  {
    name: 'Autonomous AI Agents',
    description: 'Models that can perform tasks and achieve goals with little-to-no human intervention.',
    value: '+45%',
    changeType: 'increase',
  },
  {
    name: 'Spatial Computing',
    description: 'The next evolution of human-computer interaction, blending digital and physical worlds.',
    value: '+32%',
    changeType: 'increase',
  },
  {
    name: 'DePIN',
    description: 'Decentralized Physical Infrastructure Networks are gaining traction in web3.',
    value: '+18%',
    changeType: 'increase',
  },
  {
    name: 'Legacy Social Media',
    description: 'Engagement is shifting towards smaller, community-focused platforms.',
    value: '-12%',
    changeType: 'decrease',
  },
];

export const sidebarLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/explorer', label: 'Explorer', icon: Compass },
    { href: '/dashboard/reports', label: 'Reports', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export const userMenuLinks = [
    { href: '/settings', label: 'Profile', icon: User },
    { href: '/pricing', label: 'Billing', icon: DollarSignIcon },
    { href: '/settings', label: 'Settings', icon: Settings },
];

// Helper component because lucide-react doesn't have DollarSignIcon directly
function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
