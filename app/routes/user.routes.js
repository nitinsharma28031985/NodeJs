module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/users', user.create);

    // Retrieve all Users
    app.get('/usersAll', user.findAll);

    // Retrieve a single User with userId
    app.get('/user/:userId', user.findOne);

    // Update a User with userId
    app.put('/userUpdate/:userId', user.update);

    // Delete a User with userId
    app.delete('/userDelete/:userId', user.delete);


    app.post('/loginProcess', user.login);

    // GET /logout
    app.get('/logout',function(req,res){
        console.log("logout from session")
        req.session.destroy(function(err) {
          if(err) {
            console.log(err);
          } else {
            res.redirect('login');
          }
        });
    });





}