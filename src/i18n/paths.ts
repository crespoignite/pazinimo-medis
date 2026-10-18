import { locales } from './index';
export const langPaths = () => locales.map((lang) => ({ params: { lang } }));
