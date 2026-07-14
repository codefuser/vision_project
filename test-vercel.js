import handler from "./.vercel/output/functions/__server.func/index.mjs";

async function main() {
  const req = new Request("https://vision-project-taupe.vercel.app/library");
  const context = {};
  const res = await handler.fetch(req, context);
  console.log("Status:", res.status);
  const body = await res.text();
  console.log("Body length:", body.length);
  if (res.status === 500) {
    console.log("Body preview:", body.substring(0, 500));
  }
}
main().catch(console.error);
