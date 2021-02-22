// rollup.config.js

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import del from "rollup-plugin-delete";
import dev from "rollup-plugin-dev";
import filesize from "rollup-plugin-filesize";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import progress from "rollup-plugin-progress";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: "src/index.js",
  output: [
    {
      //ES module version, for modern browsers
      dir: "dist/modules",
      name: "app",
      sourcemap: false,
      strict: false,
      format: "es",
    },
  ],
  plugins: [
    replace({
      values: {
        "process.env.NODE_ENV": production
          ? JSON.stringify("production")
          : JSON.stringify("development"),
      },
      preventAssigment: true,
    }),
    resolve({
      browser: true,
      extensions: [".js", ".jsx", ".json"],
    }),
    commonjs({ include: ["node_modules/**"] }),
    babel({
      exclude: "node_modules/**",
      presets: [
        ["@babel/preset-react"],
        ["@babel/preset-env", { loose: true }],
      ],
      plugins: ["@babel/plugin-syntax-dynamic-import"],
    }),
    postcss({
      plugins: [],
    }),
    !production &&
      dev({
        dirs: ["dist"],
        port: 3000,
        proxy: {
          "/*": "http://localhost:5000/",
        },
      }),
    production && del({ targets: "dist/modules/*" }),
    !production && livereload("dist"),
    image(),
    progress(),
    filesize(),
    production && terser(),
  ],
  preserveEntrySignatures: "false",
};
