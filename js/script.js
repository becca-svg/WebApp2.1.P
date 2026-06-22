/* ============================================
   Paws & Found — Pet Detail Panel Interactions
   Powers the "View Details" cards on Lost Pets
   (and Found Pets, once it has the same markup).
   ============================================ */

function showPet(petId) {
    const panel = document.getElementById(`detail-${petId}`);
    if (!panel) return;

    const isAlreadyOpen = panel.classList.contains('active');

    // Only one detail panel open at a time — close any others first
    document.querySelectorAll('.pet-detail-panel.active').forEach((openPanel) => {
        openPanel.classList.remove('active');
    });

    // Clicking a card whose panel was already open just closes it
    if (isAlreadyOpen) return;

    panel.classList.add('active');

    // Bring the panel into view since it renders below the card grid
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeDetail(petId) {
    const panel = document.getElementById(`detail-${petId}`);
    if (panel) {
        panel.classList.remove('active');
    }
}

// Close any open panel when clicking outside it (but not when clicking
// a pet card or inside the panel itself — those are handled above)
document.addEventListener('click', (event) => {
    if (event.target.closest('.pet-card')) return;
    if (event.target.closest('.pet-detail-panel')) return;

    document.querySelectorAll('.pet-detail-panel.active').forEach((panel) => {
        panel.classList.remove('active');
    });
});

// Make the clickable pet cards usable from the keyboard too,
// since they're <div onclick="..."> rather than real buttons/links.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.pet-card[onclick]').forEach((card) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }
        });
    });
});