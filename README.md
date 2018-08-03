# WebGL School 2018 WebAssembly 編

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## ビルド

```
npm install
```

後に

```
npm start
```

`localhost:3000`で、Chrome で開いてください。WebCamera を用いるので localhost じゃないと HTTPS 出ない限り動きません。

```
npm run asbuild
```

で WebAssembly の部分のコードをビルドします。最初に開く前に必要です。

## フォルダ構造

src 内に TS のコードが入っています。デバッグ用の仕組みの UI のコードがほとんどですので `src/core/separator`内を見ればこと足ります。
assembly 以下に AssemblyScript のコードが入っています。ほとんどのアルゴリズムが `assembly/index.ts`に入っています。Texture4CH や Queue などのクラスだけ別ファイルで、その他のファイルは js から渡される関数の型定義です。
