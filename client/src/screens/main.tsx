import React, {useCallback} from 'react';
import TodoListItem from '../components/todo-list-item';
import {Text, View, FlatList} from 'react-native';
import {useQuery, useMutation} from '@apollo/client';
import TodoInput from '../components/todo-input';
import {
  GET_TODOS_ARCHIEVED,
  GET_TODOS_PER_USER,
  REMOVE_TODO,
  TOGGLE_DONE,
} from '../queries/todos';

const initialData = [
  {
    id: 99,
    job: 'Create Agency Website',
    done: false,
  },
  {
    id: 100,
    job: 'Doing React Native',
    done: false,
  },
  {
    id: 101,
    job: 'Doing PPT Design',
    done: true,
  },
  {
    id: 102,
    job: 'Doing Graphic Design',
    done: false,
  },
];

interface TodoItem {
  id: number;
  job: string;
  done: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  attributes: {};
}

const todosParser = (todos: any) => {
  return todos.map((todo: TodoItem) => ({id: todo.id, ...todo.attributes}));
};

export default function MainScreen() {
  const {data, loading, error} = useQuery(GET_TODOS_PER_USER);
  const [deleteTodo] = useMutation(REMOVE_TODO, {
    refetchQueries: [{query: GET_TODOS_PER_USER}],
  });

  const [updateTodo] = useMutation(TOGGLE_DONE, {
    refetchQueries: [{query: GET_TODOS_ARCHIEVED}],
  });

  const todos: TodoItem[] = data?.todos?.data
    ? todosParser(data?.todos?.data)
    : [];

  console.info(data);

  const handleDelete = useCallback((todoId: number) => {
    deleteTodo({
      variables: {
        id: todoId,
      },
    });
  }, []);

  const onToggleCheck = useCallback((todoId: number) => {
    updateTodo({
      variables: {
        id: todoId,
        status: true,
      },
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E2EAF3',
        paddingVertical: 20,
      }}>
      <View style={{height: 150, justifyContent: 'center'}}>
        <Text
          style={{
            color: '#1D2F44',
            fontSize: 26,
            fontWeight: '600',
            marginBottom: 10,
          }}>
          Rumah Penguin Todos App ???
        </Text>
      </View>

      <FlatList
        data={todos}
        renderItem={({item, index}) => (
          <TodoListItem
            idx={index + 1}
            job={item.job}
            done={item.done}
            onToggleCheck={() => onToggleCheck(item.id)}
            onRemove={() => handleDelete(item.id)}
          />
        )}
      />
      {/* <TodoInput /> */}
    </View>
  );
}
