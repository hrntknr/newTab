const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const gulp = require('gulp')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const del = require('del')

const webpackConfig = require('./webpack.config')

const dist = path.join(__dirname, 'dist')
const staticFiles = ['src/manifest.json', 'src/index.html', 'src/icons/**/*']

async function clean () {
  try {
    await promisify(fs.stat)(dist)
  } catch (e) {
    await promisify(fs.mkdir)(dist)
  }
  await del([`${dist}/**`, `!${dist}`])
}

async function copyStaticFiles () {
  await new Promise((resolve, reject) => {
    gulp.src(staticFiles, {base: './src'})
      .pipe(gulp.dest(dist))
      .on('end', resolve)
      .on('error', reject)
  })
}

async function build () {
  await new Promise((resolve, reject) => {
    webpackStream(webpackConfig, webpack)
      .pipe(gulp.dest(dist))
      .on('end', resolve)
      .on('error', reject)
  })
}

gulp.task('build', async () => {
  await clean()
  await copyStaticFiles()
  await build()
})
