import React, { useState, useEffect } from 'react';
import './App.css';
// 脆弱性: シークレットを含むファイルをインポート
import config, { authenticateWithAWS, makeStripePayment } from './config';

const initialTodos = JSON.parse(localStorage.getItem('todos')) || [
  { id: 1, text: 'Learn React', status: '未着手' },
  { id: 2, text: 'Build a ToDo App', status: '実施中' },
  { id: 3, text: 'Present the App', status: '完了' }
];

const statuses = ['未着手', '実施中', '完了'];

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [archivedTodos, setArchivedTodos] = useState(JSON.parse(localStorage.getItem('archivedTodos')) || []);
  // 脆弱性: インラインスクリプトエクスポジャー
  const [customScript, setCustomScript] = useState('');
  // 脆弱性: シークレット情報をコンポーネントの状態として保存
  const [apiKeys, setApiKeys] = useState({
    github: config.github_token,
    google: config.google_api_key
  });

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
    const newTodoItem = { id: newId, text: newTodo, status: '未着手' };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const archiveTodo = id => {
    const todoToArchive = todos.find(todo => todo.id === id);
    setArchivedTodos([...archivedTodos, todoToArchive]);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 脆弱性: クレジットカード処理のためのシークレット使用
  const processDonation = (amount) => {
    console.log(`Donation processing with Stripe: ${config.stripe_api_key}`);
    makeStripePayment(amount);
    return true;
  };

  // 脆弱性: AWS認証情報を使用したデータ同期機能
  const syncWithCloud = () => {
    const awsCredentials = authenticateWithAWS();
    console.log('Syncing with AWS using:', awsCredentials.accessKeyId);
    
    // シークレットをログに出力（悪い例）
    console.log('Using Google API key:', config.google_api_key);
    
    return true;
  };

  const renderTodos = status => {
    return todos
      .filter(todo => todo.status === status)
      .map(todo => (
        <div
          key={todo.id}
          draggable
          onDragStart={e => onDragStart(e, todo.id)}
          className="todo"
        >
          {todo.text}
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
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
        {/* 脆弱性: カスタムスクリプト入力フォーム */}
        <div className="custom-script">
          <textarea
            placeholder="Enter custom script (for advanced users)"
            value={customScript}
            onChange={e => setCustomScript(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => syncWithCloud()}>
            クラウド同期 (AWS)
          </button>
          <button onClick={() => processDonation(1000)}>
            寄付する (1000円)
          </button>
        </div>
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
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
