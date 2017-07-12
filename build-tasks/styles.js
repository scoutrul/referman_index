
var gulp      = require('gulp'),
  gConfig     = require('../gulp-config'),
  utils       = require('./utils'),
  opts        = gConfig.pluginOpts,
  env         = utils.getEnv(),
  src         = gConfig.paths.sources,
  dest        = gConfig.paths.destinations,
  plugins     = require('gulp-load-plugins')(opts.load),
  koutoSwiss = require('kouto-swiss'),
  typographic = require('typographic'),
  /* styles:lint */
  lint = function() {
    return gulp.src(src.styles)
      .pipe(plugins.stylint(opts.stylint))
      .pipe(plugins.stylint.reporter());
  },
  /* styles:compile */
  compile = function() {
    return gulp.src(src.styles)
      .pipe(plugins.plumber())
      .pipe(plugins.concat(gConfig.pkg.name + '.stylus'))
      .pipe(plugins.stylus({
            "use": [koutoSwiss(), typographic()]
        }))
      .pipe(plugins.prefix(opts.prefix))
      .pipe(env.stat ? plugins.size(opts.gSize): plugins.gUtil.noop())
      .pipe(env.deploy ? plugins.gUtil.noop(): gulp.dest(env.dist ? dest.dist: dest.css))
      .pipe(plugins.minify())
      .pipe(plugins.rename(opts.rename))
      .pipe(env.stat ? plugins.size(opts.gSize): plugins.gUtil.noop())
      .pipe(gulp.dest(env.dist ? dest.dist: dest.css));
  },
  /* styles:watch */
  watch = function() {
    gulp.watch(src.styles, ['compile:styles']);
  };

module.exports = {
  lint   : lint,
  compile: compile,
  watch  : watch
};
