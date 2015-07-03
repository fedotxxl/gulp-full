var gulp = require('gulp');
var del = require('del');
var path = require('path');
var lazypipe = require('lazypipe');
var $ = require('gulp-load-plugins')({lazy: false});

var paths = {
    src: "./src",
    assets: "./assets",
    target: "./build",
    scss: {
        src: "./scss",
        target: "./assets/css/scss/"
    }
};

gulp.task("clean", function (cb) {
    del(paths.target, cb);
});

gulp.task("scss", function () {
    return gulp.src(pathAny(paths.scss.src))
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(paths.scss.target));
});

gulp.task("usemin", function () {
    var options = {
        searchPath: paths.assets
    };

    var sourceMapsWriteOptions = {
        sourceRoot: "/v1"
    };

    var cssFilter = $.filter('**/*.css');
    var jsFilter = $.filter('**/*.js');
    var assets = $.useref.assets(options, lazypipe().pipe($.sourcemaps.init, {loadMaps: true}));

    var stream = gulp
        .src(path.join(paths.src, '**/*.html'))
        .pipe(assets);

    var processJs = lazypipe()
        .pipe($.ngAnnotate)
        .pipe($.uglify);

    if (isProduction()) {
        stream = stream
            .pipe($.if('*.js', processJs()))
            .pipe($.if('*.css', $.minifyCss()))
            .pipe($.rev())
            .pipe($.if('*.js', $.sourcemaps.write('.', sourceMapsWriteOptions)));
    }

    return stream
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(paths.target))
});

gulp.task("htmlExtend", function () {
    return gulp
        .src(path.join(paths.target, '**/*.html'))
        .pipe($.htmlExtend({annotations: false, verbose: true, root: paths.target}))
        .pipe(gulp.dest(paths.target))
});

gulp.task("cleanAndUsemin", gulp.series("clean", "usemin"));

gulp.task("build.dev", gulp.series("clean", "scss", "htmlExtend"));

gulp.task("build.prod", gulp.series("clean", "scss", "usemin", "htmlExtend"));

function pathAny(dir) {
    return path.join(dir, "**/*.*")
}

function isProduction() {
    return !($.util.env.prod === undefined)
}

function ifProduction(doStream) {
    return isProduction() ? doStream : gutil.noop();
}