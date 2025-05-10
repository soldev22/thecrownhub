export default function PaymentCancelledPage() {
  return (
    <div className="text-center py-5">
      <h1 className="text-danger display-5">Payment Cancelled</h1>
      <p className="lead mt-3">Your chair was not reserved.</p>
      <a href="/booking" className="btn btn-outline-secondary mt-4">
        Try Again
      </a>
    </div>
  );
}
