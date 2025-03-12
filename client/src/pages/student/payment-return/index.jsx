import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureAndFinalizePaymentService } from "@/services"; // You'll need a Chapa capture service

function ChapaPaymentReturnPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tx_ref = params.get("tx_ref");

  useEffect(() => {
    if (tx_ref) {
      async function verifyPayment() {
        const response = await captureAndFinalizePaymentService(tx_ref);

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }

      verifyPayment();
    }
  }, [tx_ref]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default ChapaPaymentReturnPage;
