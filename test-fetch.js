fetch('http://localhost:3000/').then(r => r.text()).then(t => {
  if (t.includes('This page didn\\'t load')) {
    console.log('ERROR_PAGE_FOUND');
  } else {
    console.log('SUCCESS');
  }
}).catch(console.error);
