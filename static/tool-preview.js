window.addEventListener('load', () => {
  let $thumbnails = document.querySelectorAll('.thumbnail')
  let $preview_holder = document.querySelector('#preview-holder')

  let makePreview = (title, gif, description, url) => `
    <div class="px2" style="position: fixed; left: 0; top:0; right: 0; bottom: 0; display: block; display: flex; flex-direction: column; background: white;">
        <div class="py1 flex space-between" style="align-items: center">
          <div style="font-size: 32px; line-height: 1.2;">
            <strong>${title}</strong>
          </div>
          <div><button class="button-preview">Close preview</button></div>
        </div>
        <div class="spacer1"></div>
        <div class="img background-contain pointer" style="flex-grow: 1; background-image: url(${gif}); background-position: center center;"></div>
        <div class="spacer1"></div>
       <div class="py1 flex space-between" style="align-items: center;">
          <div class="sans measure mr2">
              ${description}
          </div>
          <div
 style="font-size: 32px; line-height: 1.2;"
><a href="${url}" target="_blank">Launch</a></div>
        </div>
        <div class="spacer1"></div>
    </div>
  `

  function showPreview(title, gif, description, url) {
    document.body.style.overflow = 'hidden'
    let html = makePreview(title, gif, description, url)
    $preview_holder.innerHTML = html
    let $close = $preview_holder.querySelector('#close-preview')
    $close.addEventListener('click', (e) => {
      closePreviewHolder()
    })
  }

  function closePreviewHolder() {
    $preview_holder.innerHTML = ''
    document.body.style.overflow = 'auto'
  }

  for (let i = 0; i < $thumbnails.length; i++) {
    let $thumbnail = $thumbnails[i]
    let $preview_button = $thumbnail.querySelector('.button-preview')
    let $img = $thumbnail.querySelector('.img')
    let $close_button = $thumbnail.querySelector('.button-close')

    let title = $thumbnail.getAttribute('data-title')
    let gif = $thumbnail.getAttribute('data-gif')
    let description = $thumbnail.getAttribute('data-description')
    let url = $thumbnail.getAttribute('data-url')

    $preview_button.addEventListener('click', (e) => {
      showPreview(title, gif, description, url)
      e.stopPropagation()
      e.preventDefault()
    })
    $img.addEventListener('click', (e) => {
      showPreview(title, gif, description, url)
      e.stopPropagation()
      e.preventDefault()
    })
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePreviewHolder()
    }
  })
})
