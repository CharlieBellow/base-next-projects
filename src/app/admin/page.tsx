"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ainda carregando
    if (!session) {
      router.push("/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>Área Administrativa</h1>

      <div className='bg-gray-100 p-4 rounded-lg mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Informações do Usuário:</h2>
        <p>
          <strong>Nome:</strong> {session.user?.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user?.email}
        </p>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt='Avatar'
            width={64}
            height={64}
            className='rounded-full mt-2'
          />
        )}
      </div>

      <div className='bg-blue-50 p-4 rounded-lg mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Dados da Sessão:</h2>
        <pre className='text-sm bg-white p-2 rounded overflow-auto'>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className='space-x-4'>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
        >
          Sair
        </button>

        <button
          onClick={() => router.push("/")}
          className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}
