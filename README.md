# maplibre-nextjs-ts-starter

Save some minutes by adapting this modern next.js typescript project to your needs. It comes with a custom maplibre-gl-js layer or jsx rendering output in your common next.js stack. ✌️

The JSX rendering output is a bit slower than the layer rendering output. But it is more flexible and you can use the full power of react. The layer rendering output is unbelivabely but you can only use the limited way of displaying layers in maplibre-gl-js, which can't really be overlapped.

You will need a maptiler account to use the maplibre-gl-js library. You can get a free account [here](https://www.maptiler.com/). A simple mapbox-to-maplibre-gl resolver is already in place in ``next.config.js.``

Replace the ``MAPTILER_KEY`` in ``.env.local.example`` with your own key and rename the file to ``.env.local``. Dont share your key with anyone.

more infos very soon...

👀 please create PR if you have some ideas to improve this starter.

🎰 Under the hood:

- Framework: [next.js](https://github.com/vercel/next.js) / [react](https://github.com/facebook/react)
- State Management: [zustand](https://github.com/pmndrs/zustand)
- UI:
  - [tailwind](https://github.com/tailwindlabs/tailwindcss)
    - [styled components](https://github.com/styled-components/styled-components)
    - [tailwind styled components](https://github.com/MathiasGilson/Tailwind-Styled-Component)
  - [Lucide Icons](https://github.com/lucide-icons/lucide)
  - [react-resize-detector](https://github.com/maslianok/react-resize-detector) (almost deprecated)
- Map:
  - [Maplibre GL JS](https://github.com/maplibre/maplibre-gl-js)
  - [react-map-gl](https://github.com/visgl/react-map-gl)
- Development
  - [typeScript](https://github.com/microsoft/TypeScript)
  - [eslint](https://github.com/eslint/eslint)
  - [prettier](https://github.com/prettier/prettier)
  - [husky](https://github.com/typicode/husky)
  - [lint-staged](https://github.com/lint-staged/lint-staged)
  - [lodash](https://github.com/lodash/lodash)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

