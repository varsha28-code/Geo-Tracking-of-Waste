import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var lucide: any;

@Component({
    selector: 'app-my-points',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="app-container">
    <div class="sidebar">
        <div class="brand-logo" style="color: black;">Orbit<span>Bin</span></div>
        <ul class="nav-list">
            <li class="nav-item" (click)="navigateTo('/dashboard')">
                <i data-lucide="camera"></i> Report Waste
            </li>
            <li class="nav-item active">
                <i data-lucide="award"></i> My Points
            </li>
            <li class="nav-item" (click)="navigateTo('/settings')">
                <i data-lucide="settings"></i> Settings
            </li>
        </ul>
        <button (click)="logout()" class="btn-logout">
            <i data-lucide="log-out"></i> Logout
        </button>
    </div>

    <div class="main-content">
        <div class="header">
            <div>
                <h2>My Rewards</h2>
                <p style="color: var(--brand-green); font-weight:bold; margin-top: 4px;">Keep up the good work! 🌟</p>
            </div>
        </div>

        <div class="card">
            <div
                style="text-align: center; padding: 40px; background: linear-gradient(135deg, var(--brand-green), #2ecc71); color: white; border-radius: 12px; margin-bottom: 20px;">
                <div style="font-size: 3rem; font-weight: bold;">{{ totalPoints || 0 }}</div>
                <div style="font-size: 1.2rem; opacity: 0.9;">Total Points Earned</div>
            </div>

        <div class="card" style="margin-top: 25px;">
            <h3 style="color: var(--brand-blue); margin-bottom: 20px;">Redeem Rewards</h3>
            <div class="rewards-grid">
                @for (reward of rewards; track reward.id) {
                    <div class="reward-item">
                        <div class="reward-icon">{{ reward.icon }}</div>
                        <div class="reward-info">
                            <div class="reward-name">{{ reward.name }}</div>
                            <div class="reward-cost">{{ reward.cost }} points</div>
                        </div>
                        <button class="btn-redeem" (click)="redeemReward(reward)" [disabled]="totalPoints < reward.cost">
                            Redeem
                        </button>
                    </div>
                }
            </div>
        </div>

        <div class="card" style="margin-top: 25px;">
            <h3 style="color: var(--brand-blue); margin-bottom: 20px; font-size: 1.25rem;">Recent Activity</h3>
            <div class="table-scroll">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; color:var(--brand-blue);">Date</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; color:var(--brand-blue);">Action</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; color:var(--brand-blue);">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (item of pointHistory; track item.id) {
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: var(--text-main);">
                                {{ item.created_at | date:'medium' }}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: var(--text-main);">
                                {{ item.action }}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight:bold;"
                                [style.color]="item.points > 0 ? 'var(--brand-green)' : 'var(--danger)'">
                                {{ item.points > 0 ? '+' : '' }}{{ item.points }}</td>
                        </tr>
                        }
                        @if (!pointHistory || pointHistory.length === 0) {
                        <tr>
                            <td colspan="3" style="text-align: center; padding: 20px; color: var(--text-light);">No activity yet.</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    </div>
    </div>
  `,
    styles: [`
        :host {
            --brand-blue: #0f172a;
            --brand-gold: #fbbf24;
            --brand-green: #10b981;
            --brand-green-hover: #0ea371;
            --text-main: #334155;
            --text-light: #64748b;
            --bg-light: #f8fafc;
            --white: #ffffff;
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
            box-shadow: 5px 0 15px rgba(0, 0, 0, 0.02);
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
            color: var(--text-main);
            font-weight: 500;
        }

        .nav-item.active {
            background: var(--brand-green);
            color: white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .nav-item:hover:not(.active) {
            background: rgba(16, 185, 129, 0.1);
            color: var(--brand-green);
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 2rem 3rem;
            gap: 25px;
            overflow-y: auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .header h2 {
            color: var(--brand-blue);
            font-size: 1.8rem;
            margin: 0;
        }

        .card {
            background: var(--glass);
            backdrop-filter: blur(12px);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.6);
            display: flex;
            flex-direction: column;
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

        .rewards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .reward-item {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: transform 0.2s;
        }

        .reward-item:hover { transform: translateY(-2px); }

        .reward-icon { font-size: 1.5rem; }
        .reward-info { flex: 1; }
        .reward-name { font-weight: 600; color: var(--brand-blue); }
        .reward-cost { font-size: 0.85rem; color: var(--text-light); }

        .btn-redeem {
            padding: 6px 12px;
            background: var(--brand-green);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .btn-redeem:disabled { background: #cbd5e1; cursor: not-allowed; }

        .table-scroll { overflow-x: auto; }
  `]
})
export class MyPointsComponent implements OnInit {
    user = { username: 'Citizen' };
    totalPoints: number = 0;
    pointHistory: any[] = [];
    apiUrl = 'http://localhost:8000/backend/api';

    rewards = [
        { id: 1, name: 'Coffee Voucher', cost: 100, icon: '☕' },
        { id: 2, name: 'Bus Pass Discount', cost: 250, icon: '🚌' },
        { id: 3, name: 'Eco-Bag Bundle', cost: 500, icon: '🛍️' },
        { id: 4, name: 'Superstar Badge', cost: 1000, icon: '⭐' }
    ];

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit() {
        const savedName = localStorage.getItem('username');
        if (savedName) {
            this.user.username = savedName;
        }
        this.getPoints();
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }

    getPoints() {
        this.http.get<any>(`${this.apiUrl}/get_points.php?username=${this.user.username}`).subscribe({
            next: (data) => {
                if (!data.error) {
                    this.totalPoints = data.totalPoints;
                    this.pointHistory = data.pointHistory;
                }
            },
            error: (e) => console.error("Could not fetch points", e)
        });
    }

    redeemReward(reward: any) {
        if (!confirm(`Are you sure you want to redeem "${reward.name}" for ${reward.cost} points?`)) return;

        this.http.post<any>(`${this.apiUrl}/redeem_points.php`, {
            username: this.user.username,
            points: reward.cost,
            reward_name: reward.name
        }).subscribe({
            next: (res) => {
                if (res.success) {
                    alert("Redeemed! Check your email for details.");
                    this.getPoints(); // Refresh balance and history
                } else {
                    alert("Error: " + res.error);
                }
            },
            error: (e) => console.error("Redemption failed", e)
        });
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    logout() {
        this.router.navigate(['/login']);
    }
}
