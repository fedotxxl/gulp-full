var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var path = require('path');
var rimraf = require('gulp-rimraf');
var $ = require('gulp-load-plugins')({ lazy: false });

var paths = {
    src: "/",
    target: "build",
    scss: {
        src: "./scss",
        target: "./assets/css/scss/"
    }
};

gulp.task("clean", function(cb) {
    del(paths.target, cb);
});

gulp.task("scss", function () {
    return gulp.src(pathAny(paths.scss.src))
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(paths.scss.target));
});

gulp.task("usemin", function() {

});

gulp.task("htmlExtend", function() {

});

gulp.task("build.dev", function() {
    return gulp.series("clean", "scss", "htmlExtend");
});

gulp.task("build.prod", function(){
    return gulp.series("clean", "scss", "usemin", "htmlExtend");
});

function pathAny(dir) {
    return path.join(dir, "**/*.*")
}