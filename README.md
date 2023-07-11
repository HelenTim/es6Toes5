# wxappSlim
gulp 压缩小程序、小程序瘦身

修改小程序目录地址，以及压缩后的输出地址
```
const entry = '../wx'       // 小程序地址
const output = './dist'     // 输出目录
```

命令行执行 

`npm install` 安装依赖

`npm run clean` 清空输出目录

`npm run dev` 清空输出目录，并压缩代码输出


js 压缩使用 gulp-uglify, wxss压缩使用 gulp-clean-css, wxml 使用 gulp-htmlmin 过程存在bug, 暂时关闭
