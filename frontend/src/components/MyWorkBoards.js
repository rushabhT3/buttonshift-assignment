// src/components/WorkBoard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkBoards,
  createWorkBoard,
  addTask,
  updateTask,
  selectBoard,
  deselectBoard,
} from "../store/workboardSlice";

import useLogout from "../utils/Logout";

const WorkBoard = () => {
  const dispatch = useDispatch();
  const { workBoards, selectedBoard, status, error } = useSelector(
    (state) => state.workboard
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("TODO");
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  const { handleLogout } = useLogout();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    } else {
      dispatch(fetchWorkBoards());
    }
  }, [dispatch, navigate]);

  const handleCreateWorkBoard = async () => {
    await dispatch(
      createWorkBoard({
        name: newBoardName,
        description: newBoardDescription,
        tasks: tasks,
      })
    );
    setShowCreateForm(false);
    resetForm();
  };

  const resetForm = () => {
    setNewBoardName("");
    setNewBoardDescription("");
    setTasks([]);
    setShowAddTask(false);
  };

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
        assigned_to: newTaskAssignedTo,
      },
    ]);
    // Reset form fields
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskAssignedTo("");
    setNewTaskStatus("TODO");
    setShowAddTask(false);
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleBoardClick = (board) => {
    dispatch(selectBoard(board));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const task = selectedBoard.tasks.find(
        (t) => t.id.toString() === draggableId
      );
      const updatedTask = { ...task, status: destination.droppableId };
      dispatch(updateTask({ boardId: selectedBoard.id, task: updatedTask }));
    }
  };

  const handleAddNewTask = async (status) => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      assigned_to: newTaskAssignedTo,
      status: status,
    };
    await dispatch(addTask({ boardId: selectedBoard.id, task: newTask }));
    resetTaskForm();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setNewTaskAssignedTo(task.assigned_to);
    setNewTaskStatus(task.status);
    setShowAddTask(true);
  };

  const handleUpdateTask = async () => {
    const updatedTask = {
      id: editingTask.id,
      title: newTaskTitle,
      description: newTaskDescription,
      assigned_to: newTaskAssignedTo,
      status: newTaskStatus,
    };
    await dispatch(
      updateTask({ boardId: selectedBoard.id, task: updatedTask })
    );
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskAssignedTo("");
    setNewTaskStatus("TODO");
    setShowAddTask(false);
    setEditingTask(null);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My WorkBoards</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {!showCreateForm && !selectedBoard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            className="bg-green-500 hover:bg-green-700 text-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={24} className="mr-2" />
            Create Work Board
          </div>
          {workBoards.map((board) => (
            <div
              key={board.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleBoardClick(board)}
            >
              <h2 className="text-xl font-semibold mb-2">{board.name}</h2>
              <p className="text-gray-600">{board.description}</p>
            </div>
          ))}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Create a WorkBoard</h2>
          <input
            type="text"
            placeholder="Name your Board"
            className="w-full p-2 mb-4 border rounded"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <textarea
            placeholder="Board description"
            className="w-full p-2 mb-4 border rounded"
            value={newBoardDescription}
            onChange={(e) => setNewBoardDescription(e.target.value)}
          />
          {tasks.map((task, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full p-2 mb-2 border rounded"
                value={task.title}
                onChange={(e) =>
                  handleTaskChange(index, "title", e.target.value)
                }
              />
              <textarea
                placeholder="Task Description (Optional)"
                className="w-full p-2 mb-2 border rounded"
                value={task.description}
                onChange={(e) =>
                  handleTaskChange(index, "description", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Assign to User (Optional)"
                className="w-full p-2 mb-2 border rounded"
                value={task.assigned_to}
                onChange={(e) =>
                  handleTaskChange(index, "assigned_to", e.target.value)
                }
              />
              <select
                className="w-full p-2 mb-2 border rounded"
                value={task.status}
                onChange={(e) =>
                  handleTaskChange(index, "status", e.target.value)
                }
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          ))}
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            <Plus size={16} className="inline mr-2" />
            Add a Task
          </button>
          <div className="flex justify-between">
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateWorkBoard}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Work Board
            </button>
          </div>
        </div>
      )}

      {selectedBoard && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedBoard.name}</h2>
            <button
              onClick={() => dispatch(deselectBoard())}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              <X size={16} className="inline mr-2" />
              Close Board
            </button>
          </div>
          <p className="text-gray-600 mb-4">{selectedBoard.description}</p>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex justify-between">
              {["TODO", "IN_PROGRESS", "COMPLETED"].map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="bg-gray-100 p-4 rounded-lg w-1/3 mr-4 flex flex-col"
                    >
                      <h3 className="font-semibold mb-2">
                        {status === "TODO"
                          ? "To Do"
                          : status === "IN_PROGRESS"
                          ? "In Progress"
                          : "Completed"}
                      </h3>
                      <div className="flex-grow">
                        {selectedBoard.tasks
                          .filter((task) => task.status === status)
                          .map((task, index) => (
                            <Draggable
                              key={task.id.toString()}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white p-2 mb-2 rounded shadow"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold">
                                        {task.title}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {task.description}
                                      </p>
                                      {task.assigned_to && (
                                        <p className="text-xs text-blue-600 mt-1">
                                          Assigned to: {task.assigned_to}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => handleEditTask(task)}
                                      className="text-blue-500 hover:text-blue-700 font-bold"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                      <button
                        onClick={() => {
                          setNewTaskStatus(status);
                          setShowAddTask(true);
                        }}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                      >
                        <Plus size={16} className="inline mr-2" />
                        Add
                      </button>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      )}

      {selectedBoard && showAddTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h3>
            <input
              type="text"
              placeholder="Task Title"
              className="w-full p-2 mb-2 border rounded"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Description (Optional)"
              className="w-full p-2 mb-2 border rounded"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Assign to User (Optional)"
              className="w-full p-2 mb-2 border rounded"
              value={newTaskAssignedTo}
              onChange={(e) => setNewTaskAssignedTo(e.target.value)}
            />
            <select
              className="w-full p-2 mb-2 border rounded"
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value)}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={resetTaskForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={
                  editingTask
                    ? handleUpdateTask
                    : () => handleAddNewTask(newTaskStatus)
                }
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkBoard;