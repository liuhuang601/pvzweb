const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const mysql = require('mysql');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '5201314mjl',
    database: 'message',
    port: '3306'
});

app.use(express.json()); // 解析application/json  

// 留言列表  
app.get('/messages', (req, res) => {
    db.query('SELECT * FROM message', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// 添加留言  
app.post('/messages', (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).send('用户名或留言不能为空！');
    }

    const query = 'INSERT INTO message (username, message) VALUES (?, ?)';
    db.query(query, [username, message], (error, results) => {
        if (error) throw error;
        res.send('留言添加成功！');
    });
});

// 根据用户名查询留言
app.get('/messages/user/:username', (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).send('用户名不能为空！');
    }

    const query = 'SELECT * FROM message WHERE username = ?';
    db.query(query, [username], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// 删除留言  
app.delete('/messages/:id', (req, res) => {
    const messageId = req.params.id; // 从URL中获取留言ID  

    if (!messageId) {
        return res.status(400).send('留言ID不能为空！');
    }

    const query = 'DELETE FROM message WHERE id = ?'; // 构建DELETE SQL语句  
    db.query(query, [messageId], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            // 如果没有影响任何行（即没有找到对应的留言），则返回404  
            return res.status(404).send('未找到对应的留言！');
        }
        res.send('留言删除成功！');
    });
});

// 修改留言
app.put('/messages/:id', (req, res) => {
    const messageId = req.params.id;
    const { message } = req.body;

    if (!messageId) {
        return res.status(400).send('留言ID不能为空！');
    }

    const query = 'UPDATE message SET message = ? WHERE id = ?';
    db.query(query, [message, messageId], (error, results) => {
        if (error) throw error;
        if (results.affectedRows === 0) {
            return res.status(404).send('未找到对应的留言！');
        }
        res.send('留言修改成功！');
    });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
