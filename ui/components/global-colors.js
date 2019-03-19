// @flow
// import * as React from 'react'
import { createGlobalStyle } from 'styled-components'

export const colors = {
  white: '#efefef',
  c9: '#EBD6D4',
  c7: '#ab9b9a',
  c5: '#756867',
  c3: '#5d5352',
  c1: '#453e3d',
  dark: '#332d2d',
  green: '#46b646',
  red: '#e95353',
  discord: '#7289da'
}

const getColors = () => {
  return Object.keys(colors).map(key => {
    const nk = key.replace(/c([0-9])/, '$1')
    return `--c-${nk}: ${colors[key]};`
  }).join('  \n')
}

export default createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  font-family: "source-han-sans-japanese", "Source Sans Pro", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* prevent FOUC */
  transition: opacity 0.2s ease-in-out;
}

* {
  box-sizing: border-box;
}

.font-sans-serif {
  font-family: sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

:root {
  ${() => getColors()}
}

::selection {
  background: var(--c-9);
  color: var(--c-1);
}

::-moz-selection {
  background: var(--c-9);
  color: var(--c-1);
}

html {
  overflow: hidden;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: auto;
  color: var(--c-white);
  background-color: var(--c-1);
  /* overflow-y: hidden; */
}

h1,h2,h3,h4,h5,h6 {
  color: var(--c-9);
}

.fade-element {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.fade {
  opacity: 0;
}

`
