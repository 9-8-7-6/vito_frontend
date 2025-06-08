#!/bin/bash

TARGET_FILE=".env"

if [ -f "$TARGET_FILE" ]; then
    cp "$TARGET_FILE" "$TARGET_FILE.bak"
    echo "🔁 Existing $TARGET_FILE backed up as $TARGET_FILE.bak"
fi

echo "🌐 Generating $TARGET_FILE for Vite..."

cat > "$TARGET_FILE" <<EOF
VITE_API_BASE_URL=https://api.vito-tw.com
EOF

echo "$TARGET_FILE created with VITE_API_BASE_URL"
