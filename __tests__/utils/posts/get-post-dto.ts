import { PostInputDto } from "../../../src/posts/dto/post.input-dto";

export const getPostDto = ( blogId: string): PostInputDto => {
  return {
    title: 'new title1',
    shortDescription: 'new short Description1',
    content: 'new content 1',
    blogId, 
  }
};
