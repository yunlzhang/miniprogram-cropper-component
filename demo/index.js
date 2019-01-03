Page({
    data:{
        imageSrc:''
    },
    handleTap(){    
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:res => {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              this.setData({
                  imageSrc:tempFilePaths[0]
              })
            }
          })
    },
    cropperDone(e){
        const {src,cropperData} = e.detail;
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
    },
    cropperCancel(){
        console.log('cancel');
    }
})