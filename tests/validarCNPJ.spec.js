import { validarCNPJ } from '../functions/validarCNPJ';

describe('Validar CNPJ', () => {
  test('Deve validar um CNPJ válido', () => {
    globalThis.$message = '12.345.678/0001-95';
    expect(validarCNPJ()).toBe('12.345.678/0001-95');
  });

  test('Deve lançar erro para um CNPJ inválido', () => {
    globalThis.$message = '11.111.111/1111-11';
    expect(() => validarCNPJ()).toThrow('CNPJ inválido');
  });
});
