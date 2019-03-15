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
        this.$ears = document.querySelector('#ears');
        this.$head = document.querySelector('#head');
        this.$menuIconsWrap = document.querySelector('.menu_icons_wrap');
        this.storyMode = false;
        this.headRect = this.getObjectRect(this.$head)
        this.setOriginZ(this.$face, -this.headRect.width/2)
        this.setOriginZ(this.$ears, this.headRect.width/2)
    },
    addEvent(){
        var that = this;
        $(window).on('resize', ()=>{
            that.headRect = that.getObjectRect(that.$head);
            that.setOriginZ(that.$face, -that.headRect.width/2)
            that.setOriginZ(that.$ears, that.headRect.width/2)
        });
        that.$menuIconsWrap.addEventListener('mousemove',(e)=>{
            if(that.storyMode){
                return
            }
            const {x,y} = e;
            const {left,top,width,height} = that.headRect;

            const tx = left + width/2 - x;
            const yx = top + height/2 - y;

            const ry = Math.atan2(-tx , Math.abs(yx));
            const rx =  Math.atan2(yx, Math.abs(yx) / Math.cos(ry));

            const angle = Math.max(Math.abs(rx), Math.abs(ry));

            that.$face.style.transform = `rotate3d(${rx/angle}, ${ry/angle}, ${ry/angle}, ${angle/8}rad)`;
            that.$ears.style.transform = `rotate3d(${rx/angle}, ${ry/angle}, ${ry/angle}, ${angle/20}rad)`;

        });
        that.$menuIconsWrap.addEventListener('mouseout',(e)=>{
            that.$face.style.transform = 'rotate3d(1, 0, 0, 0)';
            that.$ears.style.transform = 'rotate3d(1, 0, 0, 0)';
        });

        $('.mode_change').on('click', ()=>{
            console.log('change');
            this.storyMode = !this.storyMode;
        });

        $('.btn_yes').on('click', async ()=>{
            await that.doAnimation(that.$face, 'rotate3d(1, 0, 0, 0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(1, 0, 0, -0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(1, 0, 0, 0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(1, 0, 0, -0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(1, 1, 1, 0)')
        });
        $('.btn_no').on('click', async ()=>{
            await that.doAnimation(that.$face, 'rotate3d(0, 1, 0, 0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(0, 1, 0, -0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(0, 1, 0, 0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(0, 1, 0, -0.05rad)')
            await that.doAnimation(that.$face, 'rotate3d(1, 1, 1, 0)')
        });
    },
    removeClass(obj){
        obj.classList = '';
    },
    getObjectRect(obj){
        return obj.getBoundingClientRect();
    },
    setOriginZ(obj, value){
        obj.style["transform-origin"] = `50% 50% ${value}px`;
    },
    doAnimation(obj, value){
        return new Promise((res,rej)=>{
            obj.style.transform = value;
            setTimeout(()=>{
                res();
            },200)
        })
    }
}

$(function(){
    RyanMouseAction.init();
});