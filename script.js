document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('otifForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const nomPrenom = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        
        // Récupérer les domaines d'activité sélectionnés
        const domaines = [];
        form.querySelectorAll('input[name="field"]:checked').forEach(checkbox => {
            if (checkbox.id === 'otherField' && document.getElementById('otherFieldText').value) {
                domaines.push(document.getElementById('otherFieldText').value);
            } else {
                const label = checkbox.parentElement.querySelector('label');
                if (label && label.textContent) {
                    domaines.push(label.textContent.trim());
                }
            }
        });
        
        // Récupérer les intérêts sélectionnés
        const interets = [];
        form.querySelectorAll('input[name="interests"]:checked').forEach(checkbox => {
            if (checkbox.id === 'otherInterest' && document.getElementById('otherInterestText').value) {
                interets.push(document.getElementById('otherInterestText').value);
            } else {
                const label = checkbox.parentElement.querySelector('label');
                if (label && label.textContent) {
                    interets.push(label.textContent.trim());
                }
            }
        });
        
        // Récupérer les préférences de notification
        const notifications = [];
        form.querySelectorAll('input[name="notifications"]:checked').forEach(checkbox => {
            const label = checkbox.parentElement.querySelector('label');
            if (label && label.textContent) {
                notifications.push(label.textContent.trim());
            }
        });
        
        // Créer l'objet de données
        const donnees = {
            nomPrenom,
            contact,
            domaines,
            interets,
            notifications
        };
        
        console.log('Données envoyées:', donnees);
        
        // Afficher un indicateur de chargement
        const boutonEnvoyer = form.querySelector('button[type="submit"]');
        const texteOriginal = boutonEnvoyer.innerHTML;
        boutonEnvoyer.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Envoi...';
        boutonEnvoyer.disabled = true;
        

        fetch('https://api.printpolaroids.ci/api/feedback/otif', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(donnees)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }
            return response.json();
        })
        .then(data => {
            // Afficher un message de succès
            form.innerHTML = `
                <div class="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 class="text-2xl font-bold text-otifRed mb-2">Merci pour votre réponse!</h2>
                    <p class="text-gray-600 mb-4">Votre formulaire a été soumis avec succès.</p>
                    <a href="index.html" class="inline-block px-6 py-2 bg-otifRed text-white rounded-md hover:bg-[#7a0f0d] transition-colors">Retour à l'accueil</a>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erreur:', error);
            // Réactiver le bouton et afficher un message d'erreur
            boutonEnvoyer.innerHTML = texteOriginal;
            boutonEnvoyer.disabled = false;
            
            const messageErreur = document.createElement('div');
            messageErreur.className = 'mt-4 p-3 bg-red-100 text-red-700 rounded-md';
            messageErreur.textContent = 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.';
            
            form.appendChild(messageErreur);
            
            // Supprimer le message d'erreur après 5 secondes
            setTimeout(() => {
                messageErreur.remove();
            }, 5000);
        });
        
    });
    
    // Afficher/masquer les champs "autres"
    document.getElementById('otherField').addEventListener('change', function() {
        document.getElementById('otherFieldContainer').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('otherInterest').addEventListener('change', function() {
        document.getElementById('otherInterestContainer').style.display = this.checked ? 'block' : 'none';
    });
}); 