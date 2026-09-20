import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  users: User[] = [];

  loading = false;
  saving = false;

  errorMessage = '';
  successMessage = '';

  editingUserId: number | null = null;

  userForm: User = {
    name: '',
    email: '',
    city: ''
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  // GET /api/users
  loadUsers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({

      next: (users) => {
        this.users = users;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);

        this.errorMessage = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  // POST /api/users
  createUser(): void {

    if (
      !this.userForm.name.trim() ||
      !this.userForm.email.trim() ||
      !this.userForm.city.trim()
    ) {
      this.errorMessage = 'Name, email and city are required.';
      return;
    }

    this.saving = true;
    this.clearMessages();

    const newUser: User = {
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      city: this.userForm.city.trim()
    };

    this.userService.createUser(newUser).subscribe({

      next: (user) => {

        this.users.push(user);

        this.resetForm();

        this.successMessage = 'User created successfully.';
        this.saving = false;
      },

      error: (error) => {

        console.error(error);

        this.errorMessage = 'Failed to create user.';
        this.saving = false;
      }
    });
  }

  // Start editing
  editUser(user: User): void {

    this.editingUserId = user.id ?? null;

    this.userForm = {
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city
    };

    this.clearMessages();
  }

  // PUT /api/users/{id}
  updateUser(): void {

    if (this.editingUserId === null) {
      return;
    }

    if (
      !this.userForm.name.trim() ||
      !this.userForm.email.trim() ||
      !this.userForm.city.trim()
    ) {
      this.errorMessage = 'Name, email and city are required.';
      return;
    }

    this.saving = true;
    this.clearMessages();

    const updatedData: User = {
      id: this.editingUserId,
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      city: this.userForm.city.trim()
    };

    this.userService
      .updateUser(this.editingUserId, updatedData)
      .subscribe({

        next: (updatedUser) => {

          const index = this.users.findIndex(
            user => user.id === this.editingUserId
          );

          if (index !== -1) {
            this.users[index] = updatedUser;
          }

          this.cancelEdit();

          this.successMessage = 'User updated successfully.';
          this.saving = false;
        },

        error: (error) => {

          console.error(error);

          this.errorMessage = 'Failed to update user.';
          this.saving = false;
        }
      });
  }

  // DELETE /api/users/{id}
  deleteUser(id: number | undefined): void {

    if (id === undefined) {
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.userService.deleteUser(id).subscribe({

      next: () => {

        this.users = this.users.filter(
          user => user.id !== id
        );

        this.successMessage = 'User deleted successfully.';
      },

      error: (error) => {

        console.error(error);

        this.errorMessage = 'Failed to delete user.';
      }
    });
  }

    openTasks(user: User): void {

    if (user.id === undefined) {

      return;
    }


    this.router.navigate([
      '/tasks',
      user.id
    ]);
  }

  cancelEdit(): void {

    this.editingUserId = null;

    this.resetForm();
  }

  resetForm(): void {

    this.userForm = {
      name: '',
      email: '',
      city: ''
    };
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}