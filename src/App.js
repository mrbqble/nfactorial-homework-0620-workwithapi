import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = "https://api.todoist.com/rest/v1/tasks";
const TOKEN = '1b93824555bdb43d69d22ef545bf7d44db39be0c';

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {

  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios({
      method: 'post',
      url: BACKEND_URL,
      data: {
        'content': `${itemToAdd}`,
        'project_id': 2293768502
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': uuidv4(),
        'Authorization': `Bearer ${TOKEN}`,
      } 
    }).then((response) => {
      // setItems([...items, response.data]);
    getActiveItems();
    getCompletedItems();
      setItemToAdd("")
    })
  };


  const toggleItemDone = ({ id }) => {
    axios({
      method: 'post',
      url: `https://api.todoist.com/rest/v1/tasks/${id}/close`,
      headers: {
        Authorization: `Bearer ${TOKEN}` 
      }
    })
  .then((response) => {
    getActiveItems();
    getCompletedItems();
    // setItems([...items.filter(item => item.id !== id)]);
  })
  };

  const toggleItemReopen = ({task_id}) => {
    axios({
      method: 'post',
      url: `https://api.todoist.com/rest/v1/tasks/${task_id}/reopen`,
      headers: {
        Authorization: `Bearer ${TOKEN}` 
      }
    }).then((res)=>{

    getActiveItems();
    getCompletedItems();
    })
  };


  const getCompletedItems = ()=>{
    axios({
      method: 'get',
      url: 'https://api.todoist.com/sync/v8/completed/get_all',
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }).then((response) => setCompletedItems(response.data.items.filter(item => item.project_id === 2293768502)))
  }

  const getActiveItems = ()=>{
    axios({
      method: 'get',
      url: BACKEND_URL,
      data: {
        'project_id': 2293768502
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }).then((response) => setItems(response.data));
  }

  useEffect(() => {
    getCompletedItems();
    getActiveItems();
   
  }, [])

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => toggleItemDone(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>

      <ul className="list-group todo-list">
        {completedItems.length > 0 ? (
          completedItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item done`}>
                <span
                  className="todo-list-item-label"
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => toggleItemReopen(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No completed tasks🤤</div>
        )}
      </ul>
    </div>
  );
}

export default App;
