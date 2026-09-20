import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface Task {
  id?: number;
  userId: number;
  title: string;
  completed: boolean;
  completedAt?: string | null;
}

interface User {
  id?: number;
  name: string;
  email: string;
  city: string;
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tasks: Task[] = [];

  newTask = '';

  userId!: number;
  userName = '';

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  private taskApiUrl = '/api/tasks';
  private userApiUrl = '/api/users';


  ngOnInit(): void {

    // Get userId from route: /tasks/:userId
    const id = this.route.snapshot.paramMap.get('userId');

    if (!id) {
      this.errorMessage = 'User ID is missing.';
      return;
    }

    this.userId = Number(id);

    // Load user name and tasks
    this.loadUser();
    this.loadTasks();
  }


  // GET /api/users/{userId}
  loadUser(): void {

    this.http
      .get<User>(`${this.userApiUrl}/${this.userId}`)
      .subscribe({

        next: (user) => {
          this.userName = user.name;
        },

        error: (error) => {
          console.error(error);
          this.errorMessage = 'Failed to load user.';
        }
      });
  }


  // GET /api/tasks/user/{userId}
  loadTasks(): void {

    this.loading = true;
    this.errorMessage = '';

    this.getTasksByUserId(this.userId)
      .subscribe({

        next: (data) => {
          this.tasks = data;
          this.loading = false;
        },

        error: (error) => {
          console.error(error);

          this.errorMessage = 'Failed to load tasks.';
          this.loading = false;
        }
      });
  }


  getTasksByUserId(userId: number) {

    return this.http.get<Task[]>(
      `${this.taskApiUrl}/user/${userId}`
    );
  }


  // POST /api/tasks/user/{userId}
  addTask(): void {

    if (!this.newTask.trim()) {
      return;
    }

    this.saving = true;
    this.clearMessages();

    const task = {
      title: this.newTask.trim(),
      completed: false
    };

    this.http
      .post<Task>(
        `${this.taskApiUrl}/user/${this.userId}`,
        task
      )
      .subscribe({

        next: (createdTask) => {

          this.tasks.push(createdTask);

          this.newTask = '';

          this.successMessage =
            'Task added successfully.';

          this.saving = false;
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Failed to add task.';

          this.saving = false;
        }
      });
  }


  // PUT /api/tasks/{taskId}
  toggleTask(task: Task): void {

    if (task.id === undefined) {
      return;
    }

    const updatedTask = {
      title: task.title,
      completed: !task.completed
    };

    this.http
      .put<Task>(
        `${this.taskApiUrl}/${task.id}`,
        updatedTask
      )
      .subscribe({

        next: (updatedTask) => {

          const index = this.tasks.findIndex(
            t => t.id === updatedTask.id
          );

          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Failed to update task.';
        }
      });
  }


  // PUT /api/tasks/{taskId}
  updateTask(task: Task): void {

    if (task.id === undefined) {
      return;
    }

    if (!task.title.trim()) {
      this.errorMessage = 'Task title is required.';
      return;
    }

    const updatedTask = {
      title: task.title.trim(),
      completed: task.completed
    };

    this.http
      .put<Task>(
        `${this.taskApiUrl}/${task.id}`,
        updatedTask
      )
      .subscribe({

        next: (updatedTask) => {

          const index = this.tasks.findIndex(
            t => t.id === updatedTask.id
          );

          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }

          this.successMessage =
            'Task updated successfully.';
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Failed to update task.';
        }
      });
  }


  // DELETE /api/tasks/{taskId}
  deleteTask(id?: number): void {

    if (id === undefined) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.http
      .delete(`${this.taskApiUrl}/${id}`)
      .subscribe({

        next: () => {

          this.tasks = this.tasks.filter(
            task => task.id !== id
          );

          this.successMessage =
            'Task deleted successfully.';
        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            'Failed to delete task.';
        }
      });
  }


  clearMessages(): void {

    this.errorMessage = '';
    this.successMessage = '';
  }
  goBack(): void {
    this.router.navigate(['/users']);
  }
}
