import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Recommendation = {
  id: string;
  text: string;
  createdAt: string;
};

const FILE_PATH = "data/recommendations.json";
const MAX_ITEMS = 50;
const MAX_TEXT_LEN = 200;

function repoParts() {
  const repo = process.env.GITHUB_REPO || "Luthfii1/jikoshoukai";
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error("GITHUB_REPO must be owner/repo");
  }
  return { owner, name, repo };
}

function token() {
  return process.env.GITHUB_TOKEN?.trim() || "";
}

function apiHeaders(extra?: HeadersInit): HeadersInit {
  const t = token();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...extra,
  };
}

function parseList(raw: unknown): Recommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is Recommendation =>
        !!item &&
        typeof item === "object" &&
        typeof (item as Recommendation).id === "string" &&
        typeof (item as Recommendation).text === "string" &&
        typeof (item as Recommendation).createdAt === "string",
    )
    .slice(0, MAX_ITEMS);
}

async function readFromGitHub(): Promise<{
  items: Recommendation[];
  sha: string | null;
}> {
  const { owner, name } = repoParts();
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${FILE_PATH}`;
  const res = await fetch(url, {
    headers: apiHeaders(),
    next: { revalidate: 0 },
  });

  if (res.status === 404) {
    return { items: [], sha: null };
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub read failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { content?: string; sha?: string; encoding?: string };
  if (!data.content || !data.sha) {
    return { items: [], sha: null };
  }

  const decoded = Buffer.from(data.content, "base64").toString("utf8");
  return { items: parseList(JSON.parse(decoded)), sha: data.sha };
}

async function writeToGitHub(items: Recommendation[], sha: string | null) {
  const t = token();
  if (!t) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  const { owner, name } = repoParts();
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${FILE_PATH}`;
  const content = Buffer.from(JSON.stringify(items, null, 2) + "\n", "utf8").toString(
    "base64",
  );

  const res = await fetch(url, {
    method: "PUT",
    headers: apiHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      message: `chore: add recommendation (${items[0]?.id ?? "update"})`,
      content,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${body}`);
  }
}

export async function GET() {
  try {
    // Prefer live GitHub file when token exists; otherwise fall back to repo seed.
    if (token()) {
      const { items } = await readFromGitHub();
      return NextResponse.json({ items, shared: true });
    }

    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const file = join(process.cwd(), FILE_PATH);
    const raw = await readFile(file, "utf8");
    return NextResponse.json({ items: parseList(JSON.parse(raw)), shared: false });
  } catch (err) {
    console.error("[recommendations GET]", err);
    return NextResponse.json({ items: [], shared: false });
  }
}

export async function POST(req: Request) {
  try {
    if (!token()) {
      return NextResponse.json(
        { error: "Shared storage is not configured (missing GITHUB_TOKEN)." },
        { status: 503 },
      );
    }

    const body = (await req.json()) as { text?: unknown };
    const text =
      typeof body.text === "string" ? body.text.trim().slice(0, MAX_TEXT_LEN) : "";
    if (!text) {
      return NextResponse.json({ error: "Empty recommendation." }, { status: 400 });
    }

    // Retry once on SHA conflict
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { items, sha } = await readFromGitHub();
        const entry: Recommendation = {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          text,
          createdAt: new Date().toISOString(),
        };
        const next = [entry, ...items].slice(0, MAX_ITEMS);
        await writeToGitHub(next, sha);
        return NextResponse.json({ items: next, shared: true });
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  } catch (err) {
    console.error("[recommendations POST]", err);
    return NextResponse.json(
      { error: "Could not save recommendation." },
      { status: 500 },
    );
  }
}
