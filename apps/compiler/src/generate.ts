import postcss from "postcss";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer"

import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // const { classes, config, minify = true, autoprefixer = true } = JSON.parse(event.body);
  const body = JSON.parse(event.body);

  const style = String.raw`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* ... */
}

@layer components {
  /* ... */
}

@layer utilities {
  /* ... */
}`;

  const plugins = (body?.config?.plugins || []).map(plugin => require(plugin));

  const { css } = await postcss([
    ...((body.autoprefixer ?? true) && [autoprefixer()]),

    tailwindcss({
      content: [{ raw: String.raw`<div class="${body.classes.join(" ")}"></div>` }],
      ...(body.config || {}),

      plugins,
    }),

    ...((body.minify ?? true) && [cssnano()]),
  ]).process(style);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/css",
    },
    body: css,
  };
};
