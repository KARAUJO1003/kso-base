/**
 * Máscaras pré-definidas para inputs
 * Use # para representar dígitos numéricos
 * Qualquer outro caractere será mantido como separador
 * Use 'currency' para formatação de moeda brasileira
 */

// Moeda brasileira: R$ 1.234,56
// Para usar: mask="currency"
// O valor é armazenado em centavos como NUMBER (ex: 123456 = R$ 1.234,56)
// SEMPRE retorna number automaticamente
export const CURRENCY_MASK = "currency" as const;

// CPF: 000.000.000-00
export const CPF_MASK = "###.###.###-##";

// CNPJ: 00.000.000/0000-00
export const CNPJ_MASK = "##.###.###/####-##";

// Telefone: (00) 0000-0000
export const PHONE_MASK = "(##) ####-####";

// Celular: (00) 00000-0000
export const CELL_PHONE_MASK = "(##) #####-####";

// CEP: 00000-000
export const CEP_MASK = "#####-###";

// Data: 00/00/0000
export const DATE_MASK = "##/##/####";

// Hora: 00:00
export const TIME_MASK = "##:##";

// Hora completa: 00:00:00
export const TIME_FULL_MASK = "##:##:##";

// Placa de veículo: AAA-0000
export const LICENSE_PLATE_MASK = "###-####";

// Cartão de crédito: 0000 0000 0000 0000
export const CREDIT_CARD_MASK = "#### #### #### ####";

// CVV: 000
export const CVV_MASK = "###";

// RG: 00.000.000-0
export const RG_MASK = "##.###.###-#";

// Conta bancária: 00000-0
export const BANK_ACCOUNT_MASK = "#####-#";

// Agência bancária: 0000
export const BANK_AGENCY_MASK = "####";

/**
 * Exemplos de uso:
 *
 * // CPF (retorna string)
 * <FormFields.Input
 *   name="cpf"
 *   label="CPF"
 *   mask={CPF_MASK}
 * />
 *
 * // Telefone (retorna string)
 * <FormFields.Input
 *   name="phone"
 *   label="Telefone"
 *   mask={CELL_PHONE_MASK}
 * />
 *
 * // Moeda (retorna number automaticamente)
 * <FormFields.Input
 *   name="price"
 *   label="Preço"
 *   mask={CURRENCY_MASK}
 * />
 *
 * // Campo numérico com máscara
 * <FormFields.Input
 *   name="codigo"
 *   label="Código"
 *   mask="####"
 *   returnAsNumber
 * />
 *
 * // Máscara customizada
 * <FormFields.Input
 *   name="custom"
 *   label="Código"
 *   mask="+## (##) #####-####"
 * />
 *
 * // Exemplo com Zod schema:
 * const schema = z.object({
 *   cpf: z.string(),           // máscara retorna string
 *   price: z.number(),          // currency retorna number
 *   quantity: z.number(),       // com returnAsNumber
 * });
 */
