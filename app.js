import https from 'https';
import fs from 'fs';
import path from 'path';
import express from 'express';
import userRoutes from './routes/routes.js';
import cors from 'cors';
import apiRoutes from './routes/api.js';
import { Server } from 'socket.io';

const app = express();
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.use(express.json());
const usersFile = path.join(__dirname, '/data/users.json');
const newsFile = path.join(__dirname, '/data/news.json');

app.use(cors({
    origin: 'http://localhost:4200', // URL вашего Angular приложения
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Разрешенные методы
    allowedHeaders: 'Content-Type,Authorization,Access-Control-Allow-Origin,Access-Control-Allow-Headers,Access-Control-Allow-Methods', // Разрешенные заголовки
    credentials: true // Если нужны куки
}));

const privateKey = fs.readFileSync(path.join(__dirname, './httpsCert/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './httpsCert/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './pages'));

app.use('/inner', userRoutes);
app.use('/api', apiRoutes);


app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
    res.render('userList', { title: 'Список пользователей' });
});

app.get("/newUser", (req, res) => {
    res.render('newUser', { title: 'Новый пользователь' });
});

app.get('/inner/editUser/:id', (req, res) => {
    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');

        const users = JSON.parse(data);
        const user = users.find(u => u.id === parseInt(req.params.id));

        if (!user) return res.status(404).send('User not found');

        res.render('editUser', { title: 'Редактировать пользователя', user });
    });
});

app.get('/friends', (req, res) => {
    res.render('friends', { title: 'Список друзей' });
});


app.get('/news', (req, res) => {
    res.render('news', { title: 'Новости' });
});

app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

const httpsServer = https.createServer(credentials, app);

const io = new Server(httpsServer, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    fs.readFile(newsFile, 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        socket.emit('initialNews', JSON.parse(data));
    });

    socket.on('newNews', (newNews) => {
        fs.readFile(newsFile, 'utf8', (err, data) => {
            if (err) {
                return console.log(err);
            }
            const news = JSON.parse(data);
            //news.push(newNews);  // Добавляем новую новость
            fs.writeFile(newsFile, JSON.stringify(news, null, 2), (err) => {
                if (err) {
                    return console.log(err);
                }
                io.emit('updateNews', news);  // Отправляем всем клиентам обновленные новости
            });
        });
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});


function closeServer() {
    httpsServer.close();
    io.close();
}


export { app, closeServer};