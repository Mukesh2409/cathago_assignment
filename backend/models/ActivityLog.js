const db = require("../db");

class ActivityLog {
    static create(userId, action, callback) {
        const date = new Date().toISOString();
        db.run(
            "INSERT INTO user_activity_logs (userId, action, date) VALUES (?, ?, ?)",
            [userId, action, date],
            callback
        );
    }

    static findByUser(userId, callback) {
        db.all("SELECT * FROM user_activity_logs WHERE userId = ?", [userId], callback);
    }
}

module.exports = ActivityLog;
