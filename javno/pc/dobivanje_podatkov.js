function dobi_podatke() {
    let st_minut = 5;
    fetch('http://192.168.1.10/vticnica/izrocevalec/api/?t=' + st_minut * 60)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Napaka: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {//Tukaj so podatki iz api
            let x = [];
            let moc = [];
            let napetost = [];
            let tok = [];
            data.forEach(element => {
                x.push("");
                moc.push(element.moc);
                napetost.push(element.napetost);
                tok.push(element.tok);
            });
            graf_moci.data.labels = x;
            graf_napetosti.data.labels = x;
            graf_toka.data.labels = x;
            graf_moci.data.datasets[0].data = moc;
            graf_napetosti.data.datasets[0].data = napetost;
            graf_toka.data.datasets[0].data = tok;
            graf_moci.update();
            graf_napetosti.update();
            graf_toka.update();
        })
        .catch(error => {
            console.error('Prišlo je do napake:', error);
        });
}
dobi_podatke();
setInterval(dobi_podatke, 500);