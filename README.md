# 待ち合わせ駅ファインダー

複数人（2〜5人）の最寄り駅から、**電車での移動時間が公平で、できれば大きな駅**になる
待ち合わせ候補をランキング表示する純クライアント SPA です。

設計は [`../meeting-station-finder-design.md`](../meeting-station-finder-design.md) に、
ビジュアルは Google Labs の [DESIGN.md](https://github.com/google-labs-code/design.md)
フォーマットによる **Heritage**（建築的ミニマリズム／新聞的な品格）デザインシステム
（[`DESIGN.md`](./DESIGN.md)）に従っています。

## 技術スタック

- **Vite + React 18 + TypeScript**（静的出力・バックエンド不要）
- **TanStack Query v5** … K×N の並列フェッチ／重複排除／永続キャッシュ（localStorage, 24h）
- **p-limit** … fetch 層でのグローバル同時実行制限（最大4）
- **Tailwind CSS** … Heritage トークンを `tailwind.config.js` に反映
- **Vitest** … ドメイン純関数とAPI正規化の単体テスト

## 動かす

```bash
npm install
npm run dev       # 開発サーバ
npm test          # Vitest（18 tests）
npm run build     # 型チェック + 本番ビルド → dist/
npm run preview   # dist/ をローカル配信
```

デプロイは `dist/` を Cloudflare Pages または Vercel に静的配置するだけ。
環境変数・サーバー関数は不要です。

## アーキテクチャ要点

```
UI (components/) → orchestration (hooks/useMeetingSearch)
  1. 重心計算 (domain/geo)          centroid + haversine
  2. 候補抽出 (domain/candidates)   重心近傍のハブを上位K=8件
  3. K×N plan を並列実行           p-limit(4) + TanStack Query キャッシュ
  4. スコアリング (domain/score)    score = max + α·stdev − β·hubBonus（小さいほど良い）
データ取得 → api/transitProvider（interface 経由で差し替え可能）→ Transit API
```

- **API 礼儀**：1検索 最大 8候補 × 5人 = 40 plan、同時実行4、結果は永続キャッシュ、
  オートコンプリートは 300ms デバウンス、失敗時リトライは fetch 層で最大1回。
- 候補駅は関東主要ターミナルの**静的ハブリスト**（`data/hubs.ts`）から抽出。
  ハブの `to` は ID 解決の脆さを避けて原則 `geo:lat,lon` で問い合わせます。

## 設計書からの実務的な判断

- **API クライアント**：`openapi-typescript`/`openapi-fetch` の代わりに、`p-limit` で
  スロットルする手書きの型付き fetch クライアントを `transitProvider` interface の背後に
  実装しました。設計書が最重視する「interface による差し替え保険」を満たしつつ、
  ビルド時のネットワーク依存（openapi.json 取得）を排除しています。openapi-fetch への
  差し替えは `api/*.ts` の中だけで完結します。
- **ハブ座標解決**：設計書で「望ましい」とされた build 時 `resolveHubs` スクリプトは未実装。
  概算座標 + `geo:lat,lon` 問い合わせで初期スコープ（関東）には十分なためです。
- **テスト**：plan 正規化は MSW ではなくクライアントモジュールのモックで検証（ネットワーク不使用）。
```
src/
  api/        client, suggest, plan, station, transitProvider(interface)
  domain/     types, geo, candidates, score  ← Vitest 対象の純関数
  data/       hubs
  hooks/      useStationSuggest, useMeetingSearch
  components/ PersonInputList, StationInput, DateTimePicker, ResultList, ResultCard
  lib/        format
```
