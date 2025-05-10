'use client';

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import Bootstrap JS only in the browser
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
