/* ============================================
   Paws & Found — App Scripts
   Everything in one file. Each section guards
   itself, so it's safe to include this on every
   page even if that page doesn't use a section.

   1. Shared local storage helper   (PawsData)
   2. Pet detail panel show/hide    (lost_pets.html, found_pets.html)
   3. Render saved reports as cards (lost_pets.html, found_pets.html)
   4. Report form validation + save (report_form.html)
   ============================================ */

/* ---------- 1. Shared Local Storage Helper ---------- */
window.PawsData = (function () {
    const STORAGE_KEY = 'pawsAndFoundReports';

    function getReports() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error('Could not read saved pet reports:', err);
            return [];
        }
    }

    function getReportsByType(type) {
        return getReports().filter((report) => report.type === type);
    }

    function addReport(report) {
        const reports = getReports();
        reports.push(report);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        } catch (err) {
            console.error('Could not save the pet report:', err);
        }
        return reports;
    }

const VOLUNTEER_KEY = 'pawsAndFoundVolunteers';

    function getVolunteers() {
        try {
            const raw = localStorage.getItem(VOLUNTEER_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error('Could not read saved volunteers:', err);
            return [];
        }
    }

    function addVolunteer(volunteer) {
        const volunteers = getVolunteers();
        volunteers.push(volunteer);
        try {
            localStorage.setItem(VOLUNTEER_KEY, JSON.stringify(volunteers));
        } catch (err) {
            console.error('Could not save volunteer signup:', err);
        }
        return volunteers;
    }

    return { getReports, getReportsByType, addReport, getVolunteers, addVolunteer };})();


/* ---------- 2. Pet Detail Panel Show/Hide ---------- */
function showPet(petId) {
    const panel = document.getElementById(`detail-${petId}`);
    if (!panel) return;

    const isAlreadyOpen = panel.classList.contains('active');

    document.querySelectorAll('.pet-detail-panel.active').forEach((openPanel) => {
        openPanel.classList.remove('active');
    });

    if (isAlreadyOpen) return;

    panel.classList.add('active');
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeDetail(petId) {
    const panel = document.getElementById(`detail-${petId}`);
    if (panel) {
        panel.classList.remove('active');
    }
}

document.addEventListener('click', (event) => {
    if (event.target.closest('.pet-card')) return;
    if (event.target.closest('.pet-detail-panel')) return;

    document.querySelectorAll('.pet-detail-panel.active').forEach((panel) => {
        panel.classList.remove('active');
    });
});

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


/* ---------- 3. Render Saved Reports as Cards/Panels ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.dataset.petType; // "lost" or "found"
    const cardsRow = document.getElementById('petCardsRow');
    const panelsSection = document.getElementById('petDetailPanels');

    if (!pageType || !cardsRow || !panelsSection) return;

    const reports = window.PawsData.getReportsByType(pageType);
    if (reports.length === 0) return;

    const SPECIES_INFO = {
        dog: { emoji: '🐕', label: 'Dog', badgeClass: 'dog' },
        cat: { emoji: '🐈', label: 'Cat', badgeClass: 'cat' },
        bird: { emoji: '🐦', label: 'Bird', badgeClass: 'other' },
        rabbit: { emoji: '🐇', label: 'Rabbit', badgeClass: 'other' },
        hamster: { emoji: '🐹', label: 'Hamster', badgeClass: 'other' },
        other: { emoji: '🐾', label: 'Other', badgeClass: 'other' },
    };

    const PLACEHOLDER_PHOTO =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
            '<rect width="100%" height="100%" fill="#E8E2DC"/>' +
            '<text x="50%" y="50%" font-size="60" text-anchor="middle" dominant-baseline="middle">🐾</text>' +
            '</svg>'
        );

    function escapeHTML(value) {
        const div = document.createElement('div');
        div.textContent = value == null ? '' : value;
        return div.innerHTML;
    }

    function formatDate(isoDate) {
        if (!isoDate) return 'an unknown date';
        const parsed = new Date(isoDate + 'T00:00:00');
        return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    reports.forEach((report) => {
        const species = SPECIES_INFO[report.species] || SPECIES_INFO.other;
        const photo = report.photo || PLACEHOLDER_PHOTO;
        const niceDate = formatDate(report.date);
        const verb = pageType === 'lost' ? 'Lost' : 'Found';
        const shortBreed =
            report.breed.length > 45 ? report.breed.slice(0, 45) + '…' : report.breed;

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'col-md-4 col-sm-6';
        cardWrapper.innerHTML = `
            <div class="pet-card" onclick="showPet('${report.id}')">
                <img src="${photo}" class="pet-card-img" alt="${escapeHTML(report.name)}">
                <div class="pet-card-body">
                    <span class="pet-badge ${species.badgeClass}">${species.emoji} ${species.label}</span>
                    <h5>${escapeHTML(report.name)}</h5>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${escapeHTML(report.location)}</p>
                    <p class="text-muted small">${escapeHTML(shortBreed)} • ${verb} ${niceDate}</p>
                    <button class="btn-view">View Details →</button>
                </div>
            </div>
        `;
        cardsRow.appendChild(cardWrapper);

        const panel = document.createElement('div');
        panel.className = 'pet-detail-panel';
        panel.id = `detail-${report.id}`;
        panel.innerHTML = `
            <button class="close-btn" onclick="closeDetail('${report.id}')">&times;</button>
            <div class="row g-4">
                <div class="col-lg-7">
                    <h2 class="pet-name">${escapeHTML(report.name)}</h2>
                    <span class="status-badge ${pageType}">${species.emoji} ${verb}</span>
                    <p class="text-muted small mt-2">Reported: ${niceDate}</p>
                    <div class="mt-3">
                        <div class="detail-item">
                            <span class="label">Species</span>
                            <span class="value">${species.label}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Location</span>
                            <span class="value">${escapeHTML(report.location)}</span>
                        </div>
                    </div>
                    <div class="mt-3">
                        <p><strong>Description:</strong> ${escapeHTML(report.breed)}${
            report.additionalInfo ? ' ' + escapeHTML(report.additionalInfo) : ''
        }</p>
                    </div>
                    <div class="contact-box mt-3">
                        <h5><i class="fas fa-phone-alt"></i> Contact</h5>
                        <div class="contact-item"><i class="fas fa-user"></i> ${escapeHTML(report.contactName)}</div>
                        <div class="contact-item"><i class="fas fa-envelope"></i> ${escapeHTML(report.contactEmail)}</div>
                        ${
                            report.contactPhone
                                ? `<div class="contact-item"><i class="fas fa-phone"></i> ${escapeHTML(report.contactPhone)}</div>`
                                : ''
                        }
                        <a href="report_form.html" class="btn-sighting mt-2">
                            <i class="fas fa-eye"></i> I've Seen This Pet
                        </a>
                    </div>
                </div>
            </div>
        `;
        panelsSection.appendChild(panel);
    });
});


/* ---------- 4. Report Form Validation + Save ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reportForm');
    if (!form) return; // only runs on report_form.html

    const successMessage = document.getElementById('successMessage');

    const dateField = document.getElementById('date');
    if (dateField) {
        dateField.max = new Date().toISOString().split('T')[0];
    }

    const fields = Array.from(form.querySelectorAll('.form-control, .form-select'));

    function validateField(field) {
        const isValid = field.checkValidity();
        const hasValue = field.value.trim() !== '';

        field.classList.toggle('is-invalid', !isValid);
        field.classList.toggle('is-valid', isValid && hasValue);

        return isValid;
    }

    fields.forEach((field) => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('change', () => validateField(field));
    });

    function buildReport(photoDataUrl) {
        return {
            id: 'rpt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            type: document.getElementById('reportType').value,
            name: document.getElementById('petName').value.trim(),
            species: document.getElementById('species').value,
            breed: document.getElementById('breed').value.trim(),
            location: document.getElementById('location').value.trim(),
            date: document.getElementById('date').value,
            contactName: document.getElementById('contactName').value.trim(),
            contactEmail: document.getElementById('contactEmail').value.trim(),
            contactPhone: document.getElementById('contactPhone').value.trim(),
            additionalInfo: document.getElementById('additionalInfo').value.trim(),
            photo: photoDataUrl || null,
        };
    }

    function saveAndShowSuccess(photoDataUrl) {
        const report = buildReport(photoDataUrl);
        window.PawsData.addReport(report);

        form.style.display = 'none';
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let firstInvalidField = null;
        let allValid = true;

        fields.forEach((field) => {
            const isValid = validateField(field);
            if (!isValid) {
                allValid = false;
                if (!firstInvalidField) firstInvalidField = field;
            }
        });

        if (!allValid) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const photoFile = document.getElementById('petPhoto').files[0];

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = () => saveAndShowSuccess(reader.result);
            reader.onerror = () => saveAndShowSuccess(null);
            reader.readAsDataURL(photoFile);
        } else {
            saveAndShowSuccess(null);
        }
    });
});
const VOLUNTEER_KEY = 'pawsAndFoundVolunteers';

    function getVolunteers() {
        try {
            const raw = localStorage.getItem(VOLUNTEER_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.error('Could not read saved volunteers:', err);
            return [];
        }
    }

    function addVolunteer(volunteer) {
        const volunteers = getVolunteers();
        volunteers.push(volunteer);
        try {
            localStorage.setItem(VOLUNTEER_KEY, JSON.stringify(volunteers));
        } catch (err) {
            console.error('Could not save volunteer signup:', err);
        }
        return volunteers;
    }

    return { getReports, getReportsByType, addReport, getVolunteers, addVolunteer };