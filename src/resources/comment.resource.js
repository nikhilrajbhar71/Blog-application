import Resource from "resources.js";

class CommentResource extends Resource {
  toArray() {
    return {
      id: this._id || 0,
      comment: this.comment || "",
      userId: this.userId || "",
      createdAt: this.createdAt || "",
    };
  }
}

export default CommentResource;
