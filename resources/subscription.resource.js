import Resource from "resources.js";

class SubscriptionResource extends Resource {
  toArray() {
    return {
      id: this.id || 0,
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
      userId: this.userId || "",
      authorId: this.authorId || "",
    };
  }

  static collection(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => new SubscriptionResource(item).exec());
  }
}

export default SubscriptionResource;
