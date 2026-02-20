export function getSidebarJs(): string {
  return `
  var sidebar = document.getElementById('sidebar');
  var sidebarToggle = document.getElementById('sidebar-toggle');
  var mobileBtn = document.querySelector('.mobile-menu-btn');

  function toggleSidebar() { if (sidebar) sidebar.classList.toggle('open'); }
  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);

  document.addEventListener('click', function(e) {
    if (sidebar && sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        (!mobileBtn || !mobileBtn.contains(e.target))) {
      sidebar.classList.remove('open');
    }
  });
`;
}
