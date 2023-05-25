import jwt from 'jsonwebtoken'


const auth = (req, res, next)=>{
    
    const token = req.cookies.user_token_auth;
    // check if token exist

    if(token){
        jwt.verify(token, 'segun secret code', (err, decodedToken)=>{
             if(err){
                console.log(err.message)
                res.redirect('/')                
             }
             else{
                console.log(decodedToken)

                next()
             }
        })
    }
    else{
        res.redirect('/')
    }
}

export default auth;