'use strict'
console.log('ryan.js 실행');
const $container = document.querySelector('.container');
const $face = document.querySelector('#face');
const $svgContainer = document.querySelector('#head');



$container.addEventListener('mousemove',(e)=>{
    console.log('e : ', e);
    
    getSvgContainer();
});


const getSvgContainer = ()=>{
    const boxSize = $svgContainer.getBBox();
    const boundingClientRect = $svgContainer.getBoundingClientRect();
    console.log('boxSize : ', boxSize);
    console.log('boundingClientRect : ', boundingClientRect);
}

