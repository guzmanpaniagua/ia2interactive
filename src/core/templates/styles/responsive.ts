export function getResponsiveStyles(): string {
  return `
/* ===== Responsive ===== */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 100%;
    max-width: 300px;
  }

  .sidebar.open { transform: translateX(0); }
  .sidebar-toggle { display: block; }
  .mobile-menu-btn { display: block; }

  .content { margin-left: 0; padding: 1.5rem 1rem; }
  .index-container { padding: 1rem; }

  .hero h1 { font-size: 1.8rem; }
  .chapter-title { font-size: 1.5rem; }
  .quiz-title { font-size: 1.5rem; }

  .drag-container { grid-template-columns: 1fr; }
  .chapter-nav { flex-direction: column; }
}

@media (max-width: 480px) {
  .tf-options { flex-direction: column; }
  .fill-input-group { flex-direction: column; }
  .chapter-actions { flex-direction: column; }
}
`;
}
