import request from 'axios';

const API_URL = 'http://localhost:8000/todos';

export function getTodos() {
  return {
    type: 'GET_TODOS',
    promise: new Promise(resolve => {
      resolve({
        data: Date.now().toString().split('')
      });
    })
  }
}

export function createTodo(text) {
  return {
    type: 'CREATE_TODO',
    promise: request.post(API_URL, { time: Date.now(), text })
  };
}

export function editTodo(id, text) {
  return {
    type: 'EDIT_TODO',
    id,
    text,
    date: Date.now()
  };
}

export function deleteTodo(id) {
  return {
    type: 'DELETE_TODO',
    id
  };
}
