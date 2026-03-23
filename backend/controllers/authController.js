const User = require("../model/User");
const { generateToken } = require("../utils/generateToken");
const response = require("../utils/responceHandler");
const bcrypt = require('bcryptjs')



const registerUser = async(req,res) =>{
    try {
         const {username,email,password,gender,dateOfBirth} = req.body;
         
        //  check the existing user with email
        const existingUser = await User.findOne({email});
        if(existingUser){
            return response(res,400,'Cet utilisateur existe déjà.')
        }
       
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            gender,
            dateOfBirth
        })

        await newUser.save();
        
        const accessToken = generateToken(newUser);

        res.cookie("auth_token",accessToken,{
            httpOnly: true,
            sameSite:"none",
            secure:true,
           path: "/",
        })


        return response(res,201,"Utilisateur créé avec succès",{
             username:newUser.username,
             email:newUser.email
        })

    } catch (error) {
        console.error(error)
        return response(res,500,"Erreur interne du serveur",error.message)
    }
}


const loginUser = async(req,res) =>{
    try {
         const {email,password} = req.body;
         
        //  check the existing user with email
        const user = await User.findOne({email});
        if(!user){
            return response(res,404,'Utilisateur introuvable avec cette adresse e-mail')
        }
       
        const matchPassword = await bcrypt.compare(password,user.password)
        if(!matchPassword){
            return response(res,404,'Mot de passe invalide')
        }
        
        const accessToken = generateToken(user);

        res.cookie("auth_token",accessToken,{
            httpOnly: true,
            sameSite:"none",
            secure:true,
            path: "/",
        })


        return response(res,201,'L\'utilisateur s\'est connecté avec succès.',{
             username:user.username,
             email:user.email
        })

    } catch (error) {
        console.error(error)
        return response(res,500,"Erreur interne du serveur",error.message)
    }
}


const logout = (req,res) =>{
    try {
        res.cookie("auth_token", "", {
            httpOnly: true,
            sameSite:"none",
            secure:true,
            path: "/",
            expires: new Date(0)
        })
        return response(res,200,"L'utilisateur s'est déconnecté avec succès")
    } catch (error) {
        console.error(error)
        return response(res,500,"Erreur interne du serveur",error.message)
    }
}


module.exports = {registerUser,loginUser,logout}