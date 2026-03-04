const { uploadFileToCloudinary } = require("../config/cloudinary");
const User = require("../model/User");
const Bio = require("../model/UserBio");
const response = require("../utils/responceHandler");



const createOrUpdateUserBio = async(req,res) =>{
    try {
        const {userId} = req.params;
        const {bioText,liveIn,relationship,workplace,education,phone,hometown} = req.body;

        let bio = await Bio.findOneAndUpdate(
            {user:userId},
            {
                bioText,
                liveIn,
                relationship,
                workplace,
                education,
                phone,
                hometown
            },
            {new : true, runValidators:true},
        )

        // if bio does not exist to create new one
        if(!bio){
            bio = new Bio({
                user:userId,
                bioText,
                liveIn,
                relationship,
                workplace,
                education,
                phone,
                hometown
            })

            await bio.save();
            await User.findByIdAndUpdate(userId,{bio: bio._id})
        }

        return response(res,201, 'Création ou mise à jour réussie de la bio',bio)

    } catch (error) {
        console.log(error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}


const updateCoverPhoto = async(req, res) =>{
       try {
         const {userId} = req.params;
         const file = req.file;
         let coverPhoto = null;

         if(file){
            const uploadResult = await uploadFileToCloudinary(file)
            coverPhoto= uploadResult.secure_url
         }

         if(!coverPhoto){
            return response(res,400, 'Impossible de télécharger la photo de couverture')
         }
         //update user profile with cover photo
            await User.updateOne(
            {_id:userId},
            {
                $set:{
                    coverPhoto,
                },
            }
         )
         const updateUser = await User.findById(userId)

         if(!updateUser){
           return response(res,404, 'Utilisateur introuvable avec cet identifiant')
         }
         return response(res,200, 'Mise à jour de la photo de couverture réussie',updateUser)
       } catch (error) {
        console.log(error)
        return response(res,500,'Erreur interne du serveur',error.message)
       }
}



const updateUserProfile = async(req, res) =>{
    try {
      const {userId} = req.params;
      const {username,gender,dateOfBirth} = req.body;
      const file = req.file;
      let profilePicture = null;

      if(file){
         const uploadResult = await uploadFileToCloudinary(file)
         profilePicture= uploadResult.secure_url
      }
  
      //update user profile with cover photo
        await User.updateOne(
         {_id:userId},
         {
             $set:{
                username,
                gender,
                dateOfBirth,
                  ...(profilePicture && {profilePicture})
             },
         }
      )

      const updateUser = await User.findById(userId)

      if(!updateUser){
        return response(res,404, 'Utilisateur introuvable avec cet identifiant')
      }

      return response(res,200, 'Mise à jour du profil utilisateur réussie',updateUser)
    } catch (error) {
     console.log(error)
     return response(res,500,'Erreur interne du serveur',error.message)
    }
}

module.exports= {
    createOrUpdateUserBio,
    updateCoverPhoto,
    updateUserProfile
}