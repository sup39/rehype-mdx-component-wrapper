/**
 * @typedef {{
 *   name?: string
 *   path?: string
 *   props?: string[]
 * }} ComponentWrapperOptions
 */

/** @param {any} expression */
const makeExpression = expression => ({
  estree: {
    type: 'Program',
    sourceType: 'module',
    body: [{
      type: 'ExpressionStatement',
      expression,
    }],
  },
});

/**
 * @param {string} propName
 * @param {any} expression
 */
const makeJsxAttr = (propName, expression) => ({
  type: 'mdxJsxAttribute',
  name: propName,
  value: {
    type: 'mdxJsxAttributeValueExpression',
    data: makeExpression(expression),
  },
});

/** @type {import('unified').Plugin<[ComponentWrapperOptions?], import('hast').Root>} */
const ComponentWrapper = ({
  name = 'MDXRoot',
  path = '@/MDXRoot',
  props = [],
} = {}) => root => {
  const {children} = root;
  root.children = [
    // import MDXRoot from '@/MDXRoot'
    /**@type{import('mdast-util-mdx').MdxjsEsm}*/({
      type: 'mdxjsEsm',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [{
            type: 'ImportDeclaration',
            source: {type: 'Literal', value: path},
            specifiers: [{
              type: 'ImportDefaultSpecifier',
              local: {type: 'Identifier', name: name},
            }],
          }],
        },
      },
    }),
    // <MDXRoot {...props}>{children}</MDXRoot>
    /**@type{import('mdast-util-mdx').MdxJsxFlowElement}*/({
      type: 'mdxJsxFlowElement',
      name,
      children,
      attributes: [
        // {...props}
        {
          type: 'mdxJsxExpressionAttribute',
          value: '{...props}',
          data: makeExpression({
            type: 'ObjectExpression',
            properties: [{
              type: 'SpreadElement',
              argument: {
                type: 'Identifier',
                name: 'props',
              },
            }],
          }),
        },
        // extra local props
        ...props.map(prop => makeJsxAttr(prop, {
          type: 'Identifier',
          name: prop,
        })),
      ],
    }),
  ];
};
module.exports = ComponentWrapper;
