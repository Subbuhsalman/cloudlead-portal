declare module 'react-i18next' {
  export interface TFunction {
    (key: string, options?: any): string;
  }
  
  export function useTranslation(): {
    t: TFunction;
    i18n: any;
  };
  
  export const initReactI18next: any;
}
