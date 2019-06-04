import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap-social/bootstrap-social.css';

import 'bootstrap';

import * as templates from './templates.ts';


const fetchJSON = async (url, method = 'GET') => {
  try {
    const response = await fetch(url, {method, credentials: 'same-origin'});
    return response.json();
  } catch (error) {
    return {error};
  }
};

const listBundles = bundles => {
  const mainElement = document.body.querySelector('.b4-main');

  mainElement.innerHTML =
    templates.addBundleForm() + templates.listBundles({bundles});

  const form = mainElement.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.querySelector('input').value;
    addBundle(name);
  });

  const deleteButtons = mainElement.querySelectorAll('button.delete');
  for (let i = 0; i < deleteButtons.length; i++) {
    const deleteButton = deleteButtons[i];
    deleteButton.addEventListener('click', event => {
      deleteBundle(deleteButton.getAttribute('data-bundle-id'));
    });
  }
};

const getBundles = async () => {
  const bundles = await fetchJSON('/api/list-bundles');
  if (bundles.error) {
    throw bundles.error;
  }
  return bundles;
};

const deleteBundle = async (bundleId) => {
  try {

    const bundles = await getBundles();

    const idx = bundles.findIndex(bundle => bundle.id === bundleId);
    if (idx === -1) {
      throw Error(`No bundle with id "${bundleId}" was found.`);
    }

    const url = `/api/bundle/${encodeURIComponent(bundleId)}`;
    await fetchJSON(url, 'DELETE');

    bundles.splice(idx, 1);

    listBundles(bundles);

    showAlert(`Bundle deleted!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};


const showAlert = (message, type = 'danger') => {
  const alertsElement = document.body.querySelector('.b4-alerts');
  const html = templates.alert({type, message});
  alertsElement.insertAdjacentHTML('beforeend', html);
};


const addBundle = async (name) => {
  try {
    const bundles = await getBundles();

    const url = `/api/bundle?name=${encodeURIComponent(name)}`;
    const resBody = await fetchJSON(url, 'POST');

    bundles.push({id: resBody._id, name});
    listBundles(bundles);

    showAlert(`Bundle "${name}" created!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

const getBundle = bundleId =>
    fetchJSON(`/api/bundle/${encodeURIComponent(bundleId)}`);

    const showView = async () => {
      const mainElement = document.body.querySelector('.b4-main');
      const [view, ...params] = window.location.hash.split('/');
    
      switch (view) {
        case '#welcome':
          const session = await fetchJSON('/api/session');
          mainElement.innerHTML = templates.welcome({session});
          if (session.err) {
            showAlert(session.err);
          }
          break;
        case '#list-bundles':
          try {
            const bundles = await getBundles();
            listBundles(bundles);
          } catch (err) {
            showAlert(err);
            window.location.hash = '#welcome';
          }
          break;
        default:
          throw Error(`Unrecognized view: ${view}`);
      }
    };
    
    (async () => {
      const session = await fetchJSON('/api/session');
      document.body.innerHTML = templates.main({session});
      window.addEventListener('hashchange', showView);
      showView().catch(err => window.location.hash = '#welcome');
    })();