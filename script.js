/**
 * SCRIPT PRINCIPAL — DR. NATANAEL CARVALHO
 * Lógica Interativa Light-Luxury e Quiz de Autoavaliação de Conversão Direta via WhatsApp
 */

(function() {
    'use strict';

    /* ==========================================================================
       1. CONTROLE DO LOADER (CARREGAMENTO DE LUXO)
       ========================================================================== */
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(function() {
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
            }, 1800); // 1.8 segundos para exibir a animação de entrada
        }
    });

    /* ==========================================================================
       2. NAVBAR INTELIGENTE & MENU MOBILE HAMBURGER
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Mudar transparência da Navbar ao rolar a página
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Toggle Menu Mobile
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Travar rolagem do body quando menu estiver ativo
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Fechar menu mobile ao clicar em algum link
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       3. REVEAL OBSERVER (ANIMAÇÕES DE ENTRADA AO ROLAR)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function(el) {
            el.classList.add('revealed');
        });
    }

    /* ==========================================================================
       4. ACCORDION DE DÚVIDAS FREQUENTES (FAQ)
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        if (trigger && content) {
            trigger.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Fechar todos antes de abrir o clicado
                faqItems.forEach(function(otherItem) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherContent) otherContent.style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    /* ==========================================================================
       5. QUIZ INTERATIVO: JORNADA DA NATURALIDADE (R$ 20k+ STANDARD - ORAFACIAL INTEGRADO)
       ========================================================================== */
    const quizSteps = document.querySelectorAll('.quiz-step');
    const progressFill = document.getElementById('quizProgressFill');
    const currentStepText = document.getElementById('quizCurrentStep');
    const btnQuizPrev = document.getElementById('btnQuizPrev');
    const btnQuizNext = document.getElementById('btnQuizNext');
    const quizResultCard = document.getElementById('quizResultCard');
    const quizContentWrapper = document.getElementById('quizContentWrapper');
    const quizNav = document.getElementById('quizNav');

    const quizData = {
        currentStep: 0,
        totalSteps: 4,
        answers: {},
        questions: {
            0: { key: 'regiao', title: 'Região Facial/Oral' },
            1: { key: 'objetivo', title: 'Principal Objetivo' },
            2: { key: 'receio', title: 'Nível de Receio' },
            3: { key: 'periodo', title: 'Período Recomendado' }
        }
    };

    /**
     * Inicializa a escuta de cliques nas opções do Quiz
     */
    function initQuizOptions() {
        const steps = document.querySelectorAll('.quiz-step');
        steps.forEach(function(step, stepIndex) {
            const options = step.querySelectorAll('.quiz-option');
            options.forEach(function(option) {
                option.addEventListener('click', function() {
                    // Remover seleção de outros
                    step.querySelectorAll('.quiz-option').forEach(function(opt) {
                        opt.classList.remove('selected');
                    });
                    
                    // Adicionar seleção ao atual
                    option.classList.add('selected');
                    
                    // Salvar resposta
                    const answerVal = option.getAttribute('data-value');
                    const answerText = option.querySelector('.quiz-option-text').textContent.trim();
                    quizData.answers[stepIndex] = { value: answerVal, text: answerText };
                    
                    // Ativar botão de avançar
                    if (btnQuizNext) btnQuizNext.disabled = false;
                });
            });
        });
    }

    /**
     * Atualiza a barra de progresso visual do Quiz
     */
    function updateQuizProgress() {
        if (!progressFill || !currentStepText) return;
        
        const pct = (quizData.currentStep / quizData.totalSteps) * 100;
        progressFill.style.width = pct + '%';
        
        if (quizData.currentStep < quizData.totalSteps) {
            currentStepText.textContent = `Pergunta ${quizData.currentStep + 1} de ${quizData.totalSteps}`;
        } else {
            currentStepText.textContent = 'Resultado Final';
        }
    }

    /**
     * Controla a exibição da etapa atual do Quiz
     */
    function showQuizStep(stepIndex) {
        quizSteps.forEach(function(step, idx) {
            if (idx === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Configurar botão Voltar
        if (btnQuizPrev) {
            btnQuizPrev.style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
        }

        // Configurar botão Avançar
        if (btnQuizNext) {
            if (stepIndex === quizData.totalSteps - 1) {
                btnQuizNext.textContent = 'Ver Meu Diagnóstico ✨';
            } else {
                btnQuizNext.textContent = 'Avançar →';
            }
            btnQuizNext.disabled = !quizData.answers[stepIndex];
        }

        updateQuizProgress();
    }

    // Navegar para próxima pergunta
    if (btnQuizNext) {
        btnQuizNext.addEventListener('click', function() {
            if (quizData.currentStep < quizData.totalSteps - 1) {
                quizData.currentStep++;
                showQuizStep(quizData.currentStep);
            } else {
                calculateQuizResult();
            }
        });
    }

    // Navegar para pergunta anterior
    if (btnQuizPrev) {
        btnQuizPrev.addEventListener('click', function() {
            if (quizData.currentStep > 0) {
                quizData.currentStep--;
                showQuizStep(quizData.currentStep);
            }
        });
    }

    /**
     * Calcula o diagnóstico e renderiza a tela de resultados do Quiz
     */
    function calculateQuizResult() {
        if (!quizResultCard || !quizContentWrapper || !quizNav) return;
        
        quizData.currentStep = quizData.totalSteps;
        updateQuizProgress();
        
        const ansRegiao = quizData.answers[0].value;
        const ansReceio = quizData.answers[2].value;

        let perfil = 'Harmonização Definição Natural';
        let recomendacaoPrincipal = '';
        let recomendacoesHtml = '';

        if (ansRegiao === 'sorriso') {
            perfil = 'Arquitetura Integrada do Sorriso';
            recomendacaoPrincipal = 'Design Odontológico do Sorriso, combinando Lentes de Contato Dental ou Facetas em Resina Premium com Clareamento supervisionado.';
            recomendacoesHtml = `
                <li><strong>Lentes de Contato & Facetas em Resina:</strong> Solução ultra-fina e nobre para restaurar cor, formato e alinhamento dos dentes com acabamento biológico impecável.</li>
                <li><strong>Clareamento Supervisionado:</strong> Gel clareador de alta tecnologia para clarear os dentes com máxima segurança e preservação do esmalte dental.</li>
            `;
        } else if (ansRegiao === 'labio') {
            perfil = 'Moldura Labial e Dentária';
            recomendacaoPrincipal = 'Preenchimento Labial com ácido hialurônico de alta tecnologia para restaurar volume, contorno e hidratação labial em sintonia com os seus dentes.';
            recomendacoesHtml = `
                <li><strong>Proporção Labial e Dental:</strong> Escultura dos lábios planejada milimetricamente para complementar a exposição dos seus dentes ao sorrir.</li>
                <li><strong>Hidratação Profunda:</strong> Restauração da vivacidade labial mantendo o volume discreto, elegante e anatômico.</li>
            `;
        } else if (ansRegiao === 'mandibula') {
            perfil = 'Definição e Perfil Orofacial';
            recomendacaoPrincipal = 'Preenchimento de Mandíbula e Mento para harmonizar o perfil, dando maior projeção e simetria de forma elegante.';
            recomendacoesHtml = `
                <li><strong>Preenchimento de Mandíbula/Mento:</strong> Ácido Hialurônico de alta coesividade para estruturar o contorno facial do queixo e pescoço.</li>
                <li><strong>Harmonização sem Exageros:</strong> Foco exclusivo na angulação anatômica natural, evitando traços desproporcionais.</li>
            `;
        } else if (ansRegiao === 'olhos') {
            perfil = 'Expressividade Jovem & Natural';
            recomendacaoPrincipal = 'Toxina Botulínica (Botox) preventiva/corretiva para suavizar as rugas e linhas da testa e olhos, preservando suas emoções.';
            recomendacoesHtml = `
                <li><strong>Botox Preventivo/Suave:</strong> Aplicação estratégica de Toxina Botulínica para atenuar rugas de expressão, mantendo a testa com mobilidade e aspecto natural.</li>
                <li><strong>Tratamento Funcional do Bruxismo:</strong> Aplicação terapêutica de Botox nos músculos masseter e temporal para alívio de dores de cabeça e apertamento de dentes.</li>
            `;
        } else if (ansRegiao === 'papada') {
            perfil = 'Contorno de Perfil e Pescoço';
            recomendacaoPrincipal = 'Lipo de Papada Enzimática ou Lipoaspiração Mecânica para reduzir gordura localizada e esculpir a linha da mandíbula.';
            recomendacoesHtml = `
                <li><strong>Lipo de Papada com Enzimas:</strong> Aplicação de ácido deoxicólico para degradação segura e eliminação natural da gordura submentoniana.</li>
                <li><strong>Estímulo de Colágeno Localizado:</strong> Para garantir que a pele se adapte firmemente ao novo contorno esculpido da mandíbula.</li>
            `;
        }

        let receioTxt = '';
        if (ansReceio === 'sutil') {
            receioTxt = '<p style="color: var(--color-success); font-weight: 500; font-size: 0.85rem; margin-bottom: 20px;">🛡️ Diagnóstico de Segurança: O Dr. Natanael Carvalho tem como filosofia principal o resultado ultra-natural. Fique tranquilo(a), pois suas necessidades de sutileza e elegância estão 100% alinhadas ao padrão clínico dele.</p>';
        }

        quizContentWrapper.style.display = 'none';
        quizNav.style.display = 'none';
        
        quizResultCard.innerHTML = `
            <div class="quiz-result-icon">✦</div>
            <h3 class="quiz-result-title">Seu Perfil: ${perfil}</h3>
            <div class="quiz-result-subtitle">Diagnóstico Estético Personalizado</div>
            
            <p class="quiz-result-desc">
                Com base em suas respostas, o tratamento recomendado principal para o seu caso é o <strong>${recomendacaoPrincipal}</strong>.
            </p>
            
            ${receioTxt}
            
            <div class="quiz-result-box">
                <div class="quiz-result-box-title">Plano de Tratamento Sugerido:</div>
                <ul class="quiz-result-treatment-list">
                    ${recomendacoesHtml}
                    <li><strong>Avaliação Clínica e Radiográfica:</strong> Estudo odontológico completo pelo Dr. Natanael para assegurar a harmonia anatômica perfeita entre dentes e face.</li>
                </ul>
            </div>
            
            <button type="button" class="quiz-btn-whatsapp" id="btnSendQuiz">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enviar Meu Resultado & Agendar no WhatsApp
            </button>
        `;
        
        quizResultCard.style.display = 'block';

        // Ouvir clique no envio do Quiz
        const btnSendQuiz = document.getElementById('btnSendQuiz');
        if (btnSendQuiz) {
            btnSendQuiz.addEventListener('click', function() {
                const message = encodeURIComponent(
                    'Olá, Dr. Natanael Carvalho! 👋\n' +
                    'Fiz o Quiz da Naturalidade no seu site e gostaria de conversar sobre meu diagnóstico orofacial integrado:\n\n' +
                    `*Meu Perfil Estético:* ${perfil}\n` +
                    `*Minha Região Facial/Dental Alvo:* ${quizData.answers[0].text}\n` +
                    `*Meu Principal Objetivo:* ${quizData.answers[1].text}\n` +
                    `*Medo de Exageros?* ${quizData.answers[2].text}\n` +
                    `*Período Pretendido:* ${quizData.answers[3].text}\n\n` +
                    'Gostaria de agendar um horário com o senhor para analisarmos meu caso e darmos início ao meu tratamento! ✨'
                );

                const whatsappURL = `https://wa.me/558585198289?text=${message}`;
                window.open(whatsappURL, '_blank', 'noopener,noreferrer');
            });
        }
    }

    // Inicializar o Quiz se os elementos existirem
    if (quizSteps.length > 0) {
        initQuizOptions();
        showQuizStep(0);
    }

    /* ==========================================================================
       6. NAVEGAÇÃO SUAVE PARA ANCORAGENS (SMOOTH SCROLL)
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

})();
