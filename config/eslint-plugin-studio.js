/**
 * Custom ESLint plugin that reads @property declarations from @Studio
 * JSDoc blocks and declares them as globals, so `no-undef` still catches
 * truly undefined variables while allowing Studio-injected ones.
 */

const studioBlockRegex = /\/\*\*[\s\S]*?@Studio[\s\S]*?\*\//g;
const propertyRegex = /@property\s+\{[^}]+\}\s+([A-Za-z_$][\w$]*)/g;

function extractStudioGlobals(code) {
  const blocks = code.match(studioBlockRegex) || [];
  const names = [];
  for (const block of blocks) {
    let match;
    propertyRegex.lastIndex = 0;
    while ((match = propertyRegex.exec(block)) !== null) {
      names.push(match[1]);
    }
  }
  return names;
}

const plugin = {
  meta: { name: 'eslint-plugin-studio' },
  processors: {
    studio: {
      preprocess(text) {
        const globals = extractStudioGlobals(text);
        if (globals.length > 0) {
          return [`/* global ${globals.join(', ')} */\n${text}`];
        }
        return [text];
      },
      postprocess(messages) {
        return messages.flat();
      },
    },
  },
};

export default plugin;
