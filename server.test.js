// Импортируем зависимости
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import path from 'path';
import request from 'supertest';
import {app, closeServer} from './app.js'; // Подключаем приложение
import {readFile, writeFile} from 'fs/promises';
import fs from "fs";

// Получаем путь к текущему файлу через import.meta.url
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Теперь используем __dirname для вычисления пути к файлу
let users = [];
const usersFilePath = path.resolve(__dirname, './data/users.json');
const newsFilePath = path.resolve(__dirname, './data/news.json');

let originalUsersData;
let originalNewsData;

beforeAll(async () => {
    try {
        originalUsersData = fs.readFileSync(usersFilePath, 'utf8');
        originalNewsData = fs.readFileSync(newsFilePath, 'utf8');
    } catch (error) {
        console.error('Ошибка при подготовке тестов:', error);
        throw error;
    }
});

let news= [];

fs.readFile(usersFilePath, 'utf8', (err, data) => {
    users = JSON.parse(data);
});

fs.readFile(newsFilePath, 'utf8', (err, data) => {
    news = JSON.parse(data);
});




afterAll(() => {
    try {
        fs.writeFileSync(usersFilePath, originalUsersData, 'utf8');
        fs.writeFileSync(newsFilePath, originalNewsData, 'utf8');
    } catch (error) {
        console.error('Ошибка при восстановлении JSON-файлов:', error);
    } finally {
        closeServer();
    }

});

describe('GET api/news', ()  => {
    it('Проверка получения новостей', async () => {
        let res = await request(app).get('/api/news');
        res = JSON.parse(res.body);

        let flag = false;
        for (let i = 0; i < news.length; i++) {
            if (res[i].author_id !== news[i].author_id) {
                flag = true;
                break
            }
        }
        expect(flag).toEqual(false);
    });
})

describe('GET inner/users', () => {
    it('Проверка получения пользователя', async () => {
        let res = await request(app).get('/inner/users');
        let flag = false;
        for (let i = 0; i < users.length; i++) {
            if (res.body[i].id !== users[i].id) {
                flag = true;
                break
            }
        }
        expect(flag).toEqual(false);
    });
});

describe('GET inner/users', () => {
    it('Должен вернуть список пользователей в формате JSON', async () => {
        // Делаем запрос к маршруту /users
        const res = await request(app).get('/inner/users');
        // Проверяем статус ответа
        expect(res.status).toBe(200);

        // Проверяем, что тип содержимого — JSON
        expect(res.headers['content-type']).toMatch(/json/);

        // Проверяем, что тело ответа — массив пользователей
        expect(Array.isArray(res.body)).toBe(true);
    });

});


describe('GET /friends/:id', () => {
    it('Должен вернуть HTML с данными о друзьях пользователя, если пользователь найден', async () => {
        // Предварительно добавляем тестового пользователя с друзьями в users.json
        const testUsers = [
            { id: 100, name: "User 1", friends: [200] },
            { id: 200, name: "User 2", friends: [] },
        ];
        await writeFile(usersFilePath, JSON.stringify(testUsers, null, 2));

        // Изменили запрос на /friends/100 (id существующего пользователя)
        const res = await request(app).get('/inner/friends/100');

        // Ожидаем успешный ответ (статус 200)
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/html/);
        expect(res.text).toContain('Список друзей');
        expect(res.text).toContain('User 2'); // Проверяем, что друг отображается в HTML
    });

    it('Должен вернуть 404, если пользователь не найден', async () => {
        const res = await request(app).get('/inner/friends/9999'); // ID, которого нет в users.json
        expect(res.status).toBe(404);
        expect(res.text).toContain('User not found');
    });
    it('Должен вернуть HTML с пустым списком, если у пользователя нет друзей', async () => {
        const testUsers = [
            { id: 100, name: "User 1", friends: [] },
            { id: 200, name: "User 2", friends: [] },
        ];
        await writeFile(usersFilePath, JSON.stringify(testUsers, null, 2));

        const res = await request(app).get('/inner/friends/100');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/html/);
        expect(res.text).toContain('Список друзей');
    });
});
