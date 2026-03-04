const { uploadFileToCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post");
const Story = require("../model/story");
const response = require("../utils/responceHandler");




const createPost = async(req,res) =>{
    try {
        const userId = req.user.userId;

        const {content} = req.body;
        const file= req.file;
        let mediaUrl = null;
        let mediaType = null;

        if(file) {
          const uploadResult = await uploadFileToCloudinary(file)
          mediaUrl= uploadResult?.secure_url;
          mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
        }
       
        //create a new post
        const newPost = await new Post({
            user:userId,
            content,
            mediaUrl,
            mediaType,
            likeCount:0,
            commentCount:0,
            shareCount:0,
        })

        await newPost.save();
        return response(res,201,'Message créé avec succès', newPost)

    } catch (error) {
         console.log('error creating post',error)
         return response(res,500, 'Erreur interne du serveur',error.message)
    }
}


//create story 

const createStory = async(req,res) =>{
    try {
        const userId = req.user.userId;
        const file= req.file;
        
        if(!file) {
            return response(res,400, 'Un fichier est nécessaire pour créer une histoire')
        }
        let mediaUrl = null;
        let mediaType = null;

        if(file) {
          const uploadResult = await uploadFileToCloudinary(file)
          mediaUrl= uploadResult?.secure_url;
          mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
        }
       
        //create a new story
        const newStory = await new Story({
            user:userId,
            mediaUrl,
            mediaType
        })

        await newStory.save();
        return response(res,201,'Histoire créée avec succès', newStory)

    } catch (error) {
         console.log('error creating story',error)
         return response(res,500, 'Erreur interne du serveur',error.message)
    }
}


//getAllStory
const getAllStory = async(req, res) => {
    try {
        const story = await Story.find()
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')

        return response(res, 201, 'Obtenez l\'intégralité de l\'histoire avec succès', story)
    } catch (error) {
        console.log('erreur lors de la récupération de l\'histoire',error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}



//get all posts
const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find()
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'username profilePicture'
        })
        return response(res, 201, 'Récupérer tous les messages avec succès', posts)
    } catch (error) {
        console.log('erreur lors de la récupération des messages',error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}


//get post by userId
const getPostByUserId = async(req, res) => {
    const {userId} = req.params;
    
    try {
        if(!userId){
            return response(res,400,'L\'identifiant utilisateur est requis pour obtenir le message de l\'utilisateur.')
        }

        const posts = await Post.find({user:userId})
        .sort({createdAt: -1})
        .populate('user','_id username profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'username, profilePicture'
        })
        return response(res, 201, 'Récupération réussie du message de l\'utilisateur', posts)
    } catch (error) {
        console.log('erreur lors de la récupération des messages',error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}

//like post api
const likePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post non trouver')
         }
         const hasLiked = post.likes.includes(userId)
         if(hasLiked){
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
            post.likeCount =  Math.max(0, post.likeCount - 1) ; //ensure llikecount does not go negative
         }else{
            post.likes.push(userId)
            post.likeCount += 1
         }


         //save the like in updated post
         const updatedpost = await post.save()
         return response(res, 201, hasLiked ? "Publier contrairement à avec succès": "publication aimée avec succès", updatedpost )
    } catch (error) {
        console.log(error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}

//post comments by user

const addCommentToPost = async(req,res) =>{
    const {postId} = req.params;
    const userId= req.user.userId;
    const {text} = req.body;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post non trouver')
         }


         post.comments.push({user:userId,text})
         post.commentCount+=1;
          
         //save the post with new comments
         await post.save()
         return response(res, 201, "Commentaires ajoutés avec succès", post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}



//share on post by user
const sharePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post non trouver')
         }
         const hasUserShared = post.share.includes(userId)
         if(!hasUserShared){
             post.share.push(userId)
         }

         post.shareCount +=1;

         //save the share in updated post
          await post.save()
         return response(res, 201, 'Partage réussi', post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Erreur interne du serveur',error.message)
    }
}







module.exports= {
    createPost,
    getAllPosts,
    getPostByUserId,
    likePost,
    addCommentToPost,
    sharePost,
    createStory,
    getAllStory
}