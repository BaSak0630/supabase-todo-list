'use client';

import { Input,Button } from "@material-tailwind/react";
import { useState } from "react";
import Todo from "components/todo";
import { useQuery,useMutation } from "@tanstack/react-query";
import { getTodos,createTodo } from "actions/todo-actions";
import { title } from "process";

export default function UI() {
    const [searchInput, setSearchInput] = useState("");

    const todosQuery = useQuery({
        // **searchInput을 queryKey에 포함**
      queryKey: ["todos", searchInput],
      queryFn: () => getTodos({ searchInput }),
    });
    
    const createTodoMutation = useMutation({
        mutationFn: () => 
            createTodo({
                title: "New TODO",  
                completed: false,
        }),
        onSuccess: () => {
            todosQuery.refetch();//새로고침
        },
    });

    return (
        <div className="w-2/3 mx-auto flex flex-col items-center py-10 gap-2">
            <h1 className="text-xl">TODD LIST</h1>

            <Input
            label="Search TODO"
            placeholder="Search TODO"
            icon={<i className="fas fa-search" />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            />

            {todosQuery.isPending && <p>Loading...</p>}
            {todosQuery.data && todosQuery.data.map(todo => <Todo key={todo.id} todo={todo} />)}

            <Button 
                onClick={() => createTodoMutation.mutate()}
                loading={createTodoMutation.isPending}
            >
                <i className="fas fa-plus mr-2" />
                Add TODO
                </Button>
    </div>
  );
}