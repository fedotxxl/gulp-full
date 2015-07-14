var gulp = require("gulp");
var del = require("del");
var path = require("path");
var lazypipe = require("lazypipe");
var $ = require("gulp-load-plugins")({lazy: false});

var paths = {
    src: "./src",
    assets: {
        src: "./assets",
        target: "./build/sources/assets"
    },
    target: {
        root: "./build",
        js: "./build/js",
        css: "./build/css"
    },
    scss: {
        src: "./scss",
        target: "./assets/css/scss/"
    }
};

gulp.task("clean", function (cb) {
    del(paths.target.root, cb);
});

gulp.task("clean:assets", function (cb) {
    del([paths.target.js, paths.target.css], cb);
});

gulp.task("scss", function () {
    return gulp.src(pathAny(paths.scss.src))
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.autoprefixer('last 1 version', '> 1%', 'ie 8'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(paths.scss.target));
});

gulp.task("useref", function () {
    var options = {
        searchPath: paths.assets.src
    };

    var sourceMapsWriteOptions = {
        sourceRoot: "/sources/does-not-matter/",
        includeContent: false
    };

    var cssFilter = $.filter("**/*.css");
    var jsFilter = $.filter("**/*.js");
    var assets = $.useref.assets(options, lazypipe().pipe($.sourcemaps.init, {loadMaps: true}));

    var stream = gulp
        .src(pathAny(paths.src, "html"))
        .pipe($.htmlExtend({annotations: false, verbose: true, root: paths.src}))
        .pipe(assets);

    var processJs = lazypipe()
        .pipe($.ngAnnotate, {gulpWarnings: false})
        .pipe($.uglify);

    if (isProduction()) {
        stream = stream
            .pipe($.if("*.js", processJs()))
            .pipe($.if("*.css", $.minifyCss()))
            .pipe($.rev())
            .pipe($.if("*.js", $.sourcemaps.write(".", sourceMapsWriteOptions)));
    }

    return stream
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(paths.target.root))
});

gulp.task("assets", function() {
    return gulp
        .src(pathAny(paths.assets.src))
        .pipe(gulp.dest(paths.target.root))
});

gulp.task("assets:copy-original", function() {
    return gulp
        .src(pathAny(paths.assets.src, "js"))
        .pipe(gulp.dest(paths.assets.target))
});

gulp.task("htmlExtend", function () {
    return gulp
        .src(pathAny(paths.src, "html"))
        .pipe($.htmlExtend({annotations: false, verbose: true, root: paths.src}))
        .pipe(gulp.dest(paths.target.root))
});

gulp.task("webserver:run", function () {
    gulp.src(paths.target.root)
        .pipe($.webserver({
            host: "0.0.0.0"
        }));
});

gulp.task("build.dev", gulp.series("clean", "scss", "htmlExtend", "assets"));

gulp.task("build.prod", gulp.series("clean", "scss", "useref", "assets:copy-original"));

gulp.task("webserver", gulp.series("build.dev", "webserver:run"));

(function watch() {
    gulp.task("watch:scss", function() {
        $.watch(pathAny(paths.scss.src), gulp.series("scss"))
    });

    gulp.task("watch:assets", function() {
        $.watch(pathAny(paths.assets.src), gulp.series("clean:assets", "assets"))
    });

    gulp.task("watch:html", function() {
        $.watch(pathAny(paths.src), gulp.series("build.dev"))
    });

    gulp.task("watch", gulp.series("build.dev", gulp.parallel("webserver:run", "watch:scss", "watch:assets", "watch:html")));
})();

function pathAny(dir, extension) {
    return path.join(dir, "**/*." + (extension || "*"))
}

function isProduction() {
    return !($.util.env.prod === undefined)
}

function ifProduction(doStream) {
    return isProduction() ? doStream : gutil.noop();
}

(function() {
  if (isProduction()) {
      $.util.log("----PRODUCTION ENV----")
  } else {
      $.util.log("----DEV ENV----")
  }
})();