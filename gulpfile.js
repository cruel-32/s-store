const gulp = require('gulp'),
    gutil = require('gulp-util'),
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
    connect = require('gulp-connect'),
    minify = require('gulp-minify'),
    merge = require('merge-stream'),
    inlineCss = require('gulp-inline-css'),
    data = require('gulp-data'),
    template = require('gulp-template'),
    sitemap = require('gulp-sitemap-generator'),
    fs = require('fs'),
    path = require('path'),
    origin = "source",
    project = "build",
    prefix = "";

require('gulp-stats')(gulp);
sass.compiler = require('node-sass');

gulp.task('clean', () => {
    return gulp.src(`${project}`, {
            read: false
        })
        .pipe(clean());
});

gulp.task('js', () => {
    return gulp.src(`./${origin}/js/**/*.js`)
        .pipe(newer(`${origin}/js/*.js`))
        .pipe(plumber({errorHandler : gutil.log}))
        .pipe(jshint())
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(minify({
        //     ext: {
        //         src:'-debug.js',
        //         min: '.js'
        //     },
        //     // exclude: ['tasks'],
        //     ignoreFiles: ['-min.js']
        // }))
        .pipe(gulp.dest(`${project}${prefix}/js`))
        .pipe(connect.reload())
});

gulp.task('html', () => {
    return gulp.src([`${origin}/**/*.html`, `!${origin}/include/*.html`,`!${origin}/map.html`])
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
        .pipe(gulp.dest(`${project}${prefix}`))
        .pipe(connect.reload());
});

gulp.task('css', () => {
    return gulp.src([`${origin}/sass/**/*.{scss,sass,css}`,`!${origin}/sass/mixin/*.{scss,sass}`])
        .pipe(newer(`${origin}/sass/**/*.{scss,sass,css}`))
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        // .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gcmq())
        .pipe(csscomb({
            configPath: 'hint/.csscomb.json'
        }))
        /*
            *** csscomb 커스터마이징 ***
            node_modules/csscomb/lib/options/strip-spaces.js 파일에서 9 lines 수정

            수정전:
            return string.replace(/[ \t]+\n/g, '\n');
            
            수정후:
            return string.replace(/[ \t]+\n/g, '\n').replace(/\n\n/g, '\n');
        */
        .pipe(sourcemaps.write())
        // .pipe(cssmin())
        .pipe(gulp.dest(`${project}${prefix}/css`))
        .pipe(connect.reload());
});

gulp.task('inlineCss',function(){
    return gulp.src([`${origin}/inline/**/*.html`])
        .pipe(newer(`${origin}/inline/**/*.html`))
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(gulp.dest(`${project}${prefix}`))
        .pipe(connect.reload());
})

gulp.task('connect', function() {
    connect.server({
        root: `${project}`,
        port: 5000,
        livereload: true
    });
});

gulp.task('watch', () => {
    gulp.watch(`${origin}/js/**/*.js`, ['js']);
    gulp.watch(`${origin}/html/**/*.html`, ['html'])
    gulp.watch(`${origin}/sass/**/*.{scss,sass.css}`, ['css']);
    gulp.watch(`${origin}/json/**/*.json`, ['html']);
});

gulp.task('default', ['html', 'css', 'js']);
gulp.task('serve', ['connect', 'watch']);