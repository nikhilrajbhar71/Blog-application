import Resource from "resources.js";

class PostResource extends Resource {
  toArray() {
    return {
      id: this.id || 0,
      title: this.title || "",
      content: this.content || "",
      categoryId: this.categoryId || "",
      authorId: this.authorId || "",
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      likesCount: this.Likes?.length || 0,
      commentsCount: this.Comments?.length || 0,
    };
  }

  static collection(items) {
    return items.map((item) => new PostResource(item).exec());
  }
}

export default PostResource;
