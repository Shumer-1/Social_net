import https from 'https';
import fs from 'fs';
import path from 'path';
import express from 'express';
import userRoutes from './routes/routes.js';

const app = express();
const __dirname = path.resolve();


app.use(express.json());
const usersFile = path.join(__dirname, '/data/users.json');


const privateKey = fs.readFileSync(path.join(__dirname, './httpsCert/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './httpsCert/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './pages'));

app.use('/api', userRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    res.render('userList', { title: 'Список пользователей' });
});

app.get("/newUser", (req, res) => {
    res.render('newUser', { title: 'Новый пользователь' });
});

app.get('/editUser/:id', (req, res) => {
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

httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});
