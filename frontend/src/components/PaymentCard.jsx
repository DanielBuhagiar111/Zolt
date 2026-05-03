function PaymentCard({ payment }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold">Payment #{payment._id || payment.id}</h3>
      <p>Amount: €{payment.totalPrice || payment.amount}</p>
      <p>Status: {payment.status || "paid"}</p>

      {payment.createdAt && (
        <p className="text-sm text-gray-500 mt-2">
          Date: {new Date(payment.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default PaymentCard;