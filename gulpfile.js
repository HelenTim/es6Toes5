const { src, dest, series} = require('gulp');
const gulpif = require('gulp-if');
const lazypipe = require('lazypipe');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

const webpack = require('webpack-stream');
const named = require('vinyl-named');
const rename = require("gulp-rename");

const entry = './src'    // ass地址
// const entry = '../egg_wx'    // 小程序地址
// const entry = './demo'      // 示例地址
const output = './dist'     // 输出目录

const isASS = (file) => file.extname === '.ass';
const isJS = (file) => file.extname === '.js';
const isCSS = (file) => file.extname === '.wxss' || file.extname === '.css';
const isWXML = (file) => file.extname === '.wxml' || file.extname === '.html';

const uglifyOption = {
  // 压缩配置
  compress: { 
    drop_console: true,
  },
  // 输出配置
  output: {
    comments: false,    // 移除注释
  },
  toplevel: false,    // 不要混淆最高作用域中的变量和函数名
}
const jsChannel = lazypipe()
    .pipe(babel, {
        presets: ["@babel/env"],
        plugins: ["@babel/plugin-proposal-class-properties"], // 编译class语法。
    })
    .pipe(uglify, uglifyOption);

const esChannel = lazypipe()
  .pipe(named)
  .pipe(webpack, {
    module: {
      rules: [{
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader', 
            options: {
              presets: ['@babel/env'],
              plugins: ["@babel/plugin-transform-runtime"] 
            }
          }
        ],
        exclude: /node_modules/
      }]
    }
  })
  .pipe( uglify, uglifyOption)

  // 文件重命名 转换方法
const assChannel = lazypipe()
  // 注意传参写法！！
  .pipe(rename, path=> {
    let base = path.basename
    let idx = base.match(/\d{3}/g)[0]
    console.log(base, idx)
    path.basename = `第${idx}话`;
  })

// 清理
async function clean(){
  await del(output);
}
async function fileBuild() {
    src([ 
    // `node_modules/babel-polyfill/dist/polyfill.js`,  // 添加polyfill，不过打包后会生成这个js文件，还不如再浏览器里直接引入这个文件。
    `${entry}/**/*`,
    `!${entry}/**/.*`,
    `!${entry}/node_modules/*`,
    `!${entry}/**/*.md`,
  ], {
    allowEmpty: true
  })
  // 分别处理 js、wxss、wxml
  .pipe(gulpif( isJS, jsChannel()))
  .pipe(gulpif( isCSS, cleanCss()))
  // 取消对 wxml 的处理，<input></input>等与 html 中存在冲突
  .pipe(dest(output))
}

async function chunkBuild() {
  src([ 
    `${entry}/**/*`,
    `!${entry}/**/.*`,
    `!${entry}/node_modules/*`,
    `!${entry}/**/*.md`,
  ], {
    allowEmpty: true
  })
  // 分别处理 js、wxss、wxml
  .pipe(gulpif( isJS, esChannel()))
  .pipe(gulpif( isCSS, cleanCss()))
  .pipe(gulpif( isWXML, htmlmin({
    caseSensitive: true,      //  大小写敏感
    removeComments: true,     // 	删除HTML注释
    keepClosingSlash: true,   // 单标签上保留斜线
    collapseWhitespace: true, // 压缩HTML
    minifyJS: true,           // 压缩页面JS
    minifyCSS: true,          // 压缩页面CSS
  })))
  .pipe(dest(output))
}

async function renameBuild(){
  src([ 
    `${entry}/*.ass`,
  ], {
    allowEmpty: true
  })
  .pipe(gulpif( isASS, assChannel()))
  .pipe(dest(output))
}

exports.clean = clean
exports.rename = series( clean, renameBuild)    // 文件重命名
exports.build = series( clean, chunkBuild)      // html 压缩
exports.default = series( clean, fileBuild)     // 小程序压缩
