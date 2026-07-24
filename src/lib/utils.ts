import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula porcentagens de várias formas
 * @param valor Valor base para o cálculo
 * @param porcentagem Porcentagem a ser calculada (em % ou valor decimal)
 * @param tipo Tipo de cálculo: 'de' (porcentagem DE um valor),
 *             'aumento' (aumentar valor), 'desconto' (descontar do valor)
 *             ou 'diferença' (diferença percentual entre dois valores)
 * @param valor2 Segundo valor (usado apenas para tipo 'diferença')
 *
 * @example calcularPorcentagem(100, 20) // retorna 20 (20% de 100)
 * @example calcularPorcentagem(100, 20, 'aumento') // retorna 120 (100 + 20% de 100)
 * @example calcularPorcentagem(100, 20, 'desconto') // retorna 80 (100 - 20% de 100)
 * @example calcularPorcentagem(100, 20, 'diferença', 120) // retorna 20 (diferença percentual entre 100 e 120)
 *
 * @returns Resultado do cálculo
 */

export function calcularPorcentagem(
  valor: number,
  porcentagem: number,
  tipo: "de" | "aumento" | "desconto" | "diferença" = "de",
  valor2?: number
): number {
  const porcentagemDecimal = porcentagem > 1 ? porcentagem / 100 : porcentagem;

  switch (tipo) {
    case "de":
      return valor * porcentagemDecimal;

    case "aumento":
      return valor * (1 + porcentagemDecimal);

    case "desconto":
      return valor * (1 - porcentagemDecimal);

    case "diferença":
      if (valor2 === undefined)
        throw new Error("Valor2 é necessário para cálculo de diferença");
      return ((valor2 - valor) / Math.abs(valor)) * 100;

    default:
      throw new Error("Tipo de cálculo inválido");
  }
}

/**
 *
 * @param valor valor a ser calculado
 * @param total total para o cálculo da porcentagem
 * @param casasDecimais número de casas decimais para o resultado (padrão: 2)
 *
 * @example calcularPorcentagemDe(50, 200) // retorna 25.00
 * @example calcularPorcentagemDe(50, 200, 0) // retorna 25
 * @example calcularPorcentagemDe(50, 0) // retorna "O total não pode ser zero"
 * @example calcularPorcentagemDe(50, -200) // retorna "Os valores não podem ser negativos"
 *
 * @returns Resultado da porcentagem com o número de casas decimais especificado
 */

export function calcularPorcentagemDe(
  valor: number,
  total: number,
  casasDecimais: number = 2
): number | string {
  if (typeof valor !== "number" || typeof total !== "number") {
    return "Ambos os valores devem ser números";
  }

  if (total === 0) {
    return "O total não pode ser zero";
  }

  if (valor < 0 || total < 0) {
    return "Os valores não podem ser negativos";
  }

  const porcentagem = (valor / total) * 100;
  return parseFloat(porcentagem.toFixed(casasDecimais));
}

/**
 *
 * @param numeros array de números a serem somados
 * @description Soma todos os números de um array e retorna o resultado.
 * @returns retorna a soma dos números.
 * @example somar(1, 2, 3) // retorna 6
 */

export function somar(...numeros: number[]): number {
  return numeros.reduce((total, num) => total + num, 0);
}

/**
 * Formata um timestamp (número ou string) para uma data no formato "YYYY-MM-DD HH:mm"
 * @param timestamp Timestamp em milissegundos ou string representando um número
 * @returns Data formatada como string
 * @example formatTimestampToDate(1633072800000) // "2021-10-01 00:00"
 */

export function formatTimestampToDate(timestamp: number | string): string {
  if (typeof timestamp === "string") {
    timestamp = parseInt(timestamp, 10);
  }
  const date = new Date(timestamp);
  return date?.toISOString().split("T").join(" ").slice(0, 16);
}

export function generateDynamicRoutes(routeNames: string[]) {
  return routeNames.map((name) => {
    const route = `/${name}/:id`;
    const regex = new RegExp(`^\\/${name}\\/\\w+$`);
    return { route, regex };
  });
}
