var gulp = require('gulp'),
    autoprefixer = require('autoprefixer-core'),
    data = require('gulp-data'),
    ghPages = require('gh-pages'),
    jade = require('gulp-jade'),
    lodash = require('lodash'),
    postcss = require('gulp-postcss'),
    path = require('path'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    yaml = require('read-yaml');
 
var paths = {
  sass:         ['./src/sass/**/*.scss'],
  static:       ['./src/static/*.*'],
  js:           ['./src/js/**/*.js'],
  dist:         './dist'
};

var cfg = {
  autoprefixer: { browsers: ['last 2 version'] },
  jade: { pretty: true,
          debug: false,
          compileDebug: false
        }
};

gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())  
    .pipe(sass())
    .pipe( postcss([ autoprefixer(cfg.autoprefixer) ]) )
    .pipe( sourcemaps.write('maps') )
    .pipe( gulp.dest(path.join(paths.dist, 'css')) );
});

gulp.task('static', function() {
  return gulp.src(paths.static)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('templates', function() {
  return gulp.src('./src/jade/*.jade')
    .pipe(data( function(file) {
        var json = require('./src/data/the-big-data.json');
        json._ = lodash;
        return json;
      } ))
    .pipe(jade( cfg.jade ))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe( gulp.dest(path.join(paths.dist, 'js')) );
});

gulp.task('deploy', function() {
 ghPages.publish(paths.dist);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['sass', 'static', 'templates', 'js']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['sass', 'static', 'templates', 'js']);
