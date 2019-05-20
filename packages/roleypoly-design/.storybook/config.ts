const { configure } = require('@storybook/react')

// polyfill for require.context
try {
  if (require.context === undefined) {
    const fs = require('fs')
    const path = require('path')
  // @ts-ignore
    require.context = (base: string = '.', scanSubDirectories: boolean = false, regularExpression: RegExp = /\.js$/) => {
      const files = {}

      function readDirectory (directory: string) {
        fs.readdirSync(directory).forEach((file) => {
          const fullPath = path.resolve(directory, file)

          if (fs.statSync(fullPath).isDirectory()) {
            if (scanSubDirectories) readDirectory(fullPath)

            return
          }

          if (!regularExpression.test(fullPath)) return

          files[fullPath] = true
        })
      }

      readDirectory(path.resolve(__dirname, base))

      function Module (file: string) {
        return require(file)
      }

      Module.keys = () => Object.keys(files)

      return Module
    }
  }
} catch (e) {
  if (e) {
    console.log(e)
  }
}

const req = require.context('../src', true, /\.stor\bies|y\b\.[tj]sx?$/)

function loadStories () {
  req.keys().forEach(req)
}

configure(loadStories, module)
