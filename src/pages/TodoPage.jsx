import { createTodo, deleteTodo, getTodos, patchTodo } from 'api/todos';
import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate()
  const amount = todos.length
  const { isAuthenticated, currentMember } = useAuth()

  const handleChange = (value) => {
    setInputValue(value)
  }

  const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }

    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            title: data.title,
            isDone: data.isDone,
            id: data.id,
            isEdit: false
          },
        ];
      });

      setInputValue('');
    } catch (error) {
      console.error('[Create Todos Failed]:', error)
    }
  };

  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return;
    }

    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });

      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            title: data.title,
            isDone: data.isDone,
            id: data.id,
            isEdit: false,
          },
        ];
      });

      setInputValue('');
    } catch (error) {
      console.error('[Create Todos Failed]:', error);
    }
  };

  const handleToggleDone = async (id) => {
    try {
      const currentTodo = todos.find(todo => todo.id === id)

      await patchTodo({
        id,
        isDone: !currentTodo.isDone
      })

      setTodos((preTodos) => {
        return preTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error('[Patch Todos Failed]:', error);
    }
  }

  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map(todo => {
        if ( todo.id === id ) {
          return {
            ...todo,
            isEdit
          }
        }

        return { ...todo, isEdit: false }
      })
    })
  }

  const handleSave = async ({id, title}) => {
    try {
      await patchTodo({
        id,
        title
      });

      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
              isEdit: false,
            };
          }

          return todo;
        });
      });
    } catch (error) {
      console.error('[Patch Todos Failed]:', error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id)

      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== id);
      });
    } catch (error) {
      console.error('[Delete Todos Failed]:', error);
    }
  }

  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();

        setTodos(
          todos.map((todo) => ({
            ...todo,
            isEdit: false,
          })),
        );
      } catch (error) {
        console.error('[Get Todos Failed]:', error);
      }
    };
   
    getTodosAsync();
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer amount={amount} />
    </div>
  );
};

export default TodoPage;
