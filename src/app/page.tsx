"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main>
      <div className='bg-black h-screen w-screen text-white p-8'>
        <h1 className='text-3xl font-bold mb-8'>Base Next.js Project</h1>

        <div className='space-y-4'>
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h2 className='text-xl font-semibold mb-2'>Status da Autenticação:</h2>
            {status === "loading" && <p>Carregando...</p>}
            {status === "authenticated" && session && (
              <div>
                <p className='text-green-400'>✅ Logado como: {session.user?.name}</p>
                <p className='text-sm text-gray-300'>{session.user?.email}</p>
              </div>
            )}
            {status === "unauthenticated" && <p className='text-red-400'>❌ Não logado</p>}
          </div>

          <div className='space-x-4'>
            <Link
              href='/login'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block'
            >
              Login
            </Link>

            <Link
              href='/admin'
              className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block'
            >
              Área Admin (Protegida)
            </Link>
          </div>

          <div className='bg-gray-800 p-4 rounded-lg mt-8'>
            <h2 className='text-xl font-semibold mb-2'>Como testar:</h2>
            <ol className='list-decimal list-inside space-y-2 text-sm'>
              <li>
                Configure as variáveis de ambiente no <code>.env.local</code>
              </li>
              <li>
                Execute <code>pnpm run db</code> para iniciar o JSON Server
              </li>
              <li>
                Execute <code>pnpm run dev:json</code> para usar JSON Server
              </li>
              <li>Clique em &ldquo;Login&rdquo; e faça login com GitHub</li>
              <li>Acesse a &ldquo;Área Admin&rdquo; para ver dados da sessão</li>
              <li>
                Verifique os dados em{" "}
                <a
                  href='http://localhost:3001/users'
                  target='_blank'
                  className='text-blue-400 underline'
                >
                  http://localhost:3001/users
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
