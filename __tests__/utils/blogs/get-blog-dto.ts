import { BlogInputDto } from "../../../src/blogs/dto/blog.input-dto";

export const getBlogDto = (): BlogInputDto => {
  return {
    name: 'new blog 1',
    description: 'new description 1',
    websiteUrl: 'https://eNf7vpWWtJWn2ME6etJ48A4D7.com'
  }
};
