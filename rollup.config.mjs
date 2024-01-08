import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "es",
  },
  plugins: [typescript()],
  external: [
    "canvas",
    "react-reconciler",
    "react-reconciler/constants",
    "@react-pdf/stylesheet",
    "@react-pdf/yoga/dist/index",
  ],
};
