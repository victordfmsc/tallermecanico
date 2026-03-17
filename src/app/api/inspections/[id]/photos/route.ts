import { NextRequest, NextResponse } from "next/server";
import { getShopId } from "@/lib/auth-helpers";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shopId = await getShopId();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;
    const filePath = `${shopId}/${params.id}/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('inspections')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Failed to upload to Supabase" }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('inspections')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("POST inspection photos error:", error);
    return NextResponse.json({ error: "Failed to process photo upload" }, { status: 500 });
  }
}
