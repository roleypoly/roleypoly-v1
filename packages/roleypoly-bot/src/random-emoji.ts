export const emojis = [
  ':beginner:',
  ':beginner:',
  ':beginner:',
  ':beginner:',
  ':beginner:',
  ':beginner:',
  ':sunglasses:',
  ':gay_pride_flag:',
  ':gift_heart:',
  // ':lobster:',
  ':squid:'
]

export default () => { return emojis[Math.floor(Math.random() * emojis.length)] }
