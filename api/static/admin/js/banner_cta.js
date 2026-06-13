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

        // AJAX submit for Call to Action
        const saveCtaBtn = document.getElementById('save-cta-btn');
        if (saveCtaBtn) {
            saveCtaBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const csrfInput = document.getElementById('cta-csrf') || document.querySelector('input[name="csrfmiddlewaretoken"]');
                if (!csrfInput) {
                    alert("CSRF Token not found!");
                    return;
                }
                const csrfToken = csrfInput.value;
                const buttonTextVal = document.querySelector('input[name="button_text"]').value;
                const buttonLinkVal = document.querySelector('input[name="button_link"]').value;
                
                const selectedCbs = [];
                document.querySelectorAll('input[name="internal_link_page"]:checked').forEach(cb => {
                    selectedCbs.push(cb.value);
                });
                
                const formData = new URLSearchParams();
                formData.append('save_cta', '1');
                formData.append('csrfmiddlewaretoken', csrfToken);
                formData.append('button_text', buttonTextVal);
                formData.append('button_link', buttonLinkVal);
                selectedCbs.forEach(val => {
                    formData.append('internal_link_page', val);
                });
                
                fetch(window.location.pathname + window.location.search, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrfToken
                    },
                    body: formData.toString()
                })
                .then(response => {
                    if (response.ok) {
                        alert("Call to Action settings saved successfully.");
                        window.location.reload();
                    } else {
                        alert("Error saving Call to Action settings.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Error saving Call to Action settings.");
                });
            });
        }
    });
})();
