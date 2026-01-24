import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/Toaster";
import {
  Check,
  Tag,
  Shield,
  Clock,
  Users,
  Loader2,
  CreditCard,
  Percent,
  X,
  BadgeCheck,
  Lock,
} from "lucide-react";
import {
  createPaymentOrder,
  getCoupon,
  verifyPayment,
  paymentFailed,
} from "@/utils/payment";
import { Coupon, Internship } from "@/index";
import { getInternship } from "@/utils/internship";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const formSchema = z.object({
  firstName: z.string().min(5, "Title must be at least 5 characters."),
  lastName: z.string().min(5, "Title must be at least 5 characters."),
  email: z.string().email(),
  phone_number: z.string().min(10, "Please enter a valid phone_number number."),
});

const features = [
  "3 months of hands-on experience",
  "Mentorship from industry experts",
  "Real-world project work",
  "Certificate on completion",
  "Lifetime community access",
];

const formatPrice = (value: number) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function PaymentPage() {
  const params = new URLSearchParams(window.location.search);
  const { internshipId, domainId, domainName } = {
    internshipId: params.get("internshipId"),
    domainId: params.get("domainId"),
    domainName: params.get("domainName"),
  };

  if (!internshipId || !domainId) {
    console.error("Invalid internshipId or domainId");
    return null;
  }

  const { addToast } = Toaster();
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);
  const [internshhipData, setInternshhipData] = React.useState<Internship>();
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);
  const [couponError, setCouponError] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [finalPrice, setFinalPrice] = React.useState(
    parseFloat(internshhipData?.price || "0"),
  );
  const [discountAmount, setDiscountAmount] = React.useState(
    parseFloat(internshhipData?.price || "0"),
  );
  const [gstPrice, setGstPrice] = React.useState(0.0);
  const [totalPrice, setTotalPrice] = React.useState(0.0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone_number: "",
    },
  });

  React.useEffect(() => {
    const fetch = async () => {
      const res = await getInternship(internshipId);
      setInternshhipData(res);
      console.log(res);
    };
    fetch();
  }, [internshipId]);

  React.useEffect(() => {
    if (!internshhipData?.price) return;

    const price = parseFloat(internshhipData.price);

    // No coupon on load
    setDiscountAmount(0);

    const gst = parseFloat((price * 0.18).toFixed(2));

    setFinalPrice(price);
    setGstPrice(gst);
    setTotalPrice(parseFloat((price + gst).toFixed(2)));
  }, [internshhipData]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    const coupon: Coupon = await getCoupon(couponCode);

    if (coupon) {
      setAppliedCoupon(coupon);
      addToast({
        type: "success",
        title: "Coupon Applied",
        description: `You saved ${coupon.percent_off}% on your payment`,
        duration: 3000,
      });

      const discount = parseFloat(
        (
          (parseFloat(internshhipData?.price || "0") * coupon.percent_off) /
          100
        ).toFixed(2),
      );
      setDiscountAmount(discount);

      const finalPrice = parseFloat(
        (parseFloat(internshhipData?.price || "0") - discount).toFixed(2),
      );
      const gstAmount = parseFloat((finalPrice * 0.18).toFixed(2));
      setGstPrice(gstAmount);
      setFinalPrice(finalPrice);
      setTotalPrice(parseFloat((finalPrice + gstAmount).toFixed(2)));
    } else {
      setCouponError("Invalid coupon code");
    }

    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");

    const finalPrice = parseFloat(internshhipData?.price || "0");
    const gstAmount = parseFloat((finalPrice * 0.18).toFixed(2));
    setDiscountAmount(0);
    setGstPrice(gstAmount);
    setFinalPrice(finalPrice);
    setTotalPrice(parseFloat((finalPrice + gstAmount).toFixed(2)));
  };

  function loadRazorpay() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  }

  const payWithRazorpay = async () => {
    try {
      const { key_id, order } = await createPaymentOrder(
        internshipId,
        domainId,
        couponCode,
      );

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "MentEdge",
        description: "Internship payment",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              internshipId,
              domainId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            addToast({
              type: "success",
              title: "Payment Successful",
              description: "Your payment has been processed successfully",
              duration: 3000,
            });

            // Redirect to dashboard after 1 second
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
          } catch (error) {
            setIsProcessing(false);
            await paymentFailed(
              internshipId,
              domainId,
              response.razorpay_order_id,
              "failed",
            );
            addToast({
              type: "error",
              title: "Payment Failed",
              description:
                "Payment verification failed. Please contact support.",
              duration: 5000,
            });
          }
        },
        modal: {
          ondismiss: async () => {
            setIsProcessing(false);
            await paymentFailed(internshipId, domainId, order.id, "cancelled");
            addToast({
              type: "error",
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
              duration: 3000,
            });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", async (response: any) => {
        rzp.close();
        setIsProcessing(false);
        await paymentFailed(
          internshipId,
          domainId,
          response.error.metadata.order_id,
          "failed",
        );
        addToast({
          type: "error",
          title: "Payment Failed",
          description:
            response.error.description || "Payment could not be processed",
          duration: 5000,
        });
      });
      rzp.open();
    } catch (error) {
      setIsProcessing(false);
      addToast({
        type: "error",
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        duration: 5000,
      });
    }
  };

  const selectedDomain = internshhipData?.domains?.[domainName];

  return (
    <div className="max-h-[calc(100vh-64px] container mx-auto">
      {/* Header */}
      <header className="border-b backdrop-blur-sm">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">Checkout</h1>
              <p className="text-sm text-muted-foreground">
                Complete your enrollment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Lock className="h-4 w-4" />
            <span>Secure Payment</span>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Plan Selection */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className=" rounded-xl border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-lg text-sm font-medium border bg-primary/30 flex items-center justify-center">
                  1
                </span>
                <h2 className="text-xl font-semibold">Selected Plan</h2>
              </div>

              <Card>
                <CardContent className=" flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1 capitalize">
                      {internshhipData?.internship_title}
                    </h3>
                    <p className=" text-muted-foreground text-sm mb-3">
                      {internshhipData?.description.slice(0, 80)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        {
                          icon: Clock,
                          label: selectedDomain?.duration ?? "N/A",
                        },
                        {
                          icon: Users,
                          label: selectedDomain
                            ? `${selectedDomain.weekly_hours} hrs/week`
                            : "N/A",
                        },
                        { icon: Shield, label: "Certificate" },
                      ].map(({ icon: Icon, label }, index) => (
                        <Badge
                          key={index}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground line-through text-sm">
                      Rs.{internshhipData?.price}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      Rs.
                      {formatPrice(
                        parseFloat(internshhipData?.price || "0") -
                          discountAmount,
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Step 2: Personal Information */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className=" rounded-xl border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center border bg-primary/30 justify-center w-8 h-8 rounded-lg text-sm font-medium">
                  2
                </span>
                <h2 className="text-xl font-semibold">Your Information</h2>
              </div>

              <p className=" text-muted-foreground text-sm mb-6">
                Enter your details to complete the enrollment
              </p>

              <Form {...form}>
                <form className="w-full grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </motion.section>

            {/* Step 3: Apply Coupon */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className=" rounded-xl border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center border bg-primary/30 justify-center w-8 h-8 rounded-lg text-sm font-medium">
                  3
                </span>
                <h2 className="text-xl font-semibold ">Apply Coupon</h2>
              </div>

              <AnimatePresence mode="wait">
                {appliedCoupon ? (
                  <motion.div
                    key="applied"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
                  >
                    <Card>
                      <CardContent className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <BadgeCheck className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-emerald-400 font-medium">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-emerald-400/70 text-sm">
                            {appliedCoupon.percent_off}% - You save Rs.
                            {formatPrice(discountAmount)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          className="pl-10 placeholder:text-muted-foreground h-12 uppercase tracking-wider focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                      </div>
                      <Button
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon}
                        className="h-12 px-6"
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm flex items-center gap-1.5"
                      >
                        <X className="h-4 w-4" />
                        {couponError}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Step 4: Payment */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className=" rounded-xl border p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center border bg-primary/30 justify-center w-8 h-8 rounded-lg text-sm font-medium">
                  4
                </span>
                <h2 className="text-xl font-semibold">Payment</h2>
              </div>

              <div className="p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Pay with Razorpay</span>
                </div>
                <p className=" text-muted-foreground text-sm">
                  Secure payment via UPI, Credit/Debit Cards, Net Banking, and
                  Wallets
                </p>
                <div className="flex gap-3 mt-4">
                  {["UPI", "Cards", "NetBanking", "Wallets"].map((method) => (
                    <Badge
                      variant={"outline"}
                      key={method}
                      className="px-3 py-1.5 rounded-md text-xs"
                    >
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={async () => {
                  // Validate form before proceeding
                  const isValid = await form.trigger();

                  if (!isValid) {
                    toast.error("Please fill in all the required fields.");
                    return;
                  }

                  setIsProcessing(true);
                  loadRazorpay();
                  payWithRazorpay();
                }}
                disabled={isProcessing}
                className="w-full h-14 text-lg font-medium gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Pay Rs.{formatPrice(totalPrice)}
                  </>
                )}
              </Button>

              <p className="text-center text-zinc-500 text-sm mt-4">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </motion.section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className=" rounded-xl border p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Features */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className=" text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className=" text-muted-foreground">Original Price</span>
                  <span className="text-muted-foreground">
                    Rs.{internshhipData?.price}
                  </span>
                </div>

                {appliedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5" />
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="text-emerald-400">
                      -Rs.{formatPrice(discountAmount)}
                    </span>
                  </motion.div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-muted-foreground">
                    Rs.{formatPrice(finalPrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="text-muted-foreground">
                    Rs.{formatPrice(gstPrice)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t ">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    Rs.{formatPrice(totalPrice)}
                  </span>
                </div>
                {appliedCoupon && (
                  <p className="text-emerald-400 text-sm text-right">
                    You save Rs.{formatPrice(discountAmount)}
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t ">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Shield className="h-4 w-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Lock className="h-4 w-4" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <BadgeCheck className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
