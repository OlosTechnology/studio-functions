import { arrayParaLista } from '../functions/arrayParaLista';

describe('Array para Lista', () => {
  test('Deve converter um array de objetos em uma lista formatada', () => {
    globalThis.$array = [
      { nome: 'João', idade: 30 },
      { nome: 'Maria', idade: 25 },
    ];
    globalThis.$template = 'Nome: ${nome}, Idade: ${idade}';

    const resultado = arrayParaLista();

    expect(resultado).toBe(
      '1 - Nome: João, Idade: 30\n2 - Nome: Maria, Idade: 25',
    );
  });

  test('Deve lançar erro para entrada que não é um array', () => {
    globalThis.$array = 'Não é um array';
    globalThis.$template = 'Nome: ${nome}';

    expect(() => arrayParaLista()).toThrow('Entrada deve ser um array');
  });

  test('Deve lançar erro para template que não é uma string', () => {
    globalThis.$array = [{ nome: 'João' }];
    globalThis.$template = 12345;

    expect(() => arrayParaLista()).toThrow('Template deve ser uma string');
  });
});
