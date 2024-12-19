<script>
export default {
  name: 'QueueComponent',
  data() {
    return {
      queues: [],
      newQueueTitle: '',
      newTaskTitle: ''
    }
  },
  mounted() {
    this.fetchQueues()
  },
  methods: {
    fetchQueues() {
      fetch('/queues')
        .then(response => response.json())
        .then(data => {
          this.queues = data
        })
    },
    createQueue() {
      fetch('/queues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: this.newQueueTitle })
      })
        .then(response => response.json())
        .then(data => {
          this.queues.push(data)
          this.newQueueTitle = ''
        })
    },
    addTaskToQueue(queueId) {
      fetch(`/queues/${queueId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: this.newTaskTitle })
      })
        .then(response => response.json())
        .then(data => {
          const queue = this.queues.find(q => q.id === queueId)
          queue.tasks.push(data.task)
          this.newTaskTitle = ''
        })
    },
    updateQueueTitle(queue) {
      const newTitle = prompt('Enter new queue title', queue.title)
      if (newTitle) {
        fetch(`/queues/${queue.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newTitle })
        })
          .then(response => response.json())
          .then(data => {
            queue.title = data.title
          })
      }
    },
    deleteQueue(queue) {
      fetch(`/queues/${queue.id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          const index = this.queues.findIndex(q => q.id === queue.id)
          this.queues.splice(index, 1)
        })
    },
    toggleTaskStatus(queue, task) {
      fetch(`/queues/${queue.id}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completeness: !task.completeness })
      })
        .then(response => response.json())
        .then(data => {
          task.completeness = data.completeness
        })
    },
    deleteTask(queue, task) {
      fetch(`/queues/${queue.id}/tasks/${task.id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          const index = queue.tasks.findIndex(t => t.id === task.id)
          queue.tasks.splice(index, 1)
        })
    }
  }
}
</script>

<template>
  <div class="todo-board">
    <header class="board-header">
      <h1 class="board-title">To Do</h1>
      <div class="add-column">
        <input type="text" class="column-input" v-model="newColumnTitle" placeholder="Add a new column" />
        <button class="action-button" @click="addColumn">Add</button>
      </div>
    </header>
    <div class="board-columns">
      <div class="column" v-for="column in columns" :key="column.id">
        <div class="column-header">
          <h2 class="column-title">{{ column.title }}</h2>
          <div class="column-actions">
            <button class="action-button" @click="editColumn(column)">Edit</button>
            <button class="action-button" @click="deleteColumn(column)">Delete</button>
          </div>
        </div>
        <div class="tasks">
          <div class="task" v-for="task in column.tasks" :key="task.id">
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-status" :class="{ 'completed': task.completed }">{{ task.completed ? 'Completed' : 'In Progress' }}</span>
            </div>
            <div class="task-actions">
              <button class="action-button" @click="toggleTaskStatus(column.id, task)">
                {{ task.completed ? 'Reopen' : 'Complete' }}
              </button>
              <button class="action-button" @click="deleteTask(column.id, task)">Delete</button>
            </div>
          </div>
          <div class="add-task">
            <input type="text" class="task-input" v-model="newTaskTitle" placeholder="Add a new task" />
            <button class="action-button" @click="addTask(column.id)">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<style scoped>
.todo-board {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.board-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.add-column {
  display: flex;
  gap: 10px;
}

.column-input {
  flex-grow: 1;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.board-columns {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.column-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.column-actions {
  display: flex;
  gap: 10px;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-content {
  display: flex;
  flex-direction: column;
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.task-status {
  font-size: 14px;
  color: #999;
}

.task-status.completed {
  color: #4CAF50;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #0056b3;
}

.add-task {
  display: flex;
  gap: 10px;
}

.task-input {
  flex-grow: 1;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>