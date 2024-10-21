import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const usersFile = path.join(__dirname, '../data/users.json');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/users', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        res.json(JSON.parse(data));
    });
});
router.post('/addUser', upload.single('photo'), (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data);

        const newUser = {
            id: users.length + 1,
            name: req.body.name,
            dob: req.body.dob,
            email: req.body.email,
            role: req.body.role,
            status: req.body.status,
            photo: `/images/${req.file.filename}`,
            friends: []
        };

        users.push(newUser);

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/');
        });
    });
});

router.post('/editUser/:id', upload.single('photo'), (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data);
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return res.status(404).send('User not found');

        const updatedUser = {
            id: userId,
            name: users[userIndex].name,
            dob: users[userIndex].dob,
            email: users[userIndex].email,
            role: req.body.role,
            status: req.body.status,
            photo: users[userIndex].photo,
            friends: users[userIndex].friends,
        };

        users[userIndex] = updatedUser;

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/');
        });
    });
});

router.get('/friends/:id', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data);
        const user = users.find(u => u.id === parseInt(req.params.id));

        if (!user) return res.status(404).send('User not found');

        // Предполагаем, что поле friends хранит массив id друзей
        const friends = users.filter(u => user.friends && user.friends.includes(u.id));

        res.render('friends', { title: 'Список друзей', friends });
    });
});

router.get('/friendsNews/:id', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data);
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) return res.status(404).send('User not found');

        fs.readFile(path.join(__dirname, '../data/news.json'), 'utf8', (err, newsData) => {
            if (err) return res.status(500).send('Error reading news file');

            const allNews = JSON.parse(newsData);
            const userNews = allNews.filter(n => n.author_id === userId);
            const friendsNews = allNews.filter(n => user.friends && user.friends.includes(n.author_id));
            const combinedNews = [...userNews, ...friendsNews];
            combinedNews.sort((a, b) => new Date(b.date) - new Date(a.date));

            res.render('friendsNews', { title: 'Новости друзей', user, news: combinedNews, users });
        });
    });
});




export default router;

