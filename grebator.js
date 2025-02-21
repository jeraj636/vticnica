const pg = require("pg");
const fs = require("fs");

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
        console.log("-------------------------------------------------------------------------------------------");
        console.log("stanje | napetost | frekvenca | tok | moc |  casovni_zig   | tarifa | valuta | casovni_blok");
        console.log("-------+----------+-----------+-----+-----+----------------+--------+--------+-------------");
        console.log(this.stanje.toString().padStart(6) + " | " +
            this.napetost.toString().padStart(8) + " | " +
            this.frekvenca.toString().padStart(9) + " | " +
            this.tok.toString().padStart(3) + " | " +
            this.moc.toString().padStart(3) + " | " +
            this.casovni_zig.toString().padStart(14) + " | " +
            this.tarifa.toString().padStart(6) + " | " +
            this.valuta.toString().padStart(6) + " | " +
            this.casovni_blok.toString().padStart(12));
        console.log("-------------------------------------------------------------------------------------------");
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

fs.readFile('podatkovna_baza.json', function (napaka, vsebina) {
    var nastavitve = JSON.parse(vsebina);
    const pg_odjemalec = new pg.Client(nastavitve);
    pg_odjemalec.connect().then(() => console.log("ok!"));
});

(async () => {
    const vticnica_json = await dobi_json_iz_povezave(vticnica_ip);
    const tarifa_json = await dobi_json_iz_povezave(api_link);
    const podatki = new zdruzeni_podatki(vticnica_json, tarifa_json);
    podatki.izpisi();
})();