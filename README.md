 顔工場
=====================

HOMEWORKS2020（2021/1/23 〜 2021/1/24 PINEBROOKLYN）で展示した「顔工場」のプログラムです。

[当日資料.md](当日資料.md)<br><br>


![動いている様子]( https://img.youtube.com/vi/4Waat2NeyN0/maxresdefault.jpg)
<br>
https://youtu.be/4Waat2NeyN0

## 環境構築

node.js（12.16.2で実行）

```
$ npm install
```

## デバッグ実行
```
$ npm run dev
```
http://localhost:3000/ へアクセスする。

## 実行
```
$ npm run build
$ npm run start
```
http://localhost:3000/ へアクセスする。

## 「顔工場」の説明文

来場者の顔をパーツとして仕入れて顔を組み立てて出荷する工場です。

工場や倉庫内をうろうろする搬送ロボットが可愛く見えたので、プログラミングしました。
インタラクションとして顔を入力することにし、工場の目的として顔を組み立てることにしました。

複数画面で工場の様子を確認できるようにするため、node.jsとsocket.ioベースのサーバークライアントシステムにし、複数ブラウザで連動する仕組みにしました。

顔の検出はtensorflow.jsで扱えるface-landmarks-detectionを使い、Webカメラの情報から3Dメッシュを生成しています。

