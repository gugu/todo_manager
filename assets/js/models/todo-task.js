define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    var Task = Backbone.Model.extend({
        /**
         * Changes task's order — sets it after prevTask or, if prevTask is undefined, sets it as first element
         *
         * @param {Task} prevTask
         */
        placeAfter: function (prevTask) {
            var prevIndex = prevTask !== undefined ? _.indexOf(this.collection.models, prevTask) + 1 : 0;
            var currentIndex = prevIndex;
            for (var i = prevIndex; i < this.collection.length; i++) {
                var nextTask = this.collection.at(currentIndex);
                if (this.id === nextTask.id) {
                    continue;
                }
                currentIndex ++;
                if (nextTask.get('priority') !== currentIndex) {
                    nextTask.save('priority', currentIndex, {patch: true});
                }
            }
            if (this.get('priority') !== prevIndex) {
                this.set('priority', prevIndex);
                this.save();
            }
            this.collection.sort();
        }
    });
    return Task;
});