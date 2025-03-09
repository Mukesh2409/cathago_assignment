const db = require("../db");
const ActivityLog = require("../models/ActivityLog")
const { calculateSimilarity } = require("../utils/similarity"); 

exports.getUserInfo = (req, res) => {
    db.get(
        "SELECT id, name, credits,username FROM users WHERE id = ?",
        [req.session.userId],
        (err, user) => {
            if (err || !user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        }
    );
};

exports.getPastScans = (req, res) => {
   
    db.all(
        "SELECT id, fileName, matchCount, date FROM scans WHERE userId = ?",
        [req.session.userId],
        (err, scans) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
           
            res.json(scans);
        }
    );
};



exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const { filename, path } = req.file;
    const content = require("fs").readFileSync(path, "utf-8"); 

    db.get("SELECT credits FROM users WHERE id = ?", [req.session.userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        
        if (!row || row.credits <= 0) {
            return res.status(403).json({ error: "Insufficient credits. Wait until midnight or request more credits from admin." });
        }

        db.run(
            "UPDATE users SET credits = credits - 1 WHERE id = ?",
            [req.session.userId],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: "Database error" });
                }

                db.run(
                    "INSERT INTO scans (userId, fileName, content, date) VALUES (?, ?, ?, ?)",
                    [req.session.userId, filename, content, new Date().toISOString()],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: "Database error" });
                        }
                        ActivityLog.create(req.session.userId, "file upload", (err) => {
                            if (err) console.error("Failed to log activity:", err);
                        });
                        res.json({ message: "Document uploaded and scanned" });
                    }
                );
            }
        );
    });
};


exports.requestCredits = (req, res) => {
    const { credits } = req.body;

    db.run(
        "INSERT INTO credit_requests (userId, credits) VALUES (?, ?)",
        [req.session.userId, credits],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            ActivityLog.create(req.session.userId, "credits requested", (err) => {
                if (err) console.error("Failed to log activity:", err);
            });
            res.json({ message: "Credit request submitted" });
        }
    );
};


exports.creditreport = (req,res)=>{

    db.all(
        "SELECT credits, id, status FROM credit_requests WHERE userId = ?",
        [req.session.userId],
        (err, requests) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
           
            res.json(requests);
        }
    );
      
}


  
exports.getmatches = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Document ID is required" });
    }

    db.get("SELECT content FROM scans WHERE id = ?", [id], (err, uploadedDoc) => {
        if (err || !uploadedDoc) {
            console.error("Error fetching uploaded document:", err);
            return res.status(404).json({ message: "Document not found" });
        }

        db.all("SELECT id, fileName, content FROM scans WHERE id != ?", [id], (err, storedDocs) => {
            if (err) {
                console.error("Error fetching stored documents:", err);
                return res.status(500).json({ message: "Error fetching stored documents" });
            }

            const similarDocs = storedDocs
                .map(doc => ({
                    id: doc.id,
                    fileName: doc.fileName,
                    similarity: calculateSimilarity(uploadedDoc.content, doc.content),
                }))
                .filter(doc => doc.similarity > 0.3) 
                .sort((a, b) => b.similarity - a.similarity); 
            const matchCount = similarDocs.length;

            db.run("UPDATE scans SET matchCount = ? WHERE id = ?", [matchCount, id], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating match count:", updateErr);
                    return res.status(500).json({ message: "Error updating match count" });
                }
                 console.log(similarDocs)
                res.status(200).json({ similarDocs });
            });
        });
    });
};



exports.getDocContent = (req, res) => {
    const { docId } = req.params;
    if (!docId) {
        return res.status(400).json({ message: "Document ID is required" });
    }

    db.get("SELECT fileName, content FROM scans WHERE id = ?", [docId], (err, doc) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Error fetching document" });
        }

        if (!doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        console.log(doc.content)
        res.status(200).json({ fileName: doc.fileName, content: doc.content });
    });
};


