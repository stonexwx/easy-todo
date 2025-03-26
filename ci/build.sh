#!/bin/bash
set -e

# 此脚本用于 CI 环境中构建应用程序

# 检查是否存在 TAURI_SIGNING_PRIVATE_KEY
if [ -z "$TAURI_SIGNING_PRIVATE_KEY" ]; then
  echo "警告: TAURI_SIGNING_PRIVATE_KEY 环境变量未设置，将禁用自动更新功能"
  # 在没有签名密钥的情况下，完全禁用 updater 功能
  jq 'del(.plugins.updater) | del(.bundle.createUpdaterArtifacts)' src-tauri/tauri.conf.json > temp.json && mv temp.json src-tauri/tauri.conf.json
fi

# 构建应用
echo "开始构建应用..."
yarn tauri build

# 如果是 CI 环境，且有私钥，则创建 latest.json
if [ ! -z "$TAURI_SIGNING_PRIVATE_KEY" ] && [ ! -z "$CI" ]; then
  echo "生成 latest.json 用于更新..."
  
  # 获取版本号
  VERSION=$(jq -r '.version' src-tauri/tauri.conf.json)
  
  # 创建 latest.json
  cat > latest.json << EOF
{
  "version": "$VERSION",
  "notes": "新版本发布",
  "platforms": {
    "darwin-aarch64": {
      "signature": "",
      "url": "https://github.com/easy-todo/easy-todo/releases/download/v$VERSION/easy-todo_${VERSION}_aarch64.dmg"
    },
    "darwin-x86_64": {
      "signature": "",
      "url": "https://github.com/easy-todo/easy-todo/releases/download/v$VERSION/easy-todo_${VERSION}_x64.dmg"
    },
    "linux-x86_64": {
      "signature": "",
      "url": "https://github.com/easy-todo/easy-todo/releases/download/v$VERSION/easy-todo_${VERSION}_amd64.AppImage"
    },
    "windows-x86_64": {
      "signature": "",
      "url": "https://github.com/easy-todo/easy-todo/releases/download/v$VERSION/easy-todo_${VERSION}_x64-setup.exe"
    }
  }
}
EOF

  echo "构建完成！"
fi 