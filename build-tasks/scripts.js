var gulp      = require('gulp'),
  gConfig     = require('../gulp-config'),
  utils       = require('./utils'),
  opts        = gConfig.pluginOpts,
  env         = utils.getEnv(),
  src         = gConfig.paths.sources,
  dest        = gConfig.paths.destinations,
  plugins     = require('gulp-load-plugins')(opts.load),
  /* scripts:lint */
  lint = function() {
    return gulp.src(src.scripts)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format());
  },
  /* scripts:compile */
  compile = function() {
    return gulp.src(src.scripts)
      .pipe(plugins.plumber())
      .pipe(plugins.babel(opts.babel))
      .pipe(env.mapped ? gulp.dest(dest.js): plugins.gUtil.noop())
      .pipe(env.mapped ? plugins.sourcemaps.init(): plugins.gUtil.noop())
      .pipe(plugins.concat(gConfig.pkg.name + '.js'))
      .pipe(plugins.wrap(opts.wrap))
      .pipe(env.stat ? plugins.size(opts.gSize): plugins.gUtil.noop())
      .pipe(env.deploy ? plugins.gUtil.noop(): gulp.dest(env.dist ? dest.dist: dest.js))
      .pipe(plugins.uglify())
      .pipe(plugins.rename(opts.rename))
      .pipe(env.mapped ? plugins.sourcemaps.write('./'): plugins.gUtil.noop())
      .pipe(env.stat ? plugins.size(opts.gSize): plugins.gUtil.noop())
      .pipe(gulp.dest(env.dist ? dest.dist: dest.js));
  },
  /* scripts:watch */
  watch = function() {
    gulp.watch(src.scripts, ['compile:scripts']);
  };

module.exports = {
  lint   : lint,
  compile: compile,
  watch  : watch
};
