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


var opts = {
    root: argv.root
};


gulp.task('serve', ['sass','mincss','pb','minjs'], function() {

    browserSync.init({

        server: "apps/" + opts.root

    });
    gulp.watch("apps/" + opts.root + "/src/scss/**/*.scss", ['sass']);
    gulp.watch("apps/" + opts.root + "/css/style.css", ['mincss']);
    gulp.watch("apps/" + opts.root + "/src/js/*.js", ['minjs']);
    gulp.watch("apps/" + opts.root + "/src/html/**/*.html",['pb']);
    gulp.watch("apps/" + opts.root + "/src/html/**/*.html").on('change', browserSync.reload);
    gulp.watch("apps/" + opts.root + "/css/style.min.css").on('change', browserSync.reload);
});

gulp.task('sass', function() {

    return gulp.src("apps/" + opts.root + "/src/scss/**/*.scss")

        .pipe(sass().on('error', sass.logError))

        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false

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

    return gulp.src("apps/" + opts.root + "/src/js/*.js")

        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
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