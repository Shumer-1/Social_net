$(document).ready(function() {
    function loadNews() {
        $.ajax({
            url: '/inner/news',
            method: 'GET',
            success: function(news) {
                const newsList = news.map(newsItem => `
                    <li>
                        <strong>${newsItem.title}</strong>: ${newsItem.content}
                    </li>
                `).join('');
                $('#news-list').html(newsList);
            }
        });
    }

    loadNews();
});
