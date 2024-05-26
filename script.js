const apiUrl = 'http://localhost:8080/api/items';

document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    
    if (itemName && itemQuantity) {
        const entryDate = new Date().toLocaleDateString();
        const item = { name: itemName, quantity: itemQuantity, entryDate: entryDate, exitDate: '-' };
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(response => response.json())
        .then(data => {
            addItemToInventory(data);
            document.getElementById('itemForm').reset();
        });
    }
});

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryTable tbody tr');
    
    rows.forEach(row => {
        const itemName = row.children[0].textContent.toLowerCase();
        if (itemName.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

function addItemToInventory(item) {
    const inventoryTableBody = document.querySelector('#inventoryTable tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.entryDate}</td>
        <td>${item.exitDate}</td>
        <td><button onclick="removeItem(${item.id}, this)">Remover</button></td>
    `;
    
    inventoryTableBody.appendChild(row);
}

function removeItem(id, button) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        const row = button.parentElement.parentElement;
        row.remove();
    });
}

function loadItems() {
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        data.forEach(item => addItemToInventory(item));
    });
}

document.addEventListener('DOMContentLoaded', loadItems);

document.getElementById('toggleDarkMode').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
});
