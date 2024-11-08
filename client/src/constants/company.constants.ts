import Logo from '@/assets/logo.png';
import { CompanyDetails, CompanyInfoItem } from '@/types/company.types';

export const COMPANY_LOGO = Logo;

export const COMPANY_DETAILS: CompanyDetails = {
  name: 'Multidoc LMS',
  address1: '#xxx-xxx Cloverdale St',
  address2: 'City, State, Zipcode',
  phone: '(xxx) xxx-xxxx',
  email: 'info@multidoclms.com',
} as const;

export const COMPANY_INFO: CompanyInfoItem[] = [
  { text: COMPANY_DETAILS.name, bold: true },
  { text: COMPANY_DETAILS.address1, bold: false },
  { text: COMPANY_DETAILS.address2, bold: false },
  { text: COMPANY_DETAILS.phone, bold: false },
  { text: COMPANY_DETAILS.email, bold: false },
];