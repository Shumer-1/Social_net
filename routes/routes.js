import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";

// Получение пути к текущему модулю
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const usersFile = path.join(__dirname, '../data/users.json');


// Настройка пути сохранения файлов и имени файла
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images')); // Папка для сохранения изображений
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Уникальное имя для каждого изображения
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

        // Создание нового пользователя
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

        // Добавление нового пользователя в список
        users.push(newUser);

        // Сохранение обновленного списка пользователей
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/'); // Перенаправление после успешного добавления
        });
    });
});

// Маршрут для обновления данных пользователя
router.post('/editUser/:id', upload.single('photo'), (req, res) => {
    // Чтение файла с пользователями
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data);
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return res.status(404).send('User not found');

        // Обновление данных пользователя
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

        // Обновляем пользователя в списке
        users[userIndex] = updatedUser;

        // Сохранение обновленного списка пользователей
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.redirect('/'); // Перенаправление после успешного обновления
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

// В routes.js

// routes.js

router.get('/friendsNews/:id', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data); // Считываем пользователей
        const userId = parseInt(req.params.id);
        const user = users.find(u => u.id === userId);

        if (!user) return res.status(404).send('User not found');

        // Загрузка новостей
        fs.readFile(path.join(__dirname, '../data/news.json'), 'utf8', (err, newsData) => {
            if (err) return res.status(500).send('Error reading news file');

            const allNews = JSON.parse(newsData);
            const userNews = allNews.filter(n => n.author_id === userId);
            const friendsNews = allNews.filter(n => user.friends && user.friends.includes(n.author_id));

            // Объединяем новости пользователя и его друзей
            const combinedNews = [...userNews, ...friendsNews];

            // Сортируем новости по дате
            combinedNews.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Передаем список пользователей в шаблон
            res.render('friendsNews', { title: 'Новости друзей', user, news: combinedNews, users });
        });
    });
});




export default router;

