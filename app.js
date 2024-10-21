// Подключение модулей
import https from 'https'; // Импортируем модуль для работы с HTTPS
import fs from 'fs'; // Импортируем модуль для работы с файловой системой
import path from 'path'; // Импортируем модуль для работы с путями
import express from 'express'; // Импортируем express для создания сервера
import userRoutes from './routes/routes.js'; // Импортируем маршруты пользователей

const app = express();
const __dirname = path.resolve(); // Определяем текущую директорию

app.use(express.json()); // Позволяем обрабатывать JSON-тела запросов
const usersFile = path.join(__dirname, '/data/users.json'); // Путь к файлу пользователей

// Путь к SSL-сертификатам
const privateKey = fs.readFileSync(path.join(__dirname, './httpsCert/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './httpsCert/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate }; // Создаем объект с ключами и сертификатом

// Настройка Pug как шаблонизатора
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './pages')); // Указываем директорию с шаблонами

// Подключение маршрутов
app.use('/api', userRoutes); // Используем маршруты пользователей по префиксу /api

// Обработка статических файлов
app.use(express.static(path.join(__dirname, 'public'))); // Статические файлы из папки public
app.use('/dist', express.static(path.join(__dirname, 'dist'))); // Статические файлы из папки dist

// Маршрут для отображения страницы пользователей
app.get('/', (req, res) => {
    res.render('userList', { title: 'Список пользователей' }); // Рендерим страницу со списком пользователей
});

// Маршрут для создания нового пользователя
app.get("/newUser", (req, res) => {
    res.render('newUser', { title: 'Новый пользователь' }); // Рендерим страницу создания нового пользователя
});

// Маршрут для редактирования пользователя
app.get('/editUser/:id', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file'); // Обработка ошибки чтения файла

        const users = JSON.parse(data); // Парсим данные из файла
        const user = users.find(u => u.id === parseInt(req.params.id)); // Находим пользователя по id

        if (!user) return res.status(404).send('User not found'); // Если не найден - отправляем 404

        res.render('editUser', { title: 'Редактировать пользователя', user }); // Рендерим страницу редактирования
    });
});

// Маршрут для отображения друзей
app.get('/friends', (req, res) => {
    res.render('friends', { title: 'Список друзей' }); // Рендерим страницу со списком друзей
});

// Маршрут для отображения новостей
app.get('/news', (req, res) => {
    res.render('news', { title: 'Новости' }); // Рендерим страницу новостей
});

// Обработка ошибок 404
app.use((req, res, next) => {
    res.status(404).send('Page not found'); // Отправляем 404 для несуществующих страниц
});

// Создание HTTPS-сервера
const httpsServer = https.createServer(credentials, app); // Создаем HTTPS-сервер с заданными сертификатами

// Запуск HTTPS-сервера
httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000'); // Выводим сообщение о запуске сервера
});
