export default [
  'cute',
  'vanity',
  'brave',
  'proud',
  'wonderful',
  '日本語'
].map((name, i, roles) => ({ name: `a ${name} role ♡`, color: `hsl(${(360 / roles.length) * i},40%,70%)` }))
