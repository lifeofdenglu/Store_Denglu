//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

     /**
      * 页面的初始数据
      */
     data: {
         //左侧的菜单数据
         leftMenuList:[],
         //右侧的商品数据
         rightContent:[],
         //表点击的左侧的菜单
          currentIndex: 0,
          // 右侧内容的滚动条距离顶部的距离,就是每次点击左侧菜单时，使右侧菜单跳到该菜单顶部
          scrollTop: 0

     },

     //接口的返回数据
     Cates:[],

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          /**
           * 使用缓存
           * 
           * 0 web中的本地储存和小程序中的本地储存的区别
           *   1 写代码的方式不一样了
           *        web:localStotage.setItem("key","value") localStorage.getItem("key")
           *        小程序中：wx.setStorageSync("cates",{time:Data.now(),data:this.Cates});
           *   2 存的时候有，有没有做类型转换
           *        web:不管存入的是什么类型的数据，最终都会先调用下 toString(),把数据变成了字符串 再存入进去
           *        小程序：不存在类型转换的这个操作，存什么类似的数据进去，获取的时候就是什么类型
           * 1 先判断一下本地储存中有没有旧的数据
           *   {time:Date.now(),data:[...]
           * 2 没有旧的数据，直接发送新请求
           * 3 有旧的数据，同时旧的数据也没有过期，就使用本地储存中的旧数据即可
           */
               // 1 获取本地存储中的数据（小程序中也是存在本地储存技术的）
               const Cates = wx.getStorageSync("cates");
               // 2 判断
               if(!Cates){
                    // 不存在，发送请求获取数据,getCates就是下面的分类方法
                    this.getCates();
               }else{
                    // 有旧的数据，定义一个过期时间，假设1分钟
                    if(Date.now() - Cates.time > 1000 * 10 * 6){   
                         //过期,重新发送请求
                         this.getCates(); 
                    }else{
                         //获取旧的数据
                         this.Cates = Cates.data;

                         //构建左侧的菜单数据
                         let leftMenuList = this.Cates.map(v => v.cat_name);
                         //构建右侧的商品数据
                         let rightContent = this.Cates[0].children;
                         this.setData({
                              leftMenuList,
                              rightContent      
                              
                         })
                    }
               
               }
          },

          //获取分类数据
          // getCates(){
          async getCates(){

               // request({
               //      // url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
               //      url: "/categories"
               // })
               // .then(res => { 
               //      this.Cates = res.data.message;

               //      // 把接口的数据存入到本地储存中
               //      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

               //      //构建左侧的菜单数据
               //      let leftMenuList = this.Cates.map(v => v.cat_name);
               //      //构建右侧的商品数据
               //      let rightContent = this.Cates[0].children;
               //      this.setData({
               //           leftMenuList,
               //           rightContent      
                         
               //      })
               // })
          
          /**
           * 1 使用es7的async await来发送请求
           * 这一句执行完成之前，下面的不会执行：const res=await request({url: "/categories"})
           * 其实这里好像改成了同步了
           */
          const res=await request({url: "/categories"});
          // this.Cates = res.data.message;
          //简化上面的this.Cates，已经在request中拼接了
          this.Cates = res;     
          // 把接口的数据存入到本地储存中
          wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
          //构建左侧的菜单数据
          let leftMenuList = this.Cates.map(v => v.cat_name);
          //构建右侧的商品数据
          let rightContent = this.Cates[0].children;
          this.setData({
               leftMenuList,
               rightContent      
          })     
     },


     // 左侧菜单的点击事件
     handleItemTap(e){
          /**
           * 1 获取被点击的标题身上的索引 从.wxml文件中获取
           * 2 给data中的currentIndex赋值就可以了
           * 3 根据不同的索引来渲染右侧的商品内容
           */
          const {index} = e.currentTarget.dataset;

           //更新右侧的商品数据
           let rightContent = this.Cates[index].children;

         
          this.setData({
               currentIndex: index,
               rightContent,
                //  重新设置，右侧内容的scroll-view标签距离顶部的距离
               scrolTop:0
          })

         
     }

     
})