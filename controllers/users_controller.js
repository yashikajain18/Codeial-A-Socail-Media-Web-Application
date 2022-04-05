const passport = require('passport');
const User = require('../models/user');

module.exports.profile=function(req, res){
    // res.end('<h1> User Profile</h1>');
    return res.render('user_profile', {
        title: "User Profile"
    });
}

// render sign in page
module.exports.signIn=function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title:"Codeial | Sign In"
    });
}
// render sign up page
module.exports.signUp=function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: " Codeial | Sign Up"
    });
}

//get the sign up data

module.exports.create =function(req, res){
    if(req.body.password != req.body.confirm_password){
        
        return res.redirect('back');
     }
    
    User.findOne({email: req.body.email}, function(err, user){
        console.log(user);
        if(err){console.log('error in finding user in signing up'); return}

        if(!user){
            
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up', err); return}

                return res.redirect('/users/sign-in');
            });
        }else{
            
            return res.redirect('back');
        }
    });
}



// sign in and create the session for the user
module.exports.createSession=function(req, res){
    return res.redirect('/');
}

module.exports.destroySession=function(req, res){
    req.logout();
    return res.redirect('/')
}