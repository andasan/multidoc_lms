import { FONT_SIZES } from './doc-format.constants';
import { PDFType } from '@/types/pdf.types';
import { rgb } from 'pdf-lib';

// Assets
import footerLogo from '@/assets/logo.png';
import headerLogo from '@/assets/logo-horizontal.png';
import signature from '@/assets/director-signature.png';

export const TABLE_HEADERS_TITLE = ['#', 'Program ID', 'Program Name', 'Credit', 'Number\nGrade', 'Letter\nGrade', 'Credits Earned', 'GPA'];

export const DOCUMENT_TITLE = {
    [PDFType.Transcript]: 'Official Transcript of Academic Records',
    [PDFType.Invoice]: 'Invoice',
    [PDFType.Confirmation]: 'Confirmation of Completion',
}

export const DOCUMENT_TITLE_CONFIG = {
    fontSize: FONT_SIZES.header,
    offsetY: 120,
    x: {
        [PDFType.Invoice]: (width: number, titleWidth: number, left: number) => width - left - titleWidth,
        [PDFType.Confirmation]: (width: number, titleWidth: number) => (width - titleWidth) / 2,
        [PDFType.Transcript]: (width: number, titleWidth: number) => (width - titleWidth) / 2,
    },
    y: {
        [PDFType.Invoice]: (height: number) => height - 120,
        [PDFType.Confirmation]: (height: number) => height - 120,
        [PDFType.Transcript]: (height: number) => height - 115,
    }
}

export const CONTACT_INFO_CONFIG = {
    content: ['+1 (xxx) xxx-xxxx', 'info@multidoclms.com'],
    fontSize: 10,
    color: rgb(0, 0.3, 0.6),
    offsetY: 60,
    offsetX: 50,
    lineHeight: 12,
}

export const HEADER_LOGO_CONFIG = {
    src: headerLogo,
    alt: 'Multidoc Logo',
    width: 100,
    height: 100,
    x: 50,
    y: 50,
    scale: 0.36,
    offsetY: 30,
    offsetX: 50,
}


export const SIGNATURE_CONFIG = {
    [PDFType.Transcript]: {
        image: {
            offsetY: 0,
            offsetX: 20,
        },
        title: {
            content: 'MULTIDOC LMS',
            offsetY: 8,
            offsetX: 0,
        },
        subtitle: {
            content: 'OFFICIAL TRANSCRIPT',
            offsetY: 8,
            offsetX: 0,
        },
    },
    [PDFType.Confirmation]: {
        image: {
            offsetY: 20,
            offsetX: 20,
        },
        title: {
            content: 'Hoge Hoge',
            offsetY: 20,
            offsetX: 20,
        },
        subtitle: {
            content: 'Director | Multidoc LMS',
            offsetY: 10,
            offsetX: 20,
        },
    },
    [PDFType.Invoice]: {
        image: {
            offsetY: 0,
            offsetX: 0,
        },
        title: {
            content: 'MULTIDOC LMS',
            offsetY: 8,
            offsetX: 0,
        },
        subtitle: {
            content: 'Director | Multidoc LMS',
            offsetY: 10,
            offsetX: 20,
        },
    },
    src: signature,
    width: 100,
    height: 100,
    scale: 0.9,
}

export const FOOTER_LOGO_CONFIG = {
    src: footerLogo,
    alt: 'Multidoc Logo',
    width: 100,
    height: 100,
    x: 50,
    y: 65,
    scale: 0.15,
    offsetY: 5,
    offsetX: 50,
}

export const FOOTER_TEXT = [
    'Slogan',
    '#xxx-xxx Cloverdale St, City, State, Zipcode',
    'info@multidoclms.com'
];

export const FOOTER_TEXT_CONFIG = {
    fontSize: 10,
    color: rgb(0, 0.3, 0.6),
    offsetY: 60,
    offsetX: 50,
    lineHeight: 12,
}