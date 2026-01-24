import { api } from "@/services/api";

export async function createPaymentOrder(
  internshipId: string,
  domainId: string,
  couponCode?: string,
) {
  const { data } = await api.post("/payments/razorpay/order", {
    internshipId,
    domainId,
    coupon_code: couponCode || undefined,
  });
  // data = { key_id, order, payment_id }
  return data;
}

export async function verifyPayment(payload: {
  internshipId: string;
  domainId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const { data } = await api.post("/payments/razorpay/verify", payload);
  return data;
}

export const paymentFailed = async (internshipId: string, domainId: string, razorpay_order_id: string, status: string) => {
  const { data } = await api.post("/payments/razorpay/fail", {
    internshipId,
    domainId,
    razorpay_order_id,
    status,
    reason: "Payment failed or cancelled",
  });
  return data;
};

export const getCoupon = async (couponCode: string) => {
  const { data } = await api.get(`/payments/coupons?code=${couponCode}`);
  return data.coupons[0];
};
