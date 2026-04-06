export const menuItems = [
  {
    label: "Admin Users",
    icon: "pi pi-book",
    link: "/admin-users",
  },
  {
    label: "Users",
    icon: "pi pi-users",
    link: "/users",
  },
  {
    label: "File Processing",
    icon: "pi pi-file",
    link: "/file-processing",
  },
  // {
  //   label: "Mail All",
  //   icon: "pi pi-chart-line",
  //   badge: { severity: "danger" },
  //   link: "#",
  //   submenu: [
  //     {
  //       label: "Google Connected Accounts",
  //       icon: "pi pi-chart-line",
  //       link: "/mail-all/google-connected-accounts",
  //     },
  //   ],
  // },

  // {
  //   label: "Board Wala",
  //   icon: "pi pi-chart-line",
  //   badge: { severity: "danger" },
  //   link: "#",
  //   submenu: [
  //     {
  //       label: "Assessments",
  //       icon: "pi pi-chart-line",
  //       link: "/lms/assessments",
  //     },
  //     {
  //       label: "Tasks",
  //       icon: "pi pi-chart-line",
  //       link: "/lms/tasks",
  //     },
  //     {
  //       label: "Templates",
  //       icon: "pi pi-chart-line",
  //       link: "/lms/template",
  //     },
  //     {
  //       label: "Categories",
  //       icon: "pi pi-chart-line",
  //       link: "/category",
  //     },
  //     {
  //       label: "Orders",
  //       icon: "pi pi-chart-line",
  //       link: "/order",
  //     },
  //   ],
  // },

  

  // {
  //   label: "Cloud Lead",
  //   icon: "pi pi-chart-line",
  //   badge: { severity: "danger" },
  //   link: "#",
  //   submenu: [
  //     {
  //       label: "Enrichments",
  //       icon: "pi pi-chart-line",
  //       link: "/cloud-lead/enrichments",
  //     },
  //     {
  //       label: "Custom Leads",
  //       icon: "pi pi-chart-line",
  //       link: "/cloud-lead/custom-lead-request",
  //     }
  //   ],
  // },

  // {
  //   label: "Search",
  //   icon: "pi pi-search",
  //   link: "/search",
  // },
  // {
  //   label: "Team",
  //   icon: "pi pi-users",
  //   link: "#",
  // },
  // {
  //   label: "Cloud Lead",
  //   icon: "pi pi-chart-line",
  //   badge: { severity: "danger" },
  //   link: "#",
  //   submenu: [
  //     {
  //       label: "Revenue",
  //       icon: "pi pi-chart-line",
  //       link: "#",
  //       submenu: [
  //         {
  //           label: "View",
  //           icon: "pi pi-table",
  //           link: "/view",
  //         },
  //         {
  //           label: "Search",
  //           icon: "pi pi-search",
  //           link: "#",
  //         },
  //       ],
  //     },
  //     {
  //       label: "Expenses",
  //       icon: "pi pi-chart-line",
  //       link: "#",
  //     },
  //   ],
  // },
  // {
  //   label: "Events",
  //   icon: "pi pi-calendar",
  //   link: "#",
  // },
  // {
  //   label: "Options",
  //   icon: "pi pi-cog",
  //   link: "#",
  // },
];



function extractLinks(menu:any) {
  let links:any = [];
  
  menu.forEach((item:any) => {
      if (item.link) {
          links.push(item.link);
      }
      
      if (item.submenu) {
          links = links.concat(extractLinks(item.submenu));
      }
  });
  
  return links;
}

export const allPrivateRoutes = extractLinks(menuItems).filter((item:string)=> item !== "#" );