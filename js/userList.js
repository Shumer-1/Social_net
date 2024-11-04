function loadUsers() {
    $.ajax({
        url: '/api/users',
        method: 'GET',
        success: function(data) {
            renderUsers(data);
        },
        error: function(err) {
            console.error('Ошибка при загрузке пользователей:', err);
        }
    });
}

function renderUsers(users) {
    const userList = $('#user-list');
    userList.empty();

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
}


function seeFriends(userId) {
    window.location.href = `/api/friends/${userId}`;
}

function seeFriendsNews(userId) {
    window.location.href = `/api/friendsNews/${userId}`;
}


$(document).on('click', '.see-friends-button', function() {
    const userId = $(this).data('id');
    seeFriends(userId);
});

$(document).on('click', '.friends-news', function() {
    const userId = $(this).data('id');
    seeFriendsNews(userId);
});


$(document).on('click', '.edit-user', function() {
    const userId = $(this).data('id');
    editUser(userId);
});

$(document).ready(function() {
    loadUsers();
});
