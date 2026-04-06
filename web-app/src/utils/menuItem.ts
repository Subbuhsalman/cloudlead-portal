export const menuItems = [
  {
    label: "New Chat",
    icon: "pi pi-book",
    link: '/dashboard/files',
    },
  
  
];



function extractLinks(menu: any) {
  let links: any = [];

  menu.forEach((item: any) => {
    if (item.link) {
      links.push(item.link);
    }

    if (item.submenu) {
      links = links.concat(extractLinks(item.submenu));
    }
  });

  return links;
}

export const allPrivateRoutes = extractLinks(menuItems).filter((item: string) => item !== "#");
export const dashboardHome = allPrivateRoutes[0]
export const publicPaths = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verification', '/auth/create-password'];
export const protectedRedirectionUrl = '/auth/login';


