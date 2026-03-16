import { 
  LayoutDashboard, 
  Ticket, 
  LineChart, 
  History, 
  Bookmark, 
  Crown, 
  User,
  Settings,
  ShieldCheck,
  Trophy,
  ClipboardList,
  CheckCircle2
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: any;
  adminOnly?: boolean;
  premiumOnly?: boolean;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Daily Slips', href: '/slips', icon: Ticket },
  { name: 'Match Analysis', href: '/analysis', icon: LineChart },
  { name: 'Results', href: '/history', icon: History },
  { name: 'Saved Picks', href: '/saved', icon: Bookmark },
  { name: 'Subscription', href: '/subscription', icon: Crown },
  { name: 'Profile', href: '/profile', icon: User },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { name: 'Admin Dashboard', href: '/admin', icon: ShieldCheck, adminOnly: true },
  { name: 'Manage Matches', href: '/admin/matches', icon: Trophy, adminOnly: true },
  { name: 'Manage Picks', href: '/admin/picks', icon: ClipboardList, adminOnly: true },
  { name: 'Manage Slips', href: '/admin/slips', icon: Ticket, adminOnly: true },
  { name: 'Results Update', href: '/admin/results', icon: CheckCircle2, adminOnly: true },
];
