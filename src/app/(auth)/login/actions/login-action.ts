"use server";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/axios-instance";
import { loginSchema } from "../schemas/login-schema";
import { sessionConfig, legacySessionConfig } from "@/config/session-config";
import { clearCacheNavegador } from "@/lib/session/utils";
import { createSessionToken } from "@/lib/session/server";

export async function loginAction({
  login,
  password,
}: {
  login: string;
  password: string;
}) {
  const validation = loginSchema.safeParse({
    login,
    password,
  });

  if (!validation.success) {
    clearCacheNavegador(false);
    throw new Error(validation.error.message);
  }

  clearCacheNavegador(false);
  const response: any = await api
    .post("/auth/signin", {
      login,
      password,
    })
    .then(async (response) => {
      const cookieStore = await cookies();

      cookieStore.delete(sessionConfig.ABILITIES);
      cookieStore.delete(legacySessionConfig.ABILITIES);

      cookieStore.set(sessionConfig.TOKEN_NAME, response.data.token, {
        path: sessionConfig.CONFIG_PATH,
      });
      cookieStore.set(sessionConfig.TOKEN_NAME_CLIENT, response.data.token, {
        path: sessionConfig.CONFIG_PATH,
      });
      cookieStore.set(legacySessionConfig.TOKEN_NAME, response.data.token, {
        path: sessionConfig.CONFIG_PATH,
      });
      cookieStore.set(
        legacySessionConfig.TOKEN_NAME_CLIENT,
        response.data.token,
        {
          path: sessionConfig.CONFIG_PATH,
        },
      );
      cookieStore.set(
        sessionConfig.REFRESH_TOKEN_NAME,
        response.data.refreshToken,
        {
          path: sessionConfig.CONFIG_PATH,
        },
      );
      cookieStore.set(
        legacySessionConfig.REFRESH_TOKEN_NAME,
        response.data.refreshToken,
        {
          path: sessionConfig.CONFIG_PATH,
        },
      );

      await createSessionToken({
        user: {
          login: response.data.login,
          username: response.data.username,
          isAdmin: response.data.isAdmin,
          pagina_inicial: response.data.pagina_inicial,
          _id: response.data._id,
          setor: response.data.setor,
          status: response.data.status,
        },
      });
      return {
        success: true,
        user: {
          login: response.data.login,
          username: response.data.username,
          roles: response.data.roles,
          permissions: response.data.permissions,
          isAdmin: response.data.isAdmin,
          ability: response.data.ability,
          pagina_inicial: response.data.pagina_inicial,
        },
        token: response.data.token,
        refreshToken: response.data.refreshToken,
      };
    })
    .catch((error: any) => {
      if (isAxiosError(error)) {
        return {
          error: error?.response?.data.message,
        };
      }

      return {
        error: "E-mail ou senha inválidos",
      };
    });
  if (response.error) {
    return {
      success: false,
      error: response.error,
    };
  }

  const paginaInicial =
    typeof response?.user?.pagina_inicial === "string"
      ? response.user.pagina_inicial.trim()
      : "";

  if (paginaInicial) {
    redirect(paginaInicial.startsWith("/") ? paginaInicial : `/${paginaInicial}`);
  } else {
    redirect("/");
  }
}
