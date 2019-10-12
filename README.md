# Tutorial Initializare Proiect

-   Clonare repository
-   Creare Cont firebase
-   Logare Firebase -> Settings (stanga sus, rotita) -> Project Settings -> Add app (Web) -> Puteti sa ii puneti orice nume, next, cand apare codul cu "Add Firebase SDK", trebuie sa copiati de acolo doar variabila firebaseConfig, pe care o copiati in /src/main.js
-   Firebase -> Database -> Selectare de sus "Cloud Firestore", nu "Real Time Database", daca va intreaba de rules, puteti sa ii dati read, write oricui. Trebuie sa va faceti voi manual din Firestore colectiile "contests" si "users", nu trebuie sa aiba niciun document, se realizeaza automat din aplicatie
-   Firebase -> Authentification -> Sign-In Method -> Enable la Google si Email/ Password
-   Instalare pe pc nodeJS si yarn (cautati pe google)
-   Din terminal in folderul principal al proiectului, rulati "yarn" pentru instalare dependencies, trebuie decat o singura data la inceput, apoi pentru rularea serverului -> "yarn serve", dupa ce se initializeaza o sa va apara adresa in terminal. Warnings-urile nu sunt o problema.

# Prezentare proiect

-   Fisierele aplicatiei se afla in folderul /src

### Structura foldere:

-   /views —> Paginile efective ale aplicatiei
-   /components —> Module ale aplicatiei, folosite in alte pagini sau in alte componente
-   /store —> Locul unde se salveaza datele de care avem nevoie pe mai multe pagini (userul autentificat, contesturile disponibile)

# Resurse VueJS / Vuex

-   [VueJS Course01](https://www.youtube.com/watch?v=Wy9q22isx3U) -> Vue este un framework pentru JavaScript, ce ofera functionalitati noi si un mod de lucru mai simplu
-   [VueJS Course02](https://www.youtube.com/watch?v=4deVCNJq3qc&t=9208s)
-   [VueJS Official Documentation](https://vuejs.org/v2/guide/) -> Spre deosebire de multe documentatiilor de pe net, asta chiar e facuta bine
-   [Vuex](https://www.youtube.com/watch?v=5lVQgZzLMHc&t=2029s) -> Vuex este practic un fel de plugin pentru VueJS, care permite realizarea acelor fisiere din /store, pentru a putea folosi anumite variabile si functii in mai multe pagini(ex: vrem sa stim ce user este autentificat in toate paginile, nu are sens sa facem o functie identica getUser in fiecare pagina. Prin realizarea store/modules/auth.js, avem un Store pentru autentificare, unde avem toata logica de logare, inregistrare, ce o folosim pe toate paginile)
