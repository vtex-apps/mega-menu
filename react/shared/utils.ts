export function shortId() {
  let firstPart: string | number = (Math.random() * 46656) | 0
  let secondPart: string | number = (Math.random() * 46656) | 0

  firstPart = `000${firstPart.toString(36)}`.slice(-3)
  secondPart = `000${secondPart.toString(36)}`.slice(-3)

  return firstPart + secondPart
}
