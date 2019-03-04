var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCss    = require('gulp-concat-css');
var cleanCSS     = require('gulp-clean-css');
var rename       = require("gulp-rename");
var uglify       = require('gulp-uglify');
var contact      = require('gulp-concat');
var argv         = require('yargs').argv;
var pagebuilder  = require('gulp-pagebuilder');
var runSequence = require('run-sequence');

var opts = {
    root: argv.root
};


gulp.task('serve', function(cb) {

    runSequence(['pb','minjs','mincss','sass'], cb);

    browserSync.init({

        server: "apps/" + opts.root,
        port:8080,
        notify:false,

    });

    gulp.watch("apps/" + opts.root + "/src/**/*.scss", ['sass']);

    gulp.watch("apps/" + opts.root + "/css/style.css", ['mincss']);

    gulp.watch("apps/" + opts.root + "/src/**/*.js", ['minjs']);

    gulp.watch("apps/" + opts.root + "/src/html/**/*.html",['pb']);

    gulp.watch("apps/" + opts.root + "/src/html/**/*.html").on('change', browserSync.reload);

    gulp.watch("apps/" + opts.root + "/css/style.min.css").on('change', browserSync.reload);
});

gulp.task('sass', function() {

    return gulp.src("apps/" + opts.root + "/src/**/*.scss")

        .pipe(sass().on('error', sass.logError))

        .pipe(autoprefixer({

            browsers: ['> 2% in RU', 'last 4 version', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true,

        }))

        .pipe(concatCss("style.css"))

        .pipe(gulp.dest("apps/" + opts.root + "/css"))

        .pipe(browserSync.stream());
});

gulp.task('mincss', function() {

    return gulp.src("apps/" + opts.root + "/css/style.css")

        .pipe(rename({suffix: ".min"}))

        .pipe(cleanCSS())

        .pipe(gulp.dest("apps/" + opts.root + "/css/"));




});

gulp.task('minjs', function() {

    return gulp.src("apps/" + opts.root + "/src/**/*.js")

        .pipe(rename({suffix: ".min"}))

        //.pipe(uglify())

        .pipe ( contact ( 'site.min.js' ) )

        .pipe(gulp.dest("apps/" + opts.root + "/js"));

});

gulp.task('pb',function(){

 return  gulp.src("apps/" + opts.root + '/src/html/*.html')

        .pipe(pagebuilder("apps/" + opts.root + '/src/html/'))

        .pipe(gulp.dest("apps/" + opts.root + "/"));

});

gulp.task('min',['mincss', 'minjs']);
gulp.task('default', ['serve']);