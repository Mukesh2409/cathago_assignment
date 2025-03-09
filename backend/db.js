const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");
const cron = require("node-cron");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);


db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name Text,
            username TEXT UNIQUE NOT NULL, 
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('user', 'admin')) DEFAULT 'user',
            credits INTEGER DEFAULT 20
        )
    `);
   
   
    db.run(`
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            fileName TEXT NOT NULL,
            content TEXT NOT NULL,
            date TEXT NOT NULL,
            matchCount INTEGER DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `); 

    db.run(`
        CREATE TABLE IF NOT EXISTS credit_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            credits INTEGER NOT NULL,
            status TEXT CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS user_activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            action TEXT,
            date TEXT
        )
    `);


   db.run(` CREATE TABLE IF NOT EXISTS metadata (
        id INTEGER PRIMARY KEY,
        last_reset TEXT
    )`);
    

    const adminPassword = bcrypt.hashSync("admin123", 10);
    db.run(`
        INSERT OR IGNORE INTO users (username, password, role, credits)
        VALUES ('admin', ?, 'admin', 9999)
    `, [adminPassword]);




    db.get("SELECT last_reset FROM metadata WHERE id = 1", (err, row) => {
        if (err) {
            console.error(" Error fetching last reset date:", err);
            return;
        }
        const currentDate = new Date().toLocaleDateString('en-CA'); 
       
    
        if (!row || row.last_reset !== currentDate) {
            db.run(`UPDATE users SET credits = 20`, (err) => {
                if (err) {
                    console.error(" Error resetting credits:", err);
                } else {
                    console.log(" Credits reset to 20 for all users.");
                    db.run("UPDATE metadata SET last_reset = ? WHERE id = 1", [currentDate]);
                }
            });
        }
    });
    cron.schedule("0 0 * * *", () => {
      

        db.run(`UPDATE users SET credits = 20`, (err) => {
            if (err) {
                console.error(" Error resetting credits:", err);
            } else {
                console.log(" Credits reset to 20 for all users at midnight.");
                db.run("UPDATE metadata SET last_reset = ? WHERE id = 1", [new Date().toLocaleDateString('en-CA')]);
            }
        });
    });
    
    
    


  
});

module.exports = db;