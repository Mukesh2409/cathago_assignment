const db = require("../db");
const bcrypt = require('bcrypt');



exports.getAllUsers = (req, res) => {
    db.all("SELECT * FROM users where role = 'user'  ", [], (err, users) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json(users);
    });
};


exports.addUsers =  async (req, res) => {

    try {
        const { name, username, password } = req.body;
        console.log(name, username,password)    
        
        if (!name || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const hashedPassword =  await bcrypt.hash(password, 10);
        
        db.run(
            `INSERT INTO users (name, username, password) VALUES (?, ?, ?)`,
            [name, username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ id: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
    

};


exports.deleteUsers = (req, res) => {

    console.log("inside delete")
    db.run(
        `DELETE FROM users WHERE id = ?`,
        [req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true });
        }
    );
};

exports.updateCredits = (req, res) => {
    const { credits } = req.body;
    
    if (isNaN(credits)) {  
        return res.status(400).json({ error: 'Invalid credit amount' });
    }

    db.run(
        `UPDATE users SET credits = ? WHERE id = ?`,
        [credits, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ success: true });
        }
    );
};


exports.approveCreditRequest = (req, res) => {
    const { requestId, status } = req.body;

    db.run(
        "UPDATE credit_requests SET status = ? WHERE id = ?",
        [status, requestId],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }

            if (status === "Approved") {
                db.run(
                    "UPDATE users SET credits = credits + (SELECT credits FROM credit_requests WHERE id = ?) WHERE id = (SELECT userId FROM credit_requests WHERE id = ?)",
                    [requestId, requestId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: "Database error" });
                        }
                        res.json({ message: "Credit request approved" });
                    }
                );
            } else {
                res.json({ message: "Credit request rejected" });
            }
        }
    );
};

exports.getAnalytics = (req, res) => {
    const queries = [
        "SELECT COUNT(*) as totalUsers FROM users",
        "SELECT COUNT(*) as totalScans FROM scans",
        "SELECT COUNT(*) as pendingCreditRequests FROM credit_requests WHERE status = 'Pending'",
        "SELECT SUM(credits) AS totalCreditsApproved FROM credit_requests WHERE status = 'Approved'"
    ];

    db.serialize(() => {
        const results = {};
        queries.forEach((query, index) => {
            db.get(query, [], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }
                results[Object.keys(row)[0]] = row[Object.keys(row)[0]];

                if (index === queries.length - 1) {
                   
                    res.json(results);
                }
            });
        });
    });
};


exports.getpendingReq=(req,res)=>{

    db.all("SELECT id, credits, status FROM credit_requests WHERE status = 'Pending' ", (err, reqpending) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }      
        res.json(reqpending);
    });
}


exports.creditAnalytics = (req, res) => {
    db.all("SELECT * FROM credit_requests", [], (err, creditAnalytics) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ error: "Database error" });
        }
    
        res.json(creditAnalytics);
    });
};



exports.useractivity = (req, res) => {
    db.all("SELECT * from user_activity_logs", (err, activity) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json(activity);
    });
};