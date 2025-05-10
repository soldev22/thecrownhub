export default function PaymentSuccessPage() {
  return (
    <div className="text-center py-5">
      <h1 className="text-success display-5">🎉 Payment Successful!</h1>
      <p className="lead mt-3">Thank you for booking with <strong>The Crown Hub</strong>.</p>
      <p>Your chair is now secured and paid for.</p>

      <a href="/dashboard" className="btn btn-outline-primary mt-4">
        Go to Dashboard
      </a>
    </div>
  );
}
