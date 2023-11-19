import * as ICONS from "@scripts/lib/icons.js";

export function getAspectRatio(config) {
  return config.width / config.height;
}

export function createSvgNode(template) {
  const div = document.createElement("div");
  div.innerHTML = template.trim();
  return div.firstChild;
}

export function getCanvas(value) {
  const allCanvases = Array.from(document.querySelectorAll("[data-render]"));

  return allCanvases.find((canvas) => canvas.dataset.render === value);
}

export function getDeltaTime(time) {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;

  return {
    currentTime,
    deltaTime,
  };
}

export function findArrayObject(array, instance) {
  return array.find((item) => item instanceof instance);
}

export function hasProperty(obj, prop) {
  return obj.hasOwnProperty(prop) ? true : false;
}

export function setElementAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function createDomElement(config) {
  const { type, props = null, classes = null, icon = null } = config;
  const element = document.createElement(type);

  if (props) {
    setElementAttributes(element, props);
  }

  if (classes) {
    element.classList.add(...classes);
  }

  if (icon) {
    const iconElement = createSvgNode(ICONS[icon]);
    element.appendChild(iconElement);
  }

  return element;
}

export function getPointerPOS(event) {
  if (!event) event = window.event;
  const type = event.type;
  let posX = 0;
  let posY = 0;

  const source = type === "touchmove" ? event.touches[0] : event;

  if (source.pageX || source.pageY) {
    posX = source.pageX;
    posY = source.pageY;
  } else if (source.clientX || source.clientY) {
    posX =
      source.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    posY =
      source.clientY +
      document.body.scrollTop +
      document.documentElement.scrollTop;
  }

  return {
    x: posX,
    y: posY,
  };
}

export function rgbToHex(string) {
  return string.match(/\d+/g).reduce((acc, curr, index) => {
    const color = Number(curr).toString(16).padStart(2, "0");
    acc += color;

    return acc;
  }, "");
}

export function rgbToHSL(string) {
  const labels = ["r", "g", "b"];
  const values = string.match(/\d+/g).map(Number);

  const colors = values.reduce((acc, curr, index) => {
    acc[labels[index]] = curr / 255;
    return acc;
  }, {});

  let max = Math.max(colors.r, colors.g, colors.b),
    min = Math.min(colors.r, colors.g, colors.b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case colors.r:
        h = (colors.g - colors.b) / d + (colors.g < colors.b ? 6 : 0);
        break;
      case colors.g:
        h = (colors.b - colors.r) / d + 2;
        break;
      case colors.b:
        h = (colors.r - colors.g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l,
  };
}
