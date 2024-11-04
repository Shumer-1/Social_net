// Подключение необходимых модулей
import express, { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonDirectory = path.join(__dirname, '../data');
const app = Router();
const usersFile = path.join(jsonDirectory, 'users.json');
const newsFile = path.join(jsonDirectory, 'news.json');




export default app;
