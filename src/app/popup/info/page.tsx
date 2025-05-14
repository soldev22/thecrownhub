export default function PopupInfoPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center text-warning">Pop-Up Space Details</h1>

      <div className="mb-4">
        <p className="lead">
          Welcome to The Crown Hub's pop-up space — ideal for small businesses, local makers, creatives,
          and anyone looking to showcase their work in a high-footfall, vibrant environment.
        </p>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <img
            src="/images/popup1.jpg"
            alt="Pop-up stall with handmade goods"
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-4">
          <img
            src="/images/popup2.jpg"
            alt="Event setup with lighting and banners"
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-4">
          <img
            src="/images/popup3.jpg"
            alt="Small art gallery or boutique-style layout"
            className="img-fluid rounded shadow-sm"
          />
        </div>
      </div>

      <h3 className="text-warning">What's Included:</h3>
      <ul>
        <li>Flexible booking by the hour (8am–6pm)</li>
        <li>Up to 3 vendors per hour slot</li>
        <li>Electricity, Wi-Fi, and signage space available</li>
        <li>No contracts — just pay-as-you-go</li>
      </ul>

      <h3 className="text-warning mt-4">Recommended For:</h3>
      <ul>
        <li>Market traders</li>
        <li>Food and drink tastings</li>
        <li>Workshops or demos</li>
        <li>Local artists and creators</li>
      </ul>

      <div className="text-center mt-5">
        <a href="/popup" className="btn btn-warning btn-lg">
          Book a Slot Now
        </a>
      </div>
    </div>
  );
}
