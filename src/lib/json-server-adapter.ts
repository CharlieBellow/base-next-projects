import type { Adapter } from "next-auth/adapters";

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:3001";

// Função auxiliar para fazer requisições ao json-server
async function fetchJsonServer(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${JSON_SERVER_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error(`JSON Server error: ${response.status} - ${response.statusText}`);
      throw new Error(`JSON Server error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`Expected JSON but got: ${contentType}`);
      throw new Error("Expected JSON response");
    }

    return response.json();
  } catch (error) {
    console.error("Error connecting to JSON Server:", error);
    throw error;
  }
}
export function JsonServerAdapter(): Adapter {
  return {
    async createUser(user: any) {
      const newUser = {
        id: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified?.toISOString() || null,
        image: user.image,
      };

      const createdUser = await fetchJsonServer("/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });

      return {
        ...createdUser,
        emailVerified: createdUser.emailVerified ? new Date(createdUser.emailVerified) : null,
      };
    },

    async getUser(id) {
      try {
        const user = await fetchJsonServer(`/users/${id}`);
        return {
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        };
      } catch {
        return null;
      }
    },

    async getUserByEmail(email) {
      try {
        const users = await fetchJsonServer(`/users?email=${email}`);
        if (users.length === 0) return null;

        const user = users[0];
        return {
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        };
      } catch {
        return null;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const accounts = await fetchJsonServer(
          `/accounts?provider=${provider}&providerAccountId=${providerAccountId}`
        );
        if (accounts.length === 0) return null;

        const account = accounts[0];
        const user = await fetchJsonServer(`/users/${account.userId}`);

        return {
          ...user,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        };
      } catch {
        return null;
      }
    },

    async updateUser(user) {
      const updateData = {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified?.toISOString() || null,
        image: user.image,
      };

      const updatedUser = await fetchJsonServer(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
      });

      return {
        ...updatedUser,
        emailVerified: updatedUser.emailVerified ? new Date(updatedUser.emailVerified) : null,
      };
    },

    async linkAccount(account: any) {
      const newAccount = {
        id: crypto.randomUUID(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      };

      await fetchJsonServer("/accounts", {
        method: "POST",
        body: JSON.stringify(newAccount),
      });

      return newAccount;
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }) {
      try {
        const accounts = await fetchJsonServer(
          `/accounts?provider=${provider}&providerAccountId=${providerAccountId}`
        );
        if (accounts.length > 0) {
          await fetchJsonServer(`/accounts/${accounts[0].id}`, {
            method: "DELETE",
          });
        }
      } catch {
        // Silently fail if account not found
      }
    },

    async createSession({ sessionToken, userId, expires }) {
      const newSession = {
        id: crypto.randomUUID(),
        sessionToken,
        userId,
        expires: expires.toISOString(),
      };

      const createdSession = await fetchJsonServer("/sessions", {
        method: "POST",
        body: JSON.stringify(newSession),
      });

      return {
        ...createdSession,
        expires: new Date(createdSession.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
      try {
        const sessions = await fetchJsonServer(`/sessions?sessionToken=${sessionToken}`);
        if (sessions.length === 0) return null;

        const session = sessions[0];
        const user = await fetchJsonServer(`/users/${session.userId}`);

        return {
          session: {
            ...session,
            expires: new Date(session.expires),
          },
          user: {
            ...user,
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          },
        };
      } catch {
        return null;
      }
    },

    async updateSession({ sessionToken, ...session }) {
      try {
        const sessions = await fetchJsonServer(`/sessions?sessionToken=${sessionToken}`);
        if (sessions.length === 0) return null;

        const updateData = {
          ...session,
          expires: session.expires?.toISOString(),
        };

        const updatedSession = await fetchJsonServer(`/sessions/${sessions[0].id}`, {
          method: "PATCH",
          body: JSON.stringify(updateData),
        });

        return {
          ...updatedSession,
          expires: new Date(updatedSession.expires),
        };
      } catch {
        return null;
      }
    },

    async deleteSession(sessionToken) {
      try {
        const sessions = await fetchJsonServer(`/sessions?sessionToken=${sessionToken}`);
        if (sessions.length > 0) {
          await fetchJsonServer(`/sessions/${sessions[0].id}`, {
            method: "DELETE",
          });
        }
      } catch {
        // Silently fail if session not found
      }
    },

    async createVerificationToken({ identifier, expires, token }) {
      const newToken = {
        id: crypto.randomUUID(),
        identifier,
        token,
        expires: expires.toISOString(),
      };

      const createdToken = await fetchJsonServer("/verificationTokens", {
        method: "POST",
        body: JSON.stringify(newToken),
      });

      return {
        identifier: createdToken.identifier,
        token: createdToken.token,
        expires: new Date(createdToken.expires),
      };
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const tokens = await fetchJsonServer(
          `/verificationTokens?identifier=${identifier}&token=${token}`
        );
        if (tokens.length === 0) return null;

        const verificationToken = tokens[0];

        // Delete the token after use
        await fetchJsonServer(`/verificationTokens/${verificationToken.id}`, {
          method: "DELETE",
        });

        return {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
          expires: new Date(verificationToken.expires),
        };
      } catch {
        return null;
      }
    },
  };
}
