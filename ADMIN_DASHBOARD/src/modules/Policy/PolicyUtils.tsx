import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import React from 'react'

export const toSnakeCase = (msg:string) => {
  const matches = msg?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  return matches ? matches.map(x => x.toLowerCase()).join('_') : '';
}
export const defaultNodes = [
  {
    key: 'visitors',
    label: 'Visitors',
    children: [
      {
        key: 'visitors-settings',
        label: 'Settings'
      },
      {
        key: 'visitors-reports',
        label: 'Reports'
      },
      {
        key: 'visitors-analytics',
        label: 'Analytics'
      }
    ]
  },
  {
    key: 'marketing',
    label: 'Marketing',
    children: [
      {
        key: 'marketing-settings',
        label: 'Settings'
      },
      {
        key: 'marketing-campaigns',
        label: 'Campaigns'
      },
      {
        key: 'marketing-leads',
        label: 'Leads'
      }
    ]
  },
  {
    key: 'sales',
    label: 'Sales',
    children: [
      {
        key: 'sales-settings',
        label: 'Settings'
      },
      {
        key: 'sales-reports',
        label: 'Reports'
      },
      {
        key: 'sales-forecasting',
        label: 'Forecasting'
      }
    ]
  },
  {
    key: 'seo',
    label: 'SEO',
    children: [
      {
        key: 'seo-settings',
        label: 'Settings'
      },
      {
        key: 'seo-audit',
        label: 'Audit'
      },
      {
        key: 'seo-optimization',
        label: 'Optimization'
      }
    ]
  }
];
const handleTreeChange = (e: any, key: any , updatePermission:any,productSystemModuleTree:any,setProductSystemModuleTree:any , setSelectedTreeData:any,getSelectedDataOnly:any) => {
  const updatedTree = updatePermission(productSystemModuleTree, key, e.value);
  setProductSystemModuleTree(updatedTree);
  setSelectedTreeData(getSelectedDataOnly(updatedTree))

};

export const treeNodes3 = [
  {
    key: 'admin.dashboard',
    label: 'DASHBOARD',
    data: '/admin/dashboard',
  },
  {
    key: 'workflow',
    label: 'WORKFLOW',
    children: [
      {
        key: 'admin.workflow',
        label: 'All',
        data: '/admin/workflow',
      },
      {
        key: 'workflow-settings',
        label: 'Settings',
        children: [
          {
            key: 'admin.workflow.settings.workflow-asset',
            label: 'Assets',
            data: '/admin/workflow/settings/workflow-asset',
          },
          {
            key: 'admin.workflow.settings.workflow-segment',
            label: 'Segments',
            data: '/admin/workflow/settings/workflow-segment',
          },
          {
            key: 'admin.workflow.settings.workflow-event',
            label: 'Events',
            data: '/admin/workflow/settings/workflow-event',
          },
          {
            key: 'admin.workflow.settings.workflow-action',
            label: 'Actions',
            data: '/admin/workflow/settings/workflow-action',
          },
        ],
      },
    ],
  },
  {
    key: 'lead-generation',
    label: 'LEAD GENERATION',
    children: [
      {
        key: 'admin.data-mining.lead-data-mining',
        label: 'Lead Data Mining',
        data: '/admin/data-mining/lead-data-mining',
      },
      {
        key: 'admin.data-mining.people-record',
        label: 'People',
        data: '/admin/data-mining/people-record',
      },
      {
        key: 'admin.data-mining.people-record',
        label: 'Organization',
        data: '/admin/data-mining/people-record',
      },
    ],
  },
  {
    key: 'journeys',
    label: 'JOURNEYS',
    children: [
      {
        key: 'admin.customer-journey',
        label: 'All',
        data: '/admin/customer-journey',
      },
    ],
  },
  {
    key: 'marketing',
    label: 'MARKETING',
    children: [
      {
        key: 'seo',
        label: 'SEO',
        children: [
          {
            key: 'admin.marketing.seo.marketing-seo-site',
            label: 'Sites',
            data: '/admin/marketing/seo/marketing-seo-site',
          },
          {
            key: 'admin.marketing.seo.marketing-seo-site-link',
            label: 'Site Links',
            data: '/admin/marketing/seo/marketing-seo-site-link',
          },
          {
            key: 'admin.marketing.seo.marketing-seo-site-crawl-link',
            label: 'Crawl Links',
            data: '/admin/marketing/seo/marketing-seo-site-crawl-link',
          },
          {
            key: 'admin.marketing.seo.marketing-seo-site-crawl',
            label: 'Crawlers',
            data: '/admin/marketing/seo/marketing-seo-site-crawl',
          },
          {
            key: 'admin.marketing.seo.search-engine-keyword',
            label: 'Search engine keyword',
            data: '/admin/marketing/seo/search-engine-keyword',
          },
        ],
      },
      {
        key: 'email-nurturing',
        label: 'Email Nurturing',
        children: [
          {
            key: 'admin.marketing.nurturing.campaigns',
            label: 'Campaigns',
            data: '/admin/marketing/nurturing/campaigns',
          },
          {
            key: 'admin.marketing.nurturing.mailbox',
            label: 'Mailbox',
            data: '/admin/marketing/nurturing/mailbox',
          },
        ],
      },
      {
        key: 'marketing-settings',
        label: 'Settings',
        children: [
          {
            key: 'admin.marketing.settings.trigger',
            label: 'Trigger',
            data: '/admin/marketing/settings/trigger',
          },
          {
            key: 'admin.marketing.settings.action',
            label: 'Action',
            data: '/admin/marketing/settings/action',
          },
        ],
      },
    ],
  },
  {
    key: 'sales',
    label: 'SALES',
    children: [
      {
        key: 'prospects',
        label: 'Prospects',
        children: [
          {
            key: 'admin.sales.prospects.all',
            label: 'All',
            data: '/admin/sales/prospects/all',
          },
          {
            key: 'admin.sales.prospects.plg',
            label: 'PLG',
            data: '/admin/sales/prospects/plg',
          },
          {
            key: 'admin.sales.prospects.slg',
            label: 'SLG',
            data: '/admin/sales/prospects/slg',
          },
          {
            key: 'admin.sales.leads.import',
            label: 'Import',
            data: '/admin/sales/leads/import',
          },
        ],
      },
      {
        key: 'leads',
        label: 'Lead',
        children: [
          {
            key: 'admin.sales.leads.dashboard',
            label: 'Dashboard',
            data: '/admin/sales/leads/dashboard',
          },
          {
            key: 'admin.sales.leads',
            label: 'Leads',
            data: '/admin/sales/leads',
          },
          {
            key: 'leads-settings',
            label: 'Settings',
            children: [
              {
                key: 'admin.sales.leads.settings.channel-category',
                label: 'Channel Category',
                data: '/admin/sales/leads/settings/channel-category',
              },
              {
                key: 'admin.sales.leads.settings.channel-category-type',
                label: 'Channel Category Type',
                data: '/admin/sales/leads/settings/channel-category-type',
              },
              {
                key: 'admin.sales.leads.settings.follow-up-type',
                label: 'Follow up Type',
                data: '/admin/sales/leads/settings/follow-up-type',
              },
              {
                key: 'admin.sales.leads.settings.label',
                label: 'Label',
                data: '/admin/sales/leads/settings/label',
              },
              {
                key: 'admin.sales.leads.settings.method',
                label: 'Method',
                data: '/admin/sales/leads/settings/method',
              },
              {
                key: 'admin.sales.leads.settings.sales-pipeline',
                label: 'Sales Pipeline',
                data: '/admin/sales/leads/settings/sales-pipeline',
              },
              {
                key: 'admin.sales.leads.settings.status-stage',
                label: 'Status Stage',
                data: '/admin/sales/leads/settings/status-stage',
              },
              {
                key: 'admin.sales.leads.settings.sales-settings-lead-pipeline-template',
                label: 'Pipeline template',
                data: '/admin/sales/leads/settings/sales-settings-lead-pipeline-template',
              },
            ],
          },
        ],
      },
      {
        key: 'admin.sales.opportunities',
        label: 'Opportunities',
        data: '/admin/sales/opportunities',
      },
      {
        key: 'admin.sales.forecast',
        label: 'Forecast',
        data: '/admin/sales/forecast',
      },
      {
        key: 'admin.sales.deals',
        label: 'Deals',
        data: '/admin/sales/deals',
      },
    ],
  },
  {
    key: 'admin.organization',
    label: 'ORGANIZATION',
    data: '/admin/organization',
  },
  {
    key: 'organization-settings',
    label: 'Settings',
    children: [
      {
        key: 'admin.organization-settings.departments',
        label: 'Departments',
        data: '/admin/organization-settings/departments',
      },
      {
        key: 'admin.organization-settings.roles',
        label: 'Roles',
        data: '/admin/organization-settings/roles',
      },
      {
        key: 'admin.organization-settings.teams',
        label: 'Teams',
        data: '/admin/organization-settings/teams',
      },
    ],
  },
  {
    key: 'admin.settings',
    label: 'SETTINGS',
    data: '/admin/settings',
  },
];
export const treeNodes = [
  {
    label: "DASHBOARD",
    icon: "pi-home",
    link: "/dashboard",
    key: "dashboard"
  },
  {
    label: "WORKFLOW",
    icon: "pi-home",
    key: "workflow",
    children: [
      {
        label: "All",
        icon: "pi-home",
        link: "/workflow",
        key: "workflow"
      },
      {
        label: "Settings",
        key: "workflow.settings",
        children: [
          {
            label: "Assets",
            icon: "pi-home",
            link: "/workflow/settings/workflow-asset",
            key: "workflow.settings.workflow_asset"
          },
          {
            label: "Segments",
            icon: "pi-home",
            link: "/workflow/settings/workflow-segment",
            key: "workflow.settings.workflow_segment"
          },
          {
            label: "Events",
            icon: "pi-home",
            link: "/workflow/settings/workflow-event",
            key: "workflow.settings.workflow_event"
          },
          {
            label: "Actions",
            icon: "pi-home",
            link: "/workflow/settings/workflow-action",
            key: "workflow.settings.workflow_action"
          }
        ]
      }
    ]
  },
  {
    label: "LEAD GENERATION",
    icon: "pi-users",
    key: "lead_generation",
    children: [
      {
        label: "Lead Data Mining",
        icon: "pi-home",
        link: "/data-mining/lead-data-mining",
        key: "data_mining.lead_data_mining"
      },
      {
        label: "People",
        icon: "pi-user",
        link: "/data-mining/people-record",
        key: "data_mining.people_record"
      },
      {
        label: "Organization",
        icon: "pi-warehouse",
        link: "/data-mining/people-record",
        key: "data_mining.people_record"
      }
    ]
  },
  {
    icon: "pi-sparkles",
    label: "JOURNEYS",
    key: "journeys",
    children: [
      {
        label: "All",
        link: "/customer-journey",
        key: "customer_journey"
      }
    ]
  },
  {
    icon: "pi-sparkles",
    label: "MARKETING",
    key: "marketing",
    children: [
      {
        label: "SEO",
        key: "marketing.seo",
        children: [
          {
            label: "Sites",
            icon: "pi-bookmark",
            link: "/marketing/seo/marketing-seo-site",
            key: "marketing.seo.marketing_seo_site"
          },
          {
            label: "Site Links",
            icon: "pi-bookmark",
            link: "/marketing/seo/marketing-seo-site-link",
            key: "marketing.seo.marketing_seo_site_link"
          },
          {
            label: "Crawl Links",
            icon: "pi-bookmark",
            link: "/marketing/seo/marketing-seo-site-crawl-link",
            key: "marketing.seo.marketing_seo_site_crawl_link"
          },
          {
            label: "Crawlers",
            icon: "pi-bookmark",
            link: "/marketing/seo/marketing-seo-site-crawl",
            key: "marketing.seo.marketing_seo_site_crawl"
          },
          {
            label: "Search engine keyword",
            icon: "pi-bookmark",
            link: "/marketing/seo/search-engine-keyword",
            key: "marketing.seo.search_engine_keyword"
          }
        ]
      },
      {
        label: "Email Nurturing",
        key: "marketing.email_nurturing",
        children: [
          {
            label: "Campaigns",
            icon: "pi-bookmark",
            link: "/marketing/nurturing/campaigns",
            key: "marketing.nurturing.campaigns"
          },
          {
            label: "Mailbox",
            icon: "pi-bookmark",
            link: "/marketing/nurturing/mailbox",
            key: "marketing.nurturing.mailbox"
          }
        ]
      },
      {
        label: "Marketing video",
        link: "/marketing/marketing-video",
        key: "marketing.marketing_video"
      },
      {
        label: "Settings",
        key: "marketing.settings",
        children: [
          {
            label: "Trigger",
            icon: "pi-bookmark",
            link: "/marketing/settings/trigger",
            key: "marketing.settings.trigger"
          },
          {
            label: "Action",
            icon: "pi-bookmark",
            link: "/marketing/settings/action",
            key: "marketing.settings.action"
          }
        ]
      }
    ]
  },
  {
    icon: "pi-trophy",
    label: "SALES",
    key: "sales",
    children: [
      {
        icon: "FaFileAlt",
        label: "Prospects",
        key: "sales.prospects",
        children: [
          {
            icon: "FaFileAlt",
            label: "All",
            link: "/sales/prospects/all",
            key: "sales.prospects.all"
          },
          {
            icon: "FaFileAlt",
            label: "PLG",
            link: "/sales/prospects/plg",
            key: "sales.prospects.plg"
          },
          {
            icon: "FaFileAlt",
            label: "SLG",
            link: "/sales/prospects/slg",
            key: "sales.prospects.slg"
          },
          {
            label: "Import",
            icon: "pi-phone",
            link: "/sales/leads/import",
            key: "sales.leads.import"
          }
        ]
      },
      {
        label: "Lead",
        key: "sales.lead",
        children: [
          {
            icon: "FaUsers",
            label: "Dashboard",
            link: "/sales/leads/dashboard",
            key: "sales.leads.dashboard"
          },
          {
            icon: "FaUsers",
            label: "Leads",
            link: "/sales/leads",
            key: "sales.leads"
          },
          {
            label: "Settings",
            key: "sales.lead.settings",
            children: [
              {
                label: "Channel Category",
                icon: "FaTags",
                link: "/sales/leads/settings/channel-category",
                key: "sales.leads.settings.channel_category"
              },
              {
                label: "Channel Category Type",
                icon: "FaTags",
                link: "/sales/leads/settings/channel-category-type",
                key: "sales.leads.settings.channel_category_type"
              },
              {
                label: "Follow up Type",
                icon: "FaReply",
                link: "/sales/leads/settings/follow-up-type",
                key: "sales.leads.settings.follow_up_type"
              },
              {
                label: "Label",
                icon: "FaTags",
                link: "/sales/leads/settings/label",
                key: "sales.leads.settings.label"
              },
              {
                label: "Method",
                icon: "FaBullseye",
                link: "/sales/leads/settings/method",
                key: "sales.leads.settings.method"
              },
              {
                label: "Sales Pipeline",
                icon: "FaExclamationCircle",
                link: "/sales/leads/settings/sales-pipeline",
                key: "sales.leads.settings.sales_pipeline"
              },
              {
                label: "Status Stage",
                icon: "FaListUl",
                link: "/sales/leads/settings/status-stage",
                key: "sales.leads.settings.status_stage"
              },
              {
                label: "Pipeline template",
                icon: "FaListUl",
                link: "/sales/leads/settings/sales-settings-lead-pipeline-template",
                key: "sales.leads.settings.sales_settings_lead_pipeline_template"
              },
              {
                label: "Status Stage Checklist",
                icon: "FaTasks",
                link: "/sales/leads/settings/status-stage-checklist",
                key: "sales.leads.settings.status_stage_checklist"
              },
              {
                label: "Sale Region",
                icon: "FaGlobe",
                link: "/sales/options/sale-region",
                key: "sales.options.sale_region"
              }
            ]
          }
        ]
      },
      {
        label: "Deals",
        key: "sales.deals",
        children: [
          {
            icon: "FaHandshake",
            label: "Deals",
            link: "/sales/deals",
            key: "sales.deals"
          },
          {
            label: "Settings",
            key: "sales.deals.settings",
            children: [
              {
                label: "Probability",
                link: "/sales/deals/settings/deal-probability",
                key: "sales.deals.settings.deal_probability"
              },
              {
                label: "Pipeline",
                link: "/sales/deals/settings/pipeline",
                key: "sales.deals.settings.pipeline"
              },
              {
                label: "Pipeline Stage",
                link: "/sales/deals/settings/pipeline-stage",
                key: "sales.deals.settings.pipeline_stage"
              }
            ]
          }
        ]
      },
      {
        icon: "FaFileAlt",
        label: "Proposals",
        link: "/sales/proposals",
        key: "sales.proposals"
      },
      {
        icon: "FaComments",
        label: "Conversations",
        link: "/sales/conversations",
        key: "sales.conversations"
      },
      {
        icon: "FaAddressBook",
        label: "Contact",
        link: "/sales/sales-contact",
        key: "sales.sales_contact"
      },
      {
        label: "Currency",
        link: "/sales/currency",
        key: "sales.currency"
      },
      {
        icon: "FaUser",
        label: "Customer",
        link: "/sales/customer",
        key: "sales.customer"
      },
      {
        icon: "FaUser",
        label: "Sales Person",
        link: "/sales/sales-person",
        key: "sales.sales_person"
      },
      {
        label: "Goals & Target",
        key: "sales.goals_target",
        children: [
          {
            label: "Goals & Target",
            link: "/sales/goals-and-target",
            key: "sales.goals_and_target"
          },
          {
            label: "Settings",
            key: "sales.goals_target.settings",
            children: [
              {
                label: "Goal Types",
                icon: "FaBullseyeArrow",
                link: "/sales/options/goaltypes",
                key: "sales.options.goaltypes"
              },
              {
                label: "Target Types",
                icon: "FaBullseyeArrow",
                link: "/sales/options/target-types",
                key: "sales.options.target_types"
              }
            ]
          }
        ]
      },
      {
        label: "Organization",
        key: "sales.organization",
        children: [
          {
            icon: "FaHandshake",
            label: "Organization",
            link: "/sales/organization",
            key: "sales.organization"
          },
          {
            label: "Settings",
            key: "sales.organization.settings",
            children: [
              {
                label: "Business Type",
                icon: "FaFolderOpen",
                link: "/sales/organization/settings/organizationbusinesstype",
                key: "sales.organization.settings.organizationbusinesstype"
              },
              {
                label: "Industries",
                icon: "pi Industry",
                link: "/sales/options/industries",
                key: "sales.options.industries"
              }
            ]
          }
        ]
      },
      {
        icon: "FaMoneyBillAlt",
        label: "Pricebook",
        link: "/sales/pricebook",
        key: "sales.pricebook"
      },
      {
        icon: "FaShoppingCart",
        label: "Reseller",
        link: "/sales/reseller",
        key: "sales.reseller"
      },
      {
        label: "Options",
        key: "sales.options",
        children: [
          {
            label: "Activity Type",
            icon: "FaCalendar",
            link: "/sales/options/activity-type",
            key: "sales.options.activity_type"
          }
        ]
      },
      {
        label: "Products",
        key: "sales.products",
        children: [
          {
            label: "All Products",
            icon: "pi FaArchive",
            link: "/sales/products/all",
            key: "sales.products.all"
          },
          {
            label: "Settings",
            key: "sales.products.settings",
            children: [
              {
                label: "Attribute",
                icon: "FaFolderOpen",
                link: "/sales/products/settings/attributes",
                key: "sales.products.settings.attributes"
              },
              {
                label: "Categories",
                icon: "FaFolderOpen",
                link: "/sales/products/settings/categories",
                key: "sales.products.settings.categories"
              },
              {
                label: "Services",
                icon: "FaFolderOpen",
                link: "/sales/products/settings/services",
                key: "sales.products.settings.services"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    icon: "pi-globe",
    label: "VISITORS",
    key: "visitors",
    children: [
      {
        label: "Dashboard",
        icon: "pi-home",
        link: "/visitor-tracking/dashboard",
        key: "visitor_tracking.dashboard"
      },
      {
        label: "Visitors",
        icon: "pi-bookmark",
        link: "/visitor-tracking/visitors",
        key: "visitor_tracking.visitors"
      },
      {
        label: "Sessions",
        icon: "pi-bookmark",
        link: "/visitor-tracking/sessions",
        key: "visitor_tracking.sessions"
      },
      {
        label: "Page Views",
        icon: "pi-bookmark",
        link: "/visitor-tracking/page-view",
        key: "visitor_tracking.page_view"
      },
      {
        label: "IP Address",
        icon: "pi-bookmark",
        link: "/visitor-tracking/ip-address",
        key: "visitor_tracking.ip_address"
      },
      {
        label: "Blacklist",
        icon: "pi-bookmark",
        link: "/visitor-tracking/ip-address-blacklist",
        key: "visitor_tracking.ip_address_blacklist"
      },
      {
        label: "Visitor Session Form",
        icon: "pi-bookmark",
        link: "/visitor-tracking/website-visitor-session-form",
        key: "visitor_tracking.website_visitor_session_form"
      },
      {
        label: "Settings",
        icon: "pi-bookmark",
        link: "/visitor-tracking/settings",
        key: "visitor_tracking.settings"
      }
    ]
  },
  {
    icon: "pi-phone",
    label: "VOICE CALLS",
    key: "voice_calls",
    children: [
      {
        label: "Calls",
        icon: "pi-phone",
        link: "/voip/voice-call",
        key: "voip.voice_call"
      },
      {
        label: "Settings",
        icon: "pi-cogs",
        key: "voice_calls.settings",
        children: [
          {
            label: "VoIP Accounts",
            icon: "pi-phone",
            link: "/voip/settings/voip-account",
            key: "voip.settings.voip_account"
          },
          {
            label: "Providers",
            icon: "pi-phone",
            link: "/voip/settings/voip-provider",
            key: "voip.settings.voip_provider"
          }
        ]
      }
    ]
  },
  {
    icon: "pi-comment",
    label: "LIVE CHAT",
    key: "live_chat",
    children: [
      {
        label: "Overview",
        icon: "pi-phone",
        link: "/live-chat/dashboard",
        key: "livechat.dashboard"
      },
      {
        label: "Online - visitors",
        icon: "pi-phone",
        link: "/live-chat/visitors",
        key: "live_chat.visitors"
      },
      {
        label: "Queued chats",
        icon: "pi-phone",
        link: "/live-chat/queue",
        key: "live_chat.queue"
      },
      {
        label: "Active chats",
        icon: "pi-phone",
        link: "/live-chat",
        key: "live_chat"
      },
      {
        label: "Agents",
        icon: "pi-phone",
        link: "/livechats/agents",
        key: "livechats.agents"
      },
      {
        label: "Settings",
        icon: "pi-cogs",
        key: "live_chat.settings",
        children: [
          {
            label: "General",
            icon: "pi-phone",
            link: "/live-chat/settings/general",
            key: "livechat.settings.general"
          },
          {
            label: "Agents",
            icon: "pi-phone",
            link: "/live-chat/settings/agents",
            key: "livechat.settings.agents"
          }
        ]
      }
    ]
  },
  {
    icon: "pi-calendar",
    label: "CALENDAR",
    key: "calendar",
    children: [
      {
        label: "All",
        icon: "pi-phone",
        link: "/calendar",
        key: "calendar"
      }
    ]
  },
  {
    icon: "pi-calendar",
    label: "HELPDESK",
    key: "helpdesk",
    children: [
      {
        label: "Desks",
        icon: "pi-comments",
        link: "/help-desk",
        key: "help_desk"
      },
      {
        label: "Tickets",
        icon: "pi-comments",
        link: "/help-desk-ticket",
        key: "help_desk_ticket"
      },
      {
        label: "Settings",
        key: "helpdesk.settings",
        children: [
          {
            label: "Email Channel",
            icon: "pi-envelope",
            link: "/help-desk/settings/email-channel",
            key: "help_desk.settings.email_channel"
          },
          {
            label: "Channel Type",
            icon: "pi-envelope",
            link: "/help-desk/settings/helpdesk-channel-type",
            key: "help_desk.settings.helpdesk_channel_type"
          },
          {
            label: "Channel",
            icon: "pi-envelope",
            link: "/help-desk/settings/help-desk-channel",
            key: "help_desk.settings.help_desk_channel"
          },
          {
            label: "Departments",
            icon: "pi-envelope",
            link: "/help-desk/settings/help-desk-department",
            key: "help_desk.settings.help_desk_department"
          },
          {
            label: "Teams",
            icon: "pi-envelope",
            link: "/help-desk/settings/help-desk-team",
            key: "help_desk.settings.help_desk_team"
          },
          {
            label: "Users",
            icon: "pi-envelope",
            link: "/help-desk/settings/help-desk-user",
            key: "help_desk.settings.help_desk_user"
          }
        ]
      }
    ]
  },
  {
    icon: "pi-calendar",
    label: "TASKS",
    key: "tasks",
    children: [
      {
        label: "Task",
        icon: "pi-phone",
        link: "/task",
        key: "task"
      }
    ]
  },
  {
    icon: "pi-cog",
    label: "SETTINGS",
    key: "settings",
    children: [
      {
        label: "Custom attribute",
        icon: "pi-phone",
        link: "/custom-attribute",
        key: "custom_attribute"
      },
      {
        label: "Api keys",
        icon: "pi-phone",
        link: "/api-key",
        key: "api_key"
      },
      {
        label: "Integrations",
        icon: "pi-phone",
        link: "/user-integration",
        key: "user_integration"
      },
      {
        label: "Roles",
        icon: "pi-phone",
        link: "/role",
        key: "role"
      }
    ]
  }
];

