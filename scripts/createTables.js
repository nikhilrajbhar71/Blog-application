import db from "../config/db.js";

const createTables = async () => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NULL,
    comment_id INT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id, comment_id),
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR 
        (comment_id IS NOT NULL AND post_id IS NULL)
    )
);  `);

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
    db.end();
    process.exit();
  } catch (err) {
    console.error(" Error creating tables:", err);
    process.exit(1);
  }
};

// Run the function
createTables();
