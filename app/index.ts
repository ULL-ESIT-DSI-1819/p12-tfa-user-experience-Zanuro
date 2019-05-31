import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as templates from './templates';

document.body.innerHTML = templates.main();
const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

const getBundles = async() => {
    const esRes = await fetch('/es/b4/bundle/_search?size=1000');

    const esResBody = await esRes.json();

    return esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
    }));
};

const listBundles = bundles => {
    mainElement.innerHTML =
       templates.addBundleForm() + templates.listBundles({bundles});

   const form = mainElement.querySelector('form');
   form.addEventListener('submit', event => {
       event.preventDefault();
       const name = form.querySelector('input').value;
       addBundle(name);
   });

   const deleteButtons = mainElement.querySelectorAll('button.delete');
   for (let i=0; i < deleteButtons.length;i++){
    const deleteButton = deleteButtons[i];
    deleteButton.addEventListener('click', event => {
        deleteBundle(deleteButton.getAttribute('data-bundle-id'));
    });
}
};

const deleteBundle = async (bundleId) => {
    try {
    const bundles = await getBundles();

    const idx = bundles.findIndex(bundle => bundle.id === bundleId);
    if (idx === -1) {
      throw Error(`No hay bundle con el id: "${bundleId}"`);
    }

    const url = `/api/bundle/${encodeURIComponent(bundleId)}`;
    await fetch(url, {method: 'DELETE'});

    bundles.splice(idx, 1);

    listBundles(bundles);

    showAlert(`Bundle deleted!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};

const showAlert = (message, type= 'danger') => {
    const html = templates.alert({type,message});
    alertsElement.insertAdjacentHTML('beforeend',html);
};

const addBundle = async (name) => {
    try{
        //list of created bundles
        const bundles = await getBundles();

        // add the new bundle
        const url = `/api/bundle?name=${encodeURIComponent(name)}`;
        const res = await fetch(url, {method: 'POST'});
        const resBody = await res.json();

        //add new bundle to the original list
        bundles.push({id: resBody._id, name});
        listBundles(bundles);

        showAlert(`Bundle "${name}" has been created!`, 'success');
    }
    catch(err){
        showAlert(err);
    }
};

const showView = async () => {
    const [view, ...params] = window.location.hash.split('/');
  
    switch (view) {
      case '#welcome':
        mainElement.innerHTML = templates.welcome();
        break;
      case '#list-bundles':
        const bundles = await getBundles();
        listBundles(bundles);
        break;
      default:
        // Unrecognized view.
        throw Error(`Unrecognized view: ${view}`);
    }
  };

window.addEventListener('hashchange',showView);

showView().catch(err => window.location.hash = '#welcome');
