import Resource from "resources.js";

class UserResource extends Resource {
  toArray() {
    return {
      id: this._id || 0,
      name: this.name || "",
      email: this.email || "",
      created_at: this.createdAt || "",
      updated_at: this.updatedAt || "",
    };
  }
}

export default UserResource;
