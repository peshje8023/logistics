# logistics
一个对天猫国际平台后台自动发货的操作脚本。使用sheet.js插件，读取本地excel文件，使用vue的列表循环v-for生成待发货列表。使用setInterval函数，计时循环打开发货页面。使用python读取本地excel，并用flask部署本地服务器，生成一个查询物流单号的接口。使用tampermonkey对发货页面注入代码------jquery的jsonp跨域获取本地服务器的单号，并自动填充表单，提交。对发货结果判断，发货成功的自动关闭。以上实现了一个一键发货的脚本。

