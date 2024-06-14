//@ts-nocheck
import { fabric } from 'fabric'

export function loadFabricImageFromURL(src) {
  return new Promise(resolve => {
    fabric.Image.fromURL(src, function (img) {
      resolve(img)
    })
  })
}

export function loadImageFromURL(src): Promise<any> {
  return new Promise(resolve => {
    const image = new Image()
    image.src = src
    image.crossOrigin = 'Anonymous'
    image.onload = () => {
      resolve(image)
    }
  })
}
