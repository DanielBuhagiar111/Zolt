function PaymentCard({ payment }) {
  const paymentId = payment._id || payment.id;

  let amount = payment.totalPrice;

  if (!amount) {
    amount = payment.amount;
  }

  let baseFareText = null;

  if (payment.cabFare) {
    baseFareText = (
      <p>
        <span className="font-medium">Base Fare:</span> €
        {Number(payment.cabFare).toFixed(2)}
      </p>
    );
  }

  let cabMultiplierText = null;

  if (payment.cabMultiplier) {
    cabMultiplierText = (
      <p>
        <span className="font-medium">Cab Multiplier:</span> ×
        {payment.cabMultiplier}
      </p>
    );
  }

  let passengersMultiplierText = null;

  if (payment.passengersMultiplier) {
    passengersMultiplierText = (
      <p>
        <span className="font-medium">Passenger Multiplier:</span> ×
        {payment.passengersMultiplier}
      </p>
    );
  }

  let daytimeMultiplierText = null;

  if (payment.daytimeMultiplier) {
    daytimeMultiplierText = (
      <p>
        <span className="font-medium">Time Multiplier:</span> ×
        {payment.daytimeMultiplier}
      </p>
    );
  }

  let discountText;

  if (payment.discountApplied) {
    discountText = (
      <div>
        <p className="text-green-700">
          <span className="font-medium">Discount Applied:</span> -
          {payment.discountPercent}%
        </p>

        <p className="text-green-700">
          <span className="font-medium">Discount Amount:</span> €
          {Number(payment.discountAmount).toFixed(2)}
        </p>
      </div>
    );
  } else {
    discountText = (
      <p>
        <span className="font-medium">Discount:</span> none
      </p>
    );
  }

  let dateText = null;

  if (payment.createdAt) {
    dateText = (
      <p className="text-sm text-gray-500 mt-4">
        Date: {new Date(payment.createdAt).toLocaleString()}
      </p>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h3 className="font-bold text-lg mb-3">Payment #{paymentId}</h3>

      <div className="space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium">Amount:</span> €
          {Number(amount).toFixed(2)}
        </p>

        {baseFareText}

        {cabMultiplierText}

        {passengersMultiplierText}

        {daytimeMultiplierText}

        {discountText}
      </div>

      {dateText}
    </div>
  );
}

export default PaymentCard;