const form = document.querySelector('form');
const tableBody = document.querySelector('tbody');

// Carregar as dívidas salvas no localStorage ao carregar a página
window.addEventListener('load', () => {
    loadDebts();
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const valor = document.getElementById('valor').value;
    const data = document.getElementById('data').value;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${nome}</td>
        <td>${valor}</td>
        <td>${data}</td>
        <td><button class="edit-button">Editar</button></td>
    `;

    tableBody.appendChild(row);

    // Ordenar a tabela após adicionar uma nova dívida
    sortTable();

    // Salvar as dívidas no localStorage
    saveDebts();

    form.reset();
});

function addEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-button');

    editButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const row = tableBody.children[index];
            const columns = row.children;

            const nome = columns[0].textContent;
            const valor = columns[1].textContent;
            const data = columns[2].textContent;

            // Preencher o formulário com os detalhes da dívida selecionada
            document.getElementById('nome').value = nome;
            document.getElementById('valor').value = valor;
            document.getElementById('data').value = data;

            // Remover a linha da tabela enquanto edita
            row.remove();

            // Salvar as dívidas atualizadas no localStorage
            saveDebts();

            // Adicionar event listener aos botões "Editar" após adicionar nova linha
            addEditButtonListeners();
        });
    });
}

function sortTable() {
    const rows = Array.from(tableBody.children);

    rows.sort((a, b) => {
        const nomeA = a.children[0].textContent.toUpperCase();
        const nomeB = b.children[0].textContent.toUpperCase();

        if (nomeA < nomeB) return -1;
        if (nomeA > nomeB) return 1;
        return 0;
    });

    // Remover todas as linhas da tabela
    tableBody.innerHTML = '';

    // Adicionar as linhas ordenadas de volta à tabela
    rows.forEach(row => {
        tableBody.appendChild(row);
    });

    // Adicionar event listener aos botões "Editar" após recriar a tabela
    addEditButtonListeners();
}

function saveDebts() {
    const debts = [];
    const rows = tableBody.children;

    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].children;
        const debt = {
            nome: columns[0].textContent,
            valor: columns[1].textContent,
            data: columns[2].textContent,
        };
        debts.push(debt);
    }

    // Salvar as dívidas no localStorage
    localStorage.setItem('debts', JSON.stringify(debts));
}

function loadDebts() {
    const debtsString = localStorage.getItem('debts');

    if (debtsString) {
        const debts = JSON.parse(debtsString);

        debts.forEach(debt => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${debt.nome}</td>
                <td>${debt.valor}</td>
                <td>${debt.data}</td>
                <td><button class="edit-button">Editar</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Adicionar event listener aos botões "Editar" após carregar as dívidas
        addEditButtonListeners();
    }
}