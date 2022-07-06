import postcss from "postcss";
import tailwindcss from "tailwindcss";

import { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
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

  const classes = ["bg-green-500"];

  const config = {
    content: [{ raw: String.raw`<div class="${classes.join(" ")}"></div>` }],
  };

  const { css } = await postcss(tailwindcss(config)).process(style);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/css",
    },
    body: css,
  };
};
