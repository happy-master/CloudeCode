#!/bin/bash
# クリップボードの画像をファイルに保存する（macOS専用）
#
# 使い方:
#   ./scripts/save-clipboard-image.sh seminar/images/voice-03.jpg
#   ./scripts/save-clipboard-image.sh ~/Desktop/test.png
#
# 画像をコピー（右クリック →「イメージをコピー」）してから実行してください。
# Finder でファイルをコピーした場合は、その元ファイルをコピーします。

set -euo pipefail

DEST="${1:-}"
if [ -z "$DEST" ]; then
  echo "エラー: 保存先を指定してください" >&2
  echo "例: $0 seminar/images/voice-03.jpg" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"

# 1) Finder でファイルをコピーした場合は、そのファイルを直接コピー
SRC=$(osascript -e 'POSIX path of (the clipboard as «class furl»)' 2>/dev/null || true)
if [ -n "$SRC" ] && [ -f "$SRC" ]; then
  cp "$SRC" "$DEST"
  echo "元ファイルからコピーしました: $SRC"
else
  # 2) 画像データそのものがクリップボードにある場合は PNG として書き出す
  osascript \
    -e "set f to open for access POSIX file \"$(cd "$(dirname "$DEST")" && pwd)/$(basename "$DEST")\" with write permission" \
    -e 'set eof f to 0' \
    -e 'write (the clipboard as «class PNGf») to f' \
    -e 'close access f'
  echo "クリップボードの画像を書き出しました"
fi

# 保存結果を表示
if command -v sips >/dev/null; then
  SIZE=$(sips -g pixelWidth -g pixelHeight "$DEST" 2>/dev/null | awk '/pixelWidth|pixelHeight/{printf "%s ", $2}')
  echo "保存先: $DEST  (${SIZE}px, $(du -h "$DEST" | cut -f1))"
fi
