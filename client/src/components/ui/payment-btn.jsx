import React from "react";
import Button from "./button";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../store/apis/reserve";
import toast from "react-hot-toast";
import { useProfileQuery } from "../../store/apis/user";

const PaymentBTN = ({
  children,
  className,
  intent = "primary",
  size = "md",
  reservationId,
  ...props
}) => {
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const { data: profile, isLoading, isFetching } = useProfileQuery();

  const handlePayment = async () => {
    try {
      const { order, razorpaySignature } = await createOrder({
        reserveId: reservationId,
      }).unwrap();

      if (!order) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: Math.round(Number(order.amount) * 100),
        currency: order.currency,
        name: "Tourism",
        description: "Payment for reservation",
        order_id: order.order_id,
        handler: async (response) => {
          try {
            await verifyPayment({
              orderId: order._id,
              paymentId: response.razorpay_payment_id,
              signature: razorpaySignature,
            }).unwrap();
            toast.success("Payment processed successfully");
          } catch (error) {
            toast.error(error.message || "Failed to verify payment");
          }
        },
        prefill: {
          name: profile.name,
          email: profile.email,
          contact: profile.phone,
        },
        notes: {
          address: "Tourism",
        },
        theme: {
          color: "#61dafb",
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      toast.error(error.message || "Failed to process payment");
    }
  };

  if (isLoading || isFetching) {
    return null;
  }

  return (
    <Button
      className={`mt-4 w-full rounded-md ${className}`}
      intent={intent}
      size={size}
      onClick={handlePayment}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PaymentBTN;
