/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/addUser.js":
/*!***********************!*\
  !*** ./js/addUser.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
function saveUser(event) {
  event.preventDefault();
  var formData = new FormData(document.querySelector('form')); // Получить данные формы

  $.ajax({
    url: '/api/addUser',
    method: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function success(response) {
      window.location.href = '/';
    },
    error: function error(err) {
      console.error('Ошибка при сохранении пользователя:', err);
    }
  });
}
$(document).on('submit', 'form', saveUser);

/***/ }),

/***/ "./js/friends.js":
/*!***********************!*\
  !*** ./js/friends.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ "./js/news.js":
/*!********************!*\
  !*** ./js/news.js ***!
  \********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
$(document).ready(function () {
  function loadNews() {
    $.ajax({
      url: '/api/news',
      method: 'GET',
      success: function success(news) {
        var newsList = news.map(function (newsItem) {
          return "\n                    <li>\n                        <strong>".concat(newsItem.title, "</strong>: ").concat(newsItem.content, "\n                    </li>\n                ");
        }).join('');
        $('#news-list').html(newsList);
      }
    });
  }
  loadNews();
});

/***/ }),

/***/ "./js/userList.js":
/*!************************!*\
  !*** ./js/userList.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
function loadUsers() {
  $.ajax({
    url: '/api/users',
    method: 'GET',
    success: function success(data) {
      renderUsers(data);
    },
    error: function error(err) {
      console.error('Ошибка при загрузке пользователей:', err);
    }
  });
}
function renderUsers(users) {
  var userList = $('#user-list');
  userList.empty();
  users.forEach(function (user) {
    var userItem = $("\n            <tr>\n                <td>".concat(user.name, "</td>\n                <td>").concat(user.dob, "</td>\n                <td>").concat(user.email, "</td>\n                <td>").concat(user.role, "</td>\n                <td>").concat(user.status, "</td>\n                <<td>\n                    <img src=").concat(user.photo, " style=\"max-width: 100px; height: auto;\">\n                </td>\n                <td>\n                    <button class=\"edit-user\" data-id=\"").concat(user.id, "\">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>\n                    <button class=\"see-friends-button\" data-id=\"").concat(user.id, "\">\u0414\u0440\u0443\u0437\u044C\u044F</button>\n                    <button class=\"friends-news\" data-id=\"").concat(user.id, "\">\u041D\u043E\u0432\u043E\u0441\u0442\u0438 \u0414\u0440\u0443\u0437\u0435\u0439</button>\n                </td>\n            </tr>\n        "));
    userList.append(userItem);
  });
}
function editUser(userId) {
  window.location.href = "/editUser/".concat(userId);
  console.log("MMMMMMMM");
}
function seeFriends(userId) {
  window.location.href = "/api/friends/".concat(userId);
}
function seeFriendsNews(userId) {
  window.location.href = "/api/friendsNews/".concat(userId);
}
$(document).on('click', '.see-friends-button', function () {
  console.log("MMMMMMMM");
  var userId = $(this).data('id');
  seeFriends(userId);
});
$(document).on('click', '.friends-news', function () {
  var userId = $(this).data('id');
  seeFriendsNews(userId);
});
$(document).on('click', '.edit-user', function () {
  var userId = $(this).data('id');
  editUser(userId);
});
$(document).ready(function () {
  loadUsers();
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _addUser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addUser.js */ "./js/addUser.js");
/* harmony import */ var _friends_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./friends.js */ "./js/friends.js");
/* harmony import */ var _news_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./news.js */ "./js/news.js");
/* harmony import */ var _userList_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./userList.js */ "./js/userList.js");




})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map