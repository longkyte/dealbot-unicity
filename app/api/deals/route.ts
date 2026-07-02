import { NextResponse } from "next/server";
import { DealStore } from "../../../src/lib/storage/store.js";

export async function GET() {
  try {
    const deals = DealStore.getDeals();
    return NextResponse.json({ success: true, deals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
