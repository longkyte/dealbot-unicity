import { NextResponse } from "next/server";
import { DealStore } from "../../../../src/lib/storage/store.js";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = params.id;
    const deal = DealStore.getDeal(dealId);
    
    if (!deal) {
      return NextResponse.json({ success: false, error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
