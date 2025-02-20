const vticnica_ip = "http://192.168.1.42/rpc/Shelly.GetStatus";
const api_link = 'https://api-drzavno-test.scv.si/api/tarifa';
class zdruzeni_podatki {
    constructor(vticnica_json, tarifa_json) {

        this.stanje = vticnica_json['switch:0'].output;
        this.napetost = vticnica_json['switch:0'].voltage;
        this.frekvenca = vticnica_json['switch:0'].freq;
        this.tok = vticnica_json['switch:0'].current;
        this.moc = vticnica_json['switch:0'].apower;
        this.casovni_zig = Date.now();
        this.tarifa = tarifa_json.tarifa;
        this.valuta = tarifa_json.valuta;
        this.casovni_blok = tarifa_json.casovni_blok;
    }
    izpisi() {
        console.log(this.stanje + " " + this.napetost);
    }
}

async function dobi_json_iz_povezave(povezava) {
    try {
        const odgovor = await fetch(povezava);
        if (!odgovor.ok) {
            throw new Error(`Napaka: ${odgovor.status}`);
        }
        const podatki = await odgovor.json();
        return podatki;
    } catch (error) {
        console.error("Napaka pri pridobivanju podatkov:", error);
    }
}
(async () => {
    const vticnica_json = await dobi_json_iz_povezave(vticnica_ip);
    const tarifa_json = await dobi_json_iz_povezave(api_link);
    const podatki = new zdruzeni_podatki(vticnica_json, tarifa_json);
    podatki.izpisi();
})();