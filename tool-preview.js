window.addEventListener('load', () => {
  let $thumbnails = document.querySelectorAll('.thumbnail')
  let $preview_holder = document.querySelector('#preview-holder')

  let makePreview = (title, gif, description, url) => `
    <div style="position: fixed; left: 0; top:0; right: 0; bottom: 0; background: rgba(20,20,20,0.825); padding: 16px; display: block; display: flex; flex-direction: column;">
      <div style="text-align: center; margin-bottom: 6px;">
        <div id="close-preview" class="button thumbnail-button button-preview" role="button">
          Close
        </div>
      </div>
      <div style="font-size: 26px; line-height: 26px; padding-bottom: 16px; text-align: center;"><strong>${title} Preview</strong></div>
        <div style="flex-grow: 1; background-image: url(${gif}); background-size: contain; background-repeat: no-repeat; background-position: center center;"></div>
      <div style="text-align: center; padding-bottom: 6px; padding-top: 16px;">${description}</div>
      <div style="text-align: center; padding-bottom: 6px; padding-top: 0px;">
    <a
              href="${url}"
              class="thumbnail-button button button-launch"
              target="_blank"
              >Launch</a
            >

      </div>
      <div style="text-align: center;">&nbsp;</div>
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
