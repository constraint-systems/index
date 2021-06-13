window.addEventListener('load', () => {
  let state = { preview: false }

  let $thumbnails = document.querySelectorAll('.thumbnail')
  let $tools_header = document.querySelector('#tools-header')

  $tools_header.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })

  function clearPreview() {
    state.preview = false
    let $preview_backer = document.querySelector('#mobile-preview-backer')
    if ($preview_backer) $preview_backer.remove()
    document.body.style.overflow = 'auto'
  }

  function showPreview(index) {
    clearPreview()
    state.preview = true
    let $thumbnail = $thumbnails[index]
    let title = $thumbnail.getAttribute('data-title')
    let gif = $thumbnail.getAttribute('data-gif')
    let gif_aspect = $thumbnail.getAttribute('data-gif-aspect')
    let $preview_backer = document.createElement('div')
    $preview_backer.setAttribute('id', 'mobile-preview-backer')
    let $preview = document.createElement('div')
    $preview.setAttribute('id', 'mobile-preview')
    $preview.classList.add('preview-el')
    let $gif = document.createElement('img')
    $gif.setAttribute('src', gif)
    let $title_bar = document.createElement('div')
    $title_bar.classList.add('preview-title')
    $title_bar.innerText = title
    let $close_button = document.createElement('div')
    $close_button.classList.add('preview-close')
    $close_button.setAttribute('role', 'button')
    $close_button.innerText = 'x'
    $title_bar.appendChild($close_button)
    $preview.appendChild($title_bar)
    $preview.appendChild($gif)
    $preview_backer.appendChild($preview)
    document.body.appendChild($preview_backer)

    let bar_height = 20
    let wwidth = window.innerWidth
    let wheight = window.innerHeight - bar_height
    let waspect = wwidth / wheight
    if (gif_aspect > waspect) {
      aw = wwidth
      ah = Math.round(wwidth / gif_aspect) + bar_height
    } else {
      ah = wheight + bar_height
      aw = Math.round(wheight * gif_aspect)
    }
    $gif.style.width = aw + 'px'
    $gif.style.height = ah - bar_height + 'px'

    $preview.style.width = aw + 'px'
    $preview.style.height = ah + 'px'

    document.body.style.overflow = 'hidden'

    $preview_backer.addEventListener('click', () => {
      clearPreview()
    })
    $preview.addEventListener('click', e => {
      e.stopPropagation()
      e.preventDefault()
    })
    $close_button.addEventListener('click', e => {
      clearPreview()
      e.stopPropagation()
      e.preventDefault()
    })
  }

  for (let i = 0; i < $thumbnails.length; i++) {
    let $thumbnail = $thumbnails[i]
    let $preview_button = $thumbnail.querySelector('.button-preview')
    let $img = $thumbnail.querySelector('img')
    let $close_button = $thumbnail.querySelector('.button-close')
    $preview_button.addEventListener('click', e => {
      showPreview(i)
      e.stopPropagation()
      e.preventDefault()
    })
    $img.addEventListener('click', e => {
      showPreview(i)
      e.stopPropagation()
      e.preventDefault()
    })
  }
})
