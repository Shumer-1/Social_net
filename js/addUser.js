function saveUser(event) {
    event.preventDefault();

    const formData = new FormData(document.querySelector('form')); // Получить данные формы

    $.ajax({
        url: '/inner/addUser',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            window.location.href = '/';
        },
        error: function(err) {
            console.error('Ошибка при сохранении пользователя:', err);
        }
    });
}

$(document).on('submit', 'form', saveUser);
