import crypto from 'crypto';

/**
 * A Pure JavaScript implementation of the FileProcessor logic
 * for Jest transformations.
 */
const FileProcessor = {
  // Extracts @property {type} name from @Studio blocks
  parseStudio(source) {
    const studioBlockRegex = /\/\*\*[\s\S]*?@Studio[\s\S]*?\*\//g;
    const propertyRegex = /@property\s+\{([^}]+)\}\s+([A-Za-z_$][\w$]*)/g;

    const blocks = source.match(studioBlockRegex) || [];
    if (blocks.length === 0) return { isStudio: false, properties: [] };

    const properties = [];
    for (const block of blocks) {
      let match;
      while ((match = propertyRegex.exec(block)) !== null) {
        properties.push({ type: match[1], name: match[2] });
      }
    }
    return { isStudio: true, properties };
  },

  // Removes the @Studio JSDoc blocks
  stripHeaders(source) {
    return source.replace(/\/\*\*[\s\S]*?@Studio[\s\S]*?\*\//g, '').trimStart();
  },

  // Simplistic approach to finding the first function's opening brace
  // and injecting the variable declarations.
  injectGlobals(source, properties) {
    if (properties.length === 0) return source;

    // Create the declaration string: const studio_cpf = globalThis.studio_cpf;
    const declarations = properties
      .map((p) => `\n  const ${p.name} = globalThis.${p.name};`)
      .join('');

    // Regex to find the first opening brace '{' of a function
    // This targets function declarations, expressions, and arrows
    const firstBraceIndex = source.indexOf('{');

    if (firstBraceIndex === -1) return source;

    return (
      source.slice(0, firstBraceIndex + 1) +
      declarations +
      source.slice(firstBraceIndex + 1)
    );
  },
};

export default {
  process(sourceText, sourcePath) {
    const { isStudio, properties } = FileProcessor.parseStudio(sourceText);

    if (!isStudio) {
      return { code: sourceText };
    }

    let code = FileProcessor.stripHeaders(sourceText);
    code = FileProcessor.injectGlobals(code, properties);

    return { code };
  },

  getCacheKey(fileData, filename, configString) {
    return crypto
      .createHash('md5')
      .update(fileData + filename + configString)
      .digest('hex');
  },
};
