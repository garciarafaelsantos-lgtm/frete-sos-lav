/**
 * Script.js - Calculadora de Frete
 * SOS Lavanderia Igaratá
 * 
 * Este arquivo contém toda a lógica de funcionamento da calculadora,
 * incluindo cálculo de frete, validação de entrada e gerenciamento da interface.
 */

// ============================================
// ELEMENTOS DO DOM
// ============================================

// Campos de entrada
const quilometragemIdaInput = document.getElementById('quilometragemIda');
const quilometragemVoltaInput = document.getElementById('quilometragemVolta');
const valorCombustivelInput = document.getElementById('valorCombustivel');

// Botões
const calcularBtn = document.getElementById('calcularBtn');
const limparBtn = document.getElementById('limparBtn');

// Área de resultados
const resultadosDiv = document.getElementById('resultados');
const quilometragemTotalP = document.getElementById('quilometragemTotal');
const valorFinalP = document.getElementById('valorFinal');

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Evento: Clique no botão "Calcular Valor"
 * Valida os inputs e executa o cálculo do frete
 */
calcularBtn.addEventListener('click', function() {
    calcularFrete();
});

/**
 * Evento: Clique no botão "Limpar"
 * Limpa todos os campos de entrada e esconde os resultados
 */
limparBtn.addEventListener('click', function() {
    limparFormulario();
});

/**
 * Evento: Pressionar Enter em qualquer campo de entrada
 * Permite calcular ao pressionar Enter, melhorando UX
 */
[quilometragemIdaInput, quilometragemVoltaInput, valorCombustivelInput].forEach(input => {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calcularFrete();
        }
    });
});

// ============================================
// FUNÇÃO PRINCIPAL: CALCULAR FRETE
// ============================================

/**
 * Calcula o valor do frete baseado na fórmula:
 * valor_total = ((ida + volta) * 2) * valor_combustivel / 10 * 1.8
 * 
 * Processo:
 * 1. Obtém os valores dos inputs
 * 2. Valida se os valores são válidos
 * 3. Executa o cálculo
 * 4. Exibe os resultados formatados
 */
function calcularFrete() {
    // Obtém os valores dos campos de entrada
    const quilometragemIda = parseFloat(quilometragemIdaInput.value);
    const quilometragemVolta = parseFloat(quilometragemVoltaInput.value);
    const valorCombustivel = parseFloat(valorCombustivelInput.value);

    // Valida se todos os campos foram preenchidos e contêm números válidos
    if (!validarInputs(quilometragemIda, quilometragemVolta, valorCombustivel)) {
        return;
    }

    // Calcula a quilometragem total (ida + volta) * 2
    const quilometragemTotal = (quilometragemIda + quilometragemVolta) * 2;

    // Aplica a fórmula de cálculo do frete
    // Fórmula: valor_total = ((ida + volta) * 2) * valor_combustivel / 10 * 1.7
    const valorTotal = ((quilometragemTotal) * valorCombustivel / 10) * 1.7;

    // Exibe os resultados na tela
    exibirResultados(quilometragemTotal, valorTotal);
}

// ============================================
// FUNÇÃO: VALIDAR INPUTS
// ============================================

/**
 * Valida se os inputs são números válidos e maiores que zero
 * 
 * @param {number} ida - Quilometragem de ida
 * @param {number} volta - Quilometragem de volta
 * @param {number} combustivel - Valor do combustível
 * @returns {boolean} True se todos os valores são válidos, False caso contrário
 */
function validarInputs(ida, volta, combustivel) {
    // Verifica se os valores são números válidos
    if (isNaN(ida) || isNaN(volta) || isNaN(combustivel)) {
        alert('Por favor, preencha todos os campos com valores numéricos válidos.');
        return false;
    }

    // Verifica se os valores são maiores que zero
    if (ida <= 0 || volta <= 0 || combustivel <= 0) {
        alert('Os valores devem ser maiores que zero.');
        return false;
    }

    return true;
}

// ============================================
// FUNÇÃO: EXIBIR RESULTADOS
// ============================================

/**
 * Exibe os resultados do cálculo na tela
 * Formata os valores com duas casas decimais
 * 
 * @param {number} quilometragem - Quilometragem total
 * @param {number} valor - Valor final do frete
 */
function exibirResultados(quilometragem, valor) {
    // Formata a quilometragem com uma casa decimal
    const quilometragemFormatada = quilometragem.toFixed(1);

    // Formata o valor com duas casas decimais e símbolo de moeda
    const valorFormatado = valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Atualiza o conteúdo dos elementos de resultado
    quilometragemTotalP.textContent = `Quilometragem retirada + devolução: ${quilometragemFormatada} km`;
    valorFinalP.textContent = `Valor final a cobrar: ${valorFormatado}`;

    // Exibe a área de resultados (que estava oculta)
    resultadosDiv.style.display = 'block';

    // Scroll suave até os resultados (melhora UX em mobile)
    resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// FUNÇÃO: LIMPAR FORMULÁRIO
// ============================================

/**
 * Limpa todos os campos de entrada e esconde os resultados
 * Restaura o formulário ao estado inicial
 */
function limparFormulario() {
    // Limpa os valores dos campos de entrada
    quilometragemIdaInput.value = '';
    quilometragemVoltaInput.value = '';
    valorCombustivelInput.value = '';

    // Esconde a área de resultados
    resultadosDiv.style.display = 'none';

    // Define o foco no primeiro campo de entrada para melhor UX
    quilometragemIdaInput.focus();
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Função executada quando o DOM está completamente carregado
 * Realiza inicializações necessárias
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculadora de Frete carregada com sucesso!');
    
    // Define o foco inicial no primeiro campo
    quilometragemIdaInput.focus();
});
