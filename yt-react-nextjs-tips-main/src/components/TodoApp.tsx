"use client";

import { useState, useEffect } from 'react';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;
        const newTodo: Todo = {
            id: Date.now(),
            text: input,
            completed: false
        };
        setTodos([...todos, newTodo]);
        setInput('');
    };

    const toggleComplete = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };
    
    const clearAll = () => {
        setTodos([]);
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'pending') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="container">
            <h1>Todo App</h1>
            <form id="todo-form" onSubmit={addTodo}>
                <input
                    type="text"
                    id="todo-input"
                    placeholder="Add a new task..."
                    autoComplete="off"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>
            <ul id="todo-list">
                {filteredTodos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <span>{todo.text}</span>
                        <div className="actions">
                            <button className="complete-btn" onClick={() => toggleComplete(todo.id)}>
                                {todo.completed ? 'Undo' : 'Complete'}
                            </button>
                            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="filters">
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
                <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pending</button>
                <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
            </div>
            <div className="actions">
                <button id="clear-completed" onClick={clearCompleted}>Clear Completed</button>
                <button id="clear-all" onClick={clearAll}>Clear All</button>
            </div>
        </div>
    );
}
