import { Request } from 'express';

interface ICustomIExtendedRequestProperties {
  requestStartTime?: number;
  method?: string;
  headers?: any;
  protocol?: string; // Optional protocol property
  baseUrl?: string;
  url?: string;
  body?: any;
  params: any;
  query: any;
  socket: any;
}

export type IExtendedRequest = Request & ICustomIExtendedRequestProperties;