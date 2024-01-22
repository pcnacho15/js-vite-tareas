import todoStore, { Filters } from "../store/todo-store";
import html from "./app.html?raw";
import { renderTodos, renderPending } from "./use-cases";



const ElementIds = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilterLis: '.filtro',
    CountPending: '#pending-count',
}


/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIds.TodoList, todos );
        updatePendingCount()
    }

    const updatePendingCount = () => {
        renderPending(ElementIds.CountPending);
    }

    //Cuando la función App() se llama
    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayTodos();
    })();


    // Referencias HTML
    const clearCompleted = document.querySelector(ElementIds.ClearCompleted);
    const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
    const todoListUL = document.querySelector(ElementIds.TodoList);
    const todoFiltersLis = document.querySelectorAll(ElementIds.TodoFilterLis);

    // Listeners
    clearCompleted.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos()
    })


    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if (event.keyCode !== 13) return;

        if (event.target.value.trim().length == 0) return;

        todoStore.addTodo( event.target.value );

        displayTodos();

        event.target.value = '';

    });


    todoListUL.addEventListener('click', (event) => {
        
        const element = event.target.closest('[data-id]');

        todoStore.togleTodo( element.getAttribute('data-id'));
        displayTodos();
    });

    todoListUL.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');

        if (!element || !isDestroyElement) return;

        todoStore.deleteTodo(element.getAttribute('data-id'))
        displayTodos();
        
    });

    todoFiltersLis.forEach(element => {
        element.addEventListener('click', (element) => {
            todoFiltersLis.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter( Filters.All );
                    break;
                
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending );
                    break;
                
                case 'Completados':
                    todoStore.setFilter( Filters.Completed );
                    break
                default:
                    throw new Error('Not found selected filter');
            }
            displayTodos();
        });
    });

}