import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

declare var lucide: any;

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    template: `
    <div class="app-container">
    <div class="sidebar">
        <div class="brand-logo" style="color: black;">Orbit<span>Bin</span></div>
        <ul class="nav-list">
            <li class="nav-item" (click)="navigateTo('/dashboard')">
                <i data-lucide="camera"></i> Report Waste
            </li>
            <li class="nav-item" (click)="navigateTo('/my-points')">
                <i data-lucide="award"></i> My Points
            </li>
            <li class="nav-item active">
                <i data-lucide="settings"></i> Settings
            </li>
        </ul>
        <button (click)="logout()" class="btn-logout">
            <i data-lucide="log-out"></i> Logout
        </button>
    </div>

    <div class="main-content">
        <div class="header">
            <h2>Account Settings</h2>
        </div>

        @if (saved) {
            <div class="alert-success">Settings saved successfully!</div>
        }

        <div class="card">
            <h3 style="margin-bottom: 15px; color: var(--brand-blue);">Profile Information</h3>
            <form (submit)="saveSettings($event)">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" [(ngModel)]="user.username" name="username" readonly disabled style="background:#f1f5f9;">
                </div>
                <button type="submit" class="btn-save">Save Changes</button>
            </form>
        </div>
    </div>
    </div>
  `,
    styles: [`
        :host {
            --brand-blue: #0f172a;
            --brand-green: #10b981;
            --text-main: #334155;
            --text-light: #64748b;
            --bg-light: #f8fafc;
            --glass: rgba(255, 255, 255, 0.85);
            --danger: #ef4444;
            display: block;
            height: 100vh;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
            color: var(--text-main);
        }

        .app-container {
            display: flex;
            height: 100%;
        }

        .sidebar {
            width: 260px;
            background: var(--glass);
            backdrop-filter: blur(12px);
            padding: 2rem 1.5rem;
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255, 255, 255, 0.5);
            z-index: 10;
        }

        .brand-logo {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 2.5rem;
            text-align: center;
        }

        .brand-logo span {
            color: var(--brand-green);
        }

        .nav-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0;
            margin: 0;
        }

        .nav-item {
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
        }

        .nav-item.active {
            background: var(--brand-green);
            color: white;
        }

        .nav-item:hover:not(.active) {
            background: rgba(16, 185, 129, 0.1);
            color: var(--brand-green);
        }

        .main-content {
            flex: 1;
            padding: 2rem 3rem;
            overflow-y: auto;
        }

        .header h2 {
            color: var(--brand-blue);
            margin-bottom: 20px;
            margin-top: 0;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card {
            background: var(--glass);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            font-weight: bold;
            margin-bottom: 5px;
            display: block;
            color: var(--brand-blue);
        }

        input[type="text"],
        input[type="email"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            box-sizing: border-box;
            outline: none;
        }
        
        input:focus {
            border-color: var(--brand-green);
        }

        .btn-save {
            background: var(--brand-green);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        
        .btn-save:hover {
            opacity: 0.9;
        }

        .btn-logout {
            margin-top: auto;
            color: var(--text-light);
            text-decoration: none;
            padding: 12px;
            cursor: pointer;
            background: none;
            border: none;
            text-align: left;
            font-size: 1rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: color 0.3s;
        }

        .btn-logout:hover {
            color: var(--danger);
        }
        
        .alert-success {
            padding: 12px;
            background: #dcfce7;
            color: #166534;
            border-left: 4px solid var(--brand-green);
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: bold;
        }
  `]
})
export class SettingsComponent implements OnInit {
    user = { username: 'Citizen' };
    saved: boolean = false;
    apiUrl = 'http://localhost:8000/backend/api';

    constructor(private router: Router, private http: HttpClient) { }

    ngOnInit() {
        // Ideally fetch from API here, but for simplicity of this request we just update

        // Ideally fetch from API here, but for simplicity of this request we just update


        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }

    saveSettings(event: Event) {
        event.preventDefault();

        // Save via API
        this.http.post<any>(`${this.apiUrl}/update_settings.php`, {
            username: this.user.username
        }).subscribe({
            next: (res) => {
                if (res.error) {
                    console.error("Error saving properties", res.error);
                } else {
                    this.saved = true;
                    setTimeout(() => { this.saved = false; }, 3000);
                }
            },
            error: (err) => {
                console.error("Error communicating with API.", err);
            }
        });
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    logout() {
        this.router.navigate(['/login']);
    }
}
