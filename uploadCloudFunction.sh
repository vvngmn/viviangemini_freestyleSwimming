#!/bin/bash

# 设置环境变量
export installPath="/usr/local/bin"
export envId="prod-2gekgttq8daf0fa6"
export projectPath="$(pwd)"

echo "开始部署云函数..."

# 部署客服消息云函数
echo "部署 messageCloudFunction..."
${installPath} cloud functions deploy --e ${envId} --n messageCloudFunction --r --project ${projectPath}

echo "云函数部署完成！" 