#!/bin/bash
# FlowMind 构建脚本 - 自动构建并复制 dmg 到桌面

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "📦 开始构建 FlowMind..."

# 安装缺失的依赖
echo "🔧 检查依赖..."
npm install @szmarczak/http-timer atomically 2>/dev/null || true

# 运行构建
echo "🔨 运行 tsc + vite build..."
npx tsc && npx vite build

# 运行 electron-builder
echo "🔧 运行 electron-builder..."
npx electron-builder --mac

# 复制 dmg 到桌面
echo "📋 复制 dmg 到桌面..."
cp release/FlowMind-1.0.0-arm64.dmg ~/Desktop/

echo "✅ 完成！dmg 已更新：~/Desktop/FlowMind-1.0.0-arm64.dmg"
