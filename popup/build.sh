#!/usr/bin/env bash
set -euo pipefail

EXT_DIR="snap-doc-extension"          # where the source lives
BUILD_DIR="snap-doc-build"            # freshly assembled folder
ZIP_NAME="snap-doc-extension.zip"     # deliverable
DOCX_VERSION="8.1.3"                  # keep in sync if you upgrade

# 1. clean & re-create build dir
rm -rf "$BUILD_DIR" "$ZIP_NAME"
mkdir -p "$BUILD_DIR"

# 2. copy source files
cp -R "$EXT_DIR/." "$BUILD_DIR/"

# 3. fetch docx.min.js locally (only once, cached by curls -z)
curl -z "$BUILD_DIR/libs/docx.min.js" \
     -L "https://cdn.jsdelivr.net/npm/docx@${DOCX_VERSION}/build/index.umd.js" \
     -o "$BUILD_DIR/libs/docx.min.js"

# 4. make sure popup.html points to the local copy
sed -i.bak 's|https://cdn.jsdelivr.net.*/docx[^"]*|../libs/docx.min.js|' \
    "$BUILD_DIR/popup/popup.html"
rm "$BUILD_DIR/popup/popup.html.bak"

# 5. zip it up
(cd "$BUILD_DIR" && zip -qr "../$ZIP_NAME" .)

echo "✅ Built $ZIP_NAME (contains $(wc -c <"$ZIP_NAME") bytes)"
