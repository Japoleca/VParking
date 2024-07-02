document.addEventListener('DOMContentLoaded', () => {
    const configForm = document.getElementById('config-form');
    const entradaForm = document.getElementById('entrada-form');
    const veiculosTabela = document.getElementById('veiculos-tabela');
    const vagasOcupadasElement = document.getElementById('vagas-ocupadas');
    const vagasRestantesElement = document.getElementById('vagas-restantes');

    let config = {
        vagas: 0,
        tarifa: 0
    };

    let veiculos = [];

    const loadConfig = () => {
        const storedConfig = localStorage.getItem('config');
        if (storedConfig) {
            config = JSON.parse(storedConfig);
        }
        updateVagasDisplay();
    };

    const saveConfig = () => {
        localStorage.setItem('config', JSON.stringify(config));
        updateVagasDisplay();
    };

    const loadVeiculos = () => {
        const storedVeiculos = localStorage.getItem('veiculos');
        if (storedVeiculos) {
            veiculos = JSON.parse(storedVeiculos);
            renderVeiculos();
        }
    };

    const saveVeiculos = () => {
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
        updateVagasDisplay();
    };

    const renderVeiculos = () => {
        veiculosTabela.innerHTML = '';
        veiculos.forEach((veiculo, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${veiculo.placa}</td>
                <td>${veiculo.horaEntrada}</td>
                <td><button onclick="registrarSaida(${index})">Registrar Saída</button></td>
            `;
            veiculosTabela.appendChild(row);
        });
        updateVagasDisplay();
    };

    const updateVagasDisplay = () => {
        if (vagasOcupadasElement && vagasRestantesElement) {
            vagasOcupadasElement.textContent = veiculos.length;
            vagasRestantesElement.textContent = config.vagas - veiculos.length;
        }
    };

    configForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        config.vagas = parseInt(document.getElementById('vagas').value);
        config.tarifa = parseFloat(document.getElementById('tarifa').value);
        saveConfig();
        alert('Configurações salvas com sucesso!');
    });

    entradaForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const placa = document.getElementById('placa').value;
        const tipo = document.getElementById('tipo').value;
        const horaEntrada = new Date().toLocaleTimeString();
        const horaEntradaDate = new Date();

        // Verifica se a placa já está registrada
        const placaExistente = veiculos.some(veiculo => veiculo.placa === placa);
        if (placaExistente) {
            alert('A placa já está registrada!');
            return;
        }

        if (veiculos.length < config.vagas) {
            veiculos.push({ placa, tipo, horaEntrada, horaEntradaDate });
            saveVeiculos();
            renderVeiculos();
            alert('Veículo registrado com sucesso!');
        } else {
            alert('Estacionamento cheio!');
        }
    });

    window.registrarSaida = (index) => {
        const veiculo = veiculos[index];
        const horaSaidaDate = new Date();
        const tempoPermanencia = (horaSaidaDate - new Date(veiculo.horaEntradaDate) - 10000) / 3600000;
        
        const pesos = {
            carro: 2,
            moto: 1.5
        };
        
        const peso = pesos[veiculo.tipo];
        const valor = Math.ceil(tempoPermanencia) * config.tarifa * peso;
        
        alert(`Tempo de permanência: ${Math.max(0, tempoPermanencia.toFixed(2))} horas\nValor a pagar: R$ ${Math.max(0, valor.toFixed(2))}`);
        veiculos.splice(index, 1);
        saveVeiculos();
        renderVeiculos();
    };

    loadConfig();
    loadVeiculos();
});
