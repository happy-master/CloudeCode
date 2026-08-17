# 天命氣学 — セミナー LP / プロフィールページ

天道象元「天命氣学」の Web 制作物と、素材画像を用意するためのスクリプトをまとめたリポジトリです。

## 内容

| パス | 内容 |
| --- | --- |
| `seminar/index.html` | 「天命の決断」速習 Zoom セミナー LP（1ファイル完結・CSS 埋め込み） |
| `seminar/images/` | LP で使用する画像（ヒーロー、特典、お客様の声、書影、ロゴ） |
| `tendou_shogen_profile.html` | 天道象元 自己紹介カード |
| `scripts/generate_image.mjs` | OpenAI Images API（gpt-image-1）で画像を生成する CLI |
| `scripts/save-clipboard-image.sh` | クリップボードの画像をファイルに保存する（macOS 専用） |
| `.claude/commands/generate-image.md` | Claude Code 用のスラッシュコマンド定義 |

## 公開先

LP の実際の公開先は **UTAGE** です。

- ランディングページ: https://utage-system.com/p/UY0jQRAitNuD
- 申込フォーム: https://utage-system.com/event/RNy0gH09HsC1/register

LP 内の CTA は hero / schedule / footer / sticky の4箇所にあり、それぞれ `utm_medium` を付けて申込フォームへリンクしています。

> **注意:** `seminar/index.html` の冒頭コメントと `og:url` / `canonical` は公開先を `https://kaiun119.com/seminar/` と記載していますが、これは誤りです。`kaiun119.com/seminar/` は WordPress の別ページ（商品・講座一覧）で、`/seminar/images/` は 404 を返します。URL を扱う際は UTAGE 側を正としてください。

Zoom の参加 URL は LP には記載していません。申込者に UTAGE のサンクスメール／リマインドメールで配信されます。

## セットアップ

画像生成スクリプトを使う場合のみ必要です。HTML はそのままブラウザで開けます。

1. `.env.example` をコピーして `.env` を作成します。

   ```bash
   cp .env.example .env
   ```

2. `.env` に OpenAI の API キーを記入します。`.env` は `.gitignore` で除外されており、コミットされません。

   ```
   OPENAI_API_KEY=sk-...
   ```

`scripts/generate_image.mjs` は `process.loadEnvFile()` で `.env` を読み込みます。**Node.js 20.12 以上**（または 21.7 以上）が必要です。`.env` がなくても、シェルの環境変数に `OPENAI_API_KEY` があればそちらを使います。

## 使い方

### 画像を生成する

```bash
node scripts/generate_image.mjs "prompt text" --out seminar/images/hero.jpg
```

| オプション | 既定値 | 説明 |
| --- | --- | --- |
| `--out <path>` | `./generated/<timestamp>.png` | 出力先のパス |
| `--size <WxH>` | `auto` | `1024x1024` / `1024x1536` / `1536x1024` / `auto` |
| `--quality <q>` | `high` | `low` / `medium` / `high` / `auto` |
| `--background <b>` | `auto` | `auto` / `transparent` / `opaque` |
| `--n <count>` | `1` | 生成する枚数 |

出力先の既定ディレクトリ `generated/` は `.gitignore` で除外されています。

### クリップボードの画像を保存する（macOS）

画像をコピー（右クリック →「イメージをコピー」）してから実行します。Finder でファイルをコピーした場合は、その元ファイルがコピーされます。

```bash
./scripts/save-clipboard-image.sh seminar/images/voice-03.jpg
```

## 権利について

本リポジトリに含まれるテキスト、画像、デザインは天道象元および「天命氣学」に帰属します。**無断での複製・転載・二次利用はできません。** スクリプト部分の利用を希望される場合はご連絡ください。
