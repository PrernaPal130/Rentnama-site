import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

function verifySignature({ orderId, paymentId, signature, secret }) {
  const digest = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const left = Buffer.from(digest);
  const right = Buffer.from(signature);

  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const orderId = body?.razorpay_order_id;
    const paymentId = body?.razorpay_payment_id;
    const signature = body?.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Payment verification data is incomplete." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret is missing on the server." },
        { status: 500 }
      );
    }

    const valid = verifySignature({
      orderId,
      paymentId,
      signature,
      secret,
    });

    if (!valid) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      paymentId,
      orderId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not verify the payment right now.",
      },
      { status: 500 }
    );
  }
}
