import Resource from "resources.js";

class LikeResource extends Resource {
  toArray() {
    return {
      id: this.id || 0,
      userId: this.userId || 0,
      createdAt: this.createdAt || "",
    };
  }
}

export default LikeResource;
