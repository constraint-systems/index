window.addEventListener('load', () => {
  // grid masorny base on https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
  let $link_grid = document.querySelector('#link-grid')
  $link_grid.style.gridColumnGap = '32px'

  function resizeGridItem($item) {
    let $content = $item.querySelector('.content')
    let height = $content.getBoundingClientRect().height
    let row_height = Math.round(height / 12) + 2
    $item.style.gridRow = `span ${row_height}`
  }

  function resizeInstance(instance) {
    let $item = instance.elements[0]
    resizeGridItem($item)
  }

  function resizeAllGridItems() {
    let $items = document.querySelectorAll('.item')
    for (let i = 0; i < $items.length; i++) {
      imagesLoaded($items[i], resizeInstance)
    }
    setTimeout(() => {
      $link_grid.style.gridRowGap = '0'
      $link_grid.style.gridAutoRows = '12px'
    }, 0)
  }

  resizeAllGridItems()
  window.addEventListener('resize', resizeAllGridItems)
})
