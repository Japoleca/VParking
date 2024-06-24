document.addEventListener('DOMContentLoaded', () => {
    const configForm = document.getElementById('config-form');
    const entradaForm = document.getElementById('entrada-form');
    const veiculosTabela = document.getElementById('veiculos-tabela');

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
    };

    const saveConfig = () => {
        localStorage.setItem('config', JSON.stringify(config));
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
    };

    configForm.addEventListener('submit', (e) => {
        e.preventDefault();
        config.vagas = parseInt(document.getElementById('vagas').value);
        config.tarifa = parseFloat(document.getElementById('tarifa').value);
        saveConfig();
    });

    entradaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const placa = document.getElementById('placa').value;
        const horaEntrada = new Date().toLocaleTimeString();
        if (veiculos.length < config.vagas) {
            veiculos.push({ placa, horaEntrada });
            saveVeiculos();
            renderVeiculos();
        } else {
            alert('Estacionamento cheio!');
        }
    });

    window.registrarSaida = (index) => {
        const veiculo = veiculos[index];
        const horaSaida = new Date().toLocaleTimeString();
        const tempoPermanencia = (new Date().getTime() - new Date(`1970-01-01T${veiculo.horaEntrada}Z`).getTime()) / 3600000;
        const valor = Math.ceil(tempoPermanencia) * config.tarifa;
        alert(`Tempo de permanência: ${tempoPermanencia.toFixed(2)} horas\nValor a pagar: R$ ${valor.toFixed(2)}`);
        veiculos.splice(index, 1);
        saveVeiculos();
        renderVeiculos();
    };

    loadConfig();
    loadVeiculos();
});
