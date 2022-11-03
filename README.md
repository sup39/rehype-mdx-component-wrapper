# rehype-mdx-component-wrapper
A rehype plugin to wrap the mdx component with external component

## Installation
```bash
# If you are using yarn
yarn add @sup39/rehype-mdx-component-wrapper

# If you are using npm
npm install @sup39/rehype-mdx-component-wrapper
```

## Configuration
|property|type|description|
|--|--|--|
|`name`|`string`|Name of the wrapper component. Default value is `'MDXRoot'`|
|`path`|`string`|Path to the wrapper component. Default value is `'@/MDXRoot'`|
|`props`|`string[]`|Local variable names to be passed to the wrapper component. Default value is `[]`|

## Example Usage of Next.js
This plugin can be used to pass the metadata (frontmatter) parsed by
[remark-mdx-frontmatter](https://github.com/remcohaszing/remark-mdx-frontmatter)
to the wrapper component.
For instance, you can use the metadata to create footer with author name for all mdx
without explicitly writing JSX in the files.

### Settings next.config.mjs
In next.config.mjs:
```javascript
/*
  You may need to install remark-mdx-frontmatter
  $ yarn add remark-frontmatter remark-mdx-frontmatter
*/
import mdx from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import ComponentWrapper from '@sup39/rehype-mdx-component-wrapper';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      // export all metadata into an object with name `meta`
      () => remarkMdxFrontmatter({name: 'meta'}),
    ],
    rehypePlugins: [() => ComponentWrapper({
      name: 'MDXRoot',
      path: '@/MDXRoot',
      // pass the exported `meta` object to the wrapper component
      props: ['meta'],
    })],
  },
});
export default withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
});
```

### Setup Alias
In your tsconfig, add `baseUrl` and `paths` like the following to create alias.
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["components/*"],
      // ...
    }
    // ...
  }
  // ...
}
```

### Define a Wrapper Component
Define a wrapper component in `components/`. All `props` passed to the MDX file and the local exported variables with name in `props` are passed to the component as props.

For example, create file `components/MDXRoot.tsx` with the following contents:
```tsx
import Head from 'next/head'

export default function MDXRoot({meta, children}: any) {
  return <>
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
    </Head>
    {children}
    <footer>
       <div>Author: {meta.author}</div>
    </footer>
  </>;
}
```

### Write mdx
```mdx
---
title: YAML is enough to define metadata!
description: You can add other meta tags too :)
author: sup39
---

## No need to write JSX in all mdx files!
```

### Result
The final output will roughly be:
```html
<head>
  <title>YAML is enough to define metadata!</title>
  <meta name="description" content="You can add other meta tags too :)">
</head>
<h2>No need to write JSX in all mdx files!</h2>
<footer><div>Author: sup39</div></footer>
```
