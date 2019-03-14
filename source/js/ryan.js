'use strict'
console.log('ryan.js 실행');
const RyanMouseAction = {
    init(){
        this.define();
        this.addEvent();
    },
    define(){
        this.$container = document.querySelector('.container');
        this.$face = document.querySelector('#face');
        this.$head = document.querySelector('#head');
        this.$menuIconsWrap = document.querySelector('.menu_icons_wrap');

        this.menuSize = {
            mw : this.$menuIconsWrap.offsetWidth,
            mh : this.$menuIconsWrap.offsetHeight,
        };

        this.getAllObjectRect();
    },
    addEvent(){
        var that = this;
        $(window).on('resize', ()=>{
            that.getAllObjectRect();
        });
        that.$menuIconsWrap.addEventListener('mousemove',(e)=>{
            const {x,y} = e;
            const {left,top,width,height} = that.headRect;
            const {mw, mh} = this.menuSize;
            const _x = x-(that.$container.offsetWidth - that.$menuIconsWrap.offsetWidth)/2;
            const _y = y-(that.$container.offsetHeight - that.$menuIconsWrap.offsetHeight)/2;

            // const ryanRect = ryan.getBoundingClientRect();
            // const inputRect = el.getBoundingClientRect();
            // const caretRect = span.getBoundingClientRect();
            // const caretPos = caretRect.left + Math.min(caretRect.width, inputRect.width) * !!text;
            // const distCaret = ryanRect.left + ryanRect.width/2 - inputRect.left - caretPos;
            // const distInput = ryanRect.top + ryanRect.height/2 - inputRect.top;
            // const y = Math.atan2(-distCaret, Math.abs(distInput)*3);
            // const x =  Math.atan2(distInput, Math.abs(distInput)*3 / Math.cos(y));
            // const angle = Math.max(Math.abs(x), Math.abs(y));
            // rotate3d(x/angle, y/angle, y/angle/2, angle);
            
            const ry = Math.atan2(-_x, Math.abs(_y)*3);
            const rx =  Math.atan2(_y, Math.abs(_y)*3 / Math.cos(ry));
            const angle = Math.max(Math.abs(rx), Math.abs(ry));
            that.$face.style.transform = `rotate3d(${rx/angle}, ${ry/angle}, ${ry/angle/2}, ${angle}rad)`;
        });
        that.$menuIconsWrap.addEventListener('mouseout',(e)=>{
            console.log('아웃 : ', this.$face.style);
            that.$face.style.transform = 'rotate3d(1, 0, 0, 0deg)';
        });
    },
    getAllObjectRect(){
        this.headRect = this.getObjectRect(this.$head);
        console.log('this.boundingClientRect.width : ', this.headRect.width);
        console.log('this.$face.style["transform-origin"] : ', this.$face.style["transform-origin"]);
        this.$face.style["transform-origin"] = `50% 50% ${-this.headRect.width/2}px`;
    },
    getObjectRect(obj){
        return obj.getBoundingClientRect();
    },
    animate(){
        




    },
}

$(function(){
    RyanMouseAction.init();
});