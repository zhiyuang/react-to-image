import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/react-to-image.es.js",
        format: "es",
      },
      {
        file: "dist/react-to-image.cjs.js",
        format: "cjs",
        exports: "named",
      },
    ],
    plugins: [
      typescript(),
      replace({
        preventAssignment: true,
        BROWSER: JSON.stringify(false),
      }),
    ],
    external: [
      "canvas",
      "react-reconciler",
      "react-reconciler/constants",
      "@react-pdf/stylesheet",
      "@react-pdf/yoga/dist/index",
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/react-to-image.browser.es.js",
        format: "es",
      },
      {
        file: "dist/react-to-image.browser.cjs.js",
        format: "cjs",
        exports: "named",
      },
    ],
    plugins: [
      typescript(),
      replace({
        preventAssignment: true,
        BROWSER: JSON.stringify(true),
      }),
    ],
    external: [
      "canvas",
      "react-reconciler",
      "react-reconciler/constants",
      "@react-pdf/stylesheet",
      "@react-pdf/yoga/dist/index",
    ],
  },
];
