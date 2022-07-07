/** @jsx h */
import { h } from "preact";
// import Counter from "../islands/Counter.tsx";
import { Handlers } from "$fresh/server.ts";
import { extname } from "https://deno.land/std/path/mod.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const base64 = ctx.params.file.replace(extname(ctx.params.file), "");

    let redis;
    if (Deno.env.get("REDIS_CACHE_ENABLED") === "true") {
      console.log("redis cache enabled");

      redis = await connect({
        hostname: Deno.env.get("REDIS_HOST") as string,
        port: Deno.env.get("REDIS_PORT"),
        tls: Deno.env.get("REDIS_TLS") === "true",
        password: Deno.env.get("REDIS_PASSWORD"),
      });
    }

    if (redis) {
      const cachedStylesheet = await redis.get(base64);
      if (cachedStylesheet) {
        return new Response(cachedStylesheet, {
          headers: { "Content-Type": "text/css" },
        });
      }
    }

    const stylesheet = await fetch(Deno.env.get("COMPILER_URL") as string, {
      method: "POST",
      body: JSON.parse(atob(base64)),
    }).then(
      (response) => response.text(),
    );

    if (redis) {
      redis.set(base64, stylesheet);
    }

    return new Response(stylesheet, {
      headers: {
        "Content-Type": "text/css",
      },
    });
  },
};
