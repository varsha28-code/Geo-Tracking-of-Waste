import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

declare var lucide: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
    <div class="sidebar">
        <div class="brand-logo" style="display: flex; align-items: center; justify-content: center; gap: 10px; color: black; margin-bottom: 2.5rem;">
            <img src="logo.png" alt="Logo" style="height: 35px; mix-blend-mode: multiply;">
            <div>Orbit<span>Bin</span></div>
        </div>
        <ul class="nav-list">
            <li class="nav-item active" (click)="navigateTo('/dashboard')">
                <i data-lucide="camera"></i> Report Waste
            </li>
            <li class="nav-item" (click)="navigateTo('/my-points')">
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
                <h2>Welcome back, {{ user.username }}</h2>
                <p style="color: var(--text-light); margin-top: 4px;">Let's keep our environment clean. 🌍</p>
            </div>
            <div class="points-badge">
                <i data-lucide="award" size="20" style="color: var(--brand-gold);"></i>
                <span style="font-size: 1.2rem; font-weight: bold; margin-left: 8px;">{{ totalPoints }} pts</span>
            </div>
        </div>

        <div class="dashboard-grid">
            <!-- Report Section -->
            <div class="card">
                <h3><i data-lucide="upload-cloud"></i> Submit a Report</h3>
                <form (submit)="submitReport($event)" class="upload-wrapper" [style.display]="isSuccess ? 'none' : 'flex'">
                    <div class="upload-area" [class.has-image]="imagePreview"
                        (click)="fileInput.click()">
                        
                        @if (!imagePreview) {
                            <div class="upload-content">
                                <i data-lucide="image-plus" class="upload-icon" size="48"></i>
                                <p style="font-weight: 600; color: var(--brand-blue);">Click to Upload Image</p>
                                <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 5px;">Supported formats:
                                    JPG, PNG</p>
                            </div>
                        }
                        
                        @if (imagePreview) {
                            <img [src]="imagePreview" class="image-preview" alt="Waste Preview">
                            <span class="change-image-btn"><i data-lucide="refresh-cw" size="14"
                                    style="display:inline; margin-right:4px;"></i>Change Image</span>
                        }

                        <input type="file" #fileInput accept="image/*" hidden
                            (change)="onFileSelected($event)">
                    </div>

                    <div class="location-status">
                        <div class="status-dot" [class.active]="latitude"></div>
                        <span style="flex:1;">
                            @if (latitude) {
                                <span>
                                    <strong>Location Found:</strong> {{ latitude | number:'1.1-4' }}, {{ longitude | number:'1.1-4' }}
                                </span>
                            }
                            
                            @if (!latitude && !isLocating) {
                                <span style="color: var(--danger);">Location required for submission.</span>
                            }
                            
                            @if (isLocating) {
                                <span style="color: var(--brand-blue);">Acquiring GPS signal...</span>
                            }
                        </span>
                        
                        <button type="button" class="btn-action btn-location"
                            style="width:auto; margin:0; padding: 8px 12px; font-size: 0.85rem;"
                            (click)="getLocation()" [disabled]="isLocating">
                            <i data-lucide="map-pin" size="16"></i> Get Fix
                        </button>
                    </div>

                    @if (uploadStatus && !isSuccess) {
                        <div class="status-msg" [ngClass]="uploadStatusType === 'error' ? 'text-danger' : 'text-success'">
                            {{ uploadStatus }}
                        </div>
                    }

                    @if (detectionResult && !isSuccess) {
                        <div class="detection-result">
                            <h4
                                style="color: var(--brand-blue); margin-bottom: 8px; display:flex; align-items:center; gap:6px;">
                                <i data-lucide="scan" size="18"></i> AI Analysis:
                            </h4>
                            
                            @for (det of detectionResult.detections; track det) {
                                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                    <strong style="text-transform: uppercase;">{{ det.class }}</strong>
                                    <span
                                        style="background:white; padding:2px 8px; border-radius:12px; font-size:0.8rem; font-weight:bold; color:var(--brand-green);">{{ det.confidence * 100 | number:'1.0-0' }}%</span>
                                </div>
                            }
                            
                            @if (detectionResult.detections?.length === 0) {
                                <div style="color: var(--text-light);">No actionable objects detected.</div>
                            }
                        </div>
                    }

                    @if (isAnalyzing && !isSuccess) {
                        <div class="detection-result" style="display:flex; align-items:center; gap:8px; color: var(--brand-blue);">
                            <i data-lucide="loader-2" class="lucide-spin" size="18"></i> AI is analyzing the image...
                        </div>
                    }

                    @if (!isSuccess) {
                        <button type="submit" class="btn-action"
                            [disabled]="isSubmitting || isAnalyzing || !imagePreview || !latitude">
                            
                            @if (!isSubmitting) {
                                <span><i data-lucide="send" size="18"></i> Submit Report</span>
                            }
                            
                            @if (isSubmitting) {
                                <span><i data-lucide="loader-2" class="lucide-spin" size="18"></i> Submitting...</span>
                            }
                        </button>
                    }
                </form>
            </div>

            <!-- Map Section -->
            <div class="card">
                <h3><i data-lucide="map"></i> Interactive Map</h3>
                <div id="map"></div>
            </div>
        </div>
    </div>

    <!-- SUCCESS MODAL -->
    @if (isSuccess) {
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="success-icon-wrapper">
                        <i data-lucide="check-circle" size="64" class="text-success-anim"></i>
                    </div>
                    <button class="modal-close-btn" (click)="resetForm()">
                        <i data-lucide="x" size="24"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <h2>Submission Successful!</h2>
                    <p>Thank you for your contribution to a cleaner city.</p>
                    
                    <div class="reward-highlight">
                        <i data-lucide="award" size="24"></i>
                        <span>Points Earned: <strong>+{{ lastPointsAwarded }}</strong></span>
                    </div>

                    @if (collectorNotified) {
                        <div class="notification-info">
                            <i data-lucide="truck" size="20"></i>
                            <p>Nearest collector <strong>{{ collectorNotified }}</strong> has been dispatched.</p>
                        </div>
                    }

                    <div class="modal-actions">
                        <button type="button" class="btn-action" style="background: var(--brand-green);" (click)="resetForm()">
                            Report More Waste
                        </button>
                        <button type="button" class="btn-secondary" (click)="navigateTo('/my-points')">
                            View My Points
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
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
      font-family: 'Inter', sans-serif;
    }

    .app-container {
        display: flex;
        height: 100%;
        background: linear-gradient(135deg, #f0fdf4 0%, #fefce8 100%);
        color: var(--text-main);
    }

    /* SIDEBAR */
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
        flex-shrink: 0;
    }

    .brand-logo {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--brand-blue);
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

    /* MAIN CONTENT */
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
        flex-shrink: 0;
    }

    .header h2 {
        color: var(--brand-blue);
        font-size: 1.8rem;
        margin: 0;
    }

    .points-badge {
        display: flex;
        align-items: center;
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.3);
        padding: 8px 16px;
        border-radius: 20px;
        color: var(--brand-blue);
        box-shadow: 0 4px 10px rgba(251, 191, 36, 0.1);
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        height: 100%;
        min-height: 500px;
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
        transition: transform 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
    }

    .card h3 {
        color: var(--brand-blue);
        margin: 0 0 20px 0;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* UPLOAD AREA */
    .upload-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .upload-area {
        border: 2px dashed #cbd5e1;
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.5);
        position: relative;
        overflow: hidden;
        min-height: 200px;
    }

    .upload-area:hover {
        border-color: var(--brand-green);
        background: rgba(240, 253, 244, 0.8);
    }

    .upload-area.has-image {
        border: none;
        padding: 0;
        background: #000;
    }

    .upload-icon {
        color: var(--brand-green);
        margin-bottom: 12px;
    }

    .image-preview {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
    }

    .change-image-btn {
        position: absolute;
        bottom: 15px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.3s;
    }

    .upload-area:hover .change-image-btn {
        opacity: 1;
    }

    /* MAP */
    #map {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        min-height: 300px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        z-index: 1;
    }

    /* BUTTONS & STATUS */
    .btn-action {
        background: var(--brand-blue);
        color: white;
        padding: 14px 24px;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        margin-top: 15px;
        transition: all 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        font-size: 1rem;
    }

    .btn-action:hover:not(:disabled) {
        background: #1e293b;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(15, 23, 42, 0.2);
    }

    .btn-action:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-location {
        background: var(--brand-green);
        margin-top: 15px;
    }

    .btn-location:hover:not(:disabled) {
        background: var(--brand-green-hover);
        box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2);
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

    .location-status {
        margin-top: 15px;
        font-size: 0.95rem;
        color: var(--text-light);
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        padding: 10px 15px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .status-dot {
        width: 12px;
        height: 12px;
        background: #cbd5e1;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .status-dot.active {
        background: var(--brand-green);
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
        }

        70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
    }

    .detection-result {
        margin-top: 15px;
        padding: 15px;
        background: rgba(240, 253, 244, 0.8);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        font-size: 0.95rem;
    }

    .status-msg {
        margin-top: 10px;
        font-weight: 600;
        text-align: center;
        padding: 10px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.8);
    }
    
    .text-success { color: var(--brand-green); border: 1px solid rgba(16, 185, 129, 0.3); }
    .text-danger { color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

    /* MODAL STYLES */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
        background: white;
        padding: 40px;
        border-radius: 30px;
        width: 100%;
        max-width: 450px;
        text-align: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        position: relative;
        animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .modal-header {
        position: relative;
        margin-bottom: 20px;
    }

    .modal-close-btn {
        position: absolute;
        top: -20px;
        right: -20px;
        background: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        color: var(--text-light);
        transition: all 0.2s;
    }

    .modal-close-btn:hover {
        color: var(--danger);
        transform: rotate(90deg);
    }

    .success-icon-wrapper {
        color: var(--brand-green);
        display: inline-block;
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .modal-body h2 {
        color: var(--brand-blue);
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .modal-body p {
        color: var(--text-light);
        margin-bottom: 25px;
    }

    .reward-highlight {
        background: rgba(251, 191, 36, 0.1);
        border: 1px solid rgba(251, 191, 36, 0.3);
        padding: 15px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 20px;
        color: var(--brand-blue);
        font-weight: 600;
    }

    .reward-highlight i {
        color: var(--brand-gold);
    }

    .notification-info {
        background: rgba(59, 130, 246, 0.05);
        border-left: 4px solid #3b82f6;
        padding: 12px 15px;
        border-radius: 0 12px 12px 0;
        margin-bottom: 25px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        text-align: left;
    }

    .notification-info i {
        color: #3b82f6;
        flex-shrink: 0;
        margin-top: 2px;
    }

    .notification-info p {
        margin: 0;
        font-size: 0.9rem;
        color: #1e293b;
    }

    .modal-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .btn-secondary {
        background: transparent;
        border: 1px solid #e2e8f0;
        color: var(--text-main);
        padding: 12px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-secondary:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
    }

    @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes popIn {
        0% { transform: scale(0); }
        80% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .lucide-spin {
        animation: lucide-spin 2s linear infinite;
    }
    
    @keyframes lucide-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @media (max-width: 968px) {
        .app-container {
            flex-direction: column;
            overflow: auto;
        }

        .sidebar {
            width: 100%;
            padding: 1rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .brand-logo {
            margin-bottom: 0;
            font-size: 1.5rem;
        }

        .nav-list {
            display: none;
        }

        .btn-logout {
            margin-top: 0;
            padding: 8px;
        }

        .main-content {
            padding: 1.5rem;
            flex: none;
            overflow-y: visible;
        }

        .dashboard-grid {
            grid-template-columns: 1fr;
        }

        .card {
            min-height: 400px;
        }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  user = { username: 'Citizen' };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  totalPoints: number = 0;

  isSubmitting = false;
  isLocating = false;
  isAnalyzing = false;
  isSuccess = false;
  uploadStatus = '';
  uploadStatusType = '';
  detectionResult: any = null;
  lastPointsAwarded: number = 0;
  collectorNotified: string | null = null;

  map!: L.Map;
  markers: L.Marker[] = [];
  userMarker: L.Marker | null = null;
  pollingInterval: any;

  // Update with your backend URL
  apiUrl = 'http://localhost:8000/backend/api';

  // Fix leaflet default icons
  private iconDefault = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  });

  private wasteIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#d32f2f;width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);'></div>",
    iconSize: [20, 20], iconAnchor: [10, 10]
  });

  private collectorIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='background-color:#388e3c;width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);'></div>",
    iconSize: [20, 20], iconAnchor: [10, 10]
  });

  constructor(private http: HttpClient, private zone: NgZone, private router: Router) {
    L.Marker.prototype.options.icon = this.iconDefault;
  }

  ngOnInit() {
    // Load standard username if possible
    const savedName = localStorage.getItem('username');
    if (savedName) {
      this.user.username = savedName;
    }

    this.getLocation();
    this.fetchPoints();

    setTimeout(() => {
      this.initMap();
      this.loadMapData();

      // Initialize lucide icons for the dynamically rendered features
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 100); // Give the DOM time to render the map container

    // Real-time synchronization (every 5 seconds)
    this.pollingInterval = setInterval(() => {
      this.fetchPoints();
      this.loadMapData();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  fetchPoints() {
    this.http.get<any>(`${this.apiUrl}/get_points.php?username=${this.user.username}`).subscribe({
      next: (data) => {
        if (!data.error) {
          this.totalPoints = data.totalPoints;
        }
      },
      error: (e) => console.error("Could not fetch points", e)
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getLocation() {
    this.isLocating = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.zone.run(() => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.isLocating = false;
            // Add user location to map if map is ready
            if (this.map) {
              this.map.setView([this.latitude, this.longitude], 13);

              if (this.userMarker) {
                this.map.removeLayer(this.userMarker);
              }

              this.userMarker = L.marker([this.latitude, this.longitude], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: "<div style='background-color:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(59,130,246,0.8);animation: pulse 2s infinite;'></div>",
                  iconSize: [20, 20], iconAnchor: [10, 10]
                })
              }).bindPopup("<b>📍 Your Location</b><br>You are here.").addTo(this.map);
            }
          });
        },
        (error) => {
          this.zone.run(() => {
            this.isLocating = false;
            console.error("Error getting location", error);
            this.showMessage("Could not get location. Ensure location services are enabled.", "error");
          });
        }
      );
    } else {
      this.isLocating = false;
      this.showMessage("Geolocation is not supported by this browser.", "error");
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] || null;
    this.selectedFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result || null;
        // For angular change detection issue with third party uploads
        this.zone.run(() => {
          setTimeout(() => {
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }, 10);
        });
      };
      reader.readAsDataURL(file);
      this.analyzeImage(file);
    } else {
      this.imagePreview = null;
      this.detectionResult = null;
    }
  }

  analyzeImage(file: File) {
    this.isAnalyzing = true;
    this.detectionResult = null;
    this.uploadStatus = '';

    const formData = new FormData();
    formData.append('image', file);

    this.http.post<any>(`${this.apiUrl}/analyze_waste.php`, formData).subscribe({
      next: (response) => {
        this.isAnalyzing = false;
        if (response.error) {
          this.showMessage("Analysis failed: " + response.error, "error");
        } else {
          this.detectionResult = {
            detections: response.bounding_boxes || []
          };
          this.zone.run(() => {
            setTimeout(() => {
              if (typeof lucide !== 'undefined') {
                lucide.createIcons();
              }
            }, 10);
          });
        }
      },
      error: (error) => {
        this.isAnalyzing = false;
        console.error("Error analyzing image", error);
      }
    });
  }

  submitReport(event: Event) {
    event.preventDefault();

    if (!this.selectedFile || !this.latitude || !this.longitude) return;

    this.isSubmitting = true;
    this.uploadStatus = '';

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());
    formData.append('username', this.user.username);

    this.http.post<any>(`${this.apiUrl}/report_waste.php`, formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.error) {
          this.showMessage(response.error, "error");
        } else {
          let successMsg = "Waste reported successfully!";
          if (response.is_garbage_detected) {
            successMsg += ` AI confirmed garbage.`;
            if (response.nearest_collector_notified) {
              successMsg += ` Notified nearest collector: ${response.nearest_collector_notified}.`;
            }
          } else {
            successMsg += ` Note: AI didn't definitively identify garbage in this photo.`;
          }
          this.showMessage(successMsg, "success");

          // Update Points
          if (response.points_awarded) {
            this.lastPointsAwarded = parseInt(response.points_awarded, 10);
            this.totalPoints += this.lastPointsAwarded;
          }

          this.collectorNotified = response.nearest_collector_notified || null;
          this.isSuccess = true;

          this.zone.run(() => {
            setTimeout(() => {
              if (typeof lucide !== 'undefined') {
                lucide.createIcons();
              }
            }, 10);
          });

          // Refresh map data to show the new report
          this.loadMapData();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error("Error submitting report", error);
        this.showMessage("An error occurred while reporting. Please try again.", "error");
      }
    });
  }

  showMessage(msg: string, type: string) {
    this.uploadStatus = msg;
    this.uploadStatusType = type;
    setTimeout(() => { this.uploadStatus = ''; }, 8000);
  }

  resetForm() {
    this.isSuccess = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.detectionResult = null;
    this.uploadStatus = '';

    // ensure icons load after DOM changes back to upload form
    this.zone.run(() => {
      setTimeout(() => {
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 50);
    });
  }

  initMap() {
    // Default center (Hyderabad approx coordinates, since mock data uses this)
    const centerLat = this.latitude || 17.3850;
    const centerLng = this.longitude || 78.4867;

    this.map = L.map('map').setView([centerLat, centerLng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Set user marker initially if location is already known (e.g. from ngOnInit call)
    if (this.latitude && this.longitude) {
      this.userMarker = L.marker([this.latitude, this.longitude], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: "<div style='background-color:#3b82f6;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(59,130,246,0.8);animation: pulse 2s infinite;'></div>",
          iconSize: [20, 20], iconAnchor: [10, 10]
        })
      }).bindPopup("<b>📍 Your Location</b><br>You are here.").addTo(this.map);
    }
  }

  clearMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
      this.userMarker = null;
    }
  }

  loadMapData() {
    if (!this.map) return;
    this.clearMarkers();

    // Load Collectors
    this.http.get<any[]>(`${this.apiUrl}/get_collectors.php`).subscribe(collectors => {
      collectors.forEach(collector => {
        const marker = L.marker([collector.latitude, collector.longitude], { icon: this.collectorIcon })
          .bindPopup(`<b>🧹 Collector</b><br>${collector.name}<br>Phone: ${collector.phone_number}`);
        marker.addTo(this.map);
        this.markers.push(marker);
      });
    });

    // Load Waste Reports
    this.http.get<any[]>(`${this.apiUrl}/get_reports.php`).subscribe(reports => {
      reports.forEach(report => {
        // Construct image URL assuming backend is at localhost:8000 and uploads are in backend's parent dir
        const imgUrl = `http://localhost:8000/${report.image_path}`;
        const marker = L.marker([report.latitude, report.longitude], { icon: this.wasteIcon })
          .bindPopup(`
            <div style="text-align:center">
              <b>🗑️ Reported Waste</b><br>
              <span style="font-size:0.8rem;color:#666">${new Date(report.created_at).toLocaleString()}</span><br>
              Status: ${report.status}<br>
              AI Verified: ${report.is_garbage_detected ? 'Yes ✓' : 'No ✗'}<br>
              <img src="${imgUrl}" style="max-width:150px;max-height:100px;margin-top:8px;border-radius:4px;box-shadow:0 2px 5px rgba(0,0,0,0.2);">
            </div>
          `);
        marker.addTo(this.map);
        this.markers.push(marker);
      });
    });
  }
}
