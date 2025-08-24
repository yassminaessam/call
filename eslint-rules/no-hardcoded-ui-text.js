/**
 * Simple heuristic ESLint rule to prevent hard‑coded UI strings in JSX.
 * Phase 1: Warn on > 2 consecutive letters in JSXText / Literal inside JSXAttribute (excluding short tokens, numbers, icons).
 * Later: integrate allowlists & auto-suggest closest t() key.
 */

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded UI strings; enforce use of t() translation function',
      recommended: false
    },
    messages: {
      hardcoded: 'Hardcoded UI text detected: "{{text}}". Use t(\'...\') instead.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          minLength: { type: 'number' },
          ignorePattern: { type: 'string' }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {};
    const minLength = options.minLength || 3;
    const ignorePattern = options.ignorePattern ? new RegExp(options.ignorePattern) : /^(?:[\d・•.,:;#@/+=()<>{}\-_]|&[a-z]+;)*$/i;

    function reportIfHardcoded(raw, node) {
      const text = raw.trim();
      if (!text) return;
      if (text.length < minLength) return;
      // Skip if looks like variable interpolation markers already handled
      if (ignorePattern.test(text)) return;
      // Skip if wrapped in t('...') already - heuristic handled in CallExpression check
      context.report({ node, messageId: 'hardcoded', data: { text: text.slice(0, 40) } });
    }

    return {
      JSXText(node) {
        reportIfHardcoded(node.value, node);
      },
      Literal(node) {
        if (node.parent && node.parent.type === 'JSXAttribute' && typeof node.value === 'string') {
          reportIfHardcoded(node.value, node);
        }
      },
      CallExpression(node) {
        // If argument already passed through t() we do nothing (so we avoid double reporting)
        if (node.callee.type === 'Identifier' && node.callee.name === 't') return;
      }
    };
  }
};
