export async function GET(request: Request) {
  let country = request.headers.get("x-vercel-ip-country") || undefined;
  if (!country) {
    try {
      const geo = JSON.parse(request.headers.get("x-nf-geo") || "{}");
      country = typeof geo.country === "string" ? geo.country : undefined;
    } catch {}
  }
  if (country && !/^[a-z]{2}$/i.test(country)) country = undefined;
  return Response.json(
    { geo: country ? { country: country.toUpperCase() } : {} },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
