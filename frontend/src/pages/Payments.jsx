import PaymentCard from "../components/PaymentCard";

function Payments({ payments }) {
  let paymentList;

  if (payments.length === 0) {
    paymentList = (
      <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
        No payments found.
      </div>
    );
  } else {
    paymentList = payments.map(function (payment) {
      return (
        <PaymentCard
          key={payment._id || payment.id}
          payment={payment}
        />
      );
    });
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Payments</h2>

      <div className="grid gap-5">{paymentList}</div>
    </section>
  );
}

export default Payments;