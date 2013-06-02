define([
    'underscore',
    'backbone',
    'collections/todo-task-list',
    'text!templates/todo-manager.jst',
    'text!templates/todo-task.jst',
    'text!templates/todo-task-edit.jst'
], function (_, Backbone, TodoTaskList, todo_list_template, todo_task_template, todo_task_edit_template) {
    return Backbone.View.extend({
        el: $('#container'),
        events: {
            'submit .add-task': 'addTask',
            'submit form.edit-task': 'editTask',
            'click .delete-task': 'deleteTask',
            'click a.edit-task': 'showEditForm'
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
        },

        addTask: function (event) {
            event.preventDefault();
            var form = event.target;
            var name_input = form.elements.name;
            this.todoTasks.create({
                'name': name_input.value
            });

            name_input.value = '';
        },

        updateSortable: function () {
            var me = this;
            this.$('.task-list').sortable("destroy");
            this.$('.task-list').sortable().bind('sortupdate', function (e, ui) {
                var taskId = $(ui.item).attr('data-task-id');
                var prevTaskId = $(ui.item).prev().attr('data-task-id');
                var prevTask = me.todoTasks.get(prevTaskId);
                var prevIndex = prevTaskId !== undefined ? _.indexOf(me.todoTasks.models, prevTask) + 1 : 0;
                console.log(prevTask);
                console.log(prevIndex);
                var task = me.todoTasks.get(taskId);
                var currentIndex = prevIndex;
                for (var i = prevIndex; i < me.todoTasks.length; i++) {
                    var nextTask = me.todoTasks.at(currentIndex);
                    if (task.id === nextTask.id) {
                        continue;
                    }
                    currentIndex ++;
                    nextTask.save('priority', currentIndex, {patch: true});
                }
                task.set('priority', prevIndex);
                task.save();
                me.todoTasks.sort();
            });
        }, onTaskAdded: function (model) {
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
        }
    });
});