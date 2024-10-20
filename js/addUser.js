function saveUser(event) {
    event.preventDefault(); // Предотвратить обычное поведение формы

    const formData = new FormData(document.querySelector('form')); // Получить данные формы

    $.ajax({
        url: '/api/addUser', // Путь к вашему API для добавления пользователя
        method: 'POST',
        data: formData,
        contentType: false, // Не устанавливать заголовок contentType
        processData: false, // Не обрабатывать данные
        success: function(response) {
            // Успешный ответ
            window.location.href = '/'; // Перенаправление на главную страницу после успешного добавления
        },
        error: function(err) {
            console.error('Ошибка при сохранении пользователя:', err);
        }
    });
}

// Привязка события к кнопке отправки формы
$(document).on('submit', 'form', saveUser);
