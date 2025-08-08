"use client";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
export default function LoginPage() {

  const onSubmit = () => {
    signIn("github", { callbackUrl: "/admin" });
    toast("Login realizado com sucesso.");
  }
  return (
    <div>
      <h1>Login</h1>
      <button onClick={onSubmit}>Entrar com GitHub</button>
    </div>
  );
}
