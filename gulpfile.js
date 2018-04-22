const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')
const minify = require('rollup-plugin-babel-minify')
const merge = require('merge2')
const browserSync = require('browser-sync').create()
const pify = require('pify')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const packageJson = require('./package.json')
const execute = require('./utils/execute')

const projectName = 'pleasantalert'

const banner = `/*!
* ${packageJson.name} v${packageJson.version}
* Released under the ${packageJson.license} License.
*/`

const allScriptFiles = ['**/*.js', '!dist/**', '!node_modules/**']
const srcScriptFiles = ['src/js/**/*.js']
const srcStyleFiles = ['src/sass/**/*.scss']
const tsFiles = [projectName + '.d.ts']

const continueOnLintError = process.argv.includes('--continue-on-lint-error')
const skipMinification = process.argv.includes('--skip-minification')
const skipStandalone = process.argv.includes('--skip-standalone')

const removeDir = pify(rimraf)
const createDir = pify(mkdirp)

// ---

gulp.task('clean', async () => {
  await removeDir('dist')
  await createDir('dist')
})

gulp.task('build:scripts', () => {
  const rollupPlugins = [
    json(),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        'external-helpers'
      ]
    })
  ]
  if (!skipMinification) {
    rollupPlugins.push(
      minify({
        banner,
        bannerNewLine: true,
        comments: false
      })
    )
  }
  return gulp.src(['package.json', ...srcScriptFiles])
    .pipe($.rollup({
      allowRealFiles: true, // !IMPORTANT, it avoids the hypothetical file system error
      plugins: rollupPlugins,
      input: 'src/js/' + projectName + '.js',
      output: {
        format: 'umd',
        name: 'Pleasantalert',
        banner: banner,
        footer: `\
if (typeof window !== 'undefined' && window.Pleasantalert){\
  window.pleasant = window.Pleasantalert = window.Pleasant = window.PleasantAlert = window.Pleasantalert\
}`
      }
    }))
    .pipe(gulp.dest('dist'))
    .pipe($.if(!skipMinification, $.rename('' + projectName + '.min.js')))
    .pipe($.if(!skipMinification, gulp.dest('dist')))
})

gulp.task('build:styles', () => {
  return gulp.src('src/sass/' + projectName + '.scss')
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest('dist'))
    .pipe($.if(!skipMinification, $.cleanCss()))
    .pipe($.if(!skipMinification, $.rename('' + projectName + '.min.css')))
    .pipe($.if(!skipMinification, gulp.dest('dist')))
})

/**
 * Warning: This task depends on dist/' + projectName + '.js & dist/' + projectName + '.css
 */
gulp.task('build:standalone', () => {
  const prettyJs = gulp.src('dist/' + projectName + '.js')
  const prettyCssAsJs = gulp.src('dist/' + projectName + '.css')
    .pipe($.css2js())
  const prettyStandalone = merge(prettyJs, prettyCssAsJs)
    .pipe($.concat('' + projectName + '.all.js'))
    .pipe(gulp.dest('dist'))
  if (skipMinification) {
    return prettyStandalone
  } else {
    const uglyJs = gulp.src('dist/' + projectName + '.min.js')
    const uglyCssAsJs = gulp.src('dist/' + projectName + '.min.css')
      .pipe($.css2js())
    const uglyStandalone = merge(uglyJs, uglyCssAsJs)
      .pipe($.concat('' + projectName + '.all.min.js'))
      .pipe(gulp.dest('dist'))
    return merge([prettyStandalone, uglyStandalone])
  }
})

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('build:scripts', 'build:styles'),
  ...(skipStandalone ? [] : ['build:standalone'])
))

gulp.task('default', gulp.parallel('build'))

// ---

gulp.task('lint:scripts', () => {
  return gulp.src(allScriptFiles)
    .pipe($.standard())
    .pipe($.standard.reporter('default', {
      breakOnError: !continueOnLintError
    }))
})

gulp.task('lint:styles', () => {
  return gulp.src(srcStyleFiles)
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.if(!continueOnLintError, $.sassLint.failOnError()))
})

gulp.task('lint:ts', () => {
  return gulp.src(tsFiles)
    .pipe($.typescript({ lib: ['es6', 'dom'] }))
    .pipe($.tslint({ formatter: 'verbose' }))
    .pipe($.tslint.report({
      emitError: !continueOnLintError
    }))
})

gulp.task('lint', gulp.parallel('lint:scripts', 'lint:styles', 'lint:ts'))

// ---

gulp.task('develop', gulp.series(
  gulp.parallel('lint', 'build'),
  async function watch () {
    // Does not rebuild standalone files, for speed in active development
    gulp.watch(srcScriptFiles, gulp.parallel('build:scripts'))
    gulp.watch(srcStyleFiles, gulp.parallel('build:styles'))
    gulp.watch(allScriptFiles, gulp.parallel('lint:scripts'))
    gulp.watch(srcStyleFiles, gulp.parallel('lint:styles'))
    gulp.watch(tsFiles, gulp.parallel('lint:ts'))
  },
  async function sandbox () {
    browserSync.init({
      port: 8080,
      uiPort: 8081,
      notify: false,
      reloadOnRestart: true,
      https: false,
      server: ['./'],
      startPath: 'test/sandbox.html'
    })
    gulp.watch([
      'test/sandbox.html',
      'dist/' + projectName + '.js',
      'dist/' + projectName + '.css'
    ]).on('change', browserSync.reload)
  },
  async function tests () {
    await execute(`karma start karma.conf.js --no-launch`)
  }
))
