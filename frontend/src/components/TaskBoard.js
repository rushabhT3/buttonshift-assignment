import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, X } from "lucide-react";
import { addTask, updateTask } from "../store/workboardSlice";

const TaskBoard = ({ board, onClose }) => {
  const dispatch = useDispatch();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("TODO");
  const [editingTask, setEditingTask] = useState(null);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const task = board.tasks.find((t) => t.id.toString() === draggableId);
      const updatedTask = { ...task, status: destination.droppableId };
      dispatch(updateTask({ boardId: board.id, task: updatedTask }));
    }
  };

  const handleAddNewTask = async (status) => {
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      assigned_to: newTaskAssignedTo,
      status: status,
    };
    await dispatch(addTask({ boardId: board.id, task: newTask }));
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
    await dispatch(updateTask({ boardId: board.id, task: updatedTask }));
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

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{board.name}</h2>
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          <X size={16} className="inline mr-2" />
          Close Board
        </button>
      </div>
      <p className="text-gray-600 mb-4">{board.description}</p>
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
                    {board.tasks
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
      {showAddTask && (
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

export default TaskBoard;
