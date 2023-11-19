function rangeSlider (element, value, e=null) {
  const fill = element.querySelector('.custom-range--fill')
  const thumb = element.querySelector('.custom-range--thumb')
  const input = element.querySelector('[data-scene-control]')

  const val = e !== null
    ? parseFloat(input.value)
    : value

  const max = input.max
  const inputWidth = input.offsetWidth
  const thumbWidth = thumb.offsetWidth

  const space = inputWidth - thumbWidth
  const thumbCenter = val / max * 100
  const thumbLeft = (thumbCenter / 100) * space
  
  thumb.style.left = `${thumbLeft}px`
  fill.style.width = `${thumbLeft + thumbWidth / 2}px`
}

export default rangeSlider;