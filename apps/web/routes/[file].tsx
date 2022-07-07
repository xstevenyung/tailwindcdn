/** @jsx h */
import { h } from "preact";
// import Counter from "../islands/Counter.tsx";
import { Handlers } from "$fresh/server.ts";
import { extname } from "https://deno.land/std/path/mod.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const base64 = ctx.params.file.replace(extname(ctx.params.file), "");
    const stylesheet = await fetch(Deno.env.get("COMPILER_URL") as string, {
      method: "POST",
      body: JSON.parse(atob(base64)),
    }).then(
      (response) => response.text(),
    );

    return new Response(stylesheet, {
      headers: {
        "Content-Type": "text/css",
      },
    });
  },
};

// export default function Home() {
//   return (
//     <div>
//       <img
//         src="/logo.svg"
//         height="100px"
//         alt="the fresh logo: a sliced lemon dripping with juice"
//       />
//       <p>
//         Welcome to `fresh`. Try update this message in the ./routes/index.tsx
//         file, and refresh.
//       </p>
//       <Counter start={3} />
//     </div>
//   );
// }
