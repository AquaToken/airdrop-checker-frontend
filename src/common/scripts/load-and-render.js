import createStellarIdenticon from 'stellar-identicon-js';
import { truncateKey } from './truncate-key';
import { addDataToTemplate } from './add-data-to-template';
import { getFormattedDate } from './get-formatted-date';
import accountEligibilityLoading from '../../pages/home/account-status-component/account-eligibility-loading/account-eligibility-loading.html';
import eligebleStatus from '../../pages/home/account-status-component/account-eligibility/eligible-status.html';
import notEligebleStatus from '../../pages/home/account-status-component/account-eligibility/not-eligible-status.html';
import accountEligibility from '../../pages/home/account-status-component/account-eligibility/account-eligibility.html';
import accountBonuses from '../../pages/home/account-status-component/account-eligibility/account-bonuses.html';
import airdropStatus from '../../pages/home/account-status-component/airdrop-status/airdrop-status.html';
import phaseLine from '../../pages/home/account-status-component/airdrop-status/phase-line.html';
import statusClaimed from '../../pages/home/account-status-component/airdrop-status/status-claimed.html';
import statusExpired from '../../pages/home/account-status-component/airdrop-status/status-expired.html';

const INVALID_ADDRESS_ERROR = 'Please enter a valid Stellar account address';
const NOT_ELIGEBLE_ERROR = `This account has no trades before January 1, 2021, 00:00 UTC <br/>
 You may be eligible to get free AQUA in a bigger Airdrop #2 distribution starting soon. Head over to our social media to learn more!`;
const ACCOUNT_ERROR_ICON =
    "data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11Z' fill='white'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20ZM11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z' fill='%23FF3461'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 12V6H12V12H10Z' fill='%23FF3461'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 16V13H12V16H10Z' fill='%23FF3461'/%3E%3C/svg%3E%0A";

const URL = 'https://airdrop-api.aqua.network/api/account-check/?account=';

const DATA_STATUS_PHASES = {
    claimed: statusClaimed,
    expired: statusExpired,
    waiting: 'Waiting for claiming',
    coming: 'Coming soon'
};

const form = document.getElementById('check-form');
const btnSubmit = form.querySelector('#button-submit');
const airdropStatusElem = document.querySelector('.airdrop-status');
const accountEligibilityContainer = document.querySelector('.account-eligibility-container');
const accountBonusesContainer = document.querySelector('.account-bonuses-container');

let loadedAddress = '';

export function loadData(account) {
    if (!account || loadedAddress === account) {
        return;
    }
    loadedAddress = account;
    btnSubmit.setAttribute('disabled', 'disabled');
    accountEligibilityContainer.innerHTML = accountEligibilityLoading;
    // clear blocks
    accountBonusesContainer.innerHTML = '';
    airdropStatusElem.innerHTML = '';

    let accountToDisplay = account;
    validateAddress(account)
        .then(address => {
            accountToDisplay = address;
            return fetch(`${URL}${address}`);
        })
        // make request if valid
        .then(response => (response.status === 200 ? response.json() : { errorText: NOT_ELIGEBLE_ERROR }))
        // set error text if invalid
        .catch(() => ({ errorText: INVALID_ADDRESS_ERROR }))
        .then(data => renderData(data, accountToDisplay))
        .finally(() => {
            btnSubmit.removeAttribute('disabled');
        });
}

function validateAddress(address) {
    if (address.includes('*')) {
        return StellarSdk.FederationServer.resolve(address).then(({ account_id }) => account_id);
    } else {
        return address[0] === 'G' && address.length === 56 ? Promise.resolve(address) : Promise.reject();
    }
}

function renderData(data, account) {
    const isInvalidAccount = data.errorText === INVALID_ADDRESS_ERROR;

    // render account-eligibility block
    const DATA_ACCOUNT_ELIGIBILITY = {
        key: account,
        shortKey: truncateKey(account),
        identIcon: isInvalidAccount ? ACCOUNT_ERROR_ICON : createStellarIdenticon(account).toDataURL(),
        status: !data.errorText
            ? eligebleStatus
            : addDataToTemplate(
                  { errorText: data.errorText, statusClass: isInvalidAccount ? 'hidden' : '' },
                  notEligebleStatus
              ),
        containerClass: isInvalidAccount ? 'error' : ''
    };
    accountEligibilityContainer.innerHTML = addDataToTemplate(DATA_ACCOUNT_ELIGIBILITY, accountEligibility);

    if (data.errorText) {
        return;
    }

    // render account-bonuses block
    const DATA_ACCOUNT_BONUSES = {
        tradesBonus: data.has_trades_count_boost ? ' active' : '',
        productUsageBonus: data.has_product_usage_boost ? ' active' : '',
        accountAgeBonus: data.has_account_age_boost ? ' active' : '',
        baseAmount: Number(data.base_amount).toLocaleString('ru-RU'),
        airdropAmount: Number(data.airdrop_amount).toLocaleString('ru-RU'),
        boost: data.boost
    };
    accountBonusesContainer.innerHTML = addDataToTemplate(DATA_ACCOUNT_BONUSES, accountBonuses);

    if (data.phase.length !== 0) {
        airdropStatusElem.innerHTML = airdropStatus;

        // render phase-line blocks
        document.querySelector('#phases').innerHTML = data.phase
            .map(item => {
                const PREPARED_DATA = {
                    phase: item.phase,
                    state: item.state === 'coming' ? ' muted' : '',
                    status: DATA_STATUS_PHASES[item.state],
                    amount: Number(data.phase_amount).toLocaleString('ru-RU'),
                    date: getFormattedDate(item.start, item.end),
                    url: item.stellar_expert_url
                };
                return addDataToTemplate(PREPARED_DATA, phaseLine);
            })
            .join('');
    }
}
