
   const cloud = require('wx-server-sdk')
   cloud.init()
   exports.main = async (event) => {
     await cloud.openapi.customerServiceMessage.send({
       touser: event.userOpenid,
       msgtype: 'link',
       link: {
         title: '推荐文章',
         description: event.articleDesc,
         url: event.externalUrl,
         thumbUrl: event.coverImg
       }
     })
   }
   