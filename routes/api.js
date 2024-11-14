import fs from "fs";
import {fileURLToPath} from "url";
import path from "path";
import {Router} from "express";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const usersFile = path.join(__dirname, '../data/users.json');
const newsFile = path.join(__dirname, '../data/news.json');

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

router.get("/users", (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        res.json(JSON.parse(data));
    })
})

router.post("/users/:id/friends/", (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла пользователей');
        }

        const editId = req.params.id;  // Получаем ID из параметров запроса
        const friends = req.body.friends;  // Получаем новый массив друзей из тела запроса
        const users = JSON.parse(data);

        const userIndex = users.findIndex(user => user.id === parseInt(editId)); // Находим индекс пользователя по ID

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Обновляем массив друзей для найденного пользователя
        users[userIndex].friends = friends;

        // Записываем обновленные данные в файл
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи данных');
            }
            res.status(200).json({ message: 'Массив друзей успешно обновлен', user: users[userIndex] });
        });
    });
});



// API для получения данных публикаций
router.get('/news', async (req, res) => {
    try {
        fs.readFile(newsFile, 'utf8', (err, posts) => {
            console.log(newsFile);
            res.json(posts);
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при чтении файла news.json' });
    }
});

// API для добавления новости
router.post('/add-news', async (req, res) => {2
    console.log(req.body.text);
    console.log(req.body.author_id);
    const text = req.body.text;
    const author_id = req.body.author_id;

    const date = Date.now();

    if (!text || !author_id || !date) {
        return res.status(400).json({ error: 'Все поля (new, author_id, date) обязательны для заполнения' });
    }

    // Чтение текущих новостей из файла
    fs.readFile(newsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла новостей:', err);
            return res.status(500).json({ error: 'Ошибка при чтении файла news.json' });
        }
        let news = JSON.parse(data); // Парсим данные из файла
        // Создание новой новости с уникальным id на основе текущего времени
        const newPost = {
            new: text,
            author_id: author_id,
            date: date
        };
        news.push(newPost);

        // Запись обновленного списка новостей обратно в файл
        fs.writeFile(newsFile, JSON.stringify(news, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при записи в файл новостей:', err);
                return res.status(500).json({ error: 'Ошибка при записи в файл news.json' });
            }
            // Отправка подтверждения клиенту
            res.status(201).json({ message: 'Новость успешно добавлена', news: newPost });
        });
    });
});


router.get('/users/:id', async (req, res) => {
    try {
        fs.readFile(newsFile, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при чтении файла users.json' });
            }
            const users = JSON.parse(data); // Парсим JSON строку в массив объектов
            const userId = req.params.id;
            const user = users.find((u) => u.id === userId); // Используем find для поиска пользователя
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: `Пользователь с id ${userId} не найден` });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обработке запроса' });
    }
});


// API для получения данных публикации по id
router.get('/news/:id', async (req, res) => {
    try {
        fs.readFile(newsFile, 'utf8', (err, newsJ) => {
            const news = JSON.parse(newsJ); // Читаем все новости из файла
            const newsId = req.params.id; // Получаем id из параметров URL
            const post = news.find(post => post.id === newsId); // Ищем новость с указанным id
            if (post) {
                res.json(post); // Отправляем найденную новость
            } else {
                res.status(404).json({ error: `Новость с id ${newsId} не найдена` }); // Новость не найдена
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при чтении файла news.json' });
    }
});

router.post('/register', upload.single('photo'), (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Ошибка чтения файла пользователей');
            return;
        }

        const { name, email, password, dob } = req.body;
        const photo = req.file ? req.file.filename : null;
        const users = JSON.parse(data);

        // Проверка, существует ли пользователь с таким именем
        const existingUser = users.find(user => user.name === name);
        if (existingUser) {
            return res.status(409).json({ message: 'Пользователь уже существует' });
        }

        const newUser = {
            id: users.length + 1,
            name: name,
            password: password,
            dob: dob,
            email: email,
            role: "пользователь",
            status: "неподтвержденный",
            photo: photo ? `/images/${photo}` : null, // Путь к изображению
            friends: []
        };

        users.push(newUser);

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                res.status(500).send('Ошибка записи данных');
                return;
            }
            res.status(200).json({ message: 'Регистрация прошла успешно' });
        });
    });
});

router.post('/edit', upload.single('photo'), (req, res) => {
    const userId = parseInt(req.body.id, 10); // ID пользователя из тела запроса

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла пользователей');
        }

        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Получаем обновленные данные
        const name = req.body.name;
        const email = req.body.email;
        const photo = req.file ? `/images/${req.file.filename}` : users[userIndex].photo;

        // Проверка на существующего пользователя с тем же именем
        const existingUser = users.find(user => user.name === name && user.id !== userId);
        if (existingUser) {
            return res.status(409).json({ message: 'Пользователь с таким именем уже существует' });
        }

        // Обновляем данные пользователя
        users[userIndex] = {
            ...users[userIndex],
            name,
            email,
            photo
        };

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Ошибка записи данных');
            }
            res.status(200).json({ message: 'Данные пользователя успешно обновлены', user: users[userIndex] });
        });
    });
});




export default router;