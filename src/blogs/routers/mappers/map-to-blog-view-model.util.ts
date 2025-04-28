import { WithId } from "mongodb";
import { Blog } from "../../types/blog";
import { BlogViewModels } from "../../types/blog-view-model";

export function mapToBlogViewModel(blog: WithId<Blog>): BlogViewModels {
  return {
    id: blog._id.toString(),
    name:	blog.name,
    description: blog.description,
    websiteUrl:	blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
}
