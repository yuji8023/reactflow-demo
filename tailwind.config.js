import commonConfig from './tailwind-common-config';
export default {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  ...commonConfig,
};
