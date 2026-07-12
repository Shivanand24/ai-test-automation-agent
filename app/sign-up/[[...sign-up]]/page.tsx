import { SignUp } from "@clerk/nextjs";
import Provider from "./provider";

export default function SignUpPage() {
  return (
    <Provider>
      <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b' }}>
        <SignUp />
      </main>
    </Provider>
  );
}
