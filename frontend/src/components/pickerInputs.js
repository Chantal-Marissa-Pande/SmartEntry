let initialized = false;

function openPicker(input) {
    if (!input || input.disabled || input.readOnly) return;
    if (typeof input.showPicker === "function") {
        try {
            input.showPicker();
        } catch (error) {
            input.focus();
        }
    } else {
        input.focus();
    }
}

export function initializePickerInputs() {
    if (initialized) return;
    initialized = true;

    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-picker-target]");
        if (button) {
            event.preventDefault();
            openPicker(document.getElementById(button.dataset.pickerTarget));
            return;
        }

        const input = event.target.closest('input[type="date"], input[type="time"], input[type="datetime-local"]');
        if (input) openPicker(input);
    });

    document.addEventListener("keydown", (event) => {
        const input = event.target.closest?.('input[type="date"], input[type="time"], input[type="datetime-local"]');
        if (input && event.altKey && event.key === "ArrowDown") {
            event.preventDefault();
            openPicker(input);
        }
    });
}
