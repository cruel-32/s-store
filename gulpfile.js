const { src, dest, series, parallel, watch } = require('gulp');
const gutil = require('gulp-util'),
    plumber = require('gulp-plumber');
    sourcemaps = require('gulp-sourcemaps'),
    newer = require('gulp-newer'),
    fileinclude = require('gulp-file-include'),
    htmlhint = require("gulp-htmlhint"),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    cssmin = require('gulp-cssmin'),
    gcmq = require('gulp-group-css-media-queries'),
    jshint = require('gulp-jshint'),
    babel = require('gulp-babel'),
    browsersync = require("browser-sync").create(),
    minify = require('gulp-minify'),
    merge = require('merge-stream'),
    inlineCss = require('gulp-inline-css'),
    data = require('gulp-data'),
    template = require('gulp-template'),
    sitemap = require('gulp-sitemap-generator'),
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    origin = "source",
    project = "build",
    prefix = "";

const clean = async (done) => {
    await del([`${project}`]);
    done();
}

const html = ()=> src([`${origin}/**/*.html`, `!${origin}/include/*.html`,`!${origin}/map.html`])
    .pipe(newer(`${origin}/**/*.html`))
    .pipe(fileinclude({
        prefix: '@@',
        basepath: `${origin}/include`,
        context: {
            name: 'example'
        }
    }))
    .pipe(htmlhint('hint/.htmlhintrc'))
    .pipe(data((file)=>{
        return JSON.parse(fs.readFileSync(`${origin}/json/default.json`))
    }))
    .pipe(data((file)=>{
        try {
            const ext = path.extname(file.path);
            const jsonFile = file.path.split(`${origin}\\html\\`)[1].split(ext)[0];
            //html과 같은 경로와 같은 파일명으로 json파일을 넣으면 json데이터가 자동삽입됨
            return JSON.parse(fs.readFileSync(`${origin}/json/${jsonFile}.json`));
        } catch(err){
            return {}
        }
    }))
    .pipe(template())
    .pipe(sitemap({
        'name':`map.html`,
        'noDir': '상위',
        'dest':`${prefix}`,
        'app':`${origin}`,
        'untitle':'-',
        'unknown':'cruel32',
        'noDescription':'설명이 없어요',
        'division':'html'
    }))
    .pipe(dest(`${project}${prefix}`))
    .pipe(browsersync.stream());


const js = ()=> src(`./${origin}/js/**/*.js`)
    .pipe(newer(`${origin}/js/*.js`))
    .pipe(plumber({errorHandler : gutil.log}))
    .pipe(jshint())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    // .pipe(minify({
    //     ext: {
    //         src:'-debug.js',
    //         min: '.js'
    //     },
    //     // exclude: ['tasks'],
    //     ignoreFiles: ['-min.js']
    // }))
    .pipe(dest(`${project}${prefix}/js`))
    .pipe(browsersync.stream());


const css = () => src([`${origin}/sass/**/*.{scss,sass,css}`,`!${origin}/sass/mixin/*.{scss,sass}`])
    .pipe(newer(`${origin}/sass/**/*.{scss,sass,css}`))
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(csscomb({
        configPath: 'hint/.csscomb.json'
    }))
    .pipe(sourcemaps.write())
    // .pipe(cssmin())
    .pipe(dest(`${project}${prefix}/css`))
    .pipe(browsersync.stream());

const browserSyncInit = (done)=>{
    browsersync.init({
        server: {
            baseDir: `${project}/`,
            index: "map.html"
        },
        port: 5000
    },(err,bs)=>{
        console.log('err : ', err);
        console.log('server : ', bs.options.get('server'));
        console.log('urls : ', bs.options.get('urls'));
    });
    done();
}

const watcher = () => {
    watch([`${origin}/html/**/*.html`, `${origin}/json/**/*.json`], html).on('change', browsersync.reload);
    watch([`${origin}/sass/**/*.{scss,sass.css}`], css).on('change', browsersync.reload);
    watch([`${origin}/js/**/*.js`], js).on('change', browsersync.reload);
    // gulp.watch(`${origin}/js/**/*.js`, ['js']);
    // gulp.watch(`${origin}/html/**/*.html`, ['html'])
    // gulp.watch(`${origin}/sass/**/*.{scss,sass.css}`, ['css']);
    // gulp.watch(`${origin}/json/**/*.json`, ['html']);
}

exports.default = series(clean, parallel(html, css, js));
exports.serve = series(clean, parallel(html, css, js), parallel(browserSyncInit, watcher) );

// exports.build = series(clean, parallel(css, javascript));

// const gulp = require('gulp'),
//     gutil = require('gulp-util'),
//     plumber = require('gulp-plumber');
//     sourcemaps = require('gulp-sourcemaps'),
//     newer = require('gulp-newer'),
//     fileinclude = require('gulp-file-include'),
//     htmlhint = require("gulp-htmlhint"),
//     sass = require('gulp-sass'),
//     autoprefixer = require('gulp-autoprefixer'),
//     csscomb = require('gulp-csscomb'),
//     cssmin = require('gulp-cssmin'),
//     gcmq = require('gulp-group-css-media-queries'),
//     jshint = require('gulp-jshint'),
//     babel = require('gulp-babel'),
//     connect = require('gulp-connect'),
//     minify = require('gulp-minify'),
//     merge = require('merge-stream'),
//     inlineCss = require('gulp-inline-css'),
//     data = require('gulp-data'),
//     template = require('gulp-template'),
//     sitemap = require('gulp-sitemap-generator'),
//     fs = require('fs'),
//     path = require('path'),
//     origin = "source",
//     project = "build",
//     prefix = "";

// require('gulp-stats')(gulp);
// sass.compiler = require('node-sass');

// gulp.task('clean', () => {
//     return gulp.src(`${project}`, {
//             read: false
//         })
//         .pipe(clean());
// });

// gulp.task('js', () => {
//     return gulp.src(`./${origin}/js/**/*.js`)
//         .pipe(newer(`${origin}/js/*.js`))
//         .pipe(plumber({errorHandler : gutil.log}))
//         .pipe(jshint())
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         // .pipe(minify({
//         //     ext: {
//         //         src:'-debug.js',
//         //         min: '.js'
//         //     },
//         //     // exclude: ['tasks'],
//         //     ignoreFiles: ['-min.js']
//         // }))
//         .pipe(gulp.dest(`${project}${prefix}/js`))
//         .pipe(connect.reload())
// });

// gulp.task('html', () => {
//     return gulp.src([`${origin}/**/*.html`, `!${origin}/include/*.html`,`!${origin}/map.html`])
//         .pipe(newer(`${origin}/**/*.html`))
//         .pipe(fileinclude({
//             prefix: '@@',
//             basepath: `${origin}/include`,
//             context: {
//                 name: 'example'
//             }
//         }))
//         .pipe(htmlhint('hint/.htmlhintrc'))
//         .pipe(data((file)=>{
//             return JSON.parse(fs.readFileSync(`${origin}/json/default.json`))
//         }))
//         .pipe(data((file)=>{
//             try {
//                 const ext = path.extname(file.path);
//                 const jsonFile = file.path.split(`${origin}\\html\\`)[1].split(ext)[0];
//                 //html과 같은 경로와 같은 파일명으로 json파일을 넣으면 json데이터가 자동삽입됨
//                 return JSON.parse(fs.readFileSync(`${origin}/json/${jsonFile}.json`));
//             } catch(err){
//                 return {}
//             }
//         }))
//         .pipe(template())
//         .pipe(sitemap({
//             'name':`map.html`,
//             'noDir': '상위',
//             'dest':`${prefix}`,
//             'app':`${origin}`,
//             'untitle':'-',
//             'unknown':'cruel32',
//             'noDescription':'설명이 없어요',
//             'division':'html'
//         }))
//         .pipe(gulp.dest(`${project}${prefix}`))
//         .pipe(connect.reload());
// });

// gulp.task('css', () => {
//     return gulp.src([`${origin}/sass/**/*.{scss,sass,css}`,`!${origin}/sass/mixin/*.{scss,sass}`])
//         .pipe(newer(`${origin}/sass/**/*.{scss,sass,css}`))
//         .pipe(sourcemaps.init())
//         .pipe(sass.sync().on('error', sass.logError))
//         // .pipe(sass().on('error', sass.logError))
//         .pipe(autoprefixer())
//         .pipe(gcmq())
//         .pipe(csscomb({
//             configPath: 'hint/.csscomb.json'
//         }))
//         /*
//             *** csscomb 커스터마이징 ***
//             node_modules/csscomb/lib/options/strip-spaces.js 파일에서 9 lines 수정

//             수정전:
//             return string.replace(/[ \t]+\n/g, '\n');
            
//             수정후:
//             return string.replace(/[ \t]+\n/g, '\n').replace(/\n\n/g, '\n');
//         */
//         .pipe(sourcemaps.write())
//         // .pipe(cssmin())
//         .pipe(gulp.dest(`${project}${prefix}/css`))
//         .pipe(connect.reload());
// });

// gulp.task('inlineCss',function(){
//     return gulp.src([`${origin}/inline/**/*.html`])
//         .pipe(newer(`${origin}/inline/**/*.html`))
//         .pipe(inlineCss({
//             applyStyleTags: true,
//             applyLinkTags: true,
//             removeStyleTags: true,
//             removeLinkTags: true
//         }))
//         .pipe(gulp.dest(`${project}${prefix}`))
//         .pipe(connect.reload());
// })

// gulp.task('connect', function() {
//     connect.server({
//         root: `${project}`,
//         port: 5000,
//         livereload: true
//     });
// });

// gulp.task('watch', () => {
//     gulp.watch(`${origin}/js/**/*.js`, ['js']);
//     gulp.watch(`${origin}/html/**/*.html`, ['html'])
//     gulp.watch(`${origin}/sass/**/*.{scss,sass.css}`, ['css']);
//     gulp.watch(`${origin}/json/**/*.json`, ['html']);
// });

// gulp.task('default', ['html', 'css', 'js']);
// gulp.task('serve', ['connect', 'watch']);