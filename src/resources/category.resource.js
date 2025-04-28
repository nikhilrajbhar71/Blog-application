import Resource from "resources.js";

class CategoryResource extends Resource {
  toArray() {
    return {
      id: this.id || 0,
      name: this.name || "",
      createdAt: this.createdAt || "",
      updatedAt: this.updatedAt || "",
    };
  }

  static collection(items) {
    return items.map((item) => new CategoryResource(item).exec());
  }
}

export default CategoryResource;
