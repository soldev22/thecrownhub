// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
<<<<<<< HEAD
      id?: string;
      phone?: string; // ← Add this
    };
  }
=======
      id?: string; // 👈 ADD THIS
      phone?: string
    };
  }

  interface Session {
    user?: User;
  }
>>>>>>> 0f82c7484214cdb6a6bc13e5493a0600faa2ada9
}
