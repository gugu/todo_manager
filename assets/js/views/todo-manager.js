define([
    'underscore',
    'backbone',
    'globals',
    'collections/todo-task-list',
    'text!templates/todo-manager.jst',
    'text!templates/todo-task.jst',
    'text!templates/todo-task-edit.jst'
], function (_, Backbone, globals, TodoTaskList, todo_list_template, todo_task_template, todo_task_edit_template) {
    return Backbone.View.extend({
        events: {
            'submit .add-task': 'addTask',
            'submit form.edit-task': 'editTask',
            'click .delete-task': 'deleteTask',
            'click a.edit-task': 'showEditForm',
            'click .logout': 'logoutUser'
        },

        initialize: function () {
            this.todoTasks = new TodoTaskList();
            this.todoTasks.fetch();

            this.listenTo(this.todoTasks, 'add', this.onTaskAdded);
            this.listenTo(this.todoTasks, 'remove', this.onTaskRemoved);
        },

        render: function () {
            this.$el.html(_.template(todo_list_template, {}));
            this.todoTasks.each(function (task) {
                this.onTaskAdded(task);
            });
            return this;
        },

        addTask: function (event) {
            event.preventDefault();
            var form = event.target;
            var name_input = form.elements.name;
            this.todoTasks.create({
                'name': name_input.value
            }, {wait: true});

            name_input.value = '';
        },

        updateSortable: function () {
            var me = this;
            this.$('.task-list').sortable("destroy");
            this.$('.task-list').sortable().bind('sortupdate', _.bind(this.onOrderChanged, this));
        },

        onOrderChanged: function (event, ui) {
                var taskId = $(ui.item).attr('data-task-id');
                var prevTaskId = $(ui.item).prev().attr('data-task-id');
                var prevTask = prevTaskId !== undefined ? this.todoTasks.get(prevTaskId) : undefined;
                var task = this.todoTasks.get(taskId);
                task.placeAfter(prevTask);

        },

        onTaskAdded: function (model) {
            this.$('.task-list').append(_.template(todo_task_template, {'task': model}));
            this.updateSortable();
        },

        onTaskRemoved: function (model) {
            this.$('.task-list li[data-task-id="' + model.id + '"]').remove()
        },

        showEditForm: function () {
            event.preventDefault();
            var taskId = $(event.target).attr('data-task-id');
            var task = this.todoTasks.get(taskId);
            var taskEditHTML = _.template(todo_task_edit_template, {task: task });
            this.$('.task-list li[data-task-id="' + taskId + '"]').html(taskEditHTML);
            this.delegateEvents();
        },

        editTask: function (event) {
            event.preventDefault();
            var form = event.currentTarget;
            var taskId = $(form).attr('data-task-id');
            var task = this.todoTasks.get(taskId);
            var name = form.elements.name.value;
            task.set('name', name);
            task.save(null, {
                success: _.bind(function () {
                    var taskHTML = _.template(todo_task_template, {task: task });
                    this.$('.task-list li[data-task-id="' + taskId + '"]').html(taskHTML);
                }, this),
                error: function () {
                    alert('Error!!!');
                }
            })
        },

        deleteTask: function (event) {
            event.preventDefault();
            var taskId = $(event.target).attr('data-task-id');
            var task = this.todoTasks.get(taskId);
            task.destroy();
        },

        logoutUser: function (event) {
            event.preventDefault();
            globals.router.navigate('logout', true);
        }
    });
});