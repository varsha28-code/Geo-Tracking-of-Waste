import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
    template: `
    <div class="login-card">
        <div style="text-align: center;">
            <h2 style="color:var(--brand-blue); margin-bottom:1.5rem;">Orbit<span
                    style="color:var(--brand-green)">Bin</span></h2>
        </div>
        <div class="tabs">
            <button class="tab-btn" [class.active]="activeTab === 'citizen'"
                (click)="switchTab('citizen')">Citizen</button>
            <button class="tab-btn" [class.active]="activeTab === 'staff'"
                (click)="switchTab('staff')">Staff</button>
        </div>

        @if (message) {
            <div class="alert" [ngClass]="{'alert-success': messageType === 'success', 'alert-error': messageType === 'error'}">{{ message }}</div>
        }

        <!-- Citizen Login Form -->
        @if (activeTab === 'citizen') {
        <form (submit)="login($event, 'citizen')">
            <div class="form-group">
                <label>Username</label>
                <input type="text" [(ngModel)]="loginData.username" name="username" placeholder="Username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" [(ngModel)]="loginData.password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-submit btn-user" [disabled]="loading">
                {{ loading ? 'Logging in...' : 'Login as Citizen' }}
            </button>
            <p style="text-align:center; font-size:0.8rem; margin-top:10px;">
                Don't have an account? <a href="javascript:void(0)" (click)="switchTab('register')">Register</a>
            </p>
        </form>
        }

        <!-- Staff Login Form -->
        @if (activeTab === 'staff') {
        <form (submit)="login($event, 'staff')">
            <div class="form-group">
                <label>Staff ID</label>
                <input type="text" [(ngModel)]="loginData.staffId" name="staffId" placeholder="STAFF_01" required>
            </div>
            <div class="form-group">
                <label>Secure Key</label>
                <input type="password" [(ngModel)]="loginData.staffKey" name="staffKey" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-submit btn-staff" [disabled]="loading">
                {{ loading ? 'Logging in...' : 'Staff Access' }}
            </button>
        </form>
        }

        <!-- Registration Form -->
        @if (activeTab === 'register') {
        <form (submit)="register($event)">
            <div class="form-group">
                <label>Username</label>
                <input type="text" [(ngModel)]="registerData.username" name="regUsername" placeholder="Choose a username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" [(ngModel)]="registerData.password" name="regPassword" placeholder="Create a password" required>
            </div>
            <button type="submit" class="btn-submit btn-user" [disabled]="loading">
                {{ loading ? 'Registering...' : 'Register' }}
            </button>
            <p style="text-align:center; font-size:0.8rem; margin-top:10px;">
                Already have an account? <a href="javascript:void(0)" (click)="switchTab('citizen')">Login</a>
            </p>
        </form>
        }

        <a routerLink="/" class="back-home">← Back to Home</a>
    </div>
  `,
    styles: [`
        :host {
            --brand-blue: #0E2F56;
            --brand-gold: #C19A32;
            --brand-green: #27AE60;
            --white: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(rgba(14, 47, 86, 0.9), rgba(39, 174, 96, 0.8)),
                url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920');
            background-size: cover;
            font-family: 'Segoe UI', sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
        }

        .login-card {
            background: white;
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            z-index: 10;
        }

        .tabs {
            display: flex;
            background: #f1f5f9;
            padding: 5px;
            border-radius: 10px;
            margin-bottom: 2rem;
        }

        .tab-btn {
            flex: 1;
            padding: 10px;
            border: none;
            cursor: pointer;
            border-radius: 8px;
            font-weight: bold;
            color: #64748b;
            background: none;
        }

        .tab-btn.active {
            background: white;
            color: var(--brand-blue);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .form-group {
            margin-bottom: 1.2rem;
            text-align: left;
        }

        .form-group label {
            display: block;
            font-size: 0.85rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: var(--brand-blue);
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            box-sizing: border-box;
            outline: none;
        }
        
        .form-group input:focus {
            border-color: var(--brand-blue);
        }

        .btn-submit {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        
        .btn-submit:hover {
            opacity: 0.9;
        }
        
        .btn-submit:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn-user {
            background: var(--brand-green);
        }

        .btn-staff {
            background: var(--brand-blue);
        }

        .alert {
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .alert-success {
            background-color: #d4edda;
            color: #155724;
        }

        .back-home {
            display: block;
            text-align: center;
            margin-top: 1rem;
            text-decoration: none;
            color: #64748b;
            font-size: 0.9rem;
            transition: color 0.2s;
        }
        
        .back-home:hover {
            color: var(--brand-blue);
        }
  `]
})
export class Login {
    activeTab: string = 'citizen';
    message: string = '';
    messageType: 'success' | 'error' = 'error';
    loading: boolean = false;

    loginData: any = {};
    registerData: any = {};

    apiUrl = 'http://localhost:8000/backend/api';

    constructor(private router: Router, private http: HttpClient) { }

    switchTab(tab: string) {
        this.activeTab = tab;
        this.message = '';
        this.loginData = {};
        this.registerData = {};
    }

    login(event: Event, type: string) {
        event.preventDefault();

        if (type === 'citizen') {
            if (!this.loginData.username || !this.loginData.password) {
                this.showMessage('Please fill all fields', 'error');
                return;
            }

            this.loading = true;
            this.http.post<any>(`${this.apiUrl}/login.php`, {
                username: this.loginData.username,
                password: this.loginData.password
            }).subscribe({
                next: (res) => {
                    this.loading = false;
                    if (res.error) {
                        this.showMessage(res.error, 'error');
                    } else if (res.success) {
                        // Store the username in localStorage (simulate session)
                        localStorage.setItem('username', res.user.username);
                        this.showMessage('Logging in...', 'success');
                        setTimeout(() => {
                            this.router.navigate(['/dashboard']);
                        }, 500);
                    }
                },
                error: (err) => {
                    this.loading = false;
                    this.showMessage('Could not connect to server', 'error');
                    console.error("Login Error:", err);
                }
            });

        } else if (type === 'staff') {
            // Keep mocked staff login logic for now
            if (!this.loginData.staffId || !this.loginData.staffKey) {
                this.showMessage('Please fill the fields', 'error');
                return;
            }
            if (this.loginData.staffId !== 'STAFF_01' || this.loginData.staffKey !== '12345') {
                this.showMessage('Invalid credentials (try STAFF_01 / 12345)', 'error');
                return;
            }
            this.showMessage('Logging in as staff...', 'success');
            setTimeout(() => {
                this.router.navigate(['/staff-dashboard']);
            }, 800);
        }
    }

    register(event: Event) {
        event.preventDefault();

        if (!this.registerData.username || !this.registerData.password) {
            this.showMessage('Please fill all fields', 'error');
            return;
        }

        this.loading = true;
        this.http.post<any>(`${this.apiUrl}/register.php`, {
            username: this.registerData.username,
            password: this.registerData.password
        }).subscribe({
            next: (res) => {
                this.loading = false;
                if (res.error) {
                    this.showMessage(res.error, 'error');
                } else if (res.success) {
                    this.showMessage('Registration successful! Please login.', 'success');
                    setTimeout(() => {
                        this.switchTab('citizen');
                    }, 1500);
                }
            },
            error: (err) => {
                this.loading = false;
                this.showMessage('Could not connect to server', 'error');
                console.error("Registration Error:", err);
            }
        });
    }

    showMessage(msg: string, type: 'success' | 'error') {
        this.message = msg;
        this.messageType = type;
        if (type === 'error') {
            setTimeout(() => this.message = '', 3000);
        }
    }
}
