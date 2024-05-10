// Auswahl der HTML-Elemente über ihre IDs und Klassen
const sign_in_btn = document.querySelector("#sign-in-btn"); // Anmelde-Button
const sign_up_btn = document.querySelector("#sign-up-btn"); // Registrierungs-Button
const container = document.querySelector(".container"); // Container für das Anmelde-/Registrierungsformular
const sign_in_btn2 = document.querySelector("#sign-in-btn2"); // Zusätzlicher Anmelde-Button
const sign_up_btn2 = document.querySelector("#sign-up-btn2"); // Zusätzlicher Registrierungs-Button

// Event Listener für den Klick auf den Registrierungs-Button
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode"); // Fügt dem Container die Klasse "sign-up-mode" hinzu
});

// Event Listener für den Klick auf den Anmelde-Button
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode"); // Entfernt die Klasse "sign-up-mode" vom Container
});

// Event Listener für den Klick auf den zusätzlichen Registrierungs-Button
sign_up_btn2.addEventListener("click", () => {
    container.classList.add("sign-up-mode2"); // Fügt dem Container die Klasse "sign-up-mode2" hinzu
});

// Event Listener für den Klick auf den zusätzlichen Anmelde-Button
sign_in_btn2.addEventListener("click", () => {
    container.classList.remove("sign-up-mode2"); // Entfernt die Klasse "sign-up-mode2" vom Container
});
