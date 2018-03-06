var socketController = (function() {
    var socket = io();
    var todoListID = parseInt(document.querySelector('id').innerHTML);

    return {
        addTodo: function(title) {
            socket.emit('add', { id: todoListID, title: title });
        },
        deleteTodo: function(title) {
            socket.emit('delete', { id: todoListID, title: title });
        },
        completeTodo: function(title, isComplete) {
            socket.emit('complete', { id: todoListID, title: title, isComplete: isComplete });
        }
    };

})();

var UIController = (function() {

    var DOMstrings = {
        titleInput: '.title-input',
        agreeButton: '.agree-button'
    };

    return {
        addTodoItem: function(newTodoTitleElement) {
            var html = '<tr><td class="todo"><span class="delete"><i class="material-icons delete-icon">delete</i></span><span class="todo-title">' + newTodoTitleElement.value + '</span></td></tr>';
            document.querySelector('tbody').insertAdjacentHTML('beforeend', html);

            newTodoTitleElement.value = '';
        },
        toggleCompletion: function(element) {
            element.toggle('complete');
        },
        getNewTodoTitleElement: function() {
            return document.querySelector(DOMstrings.titleInput);
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

var controller = (function(socketCtrl, UICtrl) {
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.agreeButton).addEventListener('click', addTodoClick);
        document.querySelector(DOM.titleInput).addEventListener('keypress', function(event) {
            if (!(event.keyCode === 13 || event.which === 13))
                return;

            addTodoClick();
            $('#modal1').modal('close');
        });

        document.querySelectorAll('tr').forEach(function(element) {
            
            element.addEventListener('click', function(event) {
                var todoClasslist = event.target.classList;
                var title = element.querySelector('.todo-title').innerText;

                removeTodoClick(todoClasslist, title, element);
                toggleCompletion(todoClasslist, title);
            });
            
        });
    };

    var addTodoClick = function() {
        var newTodoTitle = UICtrl.getNewTodoTitleElement();
        socketCtrl.addTodo(newTodoTitle.value);
        UICtrl.addTodoItem(newTodoTitle);

        setupEventListeners();
    };

    var removeTodoClick = function(todoClasslist, title, element) {
        if (!(todoClasslist.contains('delete') || todoClasslist.contains('delete-icon')))
            return;

        element.remove();
        socketCtrl.deleteTodo(title);
    };

    var toggleCompletion = function(todoClasslist, title) {
        if (!(todoClasslist.contains('todo-title') || todoClasslist.contains('complete') || todoClasslist.contains('todo')))
            return;

        todoClasslist.toggle('complete');
        socketCtrl.completeTodo(title, todoClasslist.contains('complete'));
    };

    return {
        init: function() {
            setupEventListeners();

            $(document).ready(function() {
                $('.modal').modal();
            });
        }
    };
})(socketController, UIController);

controller.init();
