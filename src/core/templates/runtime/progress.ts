export function getProgressJs(): string {
  return `
  var STORAGE_KEY = 'ia2i_progress';

  function getProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e) { return {}; }
  }

  function saveProgress(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function markChapterComplete(slug, sc, tot) {
    var progress = getProgress();
    var pct = tot > 0 ? Math.round((sc / tot) * 100) : 0;
    progress[slug] = { completed: true, score: pct, date: new Date().toISOString() };
    saveProgress(progress);
    updateAllProgress();
  }

  function updateAllProgress() {
    var progress = getProgress();
    document.querySelectorAll('.chapter-status').forEach(function(el) {
      var s = el.id.replace('status-', '');
      if (progress[s] && progress[s].completed) {
        var sc = progress[s].score;
        el.textContent = sc >= 80 ? '\\u2705' : sc >= 50 ? '\\ud83d\\udd36' : '\\u274c';
      }
    });
    var items = document.querySelectorAll('.sidebar-nav li[data-chapter]');
    if (items.length > 0) {
      var done = 0;
      items.forEach(function(li) {
        if (getProgress()[li.dataset.chapter] && getProgress()[li.dataset.chapter].completed) done++;
      });
      var t = items.length;
      var fill = document.getElementById('sidebar-progress-fill');
      var text = document.getElementById('sidebar-progress-text');
      if (fill) fill.style.width = (t > 0 ? Math.round((done / t) * 100) : 0) + '%';
      if (text) text.textContent = done + ' / ' + t + ' completados';
    }
  }

  updateAllProgress();
`;
}
