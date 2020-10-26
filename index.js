;(function paste() {
  const b = document.body
  // 监听 数组 变化 重新渲染
  class ObserverArray extends Array {
    constructor(...args) {
      super(...args)
    }
    push(item) {
      b.appendChild(item)
    }
    remove(d) {
      b.removeChild(d)
    }
  }

  const RenderedImages = new ObserverArray([])
  document.addEventListener("paste", function callback(evt) {
    const {
      clipboardData: { items, types },
    } = evt
    let ImageData = undefined
    for (const index in types) {
      if (types[index] === "Files") {
        ImageData = items[index]
        break
      }
    }
    const { type } = ImageData
    if (type && type.match(/^image/gi)) {
      render(ImageData)
    }
  })

  // blob <=> image file
  function render(ImageData) {
    const blob = ImageData.getAsFile()
    const fr = new FileReader()
    fr.onload = function (e) {
      const TempImg = new Image()
      TempImg.src = e.target.result
      const d = document.createElement("div")
      const x = document.createElement("span")
      x.innerText = "x"
      x.setAttribute(
        "style",
        "position:absolute;right:0;top:0;color:red;cursor:pointer;z-index:9"
      )

      d.setAttribute("style", "position:relative;display:inline-block;")
      d.appendChild(TempImg)
      d.appendChild(x)
      RenderedImages.push(d)
      x.addEventListener("click", function (e) {
        RenderedImages.remove(d)
      })
    }
    fr.readAsDataURL(blob)
  }
})()
