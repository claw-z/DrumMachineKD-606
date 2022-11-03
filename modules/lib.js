export function el(css) {
    return document.querySelector(css);
}
  
export function group(css) {
    return document.querySelectorAll(css);
}
  
export function click(css,fnctn) {
    return el(css).addEventListener('click',fnctn);
}

export function create(html) {
    return document.createElement(html);
}

export async function loadJSON(url){
    return await (await fetch(url)).json();
}