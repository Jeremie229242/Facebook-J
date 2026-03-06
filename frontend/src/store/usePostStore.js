import {
  createPost,
  getAllPosts,
  getAllStory,
  getAllUserPosts,
  likePost,
  sharePost,
  createStory,
  commentsPost
} from "@/service/post.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],
  userPosts: [],
  story: [],
  loading: false,
  error: null,

  //fetchPost
  fetchPost: async () => {
    set({ loading: true });
    try {
      const posts = await getAllPosts();
      set({ posts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //fetch user posts
  fetchUserPost: async (userId) => {
    set({ loading: true });
    try {
      const userPosts = await getAllUserPosts(userId);
      set({ userPosts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  //fetch all story
  fetchStoryPost: async () => {
    set({ loading: true });
    try {
      const story = await getAllStory();
      set({ story, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //create a new post
  handleCreatePost: async (postData) => {
    set({ loading: true });
    try {
      const newPost = await createPost(postData);
      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
      toast.success("Post créer avec succes");
    } catch (error) {
      set({ error, loading: false });
      toast.error("erreur lors de creation du post");
    }
  },

  //create a new story
  handleCreateStory: async (storyData) => {
    set({ loading: true });
    try {
      const newStory = await createStory(storyData);
      set((state) => ({
        story: [newStory, ...state.story],
        loading: false,
      }));
      toast.success("Story créer avec succes");
    } catch (error) {
      set({ error, loading: false });
      toast.error("erreur lors de creation du story");
    }
  },

  //create a new story
  handleLikePost: async (postId) => {
    set({ loading: true });
    try {
       await likePost(postId);
    } catch (error) {
      set({ error, loading: false });
    }
  },

  //create a new story
  handleCommentPost: async (postId,text) => {
    set({ loading: true });
    try {
      const newComments = await commentsPost(postId, {text});
       set((state) =>({
         posts: state.posts.map((post) => 
            post?._id === postId
             ? {...post,comments: [...post.comments, newComments]}
             :post
        ),
       }))
      toast.success("Commentaire ajouter avec succes");
    } catch (error) {
      set({ error, loading: false });
      toast.error("erreur lors de creation de comments");
    }
  },


  //create a new story
  handleSharePost: async (postId) => {
    set({ loading: true });
    try {
       await sharePost(postId);
       toast.success("post partager avec successfully");
    } catch (error) {
      set({ error, loading: false });
      toast.error('erreur lors de partage du post')
    }
  },
}));
