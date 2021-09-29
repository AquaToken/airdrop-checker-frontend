import { loadData } from '../../common/scripts/load-and-render';

const form = document.getElementById('check-form');
const input = form.querySelector('#address');

form.addEventListener('submit', event => {
    event.preventDefault();
    const value = input.value;
    loadData(value);
});

try {
    const params = new URLSearchParams(location.search);
    const address = params.get('address');
    if (address) {
        input.value = address;
        loadData(address);
    }
} catch (e) {
    console.log(e);
}
