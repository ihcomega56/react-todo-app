import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './App.css';

const initialTodos = JSON.parse(localStorage.getItem('todos')) || [
  { id: 1, text: 'Learn React', status: '未着手', tags: ['frontend', 'learning'] },
  { id: 2, text: 'Build a ToDo App', status: '実施中', tags: ['project', 'frontend'] },
  { id: 3, text: 'Present the App', status: '完了', tags: ['presentation'] }
];

const statuses = ['未着手', '実施中', '完了'];
const availableTags = ['frontend', 'backend', 'learning', 'project', 'presentation', 'urgent'];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [archivedTodos, setArchivedTodos] = useState(JSON.parse(localStorage.getItem('archivedTodos')) || []);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('archivedTodos', JSON.stringify(archivedTodos));
  }, [archivedTodos]);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('id', id);
  };

  const onDrop = (e, status) => {
    const id = e.dataTransfer.getData('id');
    const updatedTodos = todos.map(todo => {
      if (todo.id === parseInt(id)) {
        todo.status = status;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const newId = todos.length ? todos[todos.length - 1].id + 1 : 1;
    const newTodoItem = { 
      id: newId, 
      text: newTodo, 
      status: '未着手',
      tags: selectedTags 
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
    setSelectedTags([]);
  };

  const archiveTodo = id => {
    const todoToArchive = todos.find(todo => todo.id === id);
    setArchivedTodos([...archivedTodos, todoToArchive]);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTag = (tag) => {
    // _.contains()を使用してタグが既に選択されているか確認
    if (_.contains(selectedTags, tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filterTodos = (todos) => {
    if (!filterTag) return todos;
    // _.contains()を使用してフィルタリング
    return todos.filter(todo => todo.tags && _.contains(todo.tags, filterTag));
  };

  const renderTodos = status => {
    return filterTodos(todos)
      .filter(todo => todo.status === status)
      .map(todo => (
        <div
          key={todo.id}
          draggable
          onDragStart={e => onDragStart(e, todo.id)}
          className="todo"
        >
          <div>{todo.text}</div>
          <div className="todo-tags">
            {todo.tags && todo.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          {status === '完了' && (
            <button onClick={() => archiveTodo(todo.id)}>Archive</button>
          )}
        </div>
      ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToDo App</h1>
      </header>
      
      <div className="filter-section">
        <label>Filter by tag: </label>
        <select 
          value={filterTag} 
          onChange={e => setFilterTag(e.target.value)}
        >
          <option value="">All tags</option>
          {availableTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <div className="tag-selector">
          {availableTags.map(tag => (
            <span 
              key={tag} 
              className={`tag-option ${_.contains(selectedTags, tag) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <button onClick={addTodo}>Add</button>
      </div>
      
      <div className="container">
        {statuses.map(status => (
          <div
            key={status}
            className="lane"
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e, status)}
          >
            <h2>{status}</h2>
            {renderTodos(status)}
          </div>
        ))}
      </div>
      
      <div className="archived-todos">
        <h2>Archived Todos</h2>
        {archivedTodos.map(todo => (
          <div key={todo.id} className="todo">
            <div>{todo.text}</div>
            {todo.tags && (
              <div className="todo-tags">
                {todo.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
