// Use variável de ambiente ou fallback para dados mockados
const apiBaseUrl =
  process.env.JSON_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Dados de fallback para quando a API não estiver disponível
const fallbackData = [
  { id: "1", title: "Exemplo de Post 1", views: 100 },
  { id: "2", title: "Exemplo de Post 2", views: 200 },
  { id: "3", title: "Exemplo de Post 3", views: 150 },
];

export async function getData() {
  try {
    // Verificar se estamos no ambiente de build
    if (typeof window === "undefined" && !process.env.JSON_SERVER_URL) {
      // Durante o build, retornar dados mockados
      return fallbackData;
    }

    const response = await fetch(`${apiBaseUrl}/posts`, {
      // Adicionar timeout para evitar travamento
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    // Retornar dados de fallback em caso de erro
    return fallbackData;
  }
}
