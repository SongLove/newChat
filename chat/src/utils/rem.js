/*
 * base on clientWidth,then transform to rem,default 320px == 20rem
 */
export function setRem(doc, win) {
  let docEl = doc.documentElement
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let reCaculate = function() {
    let clientWidth = docEl.clientWidth
    if (!clientWidth) return
    let fontSize = 20 * (clientWidth / 375) + 'px'
    docEl.style.fontSize = fontSize
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, reCaculate, false)
  doc.addEventListener('DOMContentLoaded', reCaculate, false)
}
