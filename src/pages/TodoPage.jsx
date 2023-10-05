import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyTodos = [
  {
    title: 'Learn react-router',
    isDone: true,
    id: 1,
  },
  {
    title: 'Learn to create custom hooks',
    isDone: false,
    id: 2,
  },
  {
    title: 'Learn to use context',
    isDone: true,
    id: 3,
  },
  {
    title: 'Learn to implement auth',
    isDone: false,
    id: 4,
  },
];

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState(dummyTodos);

  const navigate = useNavigate()
  const amount = todos.length
  const { isAuthenticated } = useAuth()

  const handleChange = (value) => {
    setInputValue(value)
  }

  const handleAddTodo = () => {
    if (inputValue.length === 0) {
      return;
    }

    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          title: inputValue,
          isDone: false,
          id: Math.random() * 100,
        },
      ];
    });

    setInputValue('');
  };

  const handleKeyDown = () => {
    if (inputValue.length === 0) {
      return;
    }

    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          title: inputValue,
          isDone: false,
          id: Math.random() * 100,
        },
      ];
    });

    setInputValue('');
  }

  const handleToggleDone = (id) => {
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
    })
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

  const handleSave = ({id, title}) => {
    setTodos((prevTodos) => {
      return prevTodos.map(todo => {
        if(todo.id === id) {
          return {
            ...todo,
            title,
            isEdit: false
          }
        }

        return todo
      })
    })
  }

  const handleDelete = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.filter(todo => todo.id !== id)
    })
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  return (
    <div>
      TodoPage
      <Header />
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
