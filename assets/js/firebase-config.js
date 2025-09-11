<!-- firebase-config.js -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script>
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAK3U35fipoWOOIJg0yrtgmVfQ7XQxZxqY",
        authDomain: "aprovamaispb-d4e75.firebaseapp.com",
        projectId: "aprovamaispb-d4e75",
        storageBucket: "aprovamaispb-d4e75.firebasestorage.app",
        messagingSenderId: "828577018900",
        appId: "1:828577018900:web:473d8c3fc2685d3f192301"
    };

    // Inicializar Firebase
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Referência para Firestore
    const db = firebase.firestore();
    
    // Exportar para uso global
    window.db = db;
    window.firebaseApp = firebase;
</script>
