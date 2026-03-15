import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
        <div class="brand-logo" style="display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; color: black; font-weight: 800; font-size: 1.5rem;">
            <img src="logo.png" alt="Logo" style="height: 35px; mix-blend-mode: multiply;">
            <div>Orbit<span style="color:var(--brand-green)">Bin</span></div>
        </div>
        <ul>
            <li class="nav-item" [class.active]="activeView === 'map'" (click)="switchView('map')">📍 Live Map</li>
            <li class="nav-item" [class.active]="activeView === 'fleet'" (click)="switchView('fleet')">🚛 Fleet</li>
            <li class="nav-item" [class.active]="activeView === 'reports'" (click)="switchView('reports')">📊 Reports</li>
        </ul>
        <a href="javascript:void(0)" (click)="logout()"
            style="margin-top:auto; color:#64748b; text-decoration:none; opacity:0.8; cursor:pointer;">Logout</a>
    </div>

    <div class="main-content">
        <!-- MAP VIEW -->
        @if (activeView === 'map') {
        <div class="view-section active" style="height: auto; flex: 0 0 auto; overflow: visible;">
            <div class="stats-bar">
                <div class="stat-card">
                    <h4>Total Reports</h4>
                    <p>{{ reports.length }}</p>
                </div>
                <div class="stat-card" style="border-left-color:var(--brand-gold)">
                    <h4>Pending</h4>
                    <p>{{ getPendingCount() }}</p>
                </div>
                <div class="stat-card" style="border-left-color:var(--brand-green)">
                    <h4>Cleaned</h4>
                    <p>{{ getCleanedCount() }}</p>
                </div>
            </div>
            <div style="padding: 10px 20px; background: white; border-bottom: 1px solid #e2e8f0; display:flex; justify-content: flex-end;">
                <button (click)="getStaffLocation()" style="padding: 8px 16px; background: var(--brand-blue); color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                    📍 Update My Location
                </button>
            </div>
            <!-- To prevent leaflet re-initialization issues, we use display:none via CSS instead of *ngIf for the map -->
        </div>
        }

        <!-- The map container is always in DOM but visually hidden based on view -->
        <div id="wrapper-map" [style.display]="activeView === 'map' ? 'flex' : 'none'" style="flex: 1 1 auto; width: 100%; position: relative;">
            <div id="map" style="position: absolute; top:0; bottom:0; left:0; right:0; width: 100%; height: 100%;"></div>
        </div>

        <!-- FLEET VIEW -->
        @if (activeView === 'fleet') {
        <div class="view-section active">
            <div style="padding: 20px 20px 0;">
                <h2>Fleet Management</h2>
            </div>
            <div class="fleet-grid">
                @for (truck of fleet; track truck.id) {
                <div class="truck-card">
                    <h4>🚛 Truck #{{ truck.id }}</h4>
                    <p style="color:gray; font-size:0.9rem;">Driver: {{ truck.name }}</p>
                    <div style="margin-top:10px; display:flex; justify-content:space-between;">
                        <span class="status-badge status-cleaned">Active</span>
                        <small>95% Fuel</small>
                    </div>
                </div>
                }
            </div>
        </div>
        }

        <!-- REPORTS VIEW -->
        @if (activeView === 'reports') {
        <div class="view-section active">
            <div style="padding: 20px 20px 0;">
                <h2>Citizen Reports</h2>
                <button (click)="getReports()" style="float:right; padding:5px 10px; cursor: pointer; border-radius: 4px; background: white; border: 1px solid #ccc;">Refresh</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>User</th>
                            <th>Detection</th>
                            <th>Status</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (r of reports; track r.id) {
                        <tr>
                            <td>{{ r.created_at | date:'short' }}</td>
                            <td>{{ r.username }}</td>
                            <td>
                                @if (r.detection_data?.detections?.length > 0) {
                                    @for (d of r.detection_data.detections; track d.class) {
                                        <div>{{ d.class }} ({{ d.confidence * 100 | number:'1.0-0' }}%)</div>
                                    }
                                } @else if (r.detection_data?.bounding_boxes?.length > 0) {
                                    @for (d of r.detection_data.bounding_boxes; track d.class) {
                                        <div>{{ d.class }}</div>
                                    }
                                } @else {
                                    <span style="color: #999;">No objects</span>
                                }
                            </td>
                            <td>
                                <div style="display: flex; flex-direction: column; gap: 4px;">
                                    <span class="status-badge" [ngClass]="'status-' + (r.status || 'pending')">{{ r.status || 'pending' }}</span>
                                    <div class="status-actions">
                                        @if (r.status === 'pending' || !r.status) {
                                            <button (click)="updateStatus(r.id, 'in_progress')" class="btn-mini">Start</button>
                                        }
                                        @if (r.status === 'in_progress') {
                                            <button (click)="updateStatus(r.id, 'completed')" class="btn-mini btn-complete">Finish</button>
                                        }
                                    </div>
                                </div>
                            </td>
                            <td>{{ r.latitude | number:'1.1-4' }}, {{ r.longitude | number:'1.1-4' }}</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
        }
    </div>

    <div class="alerts-panel">
        <h3 style="color:var(--brand-blue); margin-bottom:1rem;">Latest Activity</h3>
        @for (r of reports.slice(0, 5); track r.id) {
        <div class="alert-item" style="border-left-color: var(--brand-gold); background: #fffbe6;">
            <strong>🚨 Report #{{r.id}}</strong><br>
            User: {{r.username}}<br>
            <small>{{r.created_at | date:'shortTime'}}</small>
        </div>
        }
    </div>

    <!-- Notification Container -->
    <div id="notification-container" class="notification-container">
        @for (notif of activeNotifications; track notif.id) {
        <div class="notification-card" [class.fade-out]="notif.fadeOut">
            <div>
                <h4 style="color: var(--brand-blue); margin-bottom: 5px;">🚨 New Report #{{ notif.reportId }}</h4>
                <p style="font-size: 0.9rem;">{{ notif.detectionText }} at {{ notif.lat | number:'1.1-4' }}, {{ notif.lng | number:'1.1-4' }}</p>
                <p style="font-size: 0.85rem; color: var(--brand-green); margin-top: 5px; font-weight: bold;">
                    Notifying nearest truck: #{{ notif.truckId }} ({{ notif.distance | number:'1.1-1' }} km away)
                </p>
            </div>
            <button (click)="removeNotification(notif.id)" style="background:none; border:none; cursor:pointer; font-size:1.2rem; align-self:flex-start;">&times;</button>
        </div>
        }
    </div>
  `,
  styles: [`
    :host {
        display: flex;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background: #f1f5f9;
        font-family: 'Segoe UI', sans-serif;

        --brand-blue: #0E2F56;
        --brand-gold: #C19A32;
        --brand-green: #27AE60;
        --danger: #e74c3c;
        --white: #ffffff;
    }

    .sidebar {
        width: 260px;
        background: var(--white);
        color: #333;
        padding: 20px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e2e8f0;
        flex-shrink: 0;
    }

    .sidebar ul {
        padding: 0;
        margin: 0;
    }

    .nav-item {
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: 0.3s;
        list-style: none;
        margin-bottom: 5px;
    }

    .nav-item.active {
        background: rgba(39, 174, 96, 0.1);
        color: var(--brand-green);
        font-weight: bold;
    }

    .nav-item:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .stats-bar {
        display: flex;
        gap: 20px;
        padding: 20px;
        background: white;
        border-bottom: 1px solid #e2e8f0;
        flex-shrink: 0;
    }

    .stat-card {
        flex: 1;
        background: #f8fafc;
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid var(--brand-blue);
    }

    .stat-card h4 {
        margin: 0 0 5px 0;
        color: #64748b;
        font-size: 0.9rem;
    }

    .stat-card p {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--brand-blue);
    }

    #map {
        width: 100%;
        height: 100%;
    }

    .leaflet-container {
        width: 100% !important;
        height: 100% !important;
    }

    .alerts-panel {
        width: 280px;
        background: white;
        border-left: 1px solid #e2e8f0;
        padding: 20px;
        overflow-y: auto;
        flex-shrink: 0;
    }

    .alert-item {
        padding: 12px;
        border-radius: 8px;
        background: #fff5f5;
        border-left: 4px solid var(--danger);
        margin-bottom: 10px;
        font-size: 0.85rem;
    }

    /* View Management */
    .view-section {
        display: none;
        height: 100%;
        flex-direction: column;
        overflow-y: auto;
    }

    .view-section.active {
        display: flex;
    }

    /* Fleet Grid */
    .fleet-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .truck-card {
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        border-top: 4px solid var(--brand-blue);
    }

    .truck-card h4 {
        margin: 0 0 5px 0;
    }

    /* Reports Table */
    .table-container {
        padding: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    th, td {
        text-align: left;
        padding: 12px 15px;
        border-bottom: 1px solid #e2e8f0;
    }

    th {
        background: #f8fafc;
        color: var(--brand-blue);
        font-weight: 600;
    }

    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: capitalize;
    }

    .status-pending {
        background: #fee2e2;
        color: #991b1b;
    }

    .status-verified {
        background: #e0f2fe;
        color: #0369a1;
    }

    .status-cleaned {
        background: #dcfce7;
        color: #166534;
    }

    .status-completed {
        background: #dcfce7;
        color: #166534;
    }

    .status-in_progress {
        background: #e0f2fe;
        color: #0369a1;
    }

    .btn-mini {
        padding: 2px 6px;
        font-size: 0.7rem;
        cursor: pointer;
        border: 1px solid #cbd5e1;
        background: white;
        border-radius: 4px;
    }
    .btn-mini:hover { background: #f1f5f9; }
    .btn-complete { color: var(--brand-green); border-color: var(--brand-green); }

    .status-actions {
        display: none;
        gap: 4px;
    }
    tr:hover .status-actions {
        display: flex;
    }

    /* Notifications */
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .notification-card {
        background: white;
        border-left: 4px solid var(--brand-gold);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .notification-card.fade-out {
        animation: fadeOut 0.5s ease-in forwards;
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
  `]
})
export class StaffDashboard implements OnInit, OnDestroy {
  activeView: string = 'map';
  reports: any[] = [];

  apiUrl = 'http://localhost:8000/backend/api';
  pollingInterval: any;

  map!: L.Map;
  markers: L.FeatureGroup = L.featureGroup();
  staffMarker!: L.Marker;

  notifiedReportIds = new Set<string>();
  activeNotifications: any[] = [];
  notifCounter = 0;

  fleet = [
    { id: '09', lat: 17.3850, lng: 78.4867, name: 'John D.' }
  ];

  private wasteIcon = L.divIcon({
    className: 'custom-waste-icon',
    html: `<div style="background:white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  private staffIcon = L.divIcon({
    className: 'custom-staff-icon',
    html: `<div style="background:#27AE60; width:20px; height:20px; border-radius:50%; border:2px solid white; box-shadow: 0 0 10px rgba(39, 174, 96, 0.8);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  constructor(private router: Router, private http: HttpClient, private zone: NgZone) { }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
      this.getReports();
    }, 100);

    // Speed up polling for "simultaneous" feel (every 3 seconds)
    this.pollingInterval = setInterval(() => {
      this.getReports();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  switchView(view: string) {
    this.activeView = view;
    if (view === 'map') {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize(true);
        }
      }, 250);
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  getPendingCount() {
    // Treat null/undefined as pending for count consistency
    return this.reports.filter(r => !r.status || r.status === 'pending').length;
  }

  getCleanedCount() {
    // Match the 'completed' status used in the update logic and database
    return this.reports.filter(r => r.status === 'completed' || r.status === 'cleaned').length;
  }

  initMap() {
    this.map = L.map('map').setView([17.3850, 78.4867], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markers.addTo(this.map);

    // Get staff location
    this.getStaffLocation();

    // Add Fleet
    this.fleet.forEach(t => {
      let tIcon = L.divIcon({
        className: 'custom-truck-icon',
        html: `<div style="background:#0E2F56; color:white; padding:5px; border-radius:5px; font-size:12px; white-space:nowrap; border:2px solid white;">🚛 Truck #${t.id}</div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });
      L.marker([t.lat, t.lng], { icon: tIcon }).addTo(this.map).bindPopup(`<b>Truck #${t.id}</b><br>Driver: ${t.name}`);
    });
  }

  getStaffLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (this.map) {
          this.map.setView([lat, lng], 13);
          if (this.staffMarker) {
            this.map.removeLayer(this.staffMarker);
          }
          this.staffMarker = L.marker([lat, lng], { icon: this.staffIcon }).addTo(this.map)
            .bindPopup("<b>Your Current Location</b>").openPopup();
        }
      }, (err) => {
        console.warn("Could not retrieve staff location", err);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  getReports() {
    this.http.get<any[]>(`${this.apiUrl}/get_reports.php`).subscribe({
      next: (data) => {
        // Parse JSON strings in detection_data if necessary
        this.reports = data.map(r => {
          if (typeof r.detection_data === 'string') {
            try { r.detection_data = JSON.parse(r.detection_data); } catch (e) { }
          }
          return r;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        if (this.map) {
          this.updateMapMarkers();
        }
      },
      error: (e) => console.error("Could not fetch reports", e)
    });
  }

  updateStatus(reportId: any, status: string) {
    this.http.post<any>(`${this.apiUrl}/update_report_status.php`, {
      report_id: reportId,
      status: status
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.getReports(); // Refresh
        } else {
          alert("Error: " + res.error);
        }
      },
      error: (e) => console.error("Update failed", e)
    });
  }

  updateMapMarkers() {
    this.markers.clearLayers();

    if (!this.reports || this.reports.length === 0) return;

    let bounds = L.latLngBounds([]);

    this.reports.forEach(r => {
      let lat = parseFloat(r.latitude);
      let lng = parseFloat(r.longitude);

      let marker = L.marker([lat, lng], { icon: this.wasteIcon });

      let popupContent = `<b>Report #${r.id}</b><br>User: ${r.username}<br>Status: ${r.status}`;

      // Format image path correctly for localhost:8000
      if (r.image_path) {
        let imgUrl = r.image_path.replace('../', '');
        popupContent += `<br><img src="http://localhost:8000/${imgUrl}" style="width:100px; margin-top:5px;">`;
      }

      marker.bindPopup(popupContent);
      this.markers.addLayer(marker);
      bounds.extend([lat, lng]);

      // Trigger notifications for new pending reports
      if (r.status === 'pending' && !this.notifiedReportIds.has(r.id.toString())) {
        this.notifiedReportIds.add(r.id.toString());

        let nearestTruck: any = null;
        let minDistance = Infinity;

        this.fleet.forEach(t => {
          let dist = this.getDistance(lat, lng, t.lat, t.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestTruck = t;
          }
        });

        if (nearestTruck) {
          // Determine representation text
          let detText = "Waste";
          let detectionData: any = {};
          try {
            detectionData = typeof r.detection_data === 'string' ? JSON.parse(r.detection_data) : r.detection_data;
          } catch (e) { }

          if (detectionData?.bounding_boxes?.length > 0) {
            detText = detectionData.bounding_boxes.map((d: any) => d.class).join(', ');
          }

          this.addNotification(r.id, detText, lat, lng, nearestTruck.id, minDistance);
        }
      }
    });

    // Unsupervised ML Hotspot Clustering
    const CLUSTER_RADIUS_KM = 0.05;
    const MIN_POINTS = 3;

    let visited = new Set<number>();
    let clusters: number[][] = [];

    this.reports.forEach((r, i) => {
      if (visited.has(i)) return;
      visited.add(i);
      let neighbors: number[] = [];
      this.reports.forEach((n, j) => {
        if (i === j) return;
        if (this.getDistance(parseFloat(r.latitude), parseFloat(r.longitude), parseFloat(n.latitude), parseFloat(n.longitude)) <= CLUSTER_RADIUS_KM) {
          neighbors.push(j);
        }
      });

      if (neighbors.length + 1 >= MIN_POINTS) {
        let newCluster = [i, ...neighbors];
        neighbors.forEach(n => visited.add(n));
        clusters.push(newCluster);
      }
    });

    clusters.forEach((clusterIndices, idx) => {
      let sumLat = 0, sumLng = 0;
      clusterIndices.forEach(i => {
        sumLat += parseFloat(this.reports[i].latitude);
        sumLng += parseFloat(this.reports[i].longitude);
      });
      const centerLat = sumLat / clusterIndices.length;
      const centerLng = sumLng / clusterIndices.length;

      const circle = L.circle([centerLat, centerLng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: 80
      });

      circle.bindPopup(`
            <div style="text-align:center;">
                <b style="color:red; font-size:1.1rem;">⚠️ Waste Hotspot Detected</b><br>
                ${clusterIndices.length} reports in this area.<br>
                <small>ML Cluster #${idx + 1}</small>
            </div>
        `);
      this.markers.addLayer(circle);
    });

    // We do not fit bounds if we have the user location, otherwise it jumps around
    if (!this.staffMarker && this.markers.getLayers().length > 0) {
      this.map.fitBounds(bounds);
    }
  }

  addNotification(reportId: string, detectionText: string, lat: number, lng: number, truckId: string, distance: number) {
    const id = ++this.notifCounter;
    this.activeNotifications.push({
      id, reportId, detectionText, lat, lng, truckId, distance, fadeOut: false
    });

    // Auto remove after 10 seconds
    setTimeout(() => {
      this.triggerFadeOut(id);
    }, 10000);
  }

  triggerFadeOut(id: number) {
    const notif = this.activeNotifications.find(n => n.id === id);
    if (notif) {
      notif.fadeOut = true;
      setTimeout(() => this.removeNotification(id), 500);
    }
  }

  removeNotification(id: number) {
    this.activeNotifications = this.activeNotifications.filter(n => n.id !== id);
  }
}
