export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: string;
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
      title: 'Dashboard',
      url: '/',
      icon: 'lucideLayoutDashboard',
    },
    {
      title: 'Products',
      url: '/products',
      icon: 'lucidePackage',
      items: [
        { title: 'All products', url: '/products' },
        { title: 'Add product', url: '/products/new' },
      ],
    },
    {
      title: 'Orders',
      url: '/orders',
      icon: 'lucideShoppingCart',
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
