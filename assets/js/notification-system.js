<!-- notification-system.js -->
    // Sistema de Notificações
    class NotificationSystem {
        constructor() {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
        
        show(message, type = 'info', title = '', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icon = this.getIcon(type);
            
            notification.innerHTML = `
                <div class="notification-icon">${icon}</div>
                <div class="notification-content">
                    ${title ? `<div class="notification-title">${title}</div>` : ''}
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">&times;</button>
            `;
            
            this.container.appendChild(notification);
            
            // Fechar ao clicar no botão
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => this.remove(notification));
            
            // Remover automaticamente após o tempo especificado
            if (duration > 0) {
                setTimeout(() => this.remove(notification), duration);
            }
            
            return notification;
        }
        
        getIcon(type) {
            const icons = {
                success: '✓',
                error: '⚠️',
                warning: '⚠️',
                info: 'ℹ️'
            };
            return icons[type] || 'ℹ️';
        }
        
        remove(notification) {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        success(message, title = 'Sucesso', duration = 5000) {
            return this.show(message, 'success', title, duration);
        }
        
        error(message, title = 'Erro', duration = 5000) {
            return this.show(message, 'error', title, duration);
        }
        
        warning(message, title = 'Aviso', duration = 5000) {
            return this.show(message, 'warning', title, duration);
        }
        
        info(message, title = 'Informação', duration = 5000) {
            return this.show(message, 'info', title, duration);
        }
    }
    
    // Inicializar sistema de notificações
    const notifications = new NotificationSystem();
    
    // Função para mostrar loading
    function showLoading(message = 'Processando...') {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'global-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        loadingDiv.innerHTML = `
            <div style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
            ">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #1a2a6c;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                "></div>
                <p>${message}</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(loadingDiv);
        return loadingDiv;
    }
    
    function hideLoading() {
        const loadingDiv = document.getElementById('global-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // Adicionar às variáveis globais
    window.notifications = notifications;
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
