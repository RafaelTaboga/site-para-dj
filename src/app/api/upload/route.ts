import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// In production: integrate Uploadthing or Cloudflare R2
// This stub accepts the file and returns a placeholder URL
// Replace with: import { createUploadthing } from "uploadthing/next";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });

    // TODO: Upload to Uploadthing / Cloudflare R2 / S3
    // const uploadResult = await utapi.uploadFiles(file);
    // return NextResponse.json({ url: uploadResult.data.url });

    // Stub: return a placeholder for dev
    const url = `https://picsum.photos/seed/${Date.now()}/800/600`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
