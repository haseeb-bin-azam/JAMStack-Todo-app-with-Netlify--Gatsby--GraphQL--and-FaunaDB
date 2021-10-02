import React, { useEffect, useState } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";

// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
    todos {
        task,
        id,
        status
    }
}
`;
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`
const DELETE_TODO = gql`
    mutation deleteTodo($task: String!){
        deleteTodo(task: $task){
            task
        }
    }
`


export default function Home() {
    let inputText;
    let inputTask;

    const { loading, error, data } = useQuery(GET_TODOS);

    const [addTodo] = useMutation(ADD_TODO);

    const addTask = () => {
        addTodo({
            variables: {
                task: inputText.value
            },
            refetchQueries: [{ query: GET_TODOS }],
        })
        inputText.value = "";
    }

    const [deleteTodo] = useMutation(DELETE_TODO);

    const deleteTask = () => {
        console.log("delete task");
        console.log(inputTask);
        // deleteTodo({
        //     variables: {
        //         task: inputTask.value
        //     },
        //     refetchQueries: [{ query: GET_TODOS }],
        // })
    }


    // console.log(loading);
    if (loading)
        return <h2>Loading..</h2>

    if (error) {
        console.log(error)
        return <h2>Error</h2>
    }

    // console.log(data.todos);

    return (
        <div className="container">
            <label>
                <h1> Add Task </h1>
                <input type="text" ref={node => {
                    inputText = node;
                    // console.log(node);
                }} />
            </label>
            <button onClick={addTask}>Add Task</button>

            <br /> <br />

            <h3>My TODO LIST</h3>

            <table border="2">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th> TASK </th>
                        <th> STATUS </th>
                        <th> Delete </th>
                    </tr>
                </thead>
                <tbody>
                    {data.todos.map(todo => {
                        // console.log(todo)
                        return <tr key={todo.id}>
                            <td> {todo.id} </td>
                            <td ref={
                                node => {
                                    // console.log(todo.id);
                                    inputTask = todo.id;
                                }
                            }
                            > {todo.task} </td>
                            <td> {todo.status.toString()} </td>
                            <td> <button onClick={deleteTask}>Delete</button> </td>
                        </tr>
                    })}
                </tbody>
            </table>

        </div>
    );

}