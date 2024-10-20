// Функция для загрузки пользователей из JSON-файла
function loadUsers() {
    $.ajax({
        url: '/api/users', // Путь к вашему API для получения списка пользователей
        method: 'GET',
        success: function(data) {
            renderUsers(data);
        },
        error: function(err) {
            console.error('Ошибка при загрузке пользователей:', err);
        }
    });
}

// Функция для рендеринга списка пользователей
function renderUsers(users) {
    const userList = $('#user-list'); // Элемент, куда будем вставлять пользователей
    userList.empty(); // Очищаем список перед добавлением новых пользователей

    users.forEach(user => {
        const userItem = $(`
            <tr>
                <td>${user.name}</td>
                <td>${user.dob}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <<td>
                    <img src=${user.photo} style="max-width: 100px; height: auto;">
                </td>
                <td>
                    <button class="edit-user" data-id="${user.id}">Редактировать</button>
                    <button class="see-friends-button" data-id="${user.id}">Друзья</button>
                    <button class="friends-news" data-id="${user.id}">Новости Друзей</button>
                </td>
            </tr>
        `);
        userList.append(userItem);
    });
}


function editUser(userId) {
    window.location.href = `/editUser/${userId}`;
    console.log("MMMMMMMM");
}


function seeFriends(userId) {
    window.location.href = `/api/friends/${userId}`; // Изменение здесь
}

function seeFriendsNews(userId) {
    window.location.href = `/api/friendsNews/${userId}`; // Изменение здесь
}


// Обработчик событий для кнопок друзей
$(document).on('click', '.see-friends-button', function() {
    console.log("MMMMMMMM");
    const userId = $(this).data('id');
    seeFriends(userId);
});

// Обработчик событий для кнопок друзей
$(document).on('click', '.friends-news', function() {
    const userId = $(this).data('id');
    seeFriendsNews(userId);
});


// Обработчик событий для кнопок редактирования
$(document).on('click', '.edit-user', function() {
    const userId = $(this).data('id');
    editUser(userId);
});

// Инициализация приложения при загрузке страницы
$(document).ready(function() {
    loadUsers(); // Загружаем пользователей при загрузке страницы
});
