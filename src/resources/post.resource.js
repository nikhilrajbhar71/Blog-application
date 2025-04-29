import Resource from "resources.js";

class PostResource extends Resource {
  toArray() {
    return {
      id: this._id || 0,
      title: this.title || "",
      content: this.content || "",
      categoryId: this.categoryId || "",
      isPublished: this.isPublished || false,
      isDeleted: this.isDeleted || false,
      image: this.bannerImage || "",
      authorId: this.authorId || "",
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      likesCount: this.Likes || 0,
      commentsCount: this.Comments || 0,
    };
  }

  static collection(items) {
    return items.map((item) => new PostResource(item).exec());
  }
}

export default PostResource;
