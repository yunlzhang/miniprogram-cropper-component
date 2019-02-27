# miniprogram-cropper-component

小程序裁剪组件，支持等比例裁剪，使用简单。

### 使用方式
1、首先在page.json文件中引入组件
page.json

    {
        ...,
        "usingComponents": {
            "cropper":"cropper的路径/index"
        }
    }

2、在页面中使用

    <cropper imageSrc="{{imgSrc}}" enableScale="{{true}}" ratio="{{2/1}}" bind:cropperDone="cropperDone" bind:cropperCancel="cropperCancel" bind:cropperFail="cropperFail"></cropper>


### 组件的props

    imageScale(String) : 要裁剪的图片地址，基本上市本地图片地址

    enablseScale(Boolean): 是否开启等比例裁剪 可选参数

    ratio(Number): 裁剪比例 默认为1 可选参数

    cropperDone(Function):裁剪成功的回调

    cropperCancel(Function): 裁剪取消的回调

    cropperFail(Function):裁剪失败回调

    isCircleCrop(Boolean) 是否是圆形裁剪 圆形裁剪ratio 强制为1

### 回调

```js
    Page({
        cropperDone(e){
            const{src,cropperData} = e.detail;
            //src 最终裁剪图片地址
            // cropperData 裁剪起点、大小信息
        },

        cropperCancel(){
            // do something
        },

        cropperFail(e){
            const err = e.detail;
            console.log(err);
        }

    })
```


更新日志：

    1.1  等比例裁剪等
    
    1.2  支持圆形裁剪


参考:[传送门](https://github.com/IFmiss/wx-cropper)