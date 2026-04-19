#!/bin/bash
# FlowMind 监控脚本 - 监听源码变化后自动构建 dmg

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

BUILD_SCRIPT="$SCRIPT_DIR/build-dmg.sh"

echo "👀 开始监控 src/ 目录变化..."

fswatch -r src/ --exclude node_modules | while read -r event; do
    echo ""
    echo "📝 检测到变化: $event"
    echo "🔨 开始构建..."
    "$BUILD_SCRIPT"
done
