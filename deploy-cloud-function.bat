@echo off
echo 开始部署云函数...

REM 设置环境变量
set envId=prod-2gekgttq8daf0fa6
set functionName=messageCloudFunction

echo 云环境ID: %envId%
echo 云函数名称: %functionName%

REM 这里需要手动在微信开发者工具中部署云函数
echo.
echo 请按照以下步骤手动部署云函数：
echo 1. 打开微信开发者工具
echo 2. 导入项目：%cd%
echo 3. 在云开发控制台中部署云函数：%functionName%
echo 4. 确保云环境ID为：%envId%
echo.
echo 或者使用微信开发者工具的命令行工具：
echo cloud functions deploy --e %envId% --n %functionName% --r --project %cd%

pause 