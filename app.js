// Application state and data
let configuration = {
    enchimento: null,
    dimensao: null,
    unidade: null,
    tipoMedicao: null,
    faixa: null,
    conexao: null,
    escalaTemp: 'sem',
    posicao: null,
    falange: null,
    visor: null,
    restritor: null,
    ponteiro: null,
    caracteristica: 'nao',
    protecaoExtra: 'nao',
    protecaoEx: 'nenhuma',
    certificacao: 'nao'
};

// Product database from provided JSON (adapted for QUALITEC)
const productDatabase = {
    "produtos": [
        {
            "id": "QTC233-30-100-1600",
            "part_number": "233.30-E-BG616K-MI-UZHZCZZ-AHAZZZZ",
            "model_code": "213D3AZIYG0 12Z-ICZZZZZ12ZZZ",
            "nome": "Manômetro com Tubo Bourdon, Frente Sólida",
            "serie": "23X.30",
            "enchimento": "glicerina",
            "dimensao": "100mm",
            "classe": "1.0",
            "unidade": "bar",
            "segunda_escala": "2.ª escala kg/cm2",
            "tipo_medicao": "pressao",
            "faixa": "0...1600 bar",
            "conexao": "M20 x 1,5",
            "posicao": "inferior",
            "visor": "vidro_seguranca",
            "ponteiro": "ajustavel",
            "caracteristica": "nao",
            "protecao_ex": "nenhuma",
            "certificacao": "qualidade",
            "material_caixa": "aço inoxidável 304 (1.4301)",
            "mostrador": "alumínio, branco sem pino de encosto",
            "anel": "anel tipo baioneta, aço inoxidável",
            "temp_ambiente": "-20 ... +60 °C",
            "temp_processo": "+ 100 °C",
            "grau_protecao": "IP 65",
            "etiqueta": "Padrão QUALITEC sem / com nº de Tag",
            "idioma": "português",
            "preco": "R$ 1.250,00",
            "disponibilidade": "15-20 dias"
        },
        {
            "id": "QTC232-30-63-10",
            "part_number": "232.30-S-AG063K-MI-UZHZCZZ-AHAZZZZ",
            "model_code": "152A1BZIYG0 12Z-ICZZZZZ12ZZZ",
            "nome": "Manômetro com Tubo Bourdon, Frente Sólida",
            "serie": "23X.30",
            "enchimento": "sem",
            "dimensao": "63mm",
            "classe": "1.6",
            "unidade": "bar",
            "segunda_escala": "sem",
            "tipo_medicao": "pressao",
            "faixa": "0...10 bar",
            "conexao": "G 1/4 B",
            "posicao": "inferior",
            "visor": "policarbonato",
            "ponteiro": "padrao",
            "caracteristica": "livre_oleo",
            "protecao_ex": "nenhuma",
            "certificacao": "nao",
            "material_caixa": "aço inoxidável 304 (1.4301)",
            "mostrador": "alumínio, branco com pino de encosto",
            "anel": "anel rosqueado, aço inoxidável",
            "temp_ambiente": "-40 ... +60 °C",
            "temp_processo": "+ 200 °C",
            "grau_protecao": "IP 65",
            "etiqueta": "Padrão QUALITEC sem / com nº de Tag",
            "idioma": "português",
            "preco": "R$ 485,00",
            "disponibilidade": "Em estoque"
        },
        {
            "id": "QTC233-30-160-400",
            "part_number": "233.30-E-CG160K-MI-UZHZCZZ-AHAZZZZ",
            "model_code": "284C5BZIYG0 12Z-ICZZZZZ12ZZZ",
            "nome": "Manômetro com Tubo Bourdon, Frente Sólida",
            "serie": "23X.30",
            "enchimento": "glicerina",
            "dimensao": "160mm",
            "classe": "1.0",
            "unidade": "bar",
            "segunda_escala": "2.ª escala psi",
            "tipo_medicao": "pressao",
            "faixa": "0...400 bar",
            "conexao": "G 1/2 B",
            "posicao": "traseira",
            "visor": "vidro_seguranca",
            "ponteiro": "vermelho_arraste",
            "caracteristica": "nace",
            "protecao_ex": "atex",
            "certificacao": "dkd",
            "material_caixa": "aço inoxidável 316L (1.4404)",
            "mostrador": "alumínio, branco sem pino de encosto",
            "anel": "anel tipo baioneta, aço inoxidável",
            "temp_ambiente": "-20 ... +60 °C",
            "temp_processo": "+ 100 °C",
            "grau_protecao": "IP 65",
            "etiqueta": "Padrão QUALITEC sem / com nº de Tag",
            "idioma": "português",
            "preco": "R$ 1.850,00",
            "disponibilidade": "25-30 dias"
        }
    ]
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('QUALITEC Configurator initialized');
    updateProductVisualization();
    validateConfiguration();
});

// Part Number handling
function handlePartNumberInput() {
    const input = document.getElementById('partNumberInput');
    const partNumber = input.value.trim();
    const statusElement = document.getElementById('partNumberStatus');
    
    if (!partNumber) {
        statusElement.style.display = 'none';
        return;
    }
    
    // Search for product in database
    const foundProduct = productDatabase.produtos.find(p => 
        p.part_number.toLowerCase() === partNumber.toLowerCase()
    );
    
    if (foundProduct) {
        statusElement.style.display = 'block';
        statusElement.className = 'validation-message success';
        statusElement.textContent = '✓ Part Number encontrado! Preenchendo campos automaticamente...';
        
        // Auto-fill configuration from found product
        setTimeout(() => {
            fillConfigurationFromProduct(foundProduct);
        }, 500);
    } else {
        statusElement.style.display = 'block';
        statusElement.className = 'validation-message error';
        statusElement.textContent = '⚠ Part Number não encontrado. Configure manualmente.';
    }
}

// Fill configuration from product data
function fillConfigurationFromProduct(product) {
    console.log('Auto-filling from product:', product);
    
    // Reset all selections first
    resetFormElements();
    
    // Map product data to form elements and update configuration
    const mappings = {
        enchimento: product.enchimento,
        dimensao: product.dimensao,
        unidade: product.unidade,
        tipoMedicao: product.tipo_medicao,
        faixa: product.faixa,
        conexao: product.conexao,
        posicao: product.posicao,
        visor: product.visor,
        ponteiro: product.ponteiro,
        caracteristica: product.caracteristica,
        protecaoEx: product.protecao_ex,
        certificacao: product.certificacao
    };
    
    // Apply mappings to form elements
    Object.entries(mappings).forEach(([key, value]) => {
        if (value) {
            // Handle radio buttons
            const radioElement = document.querySelector(`input[name="${key}"][value="${value}"]`);
            if (radioElement) {
                radioElement.checked = true;
                configuration[key] = value;
                console.log(`Set ${key} = ${value}`);
            }
            
            // Handle select dropdowns
            const selectElement = document.getElementById(key);
            if (selectElement) {
                selectElement.value = value;
                configuration[key] = value;
                console.log(`Set ${key} = ${value} (dropdown)`);
            }
        }
    });
    
    // Update visualization and validation
    updateProductVisualization();
    updateSpecificationsTable();
    validateConfiguration();
    
    showSuccessMessage('Configuração preenchida automaticamente com base no Part Number!');
}

// Reset form elements
function resetFormElements() {
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        input.checked = false;
    });
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
}

// Update configuration when filters change
function updateConfiguration() {
    // Get all form values
    configuration.enchimento = getRadioValue('enchimento');
    configuration.dimensao = getRadioValue('dimensao');
    configuration.unidade = getSelectValue('unidade');
    configuration.tipoMedicao = getRadioValue('tipoMedicao');
    configuration.faixa = getSelectValue('faixa');
    configuration.conexao = getSelectValue('conexao');
    configuration.escalaTemp = getRadioValue('escalaTemp') || 'sem';
    configuration.posicao = getRadioValue('posicao');
    configuration.falange = getSelectValue('falange');
    configuration.visor = getRadioValue('visor');
    configuration.restritor = getSelectValue('restritor');
    configuration.ponteiro = getRadioValue('ponteiro');
    configuration.protecaoExtra = getRadioValue('protecaoExtra') || 'nao';
    
    // Handle single-choice filters (corrected)
    configuration.caracteristica = getRadioValue('caracteristica') || 'nao';
    configuration.protecaoEx = getRadioValue('protecaoEx') || 'nenhuma';
    configuration.certificacao = getRadioValue('certificacao') || 'nao';
    
    console.log('Configuration updated:', configuration);
    
    // Update UI
    updateProductVisualization();
    updateSpecificationsTable();
    validateConfiguration();
    validateCompatibility();
}

// Helper functions for form values
function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
}

function getSelectValue(id) {
    const element = document.getElementById(id);
    return element && element.value ? element.value : null;
}

// Update product visualization
function updateProductVisualization() {
    const productImage = document.getElementById('productImage');
    const productPlaceholder = document.getElementById('productPlaceholder');
    const productName = document.getElementById('productName');
    const productPartNumber = document.getElementById('productPartNumber');
    
    // Check if we have a matching product
    const matchingProduct = findMatchingProduct();
    
    if (matchingProduct) {
        // Show product details
        productImage.src = '/api/placeholder/300/300';
        productImage.style.display = 'block';
        productPlaceholder.style.display = 'none';
        productName.textContent = matchingProduct.nome;
        productPartNumber.textContent = `Part Number: ${matchingProduct.part_number}`;
    } else if (isConfigurationPartial()) {
        // Show configured product info
        productImage.style.display = 'none';
        productPlaceholder.style.display = 'flex';
        productName.textContent = generateProductName();
        productPartNumber.textContent = `Part Number: ${generatePartNumber()}`;
    } else {
        // Show placeholder
        productImage.style.display = 'none';
        productPlaceholder.style.display = 'flex';
        productName.textContent = 'Selecione as especificações';
        productPartNumber.textContent = 'Part Number será gerado automaticamente';
    }
}

// Find matching product in database
function findMatchingProduct() {
    return productDatabase.produtos.find(product => {
        const enchimentoMatch = !configuration.enchimento || product.enchimento === configuration.enchimento;
        const dimensaoMatch = !configuration.dimensao || product.dimensao === configuration.dimensao;
        const unidadeMatch = !configuration.unidade || product.unidade === configuration.unidade;
        const conexaoMatch = !configuration.conexao || product.conexao === configuration.conexao;
        const posicaoMatch = !configuration.posicao || product.posicao === configuration.posicao;
        const visorMatch = !configuration.visor || product.visor === configuration.visor;
        const ponteiroMatch = !configuration.ponteiro || product.ponteiro === configuration.ponteiro;
        const caracteristicaMatch = !configuration.caracteristica || configuration.caracteristica === 'nao' || product.caracteristica === configuration.caracteristica;
        const protecaoExMatch = !configuration.protecaoEx || configuration.protecaoEx === 'nenhuma' || product.protecao_ex === configuration.protecaoEx;
        const certificacaoMatch = !configuration.certificacao || configuration.certificacao === 'nao' || product.certificacao === configuration.certificacao;
        
        // For pressure range, check if configuration faixa contains the product's max pressure
        let faixaMatch = true;
        if (configuration.faixa && product.faixa) {
            const configMax = extractMaxPressure(configuration.faixa);
            const productMax = extractMaxPressure(product.faixa);
            faixaMatch = Math.abs(configMax - productMax) < 0.1;
        }
        
        return enchimentoMatch && dimensaoMatch && unidadeMatch && conexaoMatch && 
               posicaoMatch && visorMatch && ponteiroMatch && faixaMatch &&
               caracteristicaMatch && protecaoExMatch && certificacaoMatch;
    });
}

// Check if configuration has any values
function isConfigurationPartial() {
    return configuration.enchimento || configuration.dimensao || configuration.unidade || 
           configuration.faixa || configuration.conexao || configuration.posicao;
}

// Generate product name based on configuration
function generateProductName() {
    let name = 'Manômetro com Tubo Bourdon';
    
    if (configuration.enchimento === 'glicerina') {
        name += ', com Glicerina';
    } else if (configuration.enchimento === 'sem') {
        name += ', Seco';
    }
    
    if (configuration.dimensao) {
        name += ` ${configuration.dimensao}`;
    }
    
    return name;
}

// Generate Part Number based on configuration
function generatePartNumber() {
    if (!isConfigurationPartial()) return 'Configure o produto';
    
    let partNumber = '';
    
    // Base model number
    if (configuration.enchimento === 'glicerina') {
        partNumber += '233.30-E-';
    } else if (configuration.enchimento === 'sem') {
        partNumber += '232.30-S-';
    } else {
        partNumber += '23X.30-X-';
    }
    
    // Dimension code
    if (configuration.dimensao === '63mm') {
        partNumber += 'AG063K-';
    } else if (configuration.dimensao === '100mm') {
        partNumber += 'BG100K-';
    } else if (configuration.dimensao === '160mm') {
        partNumber += 'CG160K-';
    } else {
        partNumber += 'XGXXXK-';
    }
    
    // Position code
    if (configuration.posicao === 'inferior') {
        partNumber += 'MI-';
    } else if (configuration.posicao === 'traseira') {
        partNumber += 'TR-';
    } else {
        partNumber += 'XX-';
    }
    
    // Additional codes (simplified)
    partNumber += 'UZHZCZZ-AHAZZZZ';
    
    return partNumber;
}

// Update specifications table
function updateSpecificationsTable() {
    const container = document.getElementById('specificationsTable');
    
    if (!isConfigurationPartial()) {
        container.innerHTML = `
            <h4>Especificações Técnicas</h4>
            <div class="spec-placeholder">
                Complete a configuração para ver as especificações
            </div>
        `;
        return;
    }
    
    const specs = generateSpecifications();
    const validSpecs = specs.filter(spec => spec.value);
    
    if (validSpecs.length === 0) {
        container.innerHTML = `
            <h4>Especificações Técnicas</h4>
            <div class="spec-placeholder">
                Selecione mais opções para ver as especificações
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <h4>Especificações Técnicas</h4>
        <table class="spec-table">
    `;
    
    validSpecs.forEach(spec => {
        tableHTML += `
            <tr>
                <td>${spec.label}</td>
                <td>${spec.value}</td>
            </tr>
        `;
    });
    
    tableHTML += '</table>';
    container.innerHTML = tableHTML;
}

// Generate specifications array
function generateSpecifications() {
    return [
        { label: 'Série', value: '23X.30' },
        { label: 'Enchimento', value: configuration.enchimento ? (configuration.enchimento === 'glicerina' ? 'Com Glicerina' : 'Sem Enchimento') : null },
        { label: 'Dimensão Nominal', value: configuration.dimensao ? `${configuration.dimensao} (Classe ${configuration.dimensao === '63mm' ? '1.6' : '1.0'})` : null },
        { label: 'Unidade Principal', value: configuration.unidade || null },
        { label: 'Tipo de Medição', value: configuration.tipoMedicao ? (configuration.tipoMedicao === 'pressao' ? 'Escala de Pressão' : 'Escala Composta/Vácuo') : null },
        { label: 'Faixa de Indicação', value: configuration.faixa || null },
        { label: 'Conexão ao Processo', value: configuration.conexao || null },
        { label: 'Escala de Temperatura', value: configuration.escalaTemp === 'r717' ? 'R717 (NH3)' : 'Sem' },
        { label: 'Posição da Conexão', value: configuration.posicao ? (configuration.posicao === 'inferior' ? 'Montagem Inferior' : 'Montagem Traseira') : null },
        { label: 'Falange/Suporte', value: configuration.falange || null },
        { label: 'Visor', value: configuration.visor ? (configuration.visor === 'policarbonato' ? 'Policarbonato' : 'Vidro de Segurança') : null },
        { label: 'Restritor', value: configuration.restritor || null },
        { label: 'Ponteiro', value: configuration.ponteiro ? formatPonteiroName(configuration.ponteiro) : null },
        { label: 'Característica Especial', value: formatCaracteristica(configuration.caracteristica) },
        { label: 'Proteção Extra', value: configuration.protecaoExtra === 'sim' ? 'Sim' : 'Não' },
        { label: 'Proteção Ex', value: formatProtecaoEx(configuration.protecaoEx) },
        { label: 'Certificação', value: formatCertificacao(configuration.certificacao) }
    ];
}

// Format helper functions
function formatPonteiroName(value) {
    const names = {
        'padrao': 'Padrão',
        'ajustavel': 'Ajustável',
        'vermelho': 'Vermelho de Indicação/Arraste',
        'ajustavel_ext_vermelho': 'Ajustável Externamente Vermelho',
        'vermelho_arraste': 'Arraste Vermelho Externamente Ajustável'
    };
    return names[value] || value;
}

function formatCaracteristica(value) {
    const names = {
        'nao': 'Nenhuma',
        'livre_oleo': 'Livre de Óleo e Graxa',
        'limpo_oxigenio': 'Limpo para Oxigênio',
        'nace': 'NACE Sour Gas Service'
    };
    return names[value] || 'Nenhuma';
}

function formatProtecaoEx(value) {
    const names = {
        'nenhuma': 'Nenhuma',
        'atex': 'ATEX - Zona de Gás 1/Zona de Poeira 21',
        'eac_ex': 'EAC ex - Zona de Gás 1/Zona de Poeira 21'
    };
    return names[value] || 'Nenhuma';
}

function formatCertificacao(value) {
    const names = {
        'nao': 'Nenhuma',
        'qualidade': 'Certificados Qualidade',
        'polones': 'Certificado Calibração Polonês',
        'dkd': 'Certificado DKD'
    };
    return names[value] || 'Nenhuma';
}

// Validate configuration and enable/disable buttons
function validateConfiguration() {
    // Minimum required fields for a valid configuration
    const requiredFields = ['enchimento', 'dimensao', 'unidade', 'tipoMedicao', 'faixa', 'conexao', 'posicao'];
    const isValid = requiredFields.every(field => configuration[field]);
    
    console.log('Validation check:', {
        enchimento: configuration.enchimento,
        dimensao: configuration.dimensao,
        unidade: configuration.unidade,
        tipoMedicao: configuration.tipoMedicao,
        faixa: configuration.faixa,
        conexao: configuration.conexao,
        posicao: configuration.posicao,
        isValid: isValid
    });
    
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    const requestQuoteBtn = document.getElementById('requestQuoteBtn');
    
    if (generatePdfBtn) {
        generatePdfBtn.disabled = !isValid;
        generatePdfBtn.classList.toggle('disabled', !isValid);
    }
    
    if (requestQuoteBtn) {
        requestQuoteBtn.disabled = !isValid;
        requestQuoteBtn.classList.toggle('disabled', !isValid);
    }
    
    return isValid;
}

// Validate compatibility between selections
function validateCompatibility() {
    const warnings = [];
    
    // Check dimension vs pressure range compatibility
    if (configuration.dimensao === '63mm' && configuration.faixa) {
        const maxPressure = extractMaxPressure(configuration.faixa);
        if (maxPressure > 60) {
            warnings.push('63mm: pressão máxima recomendada 60 bar');
        }
    }
    
    // Check filling vs temperature compatibility
    if (configuration.enchimento === 'glicerina' && configuration.caracteristica === 'limpo_oxigenio') {
        warnings.push('Glicerina não é compatível com aplicações de oxigênio');
    }
    
    if (warnings.length > 0) {
        showWarningMessage(warnings.join('; '));
    }
}

// Extract maximum pressure from range string
function extractMaxPressure(faixa) {
    // Match patterns like "0...1600 bar", "0...10 bar", etc.
    const match = faixa.match(/(\d+(?:,\d+)?)\s*bar$/);
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

// Show success/warning messages
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showWarningMessage(message) {
    showMessage(message, 'warning');
}

function showMessage(message, type) {
    // Create or update message element
    let messageEl = document.getElementById('globalMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'globalMessage';
        messageEl.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 1001;
            max-width: 350px;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(messageEl);
    }
    
    messageEl.className = `validation-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    }, 5000);
}

// Generate PDF using jsPDF with QUALITEC data
function generatePDF() {
    if (!validateConfiguration()) {
        showWarningMessage('Complete a configuração antes de gerar o PDF');
        return;
    }
    
    const btn = document.getElementById('generatePdfBtn');
    btn.classList.add('loading');
    btn.disabled = true;
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Header with QUALITEC data
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('QUALITEC COMÉRCIO E SERVIÇOS DE INSTRUMENTOS DE MEDIÇÃO LTDA', 20, 20);
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text('Rua Fazenda Monte Alegre, 367', 20, 30);
            doc.text('05160-060 - São Paulo - SP - Brasil', 20, 35);
            doc.text('Tel.: (+55) 11 3908-7100', 20, 45);
            doc.text('E-mail: vendas@qualitec.ind.br', 20, 50);
            doc.text('Internet: www.qualitec.ind.br', 20, 55);
            
            // Title section
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Manômetro com Tubo Bourdon, Frente Sólida', 20, 70);
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Série 23X.30`, 20, 80);
            
            const partNumber = generatePartNumber();
            doc.text(`Part Number: ${partNumber}`, 20, 88);
            
            const modelCode = generateModelCode();
            doc.text(`Model code: ${modelCode}`, 20, 96);
            
            const currentDate = new Date().toLocaleDateString('pt-BR');
            doc.text(`Data: ${currentDate}`, 20, 104);
            
            // Technical specifications table
            const specs = generateSpecifications().filter(spec => spec.value);
            let yPos = 120;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('DADOS TÉCNICOS', 20, yPos);
            yPos += 10;
            
            // Table headers
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text('Descrição', 20, yPos);
            doc.text('Projeto', 100, yPos);
            yPos += 8;
            
            // Draw line under headers
            doc.line(20, yPos - 2, 190, yPos - 2);
            yPos += 2;
            
            doc.setFont(undefined, 'normal');
            
            // Standard specifications
            const standardSpecs = [
                ['Padrão', 'EN 837-1'],
                ['Dimensão nominal, Classe de exatidão', configuration.dimensao ? `${configuration.dimensao}, Classe ${configuration.dimensao === '63mm' ? '1.6' : '1.0'}` : '-'],
                ['Faixa de indicação', configuration.faixa || '-'],
                ['Unidade da escala principal', configuration.unidade || '-'],
                ['Segunda escala / Escala Especial', configuration.tipoMedicao === 'vacuo_composta' ? 'Escala composta' : '-'],
                ['Conexão ao processo', configuration.conexao || '-'],
                ['Posição da conexão', configuration.posicao === 'inferior' ? 'Montagem Inferior' : configuration.posicao === 'traseira' ? 'Montagem Traseira' : '-'],
                ['Característica Especial', formatCaracteristica(configuration.caracteristica)],
                ['Proteção Ex', formatProtecaoEx(configuration.protecaoEx)],
                ['Certificação', formatCertificacao(configuration.certificacao)]
            ];
            
            standardSpecs.forEach(spec => {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(spec[0], 20, yPos);
                doc.text(spec[1], 100, yPos);
                yPos += 7;
            });
            
            // Materials section
            yPos += 5;
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFont(undefined, 'bold');
            doc.text('MATERIAIS', 20, yPos);
            yPos += 8;
            
            doc.setFont(undefined, 'normal');
            const materialSpecs = [
                ['Movimento', 'aço inoxidável 316L (1.4404)'],
                ['Mostrador', 'alumínio, branco'],
                ['Ponteiro', configuration.ponteiro ? formatPonteiroName(configuration.ponteiro) : 'padrão'],
                ['Material da caixa', 'aço inoxidável 304 (1.4301)'],
                ['Visor', configuration.visor === 'vidro_seguranca' ? 'vidro de segurança' : 'policarbonato'],
                ['Anel', 'aço inoxidável'],
                ['Líquido de enchimento', configuration.enchimento === 'glicerina' ? 'glicerina' : 'sem enchimento']
            ];
            
            materialSpecs.forEach(spec => {
                if (yPos > 260) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(spec[0], 20, yPos);
                doc.text(spec[1], 100, yPos);
                yPos += 7;
            });
            
            // Operating conditions
            yPos += 5;
            if (yPos > 240) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFont(undefined, 'bold');
            doc.text('CONDIÇÕES DE OPERAÇÃO', 20, yPos);
            yPos += 8;
            
            doc.setFont(undefined, 'normal');
            const operatingSpecs = [
                ['Temp. ambiente', '-20 ... +60 °C'],
                ['Temp. processo', configuration.enchimento === 'glicerina' ? '+100 °C' : '+200 °C'],
                ['Grau de proteção', 'IP 65']
            ];
            
            operatingSpecs.forEach(spec => {
                doc.text(spec[0], 20, yPos);
                doc.text(spec[1], 100, yPos);
                yPos += 7;
            });
            
            // Footer
            doc.setFontSize(8);
            doc.text('© QUALITEC COMÉRCIO E SERVIÇOS DE INSTRUMENTOS DE MEDIÇÃO LTDA • Todos os direitos reservados', 20, 280);
            doc.text('Rua Fazenda Monte Alegre, 367 • 05160-060 - São Paulo - SP - Brasil', 20, 285);
            doc.text(`Tel.: (+55) 11 3908-7100 • E-mail: vendas@qualitec.ind.br • www.qualitec.ind.br`, 20, 290);
            
            // Generate filename
            const filename = `QUALITEC_Datasheet_${partNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${currentDate.replace(/\//g, '-')}.pdf`;
            
            // Download PDF
            doc.save(filename);
            
            showSuccessMessage('DataSheet PDF gerado com sucesso!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            showWarningMessage('Erro ao gerar PDF. Verifique se todos os campos estão preenchidos.');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
            validateConfiguration(); // Re-validate to restore proper button state
        }
    }, 1500);
}

// Generate model code (simplified)
function generateModelCode() {
    let code = '';
    
    // Dimension code
    if (configuration.dimensao === '63mm') code += '152';
    else if (configuration.dimensao === '100mm') code += '213';
    else if (configuration.dimensao === '160mm') code += '284';
    else code += 'XXX';
    
    // Filling code
    if (configuration.enchimento === 'glicerina') code += 'D';
    else code += 'A';
    
    // Additional codes (simplified)
    code += '3AZIYG0 12Z-ICZZZZZ12ZZZ';
    
    return code;
}

// Quote modal functions
function requestQuote() {
    if (!validateConfiguration()) {
        showWarningMessage('Complete a configuração antes de solicitar cotação');
        return;
    }
    
    const modal = document.getElementById('quoteModal');
    modal.classList.remove('hidden');
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.add('hidden');
}

function submitQuote(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const quoteData = Object.fromEntries(formData);
    
    // Add configuration data
    quoteData.configuration = configuration;
    quoteData.partNumber = generatePartNumber();
    quoteData.specifications = generateSpecifications().filter(spec => spec.value);
    
    console.log('Quote submitted:', quoteData);
    
    // Simulate submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage('Cotação enviada com sucesso! Entraremos em contato em até 24 horas.');
        closeQuoteModal();
        form.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }, 2000);
}

// Reset configuration
function resetConfiguration() {
    // Reset configuration object
    configuration = {
        enchimento: null,
        dimensao: null,
        unidade: null,
        tipoMedicao: null,
        faixa: null,
        conexao: null,
        escalaTemp: 'sem',
        posicao: null,
        falange: null,
        visor: null,
        restritor: null,
        ponteiro: null,
        caracteristica: 'nao',
        protecaoExtra: 'nao',
        protecaoEx: 'nenhuma',
        certificacao: 'nao'
    };
    
    // Reset form elements
    resetFormElements();
    
    // Reset defaults
    document.querySelector('input[name="escalaTemp"][value="sem"]').checked = true;
    document.querySelector('input[name="protecaoExtra"][value="nao"]').checked = true;
    document.querySelector('input[name="caracteristica"][value="nao"]').checked = true;
    document.querySelector('input[name="protecaoEx"][value="nenhuma"]').checked = true;
    document.querySelector('input[name="certificacao"][value="nao"]').checked = true;
    
    // Clear part number input
    document.getElementById('partNumberInput').value = '';
    document.getElementById('partNumberStatus').style.display = 'none';
    
    // Update UI
    updateProductVisualization();
    updateSpecificationsTable();
    validateConfiguration();
    
    showSuccessMessage('Configuração resetada com sucesso!');
}
