export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSecondaryItem {
  title: string;
  url: string;
  icon: string;
}

export interface NavProject {
  name: string;
  url: string;
  icon: string;
}

export interface SidebarUser {
  name: string;
  email: string;
}

export const sidebarData: {
  user: SidebarUser;
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
  projects: NavProject[];
} = {
  user: {
    name: 'spartan',
    email: 'hello@spartan.com',
  },
  navMain: [
    {
      title: 'Playground',
      url: '.',
      icon: 'lucideSquareTerminal',
      isActive: true,
      items: [
        { title: 'History', url: '.' },
        { title: 'Starred', url: '.' },
        { title: 'Settings', url: '.' },
      ],
    },
    {
      title: 'Products',
      url: '.',
      icon: 'lucideTag',
      items: [
        { title: 'Genesis', url: '.' },
        { title: 'Explorer', url: '.' },
        { title: 'Quantum', url: '.' },
      ],
    },
    {
      title: 'Settings',
      url: '.',
      icon: 'lucideSettings2',
      items: [
        { title: 'General', url: '.' },
        { title: 'Team', url: '.' },
        { title: 'Billing', url: '.' },
        { title: 'Limits', url: '.' },
      ],
    },
  ],
  navSecondary: [
    { title: 'Support', url: '.', icon: 'lucideLifeBuoy' },
    { title: 'Feedback', url: '.', icon: 'lucideSend' },
  ],
  projects: [
    { name: 'Design Engineering', url: '.', icon: 'lucideFrame' },
    { name: 'Sales & Marketing', url: '.', icon: 'lucideChartPie' },
    { name: 'Travel', url: '.', icon: 'lucideMap' },
  ],
};
