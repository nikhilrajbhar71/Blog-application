import db from "../config/db.js";

const createTables = async () => {
  try {
    await db.query(`
          CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    banner_image VARCHAR(255), -- Image URL
    author_id INT ,
    category_id INT ,
    is_published BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,  -- New column to indicate soft deletion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

        `);

    // await db.query(`
    //         CREATE TABLE IF NOT EXISTS orders (
    //             id INT AUTO_INCREMENT PRIMARY KEY,
    //             user_id INT NOT NULL,
    //             product_name VARCHAR(255) NOT NULL,
    //             amount DECIMAL(10,2) NOT NULL,
    //             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    //         );
    //     `);

    console.log("Tables created successfully!");
    process.exit();
  } catch (err) {
    console.error(" Error creating tables:", err);
    process.exit(1);
  }
};

// Run the function
createTables();
