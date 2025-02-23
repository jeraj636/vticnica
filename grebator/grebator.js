/*
Preprosta koda, ki iz dveh api-jev beleži podatke v postgres.
*/

const pg = require("pg");
const fs = require("fs");

let debug = false;

//* Naslovi api-jev
const vticnica_ip = "http://192.168.1.42/rpc/Shelly.GetStatus";
const api_link = 'https://api-drzavno-test.scv.si/api/tarifa';

//* Razred, ki hrani podatke iz dveh API-jev
class zdruzeni_podatki {
    constructor(vticnica_json, tarifa_json) {
        this.stanje = vticnica_json['switch:0'].output;
        this.napetost = vticnica_json['switch:0'].voltage;
        this.frekvenca = vticnica_json['switch:0'].freq;
        this.tok = vticnica_json['switch:0'].current;
        this.moc = vticnica_json['switch:0'].apower;
        const zdaj = new Date();
        zdaj.setHours(zdaj.getHours() + 1);
        this.casovni_zig = zdaj.toISOString();
        this.tarifa = tarifa_json.tarifa;
        this.valuta = tarifa_json.valuta;
        this.casovni_blok = tarifa_json.casovni_blok;
    }
    izpisi() {
        console.log("-----------------------------------------------------------------------------------------------------");
        console.log("stanje | napetost | frekvenca | tok | moc |  casovni_zig             | tarifa | valuta | casovni_blok");
        console.log("-------+----------+-----------+-----+-----+--------------------------+--------+--------+-------------");
        console.log(this.stanje.toString().padStart(6) + " | " +
            this.napetost.toString().padStart(8) + " | " +
            this.frekvenca.toString().padStart(9) + " | " +
            this.tok.toString().padStart(3) + " | " +
            this.moc.toString().padStart(3) + " | " +
            this.casovni_zig.toString().padStart(14) + " | " +
            this.tarifa.toString().padStart(6) + " | " +
            this.valuta.toString().padStart(6) + " | " +
            this.casovni_blok.toString().padStart(12));
        console.log("-----------------------------------------------------------------------------------------------------");
    }
    async vpisi_v_pb(odjemalec) {
        const poizvedba = `
        INSERT INTO stanje_vticnice (stanje, napetost, frekvenca, tok, moc, casovni_zig, tarifa, valuta, casovni_blok)
        VALUES ($1, $2, $3, $4, $5, NOW(),$6, $7, $8)`;
        const vrednosti = [
            this.stanje,
            this.napetost,
            this.frekvenca,
            this.tok,
            this.moc,
            this.tarifa,
            this.valuta,
            this.casovni_blok
        ];

        const rezultat = await odjemalec.query(poizvedba, vrednosti);
    }

}
//Funkcija, ki brise podatke, ki so straejši od 24ur iz PB
async function izbrisi_stare_podatke(odjemalec) {
    const danes = new Date().toISOString().split('T')[0];
    const poizvedba = `
    DELETE FROM stanje_vticnice
    WHERE casovni_zig < NOW() - INTERVAL '48 hours'`;
    try {
        await odjemalec.query(poizvedba);
        console.log(`Brisanje zapisov!`);
    } catch (error) {
        console.error('Napaka:', error);
    }
}
// Funkcija ki prebere podatke iz API
async function dobi_json_iz_povezave(povezava) {
    try {
        const odgovor = await fetch(povezava);
        if (!odgovor.ok) {
            throw new Error(`Napaka: ${odgovor.status}`);
        }
        const podatki = await odgovor.json();
        return podatki;
    } catch (error) {
        console.error("Napaka: ", error);
    }
}

let pg_odjemalec;
fs.readFile('nastavitve.json', function (err, podatki) {
    pg_odjemalec = new pg.Client(JSON.parse(podatki));
    pg_odjemalec.connect();

});
const branje_podatkov = setInterval(async () => {
    try {

        const vticnica_json = await dobi_json_iz_povezave(vticnica_ip);
        const tarifa_json = await dobi_json_iz_povezave(api_link);
        const podatki = new zdruzeni_podatki(vticnica_json, tarifa_json);
        if (debug)
            podatki.izpisi();
        await podatki.vpisi_v_pb(pg_odjemalec);
    } catch (error) {
        console.error('Napaka:', error);
        process.exit();
    }

}, 500);
const brisanje_podatkov = setInterval(async () => {
    try {
        izbrisi_stare_podatke(pg_odjemalec);

    } catch (error) {
        console.error('Napaka:', error);
        process.exit();
    }

}, 60 * 1000);

//* Konec Programa
process.on('SIGINT', async () => {
    clearInterval(interval);
    await pg_odjemalec.end();
    process.exit();
});