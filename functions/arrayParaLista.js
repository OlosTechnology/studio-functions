/**
 * @Studio
 * @Title Array para Lista
 * @property {string[]} $array - Array a ser convertido em lista
 * @property {string} $template - Template para formatação da lista
 */

export function arrayParaLista() {
  const array = $array;
  const template = $template;

  if (!Array.isArray(array)) throw 'Entrada deve ser um array';
  if (typeof template !== 'string') throw 'Template deve ser uma string';

  const _replaceTemaplate = (item) => {
    const _itens = template.match(/\${(.*?)}/g);
    let result = template;

    _itens.forEach((match) => {
      const key = match.replace(/\${|}/g, '');
      const value = item[key] !== undefined ? item[key] : '';
      result = result.replace(match, value);
    });

    return result;
  };

  const list = array.map((item, index) => {
    return `${index + 1} - ${_replaceTemaplate(item)}`;
  });

  return list.join('\n');
}
