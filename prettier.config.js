/** @type import('prettier').Config */
const config = {
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/app.css",
  tailwindFunctions: ["twMerge", "clsx", "cn", "cva"],
};
export default config;
