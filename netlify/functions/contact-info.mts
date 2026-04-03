import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

const STORE_NAME = "contact-info";
const DATA_KEY = "settings";

interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  address: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  email: "info@blenderdesignstudio.com",
  phone: "",
  whatsapp: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  address: "",
};

export default async (req: Request, context: Context) => {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get(DATA_KEY, { type: "json" });
    return Response.json(data || DEFAULT_CONTACT);
  }

  if (req.method === "PUT") {
    const body = await req.json() as Partial<ContactInfo>;
    const current = (await store.get(DATA_KEY, { type: "json" }) as ContactInfo | null) || DEFAULT_CONTACT;
    const updated = { ...current, ...body };
    await store.setJSON(DATA_KEY, updated);
    return Response.json(updated);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/contact-info",
  method: ["GET", "PUT"],
};
