// Show pet detail panel
        function showPet(petId) {
            // Hide all panels
            document.querySelectorAll('.pet-detail-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Show the selected panel
            const panel = document.getElementById('detail-' + petId);
            if (panel) {
                panel.classList.add('active');
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Close pet detail panel
        function closeDetail(petId) {
            const panel = document.getElementById('detail-' + petId);
            if (panel) {
                panel.classList.remove('active');
            }
        }

        // Close panel when clicking outside (on the background)
        document.addEventListener('click', function(event) {
            // Check if click is on a pet card (which triggers showPet)
            if (event.target.closest('.pet-card')) {
                return; // Let the card's onclick handle it
            }
            
            // Check if click is inside a detail panel
            if (event.target.closest('.pet-detail-panel')) {
                return; // Don't close if clicking inside
            }
            
            // Close all panels when clicking elsewhere
            document.querySelectorAll('.pet-detail-panel').forEach(panel => {
                panel.classList.remove('active');
            });
        });