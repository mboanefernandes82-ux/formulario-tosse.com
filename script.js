/**
 * 40 RECEITAS CASEIRAS PARA AJUDAR A ALIVIAR A TOSSE
 * Aplicação Interativa do Formulário de Interesse e Funil de Conversão
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estrutura de Perguntas do Formulário
  const quizData = [
    {
      id: 1,
      type: 'text',
      question: 'Qual é o seu nome?',
      hint: 'Escreva como gostaria de ser chamado(a):',
      placeholder: 'Digite o seu primeiro nome...',
      key: 'userName'
    },
    {
      id: 2,
      type: 'single',
      question: 'Atualmente, você ou alguém da sua família está com tosse?',
      hint: 'Selecione a opção que melhor descreve o momento atual:',
      options: [
        { label: 'Sim', icon: '🤧' },
        { label: 'Não', icon: '😊' },
        { label: 'Às vezes', icon: '🌤️' }
      ],
      key: 'hasCough'
    },
    {
      id: 3,
      type: 'single',
      question: 'Há quanto tempo a tosse está presente?',
      hint: 'Escolha a duração aproximada dos sintomas:',
      options: [
        { label: 'Há poucos dias', icon: '⏳' },
        { label: 'Há uma semana', icon: '📅' },
        { label: 'Há mais de uma semana', icon: '🗓️' }
      ],
      key: 'coughDuration'
    },
    {
      id: 4,
      type: 'single',
      question: 'Que tipo de solução costuma procurar primeiro para aliviar a tosse?',
      hint: 'Qual costuma ser a sua primeira escolha em casa?',
      options: [
        { label: 'Chás e receitas caseiras', icon: '🍵' },
        { label: 'Medicamentos', icon: '💊' },
        { label: 'Ambos', icon: '🌿' },
        { label: 'Outros', icon: '✨' }
      ],
      key: 'solutionPreference'
    },
    {
      id: 5,
      type: 'single',
      question: 'Você já utilizou ingredientes naturais, como mel, limão, gengibre ou ervas, para cuidar de sintomas leves de tosse?',
      hint: 'Já tem alguma experiência com esses ingredientes?',
      options: [
        { label: 'Sim', icon: '🍯' },
        { label: 'Não', icon: '🍃' }
      ],
      key: 'usedNaturalIngredients'
    },
    {
      id: 6,
      type: 'single',
      question: 'Gostaria de ter várias receitas caseiras reunidas num único guia digital?',
      hint: 'Imagine ter tudo organizado e de fácil consulta no celular:',
      options: [
        { label: 'Sim, seria muito útil', icon: '⭐' },
        { label: 'Talvez', icon: '🤔' },
        { label: 'Não tenho interesse', icon: '✖️' }
      ],
      key: 'wantsOrganizedGuide'
    },
    {
      id: 7,
      type: 'multiple',
      question: 'O que mais gostaria de encontrar num ebook sobre receitas caseiras?',
      hint: 'Você pode escolher mais de uma opção:',
      options: [
        { label: 'Receitas simples e fáceis de preparar', icon: '⚡' },
        { label: 'Ingredientes acessíveis', icon: '🛒' },
        { label: 'Diferentes opções de chás e preparações', icon: '🫖' },
        { label: 'Orientações de utilização e cuidados', icon: '🛡️' }
      ],
      key: 'desiredFeatures'
    },
    {
      id: 8,
      type: 'single',
      question: 'Se existisse um ebook com 40 receitas caseiras organizadas num único lugar, teria interesse em conhecê-lo?',
      hint: 'Última pergunta para prepararmos o seu acesso:',
      options: [
        { label: 'Sim, quero conhecer', icon: '🚀' },
        { label: 'Talvez mais tarde', icon: '⏳' }
      ],
      key: 'finalInterest'
    }
  ];

  // Chave do LocalStorage
  const STORAGE_KEY = 'receitas_tosse_answers_v1';

  // Estado da Aplicação
  let currentStepIndex = 0;
  let answers = loadAnswers();

  // Elementos do DOM
  const quizCard = document.getElementById('quizCard');
  const progressArea = document.getElementById('progressArea');
  const stepCounter = document.getElementById('stepCounter');
  const stepPercent = document.getElementById('stepPercent');
  const progressFill = document.getElementById('progressFill');
  const quizStepViewport = document.getElementById('quizStepViewport');
  const quizFooterNav = document.getElementById('quizFooterNav');
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const resultScreen = document.getElementById('resultScreen');
  const resultGreeting = document.getElementById('resultGreeting');
  const btnRestart = document.getElementById('btnRestart');
  const finalCheckoutBtn = document.getElementById('finalCheckoutBtn');

  // Inicialização
  init();

  function init() {
    // Se o usuário já concluiu anteriormente, pode continuar de onde parou ou recomeçar
    renderCurrentStep();
    setupEventListeners();
  }

  // Carregar respostas salvas do LocalStorage
  function loadAnswers() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Não foi possível ler do localStorage:', e);
    }
    return {
      userName: '',
      hasCough: '',
      coughDuration: '',
      solutionPreference: '',
      usedNaturalIngredients: '',
      wantsOrganizedGuide: '',
      desiredFeatures: [],
      finalInterest: ''
    };
  }

  // Salvar respostas
  function saveAnswers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('Não foi possível salvar no localStorage:', e);
    }
  }

  // Renderizar o passo atual
  function renderCurrentStep() {
    // Se já passou do último passo, exibe tela de resultado
    if (currentStepIndex >= quizData.length) {
      showResultScreen();
      return;
    }

    const currentData = quizData[currentStepIndex];

    // Atualiza barra de progresso
    const currentNumber = currentStepIndex + 1;
    const totalSteps = quizData.length;
    const percentage = Math.round((currentNumber / totalSteps) * 100);

    stepCounter.textContent = `Pergunta ${currentNumber} de ${totalSteps}`;
    stepPercent.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    // Atualizar estado do botão Voltar
    if (currentStepIndex === 0) {
      btnBack.style.display = 'none';
    } else {
      btnBack.style.display = 'inline-flex';
    }

    // Configurar o botão Continuar
    btnNext.style.display = 'inline-flex';
    btnNext.innerHTML = `
      <span>${currentStepIndex === totalSteps - 1 ? 'Concluir e Ver Guia' : 'Continuar'}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;

    // Criar conteúdo da pergunta com animação
    const stepMarkup = createStepHtml(currentData);
    
    quizStepViewport.innerHTML = stepMarkup;
    const container = quizStepViewport.querySelector('.step-container');
    
    // Animação de entrada
    requestAnimationFrame(() => {
      container.classList.add('anim-fade-in');
    });

    // Focar no input caso seja texto
    if (currentData.type === 'text') {
      const inputEl = document.getElementById('nameInput');
      if (inputEl) {
        inputEl.focus();
        inputEl.addEventListener('input', (e) => {
          answers.userName = e.target.value;
          saveAnswers();
          hideInputError();
        });
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleNextClick();
          }
        });
      }
    }
  }

  // Gera o HTML do passo
  function createStepHtml(data) {
    let questionText = data.question;

    // Personalização sutil se o nome já foi preenchido
    if (data.id > 1 && answers.userName && answers.userName.trim().length > 0) {
      const firstName = answers.userName.trim().split(' ')[0];
      // Para perguntas 2 e 6, adiciona toque amigável
      if (data.id === 2) {
        questionText = `${firstName}, atualmente você ou alguém da sua família está com tosse?`;
      }
    }

    let inputHtml = '';

    if (data.type === 'text') {
      inputHtml = `
        <div class="input-name-group">
          <input 
            type="text" 
            id="nameInput" 
            class="input-name-field" 
            placeholder="${data.placeholder}" 
            value="${escapeHtml(answers.userName || '')}" 
            maxlength="50"
            autocomplete="given-name"
          >
          <div class="input-error-msg" id="nameError">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Por favor, digite seu nome para continuarmos.</span>
          </div>
        </div>
      `;
    } else if (data.type === 'single') {
      const currentSelected = answers[data.key] || '';
      inputHtml = `
        <div class="options-list" role="radiogroup" aria-label="${data.question}">
          ${data.options.map((opt, idx) => {
            const isSelected = currentSelected === opt.label;
            return `
              <button 
                type="button" 
                class="option-btn ${isSelected ? 'selected' : ''}" 
                data-type="single"
                data-value="${escapeHtml(opt.label)}"
                role="radio"
                aria-checked="${isSelected}"
              >
                <span class="option-text">
                  <span style="margin-right: 8px;">${opt.icon || '🌿'}</span>
                  ${opt.label}
                </span>
                <span class="option-indicator" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    } else if (data.type === 'multiple') {
      const selectedArray = Array.isArray(answers[data.key]) ? answers[data.key] : [];
      inputHtml = `
        <div class="options-list" role="group" aria-label="${data.question}">
          ${data.options.map((opt, idx) => {
            const isSelected = selectedArray.includes(opt.label);
            return `
              <button 
                type="button" 
                class="option-btn multi-option ${isSelected ? 'selected' : ''}" 
                data-type="multiple"
                data-value="${escapeHtml(opt.label)}"
                role="checkbox"
                aria-checked="${isSelected}"
              >
                <span class="option-text">
                  <span style="margin-right: 8px;">${opt.icon || '🌱'}</span>
                  ${opt.label}
                </span>
                <span class="option-indicator" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <div class="step-container">
        <span class="step-number-tag">Etapa ${data.id} de ${quizData.length}</span>
        <h2 class="step-question-title">${questionText}</h2>
        <p class="step-question-hint">${data.hint}</p>
        ${inputHtml}
      </div>
    `;
  }

  // Configuração dos Eventos
  function setupEventListeners() {
    // Delegação de cliques para botões de opção
    quizStepViewport.addEventListener('click', (e) => {
      const optionBtn = e.target.closest('.option-btn');
      if (!optionBtn) return;

      const type = optionBtn.getAttribute('data-type');
      const val = optionBtn.getAttribute('data-value');
      const currentData = quizData[currentStepIndex];

      if (type === 'single') {
        // Desmarcar todos e marcar o atual
        const allOptions = quizStepViewport.querySelectorAll('.option-btn');
        allOptions.forEach(btn => {
          btn.classList.remove('selected');
          btn.setAttribute('aria-checked', 'false');
        });

        optionBtn.classList.add('selected');
        optionBtn.setAttribute('aria-checked', 'true');
        optionBtn.classList.add('clicked-flash');

        answers[currentData.key] = val;
        saveAnswers();

        // Avanço suave automático com 260ms de delay para feedback visual
        setTimeout(() => {
          advanceStep();
        }, 260);

      } else if (type === 'multiple') {
        // Alternar seleção
        const isSelected = optionBtn.classList.contains('selected');
        let currentList = Array.isArray(answers[currentData.key]) ? [...answers[currentData.key]] : [];

        if (isSelected) {
          optionBtn.classList.remove('selected');
          optionBtn.setAttribute('aria-checked', 'false');
          currentList = currentList.filter(item => item !== val);
        } else {
          optionBtn.classList.add('selected');
          optionBtn.setAttribute('aria-checked', 'true');
          if (!currentList.includes(val)) {
            currentList.push(val);
          }
        }

        answers[currentData.key] = currentList;
        saveAnswers();
      }
    });

    // Botão Voltar
    btnBack.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        animateTransition(() => {
          currentStepIndex--;
          renderCurrentStep();
        });
      }
    });

    // Botão Continuar
    btnNext.addEventListener('click', () => {
      handleNextClick();
    });

    // Botão de Revisar / Recomeçar na tela final
    btnRestart.addEventListener('click', () => {
      animateTransition(() => {
        resultScreen.style.display = 'none';
        progressArea.style.display = 'block';
        quizStepViewport.style.display = 'flex';
        quizFooterNav.style.display = 'flex';
        currentStepIndex = 0;
        renderCurrentStep();
      });
    });

    // Tracking sutil no clique do checkout
    if (finalCheckoutBtn) {
      finalCheckoutBtn.addEventListener('click', () => {
        try {
          // Registrar intenção de compra
          localStorage.setItem('checkout_clicked_timestamp', new Date().toISOString());
        } catch (e) {}
      });
    }
  }

  // Tratamento do clique no botão Continuar com Validação
  function handleNextClick() {
    const currentData = quizData[currentStepIndex];

    // Validação da pergunta 1 (Nome)
    if (currentData.type === 'text') {
      const nameInput = document.getElementById('nameInput');
      const enteredName = nameInput ? nameInput.value.trim() : '';

      if (enteredName.length === 0) {
        showInputError('Por favor, escreva o seu nome para continuarmos.');
        if (nameInput) nameInput.focus();
        return;
      }

      answers.userName = enteredName;
      saveAnswers();
    }

    // Validação de seleção única se nenhuma opção foi marcada
    if (currentData.type === 'single') {
      if (!answers[currentData.key]) {
        shakeViewport();
        return;
      }
    }

    // Validação de múltipla escolha: requer pelo menos 1 item selecionado
    if (currentData.type === 'multiple') {
      const selected = answers[currentData.key];
      if (!selected || selected.length === 0) {
        shakeViewport();
        return;
      }
    }

    advanceStep();
  }

  // Avançar passo com transição
  function advanceStep() {
    animateTransition(() => {
      currentStepIndex++;
      renderCurrentStep();
      // Scroll suave para o topo do quiz card se estiver em mobile
      if (window.innerWidth < 768) {
        quizCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Animação de transição suave entre perguntas
  function animateTransition(callback) {
    const container = quizStepViewport.querySelector('.step-container');
    if (container) {
      container.classList.remove('anim-fade-in');
      container.classList.add('anim-fade-out');
      setTimeout(() => {
        callback();
      }, 180);
    } else {
      callback();
    }
  }

  // Erro no campo de nome
  function showInputError(msg) {
    const errorEl = document.getElementById('nameError');
    if (errorEl) {
      if (msg) errorEl.querySelector('span').textContent = msg;
      errorEl.classList.add('visible');
    }
    const inputEl = document.getElementById('nameInput');
    if (inputEl) {
      inputEl.style.borderColor = 'var(--color-error)';
      inputEl.focus();
    }
  }

  function hideInputError() {
    const errorEl = document.getElementById('nameError');
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
    const inputEl = document.getElementById('nameInput');
    if (inputEl) {
      inputEl.style.borderColor = 'var(--color-border)';
    }
  }

  // Efeito sutil de balanço quando tenta avançar sem selecionar
  function shakeViewport() {
    quizStepViewport.style.transition = 'transform 0.08s ease';
    quizStepViewport.style.transform = 'translateX(-6px)';
    setTimeout(() => {
      quizStepViewport.style.transform = 'translateX(6px)';
      setTimeout(() => {
        quizStepViewport.style.transform = 'translateX(-4px)';
        setTimeout(() => {
          quizStepViewport.style.transform = 'translateX(0)';
        }, 80);
      }, 80);
    }, 80);
  }

  // Exibir a Tela Final Persuasiva
  function showResultScreen() {
    progressArea.style.display = 'none';
    quizStepViewport.style.display = 'none';
    quizFooterNav.style.display = 'none';

    // Personalizar saudação com o nome
    if (answers.userName && answers.userName.trim().length > 0) {
      const cleanName = answers.userName.trim().split(' ')[0];
      resultGreeting.textContent = `🌿 Parabéns, ${cleanName}!`;
    } else {
      resultGreeting.textContent = '🌿 Parabéns por chegar até aqui!';
    }

    resultScreen.style.display = 'block';

    // Scroll suave até o início do card para visualização perfeita
    quizCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Função utilitária para prevenir injeção de HTML
  function escapeHtml(string) {
    if (!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
