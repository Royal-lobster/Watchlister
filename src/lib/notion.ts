import { Client } from "@notionhq/client";

export function createNotionClient(accessToken: string): Client {
  return new Client({ auth: accessToken });
}

// Notion property value extractors
export function extractTitle(properties: Record<string, any>): string {
  const title = Object.values(properties).find(
    (p) => p.type === "title"
  );
  return title?.title?.[0]?.plain_text ?? "Untitled";
}

export function extractMultiSelect(
  properties: Record<string, any>,
  key: string
): string[] {
  return properties[key]?.multi_select?.map((o: any) => o.name) ?? [];
}

export function extractUrl(
  properties: Record<string, any>,
  key: string
): string | null {
  return properties[key]?.url ?? null;
}

export function extractRichText(
  properties: Record<string, any>,
  key: string
): string {
  return (
    properties[key]?.rich_text?.[0]?.plain_text ?? ""
  );
}
