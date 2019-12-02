
function adminAuth (req, res, next){
    console.log("get in admin");
    
    if(req.isAuthenticated()){
        console.log("auth");
        
        if(req.user.role == 'admin'){
            console.log("admin");
            
          return  next()
        }
        else return res.redirect('/login')
    }

   return res.redirect('/login')
}
module.exports=adminAuth