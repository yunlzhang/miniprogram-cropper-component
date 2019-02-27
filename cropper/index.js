const defaultData = {
    isShowCropper:false,
    // 初始化的宽高
    cropperInitW: 750,
    cropperInitH: 750,
    // 动态的宽高
    cropperW: 750,
    cropperH: 750,
    // 动态的left top值
    cropperL: 0,
    cropperT: 0,

    transL: 0,
    transT: 0,

    // 图片缩放值
    scaleP: 0,
    imageW: 0,
    imageH: 0,

    // 裁剪框 宽高
    cutL: 0,
    cutT: 0,
    cutB: 0,
    cutR: 0,

    qualityWidth: '',
    innerAspectRadio: 750 / wx.getSystemInfoSync().windowWidth,
    
    C_CONSTANTS:{
        SCREEN_WIDTH : 750,
        PAGE_X:0, // 手按下的x位置
        PAGE_Y:0, // 手按下y的位置
        PR : wx.getSystemInfoSync().pixelRatio, // dpi
        T_PAGE_X:{}, // 手移动的时候x的位置
        T_PAGE_Y:{}, // 手移动的时候Y的位置
        CUT_L:0, // 初始化拖拽元素的left值
        CUT_T:0, // 初始化拖拽元素的top值
        CUT_R:0, // 初始化拖拽元素的
        CUT_B:0, // 初始化拖拽元素的
        CUT_W:0, // 初始化拖拽元素的宽度
        CUT_H:0, //  初始化拖拽元素的高度
        IMG_RATIO:0, // 图片比例
        IMG_REAL_W:0, // 图片实际的宽度
        IMG_REAL_H:0, // 图片实际的高度
        IMG_TYPE:'',//图片的格式
        DRAFG_MOVE_RATIO : 750 / wx.getSystemInfoSync().windowWidth //移动时候的比例
    }
};
let data = {};

try{
    data = JSON.parse(JSON.stringify(defaultData));
}catch(e){console.log(e)};

Component({
    properties: {
        imageSrc:{
            type:String,
            value:'',
            observer(newVal, oldVal) {
                if(newVal !== oldVal){
                    this.setData({
                        isShowCropper:true
                    },() => {
                        this.loadImage();
                    })
                }
                
            }
        },
        isCircleCrop:{
            type:Boolean,
            value:false
        },
        enableScale:{
            type:Boolean,
            value:false
        },
        ratio:{
            type:Number,
            value:1
        }
    },
    data,
    ready(){
        if(this.data.isCircleCrop){
            //圆形裁剪 强制比例为1
            this.setData({
                ratio:1
            })
        }
    },
    methods: {
        loadImage() {
            let {ratio,imageSrc} = this.data;
            let {IMG_REAL_W,IMG_REAL_H,IMG_RATIO,SCREEN_WIDTH,IMG_TYPE} = this.data.C_CONSTANTS;
            wx.getImageInfo({
                src: imageSrc,
                success: res => {
                    IMG_REAL_W = res.width;
                    IMG_REAL_H = res.height;
                    IMG_RATIO = IMG_REAL_W / IMG_REAL_H;
                    IMG_TYPE = res.type === 'png' ? 'png' : 'jpg';
                    // 根据图片的宽高显示不同的效果   保证图片可以正常显示
                    let temp = {};
                    let cropperData = {};
                    if (IMG_RATIO >= 1) {
                        cropperData = {
                            cropperW: SCREEN_WIDTH,
                            cropperH: SCREEN_WIDTH / IMG_RATIO,
                            // 初始化left right
                            cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
                            cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2)
                        }
                        if(ratio > 1){
                            temp = {
                                cutL: (SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2,
                                cutT: (SCREEN_WIDTH / IMG_RATIO - SCREEN_WIDTH / IMG_RATIO / ratio ) / 2,
                                cutR: SCREEN_WIDTH - (SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2 - SCREEN_WIDTH / IMG_RATIO,
                                cutB: SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - SCREEN_WIDTH / IMG_RATIO / ratio ) / 2 - SCREEN_WIDTH / IMG_RATIO / ratio
                            }
                        }else{
                            temp = {
                                cutT:0,
                                cutB:0,
                                cutL:(SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO * ratio) / 2,
                                cutR: SCREEN_WIDTH - (SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO * ratio) / 2 - SCREEN_WIDTH / IMG_RATIO * ratio
                            }
                        }
                    } else {
                        cropperData = {
                            cropperW: SCREEN_WIDTH * IMG_RATIO,
                            cropperH: SCREEN_WIDTH,
                            // 初始化left right
                            cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
                            cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2)
                        }
                        if(ratio > 1){
                            temp = {
                                cutL:0,
                                cutR:0,
                                cutT: (SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO / ratio) / 2,
                                cutB: SCREEN_WIDTH - (SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO / ratio) / 2 - SCREEN_WIDTH * IMG_RATIO / ratio
                            }
                        }else{
                            temp = {
                                cutL: (SCREEN_WIDTH * IMG_RATIO - SCREEN_WIDTH * IMG_RATIO * ratio) / 2,
                                cutR: SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO - SCREEN_WIDTH * IMG_RATIO * ratio) / 2 - SCREEN_WIDTH * IMG_RATIO * ratio,
                                cutT: (SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2,
                                cutB: SCREEN_WIDTH - (SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2 - SCREEN_WIDTH * IMG_RATIO
                            }
    
                        }
                    }
                    this.setData({
                        C_CONSTANTS:Object.assign({},this.data.C_CONSTANTS,{
                            IMG_REAL_W,
                            IMG_REAL_H,
                            IMG_RATIO,
                            IMG_TYPE
                        }),
                        isShowCropper: true,
                        // 图片缩放值
                        scaleP: IMG_REAL_W / SCREEN_WIDTH,
                        qualityWidth: IMG_REAL_W,
                        innerAspectRadio: IMG_RATIO,
                        ...temp,
                        ...cropperData
                    })
                }
            });
            
        },
        contentStartMove(e) {
            this.setData({
                'C_CONSTANTS.PAGE_X':e.touches[0].pageX,
                'C_CONSTANTS.PAGE_Y':e.touches[0].pageY
            })
        },
        // 拖动时候触发的touchMove事件
        contentMoveing(e) {
            let {PAGE_X,PAGE_Y,DRAFG_MOVE_RATIO} = this.data.C_CONSTANTS;
            let {cutL,cutR,cutT,cutB} = this.data;
            let dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
            let dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
            // 左移
            if (dragLengthX > 0) {
                if (cutL - dragLengthX < 0) dragLengthX = cutL
            } else {
                if (cutR + dragLengthX < 0) dragLengthX = -cutR
            }
    
            if (dragLengthY > 0) {
                if (cutT - dragLengthY < 0) dragLengthY = cutT
            } else {
                if (cutB + dragLengthY < 0) dragLengthY = -cutB
            }
            this.setData({
                cutL: cutL - dragLengthX,
                cutT: cutT - dragLengthY,
                cutR: cutR + dragLengthX,
                cutB: cutB + dragLengthY,
                'C_CONSTANTS.PAGE_X':e.touches[0].pageX,
                'C_CONSTANTS.PAGE_Y':e.touches[0].pageY
            });
        },
        // 设置大小的时候触发的touchStart事件
        dragStart(e) {
            let {cutL,cutR,cutT,cutB} = this.data;
            this.setData({
                C_CONSTANTS:Object.assign({},this.data.C_CONSTANTS,{
                    T_PAGE_X : e.touches[0].pageX,
                    T_PAGE_Y : e.touches[0].pageY,
                    CUT_L : cutL,
                    CUT_R : cutR,
                    CUT_B : cutB,
                    CUT_T : cutT
                })
            })
            
        },
        // 设置大小的时候触发的touchMove事件
        dragMove(e) {
            let dragType = e.target.dataset.drag
            let {ratio,cropperW,cropperH,cutL,cutT,cutR,cutB,enableScale} = this.data;
            let {CUT_R,CUT_L,CUT_T,CUT_B,T_PAGE_X,T_PAGE_Y,DRAFG_MOVE_RATIO} = this.data.C_CONSTANTS;
            let dragLength;
            switch (dragType) {
                case 'right':
                    dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
                    if (CUT_R + dragLength < 0) dragLength = -CUT_R
                    cutR = CUT_R + dragLength;
                    if(enableScale){
                        cutT = CUT_T + dragLength / ratio;
                    }
                    if(cutR < 0 || cutT < 0 || cutT > cropperH || cutR > cropperW) return;
                    break;
                case 'left':
                    dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
                    if (CUT_L - dragLength < 0) dragLength = CUT_L
                    if ((CUT_L - dragLength) > (this.data.cropperW - this.data.cutR)) dragLength = CUT_L - (this.data.cropperW - this.data.cutR)
                    cutL = CUT_L - dragLength;
                    if(enableScale){
                        cutT = CUT_T - dragLength / ratio;
                    }
                    if(cutL < 0 || cutT < 0 || cutT > cropperH || cutL > cropperW) return;
                    break;
                case 'top':
                    dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
                    if (CUT_T - dragLength < 0) dragLength = CUT_T
                    if ((CUT_T - dragLength) > (this.data.cropperH - this.data.cutB)) dragLength = CUT_T - (this.data.cropperH - this.data.cutB)
                    cutT = CUT_T - dragLength;
                    if(enableScale){
                        cutR = CUT_R - dragLength * ratio;
                    }
                    break;
                case 'bottom':
                    dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
                    if (CUT_B + dragLength < 0) dragLength = -CUT_B
                    cutB = CUT_B + dragLength;
                    if(enableScale){
                        cutR = CUT_R + dragLength * ratio;
                    }
                    if(cutR < 0 || cutT < 0 || cutT > cropperH || cutR > cropperW) return;
                    break;
                default:'';
            }
            this.setData({
                cutL,
                cutT,
                cutR,
                cutB
            });
        },
        contentTouchEnd(){},  
        // 获取图片
        confirmCropper() {
            const {isCircleCrop} = this.data;;
            if(isCircleCrop){
                this.circleCrop()
            }else{
                this.normalCropper();
            }
        },

        normalCropper(){
            let {imageSrc,cropperW,cropperH,cutL,cutT,cutR,cutB} = this.data;
            let {IMG_REAL_W,IMG_REAL_H,IMG_TYPE} = this.data.C_CONSTANTS;
            // 将图片写入画布
            const ctx = wx.createCanvasContext('cropper',this)
            ctx.drawImage(imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
            ctx.draw(true, () => {
                // 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题 canvasT = (_this.data.cutT / _this.data.cropperH) * (_this.data.imageH / pixelRatio)
                let canvasW = ((cropperW - cutL - cutR) / cropperW) * IMG_REAL_W
                let canvasH = ((cropperH - cutT - cutB) / cropperH) * IMG_REAL_H
                let canvasL = (cutL / cropperW) * IMG_REAL_W
                let canvasT = (cutT / cropperH) * IMG_REAL_H
                wx.canvasToTempFilePath({
                    x: canvasL,
                    y: canvasT,
                    width: canvasW,
                    height: canvasH,
                    destWidth: canvasW,
                    destHeight: canvasH,
                    fileType:IMG_TYPE || 'jpg',
                    canvasId: 'cropper',
                    success: (res) => {
                        //图片裁剪成功
                        this.cancelCropper();
                        this.triggerEvent('cropperDone', {
                            src:res.tempFilePath,
                            cropperData:{
                                x: canvasL,
                                y: canvasT,
                                width: canvasW,
                                height: canvasH
                            }
                        })
                    },
                    fail:err =>{
                        this.triggerEvent('cropperFail',err)
                    }
                },this);
            })
        },

        circleCrop(){
            let {imageSrc,cropperW,cropperH,cutL,cutT,cutR,cutB} = this.data;
            let {IMG_REAL_W,IMG_REAL_H,IMG_TYPE} = this.data.C_CONSTANTS;
            // 将图片写入画布
            const ctx = wx.createCanvasContext('cropper',this)
            let canvasW = ((cropperW - cutL - cutR) / cropperW) * IMG_REAL_W
            let canvasL = (cutL / cropperW) * IMG_REAL_W
            let canvasT = (cutT / cropperH) * IMG_REAL_H
            
            this.setData({
                canvasW:canvasW,
                canvasH:canvasW
            },() => {
                ctx.arc(canvasW / 2,canvasW / 2,canvasW / 2,0,2 * Math.PI);
                ctx.clip();
                ctx.drawImage(imageSrc, canvasL, canvasT, canvasW, canvasW,0,0,canvasW,canvasW);
                ctx.draw(true, () => {
                    wx.canvasToTempFilePath({
                        fileType:IMG_TYPE || 'jpg',
                        canvasId: 'cropper',
                        success: (res) => {
                            //图片裁剪成功
                            this.cancelCropper();
                            this.triggerEvent('cropperDone', {
                                src:res.tempFilePath,
                                cropperData:{
                                    x: canvasL,
                                    y: canvasT,
                                    width: canvasW,
                                    height: canvasW
                                }
                            })
                        },
                        fail:err =>{
                            this.triggerEvent('cropperFail',err)
                        }
                    },this);
                })
            })
        },

        cancelCropper(){
            let originData = {}
            try{
                originData = JSON.parse(JSON.stringify(defaultData))
            }catch(e){};

            this.setData({
                ...originData
            });
            this.triggerEvent('cropperCancel')
        }
    }
})