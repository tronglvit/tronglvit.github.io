// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp')
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const browserSync = require('browser-sync').create()

const del = require('del')
const clean = () => del(['./dist'])

function reload(done) {
  browserSync.reload()
  done()
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './',
    },
  })
  done()
}

// File paths
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js',
  htmlPath: './*.html',
  image: 'app/images/**/*.+(png|jpg|jpeg|gif|svg)',
  font: 'app/webfonts/**/*',
  video: 'app/videos/**/*',
  vendor: 'app/vendors/**/*',
}

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return (
    src(files.scssPath)
      // .pipe(sourcemaps.init()) // initialize sourcemaps first
      .pipe(sass()) // compile SCSS to CSS
      .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
      // .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
      .pipe(dest('dist/css'))
      .pipe(browserSync.stream())
  )
}

//Image
function images() {
  return (
    src(files.image)
      // Caching images that ran through imagemin
      .pipe(dest('dist/images'))
  )
}

// Fonts
function font() {
  return src(files.font).pipe(dest('dist/webfonts'))
}

//Video
function video() {
  return src(files.video).pipe(dest('dist/videos'))
}

//Video
function vendor() {
  return src(files.vendor).pipe(dest('dist/vendors'))
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask() {
  return src([
    files.jsPath,
    //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  browserSync.init({
    // You can tell browserSync to use this directory and serve it as a mini-server
    server: {
      baseDir: './',
    },
    // If you are already serving your website locally using something like apache
    // You can use the proxy setting to proxy that instead
    // proxy: "yourlocal.dev"
  })
  watch(files.scssPath, scssTask)
  watch(files.image, images)
  watch(files.htmlPath, reload)
  watch('dist/css/*.css', reload)
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
  parallel(scssTask, jsTask, images, font, video, vendor),
  watchTask
)
