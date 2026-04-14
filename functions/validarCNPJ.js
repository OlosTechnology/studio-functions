/**
 * @Studio
 * @Title Validador de CNPJ
 * @property {string} $message - CNPJ a ser validado
 */

export function validarCNPJ() {
  const cnpj = $message.replace(/\D/g, '');

  function valida(cnpj) {
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false; // bloqueia repetidos

    const calcDigito = (base) => {
      let soma = 0;
      let pos = base.length - 7;

      for (let i = base.length; i >= 1; i--) {
        soma += parseInt(base.charAt(base.length - i), 10) * pos--;
        if (pos < 2) pos = 9;
      }

      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const base12 = cnpj.slice(0, 12);
    const d1 = calcDigito(base12);
    const d2 = calcDigito(base12 + d1);

    return cnpj === base12 + String(d1) + String(d2);
  }

  if (!valida(cnpj)) throw 'CNPJ inválido';

  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
