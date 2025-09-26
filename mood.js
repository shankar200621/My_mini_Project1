// Enhanced Mood Tracker
class MoodTracker {
  constructor() {
    this.selectedMood = null;
    this.selectedActivities = new Set();
    this.charts = {};
    this.entriesPerPage = 10;
    this.currentPage = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTodayEntry();
    this.updateAnalytics();
    this.loadEntries();
  }

  setupEventListeners() {
    // Mood selection
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectMood(e.currentTarget));
    });

    // Activity selection
    document.querySelectorAll('.activity-tag').forEach(tag => {
      tag.addEventListener('click', (e) => this.toggleActivity(e.currentTarget));
    });

    // Save mood
    document.getElementById('save-mood').addEventListener('click', () => this.saveMood());

    // Skip today
    document.getElementById('skip-today').addEventListener('click', () => this.skipToday());

    // Export data
    document.getElementById('export-data').addEventListener('click', () => this.exportData());

    // Clear data
    document.getElementById('clear-data').addEventListener('click', () => this.clearAllData());

    // Date filter
    document.getElementById('date-filter').addEventListener('change', () => this.loadEntries());

    // Load more
    document.getElementById('load-more').addEventListener('click', () => this.loadMoreEntries());
  }

  selectMood(button) {
    // Remove previous selection
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));

    // Add selection to clicked button
    button.classList.add('selected');
    this.selectedMood = {
      emoji: button.dataset.mood,
      value: parseInt(button.dataset.value),
      label: button.querySelector('.mood-label').textContent
    };

    // Enable save button
    document.getElementById('save-mood').disabled = false;
  }

  toggleActivity(tag) {
    const activity = tag.dataset.activity;

    if (this.selectedActivities.has(activity)) {
      this.selectedActivities.delete(activity);
      tag.classList.remove('selected');
    } else {
      this.selectedActivities.add(activity);
      tag.classList.add('selected');
    }
  }

  saveMood() {
    if (!this.selectedMood) {
      this.showNotification('Please select a mood first!', 'error');
      return;
    }

    const note = document.getElementById('mood-note').value.trim();
    const dateKey = this.getDateKey(new Date());

    const moodData = this.getMoodData();
    moodData[dateKey] = {
      mood: this.selectedMood.emoji,
      value: this.selectedMood.value,
      label: this.selectedMood.label,
      note: note,
      activities: Array.from(this.selectedActivities),
      timestamp: new Date().toISOString()
    };

    this.saveMoodData(moodData);
    this.showNotification('Mood saved successfully! 🎉', 'success');
    this.resetForm();
    this.loadTodayEntry();
    this.updateAnalytics();
    this.loadEntries();
  }

  skipToday() {
    const dateKey = this.getDateKey(new Date());
    const moodData = this.getMoodData();

    if (moodData[dateKey]) {
      this.showNotification('You already have an entry for today!', 'info');
      return;
    }

    moodData[dateKey] = {
      mood: '⏭️',
      value: null,
      label: 'Skipped',
      note: 'Day skipped',
      activities: [],
      timestamp: new Date().toISOString(),
      skipped: true
    };

    this.saveMoodData(moodData);
    this.showNotification('Day skipped', 'info');
    this.loadTodayEntry();
    this.updateAnalytics();
    this.loadEntries();
  }

  resetForm() {
    this.selectedMood = null;
    this.selectedActivities.clear();
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.activity-tag').forEach(tag => tag.classList.remove('selected'));
    document.getElementById('mood-note').value = '';
    document.getElementById('save-mood').disabled = true;
  }

  loadTodayEntry() {
    const dateKey = this.getDateKey(new Date());
    const moodData = this.getMoodData();
    const entry = moodData[dateKey];
    const todayDisplay = document.getElementById('today-display');

    if (entry) {
      todayDisplay.innerHTML = this.createEntryHTML(entry, true);
    } else {
      todayDisplay.innerHTML = `
        <div class="no-entry">
          <span class="no-entry-icon">📝</span>
          <p>No entry yet for today</p>
          <small>Track your mood to see it here</small>
        </div>
      `;
    }
  }

  createEntryHTML(entry, isToday = false) {
    const activitiesHTML = entry.activities.length > 0
      ? `<div class="entry-activities">${entry.activities.map(activity =>
        `<span class="activity-badge">${this.getActivityEmoji(activity)} ${activity}</span>`
      ).join('')}</div>`
      : '';

    return `
      <div class="entry-card">
        <div class="entry-mood">${entry.mood}</div>
        <div class="entry-note">${entry.note || 'No note added'}</div>
        ${activitiesHTML}
        ${isToday ? '<small>Today\'s entry</small>' : ''}
      </div>
    `;
  }

  getActivityEmoji(activity) {
    const emojis = {
      exercise: '🏃',
      work: '💼',
      social: '👥',
      hobby: '🎨',
      rest: '😴',
      nature: '🌿'
    };
    return emojis[activity] || '📝';
  }

  updateAnalytics() {
    this.updateWeeklyChart();
    this.updateMoodDistribution();
    this.updateWeeklySummary();
  }

  updateWeeklyChart() {
    const moodData = this.getMoodData();
    const labels = [];
    const values = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = this.getDateKey(date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      labels.push(dayName);

      if (moodData[dateKey] && moodData[dateKey].value !== null) {
        values.push(moodData[dateKey].value);
      } else {
        values.push(null);
      }
    }

    const ctx = document.getElementById('weekly-chart').getContext('2d');
    if (this.charts.weekly) this.charts.weekly.destroy();

    this.charts.weekly = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Mood Score',
          data: values,
          borderColor: '#4b7fa1',
          backgroundColor: 'rgba(75, 127, 161, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#4b7fa1',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              callback: function (value) {
                const moodMap = { 1: '😢', 2: '😔', 3: '😐', 4: '😌', 5: '😊' };
                return moodMap[value] || '';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  updateMoodDistribution() {
    const moodData = this.getMoodData();
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    Object.values(moodData).forEach(entry => {
      if (entry.value !== null) {
        distribution[entry.value]++;
      }
    });

    const ctx = document.getElementById('mood-distribution').getContext('2d');
    if (this.charts.distribution) this.charts.distribution.destroy();

    this.charts.distribution = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Struggling', 'Down', 'Okay', 'Good', 'Great'],
        datasets: [{
          data: Object.values(distribution),
          backgroundColor: [
            '#ef4444',
            '#f97316',
            '#eab308',
            '#22c55e',
            '#10b981'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  updateWeeklySummary() {
    const moodData = this.getMoodData();
    const weekData = this.getWeekData();

    // Calculate average mood
    const validEntries = weekData.filter(entry => entry.value !== null);
    const avgMood = validEntries.length > 0
      ? (validEntries.reduce((sum, entry) => sum + entry.value, 0) / validEntries.length).toFixed(1)
      : '--';

    // Calculate streak
    const streak = this.calculateStreak();

    document.getElementById('avg-mood').textContent = avgMood;
    document.getElementById('days-tracked').textContent = validEntries.length;
    document.getElementById('streak').textContent = streak;
  }

  getWeekData() {
    const moodData = this.getMoodData();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = this.getDateKey(date);
      if (moodData[dateKey]) {
        weekData.push(moodData[dateKey]);
      }
    }

    return weekData;
  }

  calculateStreak() {
    const moodData = this.getMoodData();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = this.getDateKey(date);

      if (moodData[dateKey]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  loadEntries() {
    const moodData = this.getMoodData();
    const filter = document.getElementById('date-filter').value;
    const entriesList = document.getElementById('entries-list');

    let filteredEntries = Object.entries(moodData)
      .filter(([dateKey, entry]) => {
        if (filter === 'all') return true;

        const entryDate = new Date(entry.timestamp);
        const now = new Date();

        switch (filter) {
          case 'week':
            return entryDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'month':
            return entryDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          case '3months':
            return entryDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      })
      .sort(([a], [b]) => b.localeCompare(a));

    this.currentPage = 0;
    this.displayEntries(filteredEntries);
  }

  displayEntries(entries) {
    const entriesList = document.getElementById('entries-list');
    const loadMoreBtn = document.getElementById('load-more');

    entriesList.innerHTML = '';

    const startIndex = this.currentPage * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    const pageEntries = entries.slice(startIndex, endIndex);

    if (pageEntries.length === 0) {
      entriesList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No entries found</p>';
      loadMoreBtn.style.display = 'none';
      return;
    }

    pageEntries.forEach(([dateKey, entry]) => {
      const entryElement = document.createElement('div');
      entryElement.className = 'entry-item';
      entryElement.innerHTML = `
        <div class="entry-date">${this.formatDate(dateKey)}</div>
        <div class="entry-mood-display">${entry.mood}</div>
        <div class="entry-note-display">${entry.note || 'No note'}</div>
        ${entry.activities.length > 0 ? `
          <div class="entry-activities-display">
            ${entry.activities.map(activity =>
        `<span class="activity-badge">${this.getActivityEmoji(activity)} ${activity}</span>`
      ).join('')}
          </div>
        ` : ''}
      `;
      entriesList.appendChild(entryElement);
    });

    loadMoreBtn.style.display = endIndex < entries.length ? 'block' : 'none';
  }

  loadMoreEntries() {
    this.currentPage++;
    const moodData = this.getMoodData();
    const filter = document.getElementById('date-filter').value;

    let filteredEntries = Object.entries(moodData)
      .filter(([dateKey, entry]) => {
        if (filter === 'all') return true;

        const entryDate = new Date(entry.timestamp);
        const now = new Date();

        switch (filter) {
          case 'week':
            return entryDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'month':
            return entryDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          case '3months':
            return entryDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      })
      .sort(([a], [b]) => b.localeCompare(a));

    const entriesList = document.getElementById('entries-list');
    const startIndex = this.currentPage * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    const pageEntries = entries.slice(startIndex, endIndex);

    pageEntries.forEach(([dateKey, entry]) => {
      const entryElement = document.createElement('div');
      entryElement.className = 'entry-item';
      entryElement.innerHTML = `
        <div class="entry-date">${this.formatDate(dateKey)}</div>
        <div class="entry-mood-display">${entry.mood}</div>
        <div class="entry-note-display">${entry.note || 'No note'}</div>
        ${entry.activities.length > 0 ? `
          <div class="entry-activities-display">
            ${entry.activities.map(activity =>
        `<span class="activity-badge">${this.getActivityEmoji(activity)} ${activity}</span>`
      ).join('')}
          </div>
        ` : ''}
      `;
      entriesList.appendChild(entryElement);
    });

    const loadMoreBtn = document.getElementById('load-more');
    loadMoreBtn.style.display = endIndex < entries.length ? 'block' : 'none';
  }

  exportData() {
    const moodData = this.getMoodData();
    const dataStr = JSON.stringify(moodData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `mood-data-${this.getDateKey(new Date())}.json`;
    link.click();

    this.showNotification('Data exported successfully! 📁', 'success');
  }

  clearAllData() {
    if (confirm('Are you sure you want to clear all mood data? This action cannot be undone.')) {
      localStorage.removeItem('moodData');
      this.loadTodayEntry();
      this.updateAnalytics();
      this.loadEntries();
      this.showNotification('All data cleared', 'info');
    }
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Utility functions
  getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDate(dateKey) {
    const date = new Date(dateKey);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getMoodData() {
    return JSON.parse(localStorage.getItem('moodData') || '{}');
  }

  saveMoodData(data) {
    localStorage.setItem('moodData', JSON.stringify(data));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MoodTracker();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);