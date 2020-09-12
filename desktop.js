window.addEventListener('load', () => {
  let $ = selector => document.querySelector(selector)

  let $screen = $('#screen')
  let $sidebar = $('#sidebar')
  let $about_button = $('#about-button')
  let $clear_button = $('#clear-button')
  let $tools_header = $('#tools-header')
  let $preview_count = $('#preview-count')
  let screen = { w: $screen.offsetWidth, h: $screen.offsetHeight }

  let preview_ids = []
  let preview_apps = []
  let $preview_divs = []

  let $tagline = document.querySelector('#tagline')
  let taglines = [
    'Experiments in creative constraints',
    'Do one weird thing well',
    'Where the lack of features is a feature',
    'Keyboard club',
  ]
  $tagline.innerText =
    taglines[Math.round(Math.random() * (taglines.length - 1))]
  $tagline.addEventListener('click', () => {
    let current = $tagline.innerText
    let index = taglines.indexOf(current)
    let next = (index + 1) % taglines.length
    $tagline.innerText = taglines[next]
  })

  $tools_header.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })

  let $thumbnails = Array.from(document.querySelectorAll('.thumbnail'))
  let tool_data = $thumbnails.map($t => {
    return {
      title: $t.getAttribute('data-title'),
      gif: $t.getAttribute('data-gif'),
      aspect: $t.getAttribute('data-gif-aspect'),
      url: $t.getAttribute('data-url'),
    }
  })

  function addClass($el, className) {
    $el.classList.add(className)
  }
  function setText($el, text) {
    $el.innerText = text
  }
  function create(el_type) {
    return document.createElement(el_type)
  }
  let px = val => val + 'px'

  let percent = 0.7
  let bar_height = 20
  let x_padding = 20
  let y_padding = 48
  function getContainer(screen) {
    return [
      Math.round((screen.w - x_padding * 2) * percent),
      Math.round((screen.h - y_padding * 2) * percent + bar_height),
    ]
  }

  function getMaxZ() {
    if (preview_apps.length === 0) {
      return 0
    } else {
      let max = Math.max(...preview_apps.map(o => o.z))
      return max
    }
  }

  function bringToFront(tool_index) {
    let index = preview_ids.indexOf(tool_index)
    let app = preview_apps[index]
    app.z = getMaxZ() + 1
    placeScreenEl(index)
  }

  let alignments = [
    ['center', 'center'],
    ['left', 'bottom'],
    ['right', 'top'],
    ['right', 'bottom'],
    ['left', 'top'],
  ]

  function getPosition(alignment, index, aw, ah, jitter = true) {
    let { w, h } = screen
    let left, top
    let jit = 48
    if (jitter === false) jit = 0
    let x_jitter = Math.round(Math.random() * jit)
    let y_jitter = Math.round(Math.random() * jit)
    if (alignment[0] === 'left') {
      left = Math.round(x_padding + x_jitter)
    } else if (alignment[0] === 'center') {
      left = Math.round(w * 0.5 - aw / 2 + jit / 2 - x_jitter)
    } else if (alignment[0] === 'right') {
      left = Math.round(w - aw - x_padding - x_jitter)
    }
    if (alignment[1] === 'top') {
      top = Math.round(y_padding + y_jitter)
    } else if (alignment[1] === 'center') {
      top = Math.round(h * 0.5 - ah / 2 - 10 + jit / 2 - y_jitter)
    } else if (alignment[1] === 'bottom') {
      top = Math.round(h - ah - y_padding - bar_height / 2 - y_jitter)
    }
    return [left, top]
  }
  function getPositionPlace(index, aw, ah, jitter = true) {
    let alignment = alignments[index % alignments.length]
    return getPosition(alignment, index, aw, ah, jitter)
  }

  // most ids are indexes, about is special case
  function addToScreen(id) {
    let app = {}

    let $el = create('div')
    $el.style.position = 'absolute'
    $el.style.background = '#fff'
    addClass($el, 'preview-el')

    let $title_bar = create('div')
    addClass($title_bar, 'preview-title')

    $el.appendChild($title_bar)

    let container = getContainer(screen)
    if (id === 'about') {
      app.width = Math.min(container[0], 520)

      setText($title_bar, 'About')
      let $content = create('div')
      addClass($content, 'about-content')
      $content.style.background = '#eee'
      $content.innerHTML =
        'Constraint Systems is a collection of experimental web-based creative tools focused on exploring alternative interfaces for creating and editing images and text.<br /><br />Most of the tools are keyboard-focused. You can <strong style="font-size: 16px; line-height: 1;">Preview</strong> recorded demos of them here, or <strong style="font-size: 16px; line-height: 1;">Launch</strong> to try them yourself.'
      $el.appendChild($content)

      // add early so we can measure height
      $el.style.width = px(app.width)
      $screen.appendChild($el)
      let height = $el.offsetHeight
      let [left, top] = getPosition(
        ['right', 'bottom'],
        preview_ids.length,
        app.width + 60,
        height + 100,
        false
      )
      app.left = Math.min(left, screen.w - app.width - x_padding)
      app.top = Math.min(top, screen.h - height - y_padding)
    } else {
      let data = tool_data[id]
      let gif_aspect = data.aspect
      let container_aspect = container[0] / container[1]
      let gw, gh
      if (gif_aspect > container_aspect) {
        gw = container[0]
        gh = Math.round(gw / gif_aspect) + bar_height
      } else {
        gh = container[1] + bar_height
        gw = Math.round(gh * gif_aspect)
      }
      app.width = gw
      app.height = gh
      let [left, top] = getPositionPlace(preview_ids.length, gw, gh)
      app.left = left
      app.top = top

      setText($title_bar, data.title)
      let $gif = create('img')
      $gif.setAttribute('src', data.gif)
      $el.appendChild($gif)

      $screen.appendChild($el)
    }

    app.z = getMaxZ() + 1

    let $close_button = create('div')
    addClass($close_button, 'preview-close')
    $close_button.setAttribute('role', 'button')
    $close_button.innerText = 'x'
    $title_bar.appendChild($close_button)

    if (id !== 'about') {
      let $app_resize = document.createElement('div')
      $app_resize.classList.add('preview-resize')
      $el.appendChild($app_resize)
    }

    // Event listeners
    addListeners(id, app, $el)

    preview_ids.push(id)
    preview_apps.push(app)
    $preview_divs.push($el)
    placeScreenEl(preview_ids.length - 1)

    markActiveThumbnails()
  }

  function markActiveThumbnails() {
    if (preview_ids.includes('about')) {
      $about_button.classList.add('active')
    } else {
      $about_button.classList.remove('active')
    }
    for (let i = 0; i < $thumbnails.length; i++) {
      let $thumbnail = $thumbnails[i]
      if (preview_ids.includes(i)) {
        $thumbnail.classList.add('active')
      } else {
        $thumbnail.classList.remove('active')
      }
    }
    setPreviewCount()
  }

  function setPreviewCount() {
    let preview_count = preview_ids.length
    if (preview_ids.includes('about')) preview_count--
    let preview_count_readout = ''
    if (preview_count === 1) preview_count_readout = preview_count + ' Preview'
    if (preview_count > 1) preview_count_readout = preview_count + ' Previews'
    $preview_count.innerText = preview_count_readout
  }

  function placeScreenEl(preview_index) {
    let id = preview_ids[preview_index]
    let app = preview_apps[preview_index]
    let $app = $preview_divs[preview_index]
    $app.style.left = px(app.left)
    $app.style.top = px(app.top)
    $app.style.width = px(app.width)
    $app.style.zIndex = app.z
    if (id !== 'about') {
      $app.style.height = px(app.height)
      let $gif = $app.querySelector('img')
      $gif.style.width = px(app.width)
      $gif.style.height = px(app.height - bar_height)
    }
  }

  function removeToolByIndex(tool_index) {
    let array_index = preview_ids.indexOf(tool_index)
    let $div = $preview_divs[array_index]
    $div.remove()
    $preview_divs.splice(array_index, 1)
    preview_apps.splice(array_index, 1)
    preview_ids.splice(array_index, 1)
    markActiveThumbnails()
  }

  let cache = {}
  cache.moving_index = null
  cache.mouse_position = null
  cache.box_position = null

  cache.resizing_index = null
  cache.resize_mouse_position = null
  cache.resize_dims = null

  cache.closing = false

  function scrollToThumbnail(tool_index) {
    let $thumbnail = $thumbnails[tool_index]
    window.scrollTo({
      top: $thumbnail.offsetTop - 40,
      left: 0,
      behavior: 'smooth',
    })
  }

  function addListeners(id, app, $app) {
    let $close_button = $app.querySelector('.preview-close')
    $close_button.addEventListener('mousedown', e => {
      cache.closing = true
      e.preventDefault()
    })
    $close_button.addEventListener('mouseup', e => {
      if (cache.closing) {
        cache.closing = false
        removeToolByIndex(id)
        e.stopPropagation()
        e.preventDefault()
      }
    })
    $app.addEventListener('mousedown', e => {
      if (!cache.closing) {
        bringToFront(id)
        if (id !== 'about') {
          scrollToThumbnail(id)
        }
      }
      e.preventDefault()
    })

    if (id !== 'about') {
      let $app_resize = $app.querySelector('.preview-resize')
      $app_resize.addEventListener('mousedown', e => {
        cache.resize_mouse_position = [e.pageX, e.pageY]
        cache.resize_dims = [$app.offsetWidth, $app.offsetHeight]
        cache.resizing_index = preview_ids.indexOf(id)
        bringToFront(id)
        e.stopPropagation()
        e.preventDefault()
      })
    }

    let $title = $app.querySelector('.preview-title')
    $title.addEventListener('mousedown', e => {
      if (!cache.closing) {
        bringToFront(id)
        $title.style.cursor = 'grabbing'
        cache.mouse_position = [e.pageX, e.pageY]
        cache.box_position = [$app.offsetLeft, $app.offsetTop]
        cache.moving_index = preview_ids.indexOf(id)
      }
      e.stopPropagation()
      e.preventDefault()
    })
  }

  function sizeToContainer(aspect, target_width, target_height) {
    let target_aspect = target_width / target_height
    let aw, ah
    if (aspect > target_aspect) {
      aw = target_width
      ah = target_width / aspect + bar_height
    } else {
      ah = target_height + bar_height
      aw = target_height * aspect
    }
    return [aw, ah]
  }

  document.addEventListener('mousemove', e => {
    // resize
    if (
      e.pageX > 0 &&
      e.pageY > 0 &&
      e.pageX < window.innerWidth &&
      e.pageY < window.innerHeight
    ) {
      if (e.pageX > 0 && e.pageY > 0) {
        let diff = [
          cache.resize_mouse_position[0] - e.pageX,
          cache.resize_mouse_position[1] - e.pageY,
        ]
        let app = preview_apps[cache.resizing_index]
        let aspect = tool_data[preview_ids[cache.resizing_index]].aspect
        let target_width = cache.resize_dims[0] - diff[0]
        let target_height = cache.resize_dims[1] - diff[1]
        let [aw, ah] = sizeToContainer(aspect, target_width, target_height)
        app.width = aw
        app.height = ah
        placeScreenEl(cache.resizing_index)
      }
    }
  })
  document.addEventListener('mousemove', e => {
    // move
    if (
      e.pageX > 0 &&
      e.pageY > 0 &&
      e.pageX < window.innerWidth &&
      e.pageY < window.innerHeight
    ) {
      if (cache.mouse_position !== null) {
        let diff = [
          cache.mouse_position[0] - e.pageX,
          cache.mouse_position[1] - e.pageY,
        ]
        let app = preview_apps[cache.moving_index]
        app.left = cache.box_position[0] - diff[0]
        app.top = cache.box_position[1] - diff[1]
        placeScreenEl(cache.moving_index)
      }
    }
  })
  document.addEventListener('mouseup', e => {
    cache.mouse_position = null
    cache.box_position = null
    cache.moving_index = null
    cache.resize_mouse_position = null
    cache.resize_dims = null
    cache.resizing_index = null
    for (let i = 0; i < $preview_divs.length; i++) {
      let $app = $preview_divs[i]
      let $title = $app.querySelector('.preview-title')
      $title.style.cursor = 'grab'
    }
  })

  function resizeDesktop() {
    let new_screen = { w: $screen.offsetWidth, h: $screen.offsetHeight }
    for (let i = 0; i < preview_ids.length; i++) {
      let $preview_div = $preview_divs[i]
      let app = preview_apps[i]
      let id = preview_ids[i]
      let aspect
      if (id !== 'about') {
        aspect = tool_data[id].aspect
      }

      // resize comes first
      // TODO: handle ratio
      let max_w = new_screen.w - x_padding * 2
      if (id === 'about') {
        app.width = Math.min(max_w, 520)
      } else {
        app.width = Math.min(app.width, max_w)
        app.height = app.width / aspect + bar_height

        let max_h = new_screen.h - y_padding * 2
        app.height = Math.min(app.height, max_h)
        app.width = (app.height - bar_height) * aspect
      }

      // move
      let center_x = app.left + app.width / 2
      let percent_x = center_x / screen.w
      let center_y = app.top + app.height / 2
      let percent_y = center_y / screen.h

      if (new_screen.w !== screen.w) {
        let min_x = x_padding
        let max_x = new_screen.w - x_padding - app.width
        app.left = Math.min(
          max_x,
          Math.max(min_x, percent_x * new_screen.w - app.width / 2)
        )
      }
      if (new_screen.h !== screen.h) {
        let min_y = y_padding
        let max_y = new_screen.h - y_padding - app.height
        app.top = Math.min(
          max_y,
          Math.max(min_y, y_padding, percent_y * new_screen.h - app.height / 2)
        )
      }
      placeScreenEl(i)
    }
    screen = new_screen
  }

  // init

  // thumbnail listeners
  for (let i = 0; i < $thumbnails.length; i++) {
    let $thumbnail = $thumbnails[i]

    let $preview_button = $thumbnail.querySelector('.button-preview')
    $preview_button.addEventListener('click', () => {
      if (preview_ids.includes(i)) {
        removeToolByIndex(i)
      } else {
        addToScreen(i)
      }
    })

    let $img = $thumbnail.querySelector('img')
    $img.addEventListener('click', () => {
      if (preview_ids.includes(i)) {
        bringToFront(i)
      } else {
        addToScreen(i)
      }
    })
  }
  $about_button.addEventListener('click', () => {
    if (preview_ids.includes('about')) {
      removeToolByIndex('about')
    } else {
      addToScreen('about')
    }
  })
  $clear_button.addEventListener('click', () => {
    let queue = preview_ids
    function removeOne() {
      if (queue.length > 0) {
        removeToolByIndex(queue[0])
        removeOne()
      }
    }
    removeOne()
  })

  window.addEventListener('resize', resizeDesktop)

  // start with 3 random tools
  let possible_indexes = $thumbnails.map((n, i) => i)
  possible_indexes.splice(0, 1)
  function sampleIndex() {
    let length = possible_indexes.length
    let select = Math.floor(Math.random() * length)
    let spliced = possible_indexes.splice(select, 1)
    return spliced[0]
  }
  addToScreen(sampleIndex())
  addToScreen(sampleIndex())
  addToScreen(sampleIndex())
  addToScreen('about')
})
