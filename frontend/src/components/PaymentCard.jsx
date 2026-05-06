function PaymentCard({ payment }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold text-lg mb-3">
        Payment #{payment._id || payment.id}
      </h3>

      <div className="space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium">Amount:</span> €
          {Number(payment.totalPrice || payment.amount).toFixed(2)}
        </p>

        {payment.cabFare && (
          <p>
            <span className="font-medium">Base Fare:</span> €
            {Number(payment.cabFare).toFixed(2)}
          </p>
        )}

        {payment.cabMultiplier && (
          <p>
            <span className="font-medium">Cab Multiplier:</span> ×
            {payment.cabMultiplier}
          </p>
        )}

        {payment.passengersMultiplier && (
          <p>
            <span className="font-medium">Passenger Multiplier:</span> ×
            {payment.passengersMultiplier}
          </p>
        )}

        {payment.daytimeMultiplier && (
          <p>
            <span className="font-medium">Time Multiplier:</span> ×
            {payment.daytimeMultiplier}
          </p>
        )}

        {payment.discountApplied ? (
          <>
            <p className="text-green-700">
              <span className="font-medium">Discount Applied:</span>{" "}
              -{payment.discountPercent}%
            </p>

            <p className="text-green-700">
              <span className="font-medium">Discount Amount:</span> €
              {Number(payment.discountAmount).toFixed(2)}
            </p>
          </>
        ) : (
          <p>
            <span className="font-medium">Discount:</span> none
          </p>
        )}

        <p>
          <span className="font-medium">Status:</span>{" "}
          {payment.status || "paid"}
        </p>
      </div>

      {payment.createdAt && (
        <p className="text-sm text-gray-500 mt-4">
          Date: {new Date(payment.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default PaymentCard;