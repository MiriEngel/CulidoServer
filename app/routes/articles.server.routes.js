const users = require('../../app/controllers/users.server.controller');
const articles = require('../../app/controllers/articles.server.controller');
const profile = require('../../app/controllers/profile.server.controller');
const order = require('../../app/controllers/order.server.controller');
const core = require('../../app/controllers/core.server.controller');


module.exports = function(app) {
    app.route('/api/articles')
        .get(articles.list)
        .post(users.requiresLogin, articles.create);

    app.route('/api/articles/:articleId')
        .get(articles.read)
        .put(users.requiresLogin, articles.hasAuthorization, articles.update)
        .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
        
   	app.route('/api/articles/uploadPics').post(articles.uploadArticlePicture);
    app.route('/api/articles/insertOrderDates').post(articles.insertOrderDates);
    // app.route('/api/articles/updateOrderStatus').post(articles.updateOrderStatus);

    app.route('/api/order/updateOrderStatus').post(order.updateOrderStatus);
     
      app.route('/api/articles/listPopOrder').get(articles.listPopOrder) ;
            // app.route('/api/profile/getByUserId').get(profile.getByUserId);

        // app.route('/api/profiles/updateOrderDates').post(articles.updateOrderDates);
    app.param('articleId', articles.articleByID);


    //profile
     app.route('/api/profile/getByUserId').get(profile.getByUserId);
    //  app.route('/api/profile/updateOrderDates').post(profile.updateOrderDates);

      app.route('/api/order/create').post(order.create);
        app.route('/api/orders').get(order.list)

        //core
        
          app.route('/api/core/getTopNotificationByUserId/:cnt').get(core.getTopNotificationByUserId);
           app.route('/api/core/isNewNotification/:NotificationId').put( core.updateIsNewNotification);
               app.route('/api/core/sendMail').get(core.sendMail);

 app.route('/api/notification/:notificationId').get(core.getNotificationById);
      

};