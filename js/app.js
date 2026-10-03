// ==========================================
// Pure Validation Functions (Autograder Safe)
// ==========================================

function isValidStudentNumber(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return /^\d{2}-\d{4}-\d{3}$/.test(trimmed);
}

function isValidPassword(value) {
    if (typeof value !== 'string') return false;
    // At least 8 chars, 1 uppercase, 1 digit, 1 of @$!, no whitespace
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!])\S{8,}$/.test(value);
}

// Export for CommonJS (Node.js autograder compatibility)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isValidStudentNumber, isValidPassword };
}

// ==========================================
// DOM Interaction (Guarded for Browser)
// ==========================================

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('registrationForm');
        const fullName = document.getElementById('fullName');
        const studentNumber = document.getElementById('studentNumber');
        const email = document.getElementById('email');
        const mobileNumber = document.getElementById('mobileNumber');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const course = document.getElementById('course');
        const terms = document.getElementById('terms');

        const passwordFeedback = document.getElementById('passwordFeedback');
        const successMessage = document.getElementById('successMessage');
        const registrationSummary = document.getElementById('registrationSummary');

        // Helper: Show Error
        function showError(inputElement, errorId, message) {
            const errorElement = document.getElementById(errorId);
            inputElement.setAttribute('aria-invalid', 'true');
            errorElement.textContent = message;
        }

        // Helper: Clear Error
        function clearError(inputElement, errorId) {
            const errorElement = document.getElementById(errorId);
            inputElement.setAttribute('aria-invalid', 'false');
            errorElement.textContent = '';
        }

        // Helper: Clear All Errors
        function clearAllErrors() {
            const inputs = [fullName, studentNumber, email, mobileNumber, password, confirmPassword, course, terms];
            const errorIds = [
                'fullNameError', 'studentNumberError', 'emailError', 'mobileNumberError',
                'passwordError', 'confirmPasswordError', 'courseError', 'termsError'
            ];
            inputs.forEach((input, index) => {
                clearError(input, errorIds[index]);
            });
        }

        // 1. Password Input Feedback
        password.addEventListener('input', () => {
            const val = password.value;
            if (val.length === 0) {
                passwordFeedback.textContent = '';
                return;
            }

            const hasUpper = /[A-Z]/.test(val);
            const hasDigit = /\d/.test(val);
            const hasSymbol = /[@$!]/.test(val);
            const noSpace = /^\S+$/.test(val);
            const isLongEnough = val.length >= 8;

            let messages = [];
            if (!isLongEnough) messages.push("at least 8 characters");
            if (!hasUpper) messages.push("one uppercase letter");
            if (!hasDigit) messages.push("one digit");
            if (!hasSymbol) messages.push("one of @, $, or !");
            if (!noSpace) messages.push("no whitespace");

            if (messages.length === 0) {
                passwordFeedback.textContent = "Password meets all requirements.";
                passwordFeedback.style.color = "green";
            } else {
                passwordFeedback.textContent = "Password must contain: " + messages.join(", ") + ".";
                passwordFeedback.style.color = "#e74c3c";
            }
        });

        // 2. Full Name Blur Validation
        fullName.addEventListener('blur', () => {
            const val = fullName.value.trim();
            if (val.length < 2) {
                showError(fullName, 'fullNameError', 'Full name is required and must be at least two characters.');
            } else {
                clearError(fullName, 'fullNameError');
            }
        });

        // 3. Course and Terms Change Validation
        course.addEventListener('change', () => {
            if (course.value === 'BSIT' || course.value === 'BSCS') {
                clearError(course, 'courseError');
            }
        });

        terms.addEventListener('change', () => {
            if (terms.checked) {
                clearError(terms, 'termsError');
            }
        });

        // 4. Form Submission
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            clearAllErrors();
            let isValid = true;

            // Full Name
            const nameVal = fullName.value.trim();
            if (nameVal.length < 2) {
                showError(fullName, 'fullNameError', 'Full name is required and must be at least two characters.');
                isValid = false;
            }

            // Student Number
            const studentNumVal = studentNumber.value.trim();
            if (!isValidStudentNumber(studentNumVal)) {
                showError(studentNumber, 'studentNumberError', 'Enter a student number in the format 24-1234-123.');
                isValid = false;
            }

            // Email
            const emailVal = email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                showError(email, 'emailError', 'Enter a valid email address (e.g., text@domain.com).');
                isValid = false;
            }

            // Mobile Number
            const mobileVal = mobileNumber.value.trim();
            const mobileRegex = /^(09\d{9}|\+639\d{9})$/;
            if (!mobileRegex.test(mobileVal)) {
                showError(mobileNumber, 'mobileNumberError', 'Enter a valid mobile number (09XXXXXXXXX or +639XXXXXXXXX) with no spaces or hyphens.');
                isValid = false;
            }

            // Password
            const passVal = password.value;
            if (!isValidPassword(passVal)) {
                showError(password, 'passwordError', 'Password must be at least 8 characters, contain 1 uppercase letter, 1 digit, and one of @, $, or !, with no spaces.');
                isValid = false;
            }

            // Confirm Password
            const confirmPassVal = confirmPassword.value;
            if (confirmPassVal !== passVal || confirmPassVal === '') {
                showError(confirmPassword, 'confirmPasswordError', 'Passwords do not match.');
                isValid = false;
            }

            // Course
            if (course.value !== 'BSIT' && course.value !== 'BSCS') {
                showError(course, 'courseError', 'Please select a valid course (BSIT or BSCS).');
                isValid = false;
            }

            // Terms
            if (!terms.checked) {
                showError(terms, 'termsError', 'You must agree to the terms and conditions.');
                isValid = false;
            }

            // Success State
            if (isValid) {
                successMessage.textContent = 'Registration details validated successfully!';
                successMessage.classList.remove('hidden');

                // Use textContent to safely display user input (No innerHTML)
                document.getElementById('summaryName').textContent = nameVal;
                document.getElementById('summaryStudentNumber').textContent = studentNumVal;
                document.getElementById('summaryEmail').textContent = emailVal;
                document.getElementById('summaryMobileNumber').textContent = mobileVal;
                document.getElementById('summaryCourse').textContent = course.value;

                registrationSummary.classList.remove('hidden');
            }
        });

        // 5. Form Reset
        form.addEventListener('reset', () => {
            // Use setTimeout to allow the native reset to clear input values first
            setTimeout(() => {
                clearAllErrors();
                passwordFeedback.textContent = '';
                successMessage.textContent = '';
                successMessage.classList.add('hidden');
                registrationSummary.classList.add('hidden');
            }, 0);
        });
    });
}