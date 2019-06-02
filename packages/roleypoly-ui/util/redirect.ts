import Router from 'next/router'

export default async (context, target) => {
  if (context && context.res) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    await Router.replace(target)
  }
}
