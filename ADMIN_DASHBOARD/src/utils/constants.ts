

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
export const BASE_URL_ENDPOINT = process.env.NEXT_PUBLIC_BASE_URL_ENDPOINT
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL
export const ENVIRONMENT_PROD = !(process.env.NODE_ENV === "development")
export const ENVIRONMENT_DEV = !(process.env.NODE_ENV === "development")

export const APP_NAME=process.env.NEXT_PUBLIC_APP_NAME
export const THEME_COLOR =process.env.NEXT_PUBLIC_THEME_COLOR
export const APP_LOGO =process.env.NEXT_PUBLIC_THEME_LOGO




export const VALIDITY_TYPES = [
  { key: "Day", value: "DAY" },
  { key: "Month", value: "MONTH" },
  { key: "Week", value: "WEEK" },
  { key: "Year", value: "YEAR" }
];


export const formTypes = [
  { name: "Form", key: "form", id: 1 },
  { name: "Survey", key: "survey", id: 2 },
  { name: "Training", key: "training", id: 3 },
  { name: "Exam / Quiz", key: "exam", id: 4 },
  { name: "Policies", key: "policies", id: 5 },
  { name: "Page", key: "page", id: 6 },
  { name: "pdf", key: "pdf", id: 7 },
  { name: "Service", key: "service", id: 8 },
];
  