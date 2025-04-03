import { Blog } from "../blogs/types/blog";
import { Post } from "../posts/types/post";

export const db = {
  blogs: <Blog[]>[
    {
      id:	'1',
      name:	'blog1',
      description: 'description blog1',
      websiteUrl: 'https://fake-url.com/blog1'
    },
    {
      id:	'2',
      name:	'blog2',
      description: 'description blog2',
      websiteUrl: 'https://fake-url.com/blog2'
    },
    {
      id:	'3',
      name:	'blog3',
      description: 'description blog3',
      websiteUrl: 'https://fake-url.com/blog3'
    },
  ],
  posts: <Post[]>[
    {
      id:	'1',
      title: 'title1',
      shortDescription: 'shortDescription1',
      content: 'content1',
      blogId: '1',
      blogName: 'blog1',
    },
    {
      id:	'2',
      title: 'title_2',
      shortDescription: 'shortDescription_2',
      content: 'content_2',
      blogId: '1',
      blogName: 'blog1',
    },
  ]
};