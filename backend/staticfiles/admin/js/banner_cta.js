(function() {
    'use strict';
    window.addEventListener('load', function() {
        const checkboxes = document.querySelectorAll('input[name="internal_link_page"]');
        const buttonLinkInput = document.querySelector('input[name="button_link"]');
        
        if (!buttonLinkInput) return;

        function updateCheckboxes() {
            const currentVal = buttonLinkInput.value.trim();
            checkboxes.forEach(cb => {
                cb.checked = (cb.value === currentVal);
            });
        }

        checkboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    // Uncheck all other checkboxes
                    checkboxes.forEach(other => {
                        if (other !== this) other.checked = false;
                    });
                    // Set button_link value
                    buttonLinkInput.value = this.value;
                } else {
                    // If unchecked, and it matches the current button_link, clear it
                    if (buttonLinkInput.value === this.value) {
                        buttonLinkInput.value = '';
                    }
                }
            });
        });

        // Sync initial state
        updateCheckboxes();

        // Listen for manual inputs on button_link to sync checkboxes
        buttonLinkInput.addEventListener('input', updateCheckboxes);
        buttonLinkInput.addEventListener('change', updateCheckboxes);
    });
})();
