/* ============================================
   Paws & Found — Report Form Validation
   Validates the lost/found pet report form and
   shows the success message on a valid submit.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reportForm');
    if (!form) return; // only runs on report_form.html

    const successMessage = document.getElementById('successMessage');

    // A pet can't be reported lost/found in the future
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

    // Clear/flag a field's error the moment the user edits it,
    // rather than waiting for the next submit attempt
    fields.forEach((field) => {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('change', () => validateField(field));
    });

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

        // Everything checks out — swap the form for the success message
        form.style.display = 'none';
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});