# wxappSlim
gulp 压缩编译代码

```
const entry = '../wx'       // 资源入口
const output = './dist'     // 输出目录
```

命令行执行 

`npm install` 安装依赖

`npm run clean` 清空输出目录

`npm run dev` 清空输出目录，并压缩代码输出


js 压缩使用 gulp-uglify, wxss压缩使用 gulp-clean-css, wxml 使用 gulp-htmlmin 过程存在bug, 暂时关闭
### 页面配合polyfill使用
  + 页面需要引入babel-polyfill包里的dist目录下的polyfill.js文件
  + 直接 npm run dev 即可。尤其是在使用 async函数时，polyfill里面会提供一个特别的变量 regeneratorRuntime
  + 如果 npm run build  那么转出来的代码就不要任何poltfill了。但是编译的结果也导致无法单独调用某个函数了。
