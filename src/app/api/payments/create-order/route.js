import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const STORE_ACCESS_AMOUNT_PAISE = 5000;

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay env vars are missing on the server.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const purpose = body?.purpose || "store_access_pass";
    const customerId = body?.customerId || "guest";
    const requestedAmount = Number(body?.amount || 0);

    const razorpay = getRazorpayClient();
    let amount = STORE_ACCESS_AMOUNT_PAISE;
    let description = "RentNama Store Access Pass";

    if (purpose === "checkout_order") {
      if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
        return NextResponse.json(
          { error: "A valid checkout amount is required." },
          { status: 400 }
        );
      }

      amount = requestedAmount;
      description = "RentNama Rental Order";
    } else if (purpose !== "store_access_pass") {
      return NextResponse.json(
        { error: "Unsupported payment purpose." },
        { status: 400 }
      );
    }

    const receiptPrefix =
      purpose === "checkout_order" ? "checkout" : "store-pass";

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `${receiptPrefix}-${customerId}-${Date.now()}`.slice(0, 40),
      notes: {
        purpose,
        customerId,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      description,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create the payment order right now.",
      },
      { status: 500 }
    );
  }
}
