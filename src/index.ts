(() => {
    enum NotificationsPlatform {
        SMS = 'SMS',
        EMAIL = 'EMAIL',
        PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
    };
    
    enum ViewMode {
        TODO = 'TODO',
        REMEINDER = 'REMEINDER',
    }

    const UUID = (): string => {
        return Math.random().toString(32).substr(2, 9);
    };

    const DateUtils = {
        tomorrow(): Date {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        }, 
        today(): Date {
            return new Date();
        },
        foramtDate(date: Date) : string {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
        },
    };

    interface Task{
        id: string;
        dateCreated: Date;
        dateUpdated: Date;
        description: string;
        render(): string;
    }

    class Remeinder implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        date: Date = DateUtils.tomorrow();
        notifications: Array<NotificationsPlatform> = [NotificationsPlatform.EMAIL];

        constructor(description: string, date: Date, notifications: Array<NotificationsPlatform>) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }

        render(): string {
            return `
            ---> Reminder <---
            description: ${this.description}
            date: ${DateUtils.foramtDate(this.date)}
            platform: ${this.notifications.join(',')}
            `;
        }

    }

    class Todo implements Task {
        id: string = UUID();
        dateCreated: Date = DateUtils.today();
        dateUpdated: Date = DateUtils.today();
        description: string = '';

        done: boolean = false;

        constructor(description: string) {
            this.description = description;
        }
        
        render(): string {
            return `
            ---> TODO <---
            description: ${this.description}
            done: ${this.done}
            `;
        }

    }

    const todo = new Todo ('Todo criando com a classe');

    const remeinder = new Remeinder ('Remeinder criado com  classe', new Date(), [NotificationsPlatform.EMAIL]);

    const taskView = {
        getTodo(form: HTMLFormElement): Todo {
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription)
        },
        getReminder(form: HTMLFormElement): Remeinder {
            const remeinderNotifications = [
                form.notifications.value as NotificationsPlatform,
            ];
            const remeinderDate = new Date(form.remeinderDate.value);
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Remeinder(
                reminderDescription,
                remeinderDate,
                remeinderNotifications
            );
        },
        render(tasks: Array<Task>, mode: ViewMode) {
            const tasksList = document.getElementById('tasksList');
            while (tasksList?.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }

            tasks.forEach((task) => {
                const li = document.createElement('LI');
                const textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList?.appendChild(li);
            });

            const todoSet = document.getElementById('todoSet');
            const remeinderSet = document.getElementById('remeinderSet');

            if (mode === ViewMode.TODO) {
                todoSet?.setAttribute('style', 'dispalay: block');
                todoSet?.removeAttribute('disabled');
                remeinderSet?.setAttribute('style', 'dispalay: none');
                remeinderSet?.setAttribute('disabled', 'true');
            } else {
                remeinderSet?.setAttribute('style', 'dispalay: block');
                remeinderSet?.removeAttribute('disabled');
                todoSet?.setAttribute('style', 'dispalay: none');
                todoSet?.setAttribute('disabled', 'true');
            }
        },
    };

    const TaskController = (view: typeof taskView) => {
        const tasks: Array<Task> = [];
        let mode: ViewMode = ViewMode.TODO;


        const handleEvent = (event: Event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case ViewMode.REMEINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };

        const handleToggleMode = () => {
            switch (mode as ViewMode) {
                case ViewMode.TODO:
                    mode = ViewMode.REMEINDER
                    break;
                case ViewMode.REMEINDER:
                    mode = ViewMode.TODO
                    break;
            }
            view.render(tasks, mode)
        }

        document.getElementById('toggleMode')?.addEventListener('click', handleToggleMode);

        document.getElementById('taskForm')?.addEventListener('submit', handleEvent);
    };

    TaskController(taskView); 
}) ();