import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "../../../../models/transaction";
import { ApiError } from "../../../errors/api-error";

type PutRequestBody = {
  date: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const res: PutRequestBody = await request.json();

    const transaction = await new Transaction().update(id, res);

    return NextResponse.json(transaction);
  } catch (error: any) {
    new ApiError(error);
    return NextResponse.json({ error: error?.response?.data || error });
  }
}
