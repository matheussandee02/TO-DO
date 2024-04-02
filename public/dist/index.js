"use strict";
(function () {
    var NotificationsPlatform;
    (function (NotificationsPlatform) {
        NotificationsPlatform["SMS"] = "SMS";
        NotificationsPlatform["EMAIL"] = "EMAIL";
        NotificationsPlatform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificationsPlatform || (NotificationsPlatform = {}));
    ;
    var ViewMode;
    (function (ViewMode) {
        ViewMode["TODO"] = "TODO";
        ViewMode["REMEINDER"] = "REMEINDER";
    })(ViewMode || (ViewMode = {}));
    var UUID = function () {
        return Math.random().toString(32).substr(2, 9);
    };
    var DateUtils = {
        tomorrow: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        today: function () {
            return new Date();
        },
        foramtDate: function (date) {
            return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
        },
    };
    var Remeinder = /** @class */ (function () {
        function Remeinder(description, date, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.date = DateUtils.tomorrow();
            this.notifications = [NotificationsPlatform.EMAIL];
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }
        Remeinder.prototype.render = function () {
            return "\n            ---> Reminder <---\n            description: ".concat(this.description, "\n            date: ").concat(DateUtils.foramtDate(this.date), "\n            platform: ").concat(this.notifications.join(','), "\n            ");
        };
        return Remeinder;
    }());
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = '';
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            return "\n            ---> TODO <---\n            description: ".concat(this.description, "\n            done: ").concat(this.done, "\n            ");
        };
        return Todo;
    }());
    var todo = new Todo('Todo criando com a classe');
    var remeinder = new Remeinder('Remeinder criado com  classe', new Date(), [NotificationsPlatform.EMAIL]);
    var taskView = {
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            var remeinderNotifications = [
                form.notifications.value,
            ];
            var remeinderDate = new Date(form.remeinderDate.value);
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Remeinder(reminderDescription, remeinderDate, remeinderNotifications);
        },
        render: function (tasks, mode) {
            var tasksList = document.getElementById('tasksList');
            while (tasksList === null || tasksList === void 0 ? void 0 : tasksList.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }
            tasks.forEach(function (task) {
                var li = document.createElement('LI');
                var textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList === null || tasksList === void 0 ? void 0 : tasksList.appendChild(li);
            });
            var todoSet = document.getElementById('todoSet');
            var remeinderSet = document.getElementById('remeinderSet');
            if (mode === ViewMode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'dispalay: block');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute('disabled');
                remeinderSet === null || remeinderSet === void 0 ? void 0 : remeinderSet.setAttribute('style', 'dispalay: none');
                remeinderSet === null || remeinderSet === void 0 ? void 0 : remeinderSet.setAttribute('disabled', 'true');
            }
            else {
                remeinderSet === null || remeinderSet === void 0 ? void 0 : remeinderSet.setAttribute('style', 'dispalay: block');
                remeinderSet === null || remeinderSet === void 0 ? void 0 : remeinderSet.removeAttribute('disabled');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('style', 'dispalay: none');
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute('disabled', 'true');
            }
        },
    };
    var TaskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = ViewMode.TODO;
        var handleEvent = function (event) {
            event.preventDefault();
            var form = event.target;
            switch (mode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMEINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        var handleToggleMode = function () {
            switch (mode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMEINDER;
                    break;
                case ViewMode.REMEINDER:
                    mode = ViewMode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document.getElementById('toggleMode')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleToggleMode);
        (_b = document.getElementById('taskForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', handleEvent);
    };
    TaskController(taskView);
})();
